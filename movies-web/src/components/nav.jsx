import { Home } from "lucide-react";


export default function Nav() {
  return (
    <nav className="w-[1200px] bg-[#c5cefa] p-2 mt-1 flex justify-between items-center gap-4">
      <Home />
      <div className="flex gap-2">
        <input type="search" name="" id="" className="bg-white rounded p-1" placeholder="Search"/>
        <button className="border border-green-700 px-2 rounded-md text-green-700">Search</button>
      </div>
    </nav>
  )
}