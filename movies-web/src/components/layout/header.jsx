import { Sun, Moon } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { useTheme } from '@/context/ThemeContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={`flex justify-between items-center rounded-xs font-bold w-[1200px] p-2 transition-colors ${isDark ? 'bg-[#520a0a] text-[#df7d7d]' : 'bg-[#f1c2c2] text-black'
      }`}>
      <div>23120231</div>
      <h1 className='text-2xl font-2xl'>Movies info</h1>
      <div className='flex gap-3 items-center'>
        <Switch checked={isDark} onCheckedChange={toggleTheme} />
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </div>
    </header>
  )
}