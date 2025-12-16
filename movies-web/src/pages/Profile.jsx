import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/service/api';
import { useTheme } from '@/context/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const ProfileSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày sinh phải dạng YYYY-MM-DD'),
});

export default function Profile() {
    const { isDark } = useTheme();
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editing, setEditing] = useState(false);

    const form = useForm({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            email: '',
            phone: '',
            dob: '',
        },
    });

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError('');
            try {
                const data = await getUserProfile();
                if (!ignore) {
                    setProfile(data);
                    form.reset({
                        email: data.email || '',
                        phone: data.phone || '',
                        dob: data.dob || '',
                    });
                    setEditing(false);
                }
            } catch (err) {
                if (!ignore) setError(err?.message || 'Failed to load profile');
            } finally {
                if (!ignore) setLoading(false);
            }
        }
        load();
        return () => { ignore = true; };
    }, []);

    const labelCls = "text-sm font-semibold";
    const valueCls = isDark ? 'text-gray-200' : 'text-gray-700';

    async function onSubmit(values) {
        setError('');
        setSuccess('');
        try {
            const updated = await updateUserProfile(values);
            setProfile(updated);
            setSuccess('Cập nhật hồ sơ thành công');
            setEditing(false);
        } catch (err) {
            setError(err?.message || 'Cập nhật thất bại');
        }
    }

    return (
        <div className={`w-[1200px] mx-auto p-6 min-h-[600px] ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Profile</h1>
                <Button
                    variant="outline"
                    onClick={async () => {
                        await logout();
                    }}
                    className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                >
                    Logout
                </Button>
            </div>

            {loading && (
                <div className="py-10 text-center opacity-70">Loading profile...</div>
            )}

            {error && (
                <div className="py-10 text-center text-red-500">{error}</div>
            )}

            {!loading && !error && profile && (
                <Card className={`p-6 max-w-2xl ${isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-14 h-14">
                            <AvatarFallback className={isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}>
                                {profile.username?.slice(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-semibold">{profile.username}</p>
                            <p className={valueCls}>{profile.email}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                                Role: {profile.role}
                            </span>
                        </div>
                    </div>

                    {/* Read-only view */}
                    {!editing && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className={labelCls}>Email</p>
                                <p className={valueCls}>{profile.email}</p>
                            </div>
                            <div>
                                <p className={labelCls}>Phone</p>
                                <p className={valueCls}>{profile.phone || '—'}</p>
                            </div>
                            <div>
                                <p className={labelCls}>Date of Birth</p>
                                <p className={valueCls}>{profile.dob || '—'}</p>
                            </div>
                        </div>
                    )}

                    {success && <div className="text-sm text-green-500 mb-2">{success}</div>}
                    {error && <div className="text-sm text-red-500 mb-2">{error}</div>}

                    {!editing && (
                        <Button
                            variant="outline"
                            className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                            onClick={() => {
                                setEditing(true);
                                form.reset({
                                    email: profile.email || '',
                                    phone: profile.phone || '',
                                    dob: profile.dob || '',
                                });
                            }}
                        >
                            Update
                        </Button>
                    )}

                    {editing && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="email"
                                                        className={`w-full rounded-md border px-3 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="tel"
                                                        className={`w-full rounded-md border px-3 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="dob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth</FormLabel>
                                                <FormControl>
                                                    <input
                                                        {...field}
                                                        type="date"
                                                        className={`w-full rounded-md border px-3 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={form.formState.isSubmitting}
                                        className={isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : ''}
                                    >
                                        {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                                        onClick={() => {
                                            setEditing(false);
                                            form.reset({
                                                email: profile.email || '',
                                                phone: profile.phone || '',
                                                dob: profile.dob || '',
                                            });
                                            setError('');
                                            setSuccess('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </Card>
            )}
        </div>
    );
}
