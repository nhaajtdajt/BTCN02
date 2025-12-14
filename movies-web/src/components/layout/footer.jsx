import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`w-[1200px] rounded p-1 transition-colors ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'
      }`}>
      <div> {`<footer>`} </div>
    </footer>
  )
}