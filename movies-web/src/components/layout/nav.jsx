import { Home, Search as SearchIcon } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';

export default function Nav() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowEmptyWarning(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setShowEmptyWarning(true);
      setTimeout(() => setShowEmptyWarning(false), 3000);
    }
  };

  return (
    <nav className={`w-[1200px] p-2 mt-1 rounded-xs flex justify-between items-center gap-4 transition-colors ${isDark ? 'bg-[#303873] text-white' : 'bg-[#c5cefa] text-black'
      }`}>
      {/* Left side - Home */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:opacity-70 transition-opacity" title="Home">
          <Home size={20} />
        </Link>
      </div>

      {/* Right side - Search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (showEmptyWarning) setShowEmptyWarning(false);
              }}
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
          {showEmptyWarning && (
            <div className={`absolute top-full left-0 mt-1 text-xs px-2 py-1 rounded ${isDark ? 'bg-red-900/80 text-red-200' : 'bg-red-100 text-red-700'
              }`}>
              Please enter a search term
            </div>
          )}
        </div>
      </div>


    </nav>
  )
}