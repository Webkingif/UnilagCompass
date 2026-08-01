import { Compass } from "lucide-react";
import Image from "next/image";
export default function Header() {
	//<Compass className="w-6 h-6 animate-spin-slow" />
  return (
    <header id="app-header" className="shrink-0 h-[72px] bg-white border-b border-[#e2e8f0] px-6 md:px-10 flex items-center shadow-xs z-50">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Image 
				src="/android-chrome-512x512.png"
				alt="Logo"
				width={70}
				height={70}
				className=""
			/>
          
          <span className="text-2xl font-extrabold tracking-tight text-[#003366] font-sans">
            unilag<span className="text-[#facc15]">compass</span>
          </span>
        </div>
      </div>
    </header>
  )
}
