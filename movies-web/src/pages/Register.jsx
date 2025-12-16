import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { registerUser } from '@/service/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const RegisterSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'DOB must be in YYYY-MM-DD format'),
});

export default function Register() {
    const { isDark } = useTheme();
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            phone: '',
            dob: '',
        },
        mode: 'onSubmit',
    });

    async function onSubmit(values) {
        setServerError('');
        setSuccessMsg('');
        try {
            const res = await registerUser(values);
            setSuccessMsg(res?.message || 'Registered successfully! Redirecting to login...');
            showToast('Register successful', 'success');
            // Redirect to login page after short delay
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setServerError(err?.message || 'Registration failed');
            showToast(err?.message || 'Registration failed', 'error');
        }
    }

    return (
        <div className={`w-[1200px] mx-auto p-6 min-h-[600px] flex items-center justify-center ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className={`w-full max-w-md rounded-xl border p-6 ${isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h1 className="text-2xl font-bold mb-1">Create your account</h1>
                <p className={`mb-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Fill out the form to register.</p>

                {serverError && (
                    <div className="mb-3 text-sm text-red-500">{serverError}</div>
                )}
                {successMsg && (
                    <div className="mb-3 text-sm text-green-600">{successMsg}</div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="yourname"
                                            className={`w-full rounded-md border px-3 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                            placeholder="user@example.com"
                                            className={`w-full rounded-md border px-3 py-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400' : 'bg-white border-gray-300'}`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <input
                                            {...field}
                                            type="password"
                                            placeholder="••••••"
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
                                            placeholder="0123456789"
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

                        <div className="pt-2 flex items-center gap-3">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                                className={isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : ''}
                            >
                                {form.formState.isSubmitting ? 'Submitting…' : 'Register'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
                            >
                                Go to Login
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
