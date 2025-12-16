import { useEffect, useState } from 'react';
import { getUserProfile } from '@/service/api';
import { useTheme } from '@/context/ThemeContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
    const { isDark } = useTheme();
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            setError('');
            try {
                const data = await getUserProfile();
                if (!ignore) setProfile(data);
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

    return (
        <div className={`w-[1200px] mx-auto p-6 min-h-[600px] ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Your Profile</h1>
                <Button
                    variant="outline"
                    onClick={logout}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className={labelCls}>Phone</p>
                            <p className={valueCls}>{profile.phone || '—'}</p>
                        </div>
                        <div>
                            <p className={labelCls}>Date of Birth</p>
                            <p className={valueCls}>{profile.dob || '—'}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
