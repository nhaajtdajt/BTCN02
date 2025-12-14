import { Home } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';

export default function Nav() {
  const { isDark } = useTheme();

  return (
    <nav className={`w-[1200px] p-2 mt-1 rounded-xs flex justify-between items-center gap-4 transition-colors ${isDark ? 'bg-[#303873] text-white' : 'bg-[#c5cefa] text-black'
      }`}>
      <Home />
      <div className="flex gap-2">
        <input
          type="search"
          className={`rounded p-1 outline-none transition-colors ${isDark ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white text-black'
            }`}
          placeholder="Search"
        />
        <button className={`border px-2 rounded-md transition-colors ${isDark ? 'border-green-400 text-green-400 hover:bg-green-400/10' : 'border-green-700 text-green-700 hover:bg-green-700/10'
          }`}>Search</button>
      </div>
    </nav>
  )
}