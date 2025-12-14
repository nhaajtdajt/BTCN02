import { Sun, Moon } from 'lucide-react';
import { Switch } from "@/components/ui/switch"


export default function Header() {
  return (
    <header className='flex justify-between items-center w-[1200px] bg-[#f1c2c2] p-2'>
      <div>23120231</div>
      <h1 className='text-2xl font-2xl'>Moives info</h1>
      <div className='flex gap-4'>
        <Switch />
        <Sun size={20} />
      </div>
    </header>
  )
}