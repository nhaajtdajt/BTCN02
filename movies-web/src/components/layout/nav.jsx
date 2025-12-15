import { Home, Search as SearchIcon, Heart, User } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Nav() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`w-[1200px] p-2 mt-1 rounded-xs flex justify-between items-center gap-4 transition-colors ${isDark ? 'bg-[#303873] text-white' : 'bg-[#c5cefa] text-black'
      }`}>
      {/* Left side - Home + Navigation Links */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:opacity-70 transition-opacity" title="Home">
          <Home size={20} />
        </Link>
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
      </div>

      {/* Right side - Search + Auth */}
      <div className="flex items-center gap-3">


        <div className="flex gap-2 ml-2">
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
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`rounded p-1 px-2 outline-none transition-colors ${isDark ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white text-black'
              }`}
            placeholder="Search Title, Person, Genre ..."
          />
          <button
            type="submit"
            className={`border px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${isDark ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'border-green-700 text-green-700 hover:bg-green-700/10'
              }`}
          >
            <SearchIcon size={16} />
            Search
          </button>
        </form>
      </div>


    </nav>
  )
}