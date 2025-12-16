import { Sun, Moon, Heart, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch"
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return (
    <header className={`flex items-center rounded-xs font-bold w-[1200px] p-2 transition-colors relative ${isDark ? 'bg-[#520a0a] text-[#df7d7d]' : 'bg-[#f1c2c2] text-black'
      }`}>
      <div className="flex-1">23120231</div>
      <h1 className='text-2xl font-2xl absolute left-1/2 -translate-x-1/2'>Movies info</h1>
      <div className='flex gap-3 items-center flex-1 justify-end relative z-10'>
        {/* Navigation Links */}
        {isAuthenticated && (
          <>
            <Link
              to="/favorites"
              className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
              title="Favorites"
            >
              <Heart size={18} />
              <span>Favorites</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
              title="Profile"
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          </>
        )}

        {/* Auth Section */}
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className={isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}>
                  {user?.username?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <Button
              onClick={async () => {
                await logout();
                showToast('Logged out successfully', 'success');
                navigate('/');
              }}
              size="sm"
              variant="outline"
              className={isDark ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : ''}
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Link to="/register">Register</Link>
            </Button>
          </div>
        )}

        {/* Theme Toggle */}
        <div className="flex gap-2 items-center border-l pl-3" style={{ borderColor: isDark ? '#df7d7d' : '#000' }}>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </div>
      </div>
    </header>
  )
}