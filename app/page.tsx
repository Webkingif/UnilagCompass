'use client';

import { useState } from 'react';
import { Compass, MapPin, Navigation, Search, ArrowUpDown } from 'lucide-react';

export default function Home() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 600);
  };

  return (
    <div id="main-container" className="flex flex-col h-screen overflow-hidden bg-[#f8fafc] text-[#1e293b]">
      {/* 1. Persistent Header Component (Professional Polish Theme) */}
      <header id="app-header" className="shrink-0 h-[72px] bg-white border-b border-[#e2e8f0] px-6 md:px-10 flex items-center shadow-xs z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#003366] text-[#facc15] shadow-sm">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#003366] font-sans">
              unilag<span className="text-[#facc15]">compass</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            University of Lagos Campus Navigator
          </div>
        </div>
      </header>

      {/* 2. Main Content Area (Two-Pane Responsive Layout) */}
      <main id="main-content" className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Left Pane: Route Controls & Inputs */}
        <section 
          id="left-pane" 
          className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between overflow-y-auto bg-white border-b md:border-b-0 md:border-r border-[#e2e8f0]"
        >
          <div className="max-w-[420px] w-full mx-auto my-auto space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight flex items-center gap-2.5">
                <Navigation className="w-6 h-6 text-[#003366]" />
                Navigate Campus
              </h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Smart routing for the University of Lagos. Enter your starting point and destination to compute the most efficient path.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              {/* "From" Input */}
              <div className="space-y-2">
                <label htmlFor="from-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#003366]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <input
                    id="from-input"
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Starting Point (e.g., Main Gate, Senate Building)"
                    className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Swap Locations Button */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  title="Swap locations"
                  className="p-2 rounded-full text-slate-400 hover:text-[#003366] hover:bg-slate-100 transition-colors border border-slate-200 hover:border-[#003366]/30 shadow-2xs"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              {/* "To" Input */}
              <div className="space-y-2">
                <label htmlFor="to-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#facc15] filter drop-shadow-xs">
                    <MapPin className="w-5 h-5 fill-[#003366]" />
                  </div>
                  <input
                    id="to-input"
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Destination (e.g., Faculty of Arts, Moremi Hall)"
                    className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="find-route-btn"
                  type="submit"
                  disabled={isSearching}
                  className="w-full h-[56px] inline-flex items-center justify-center gap-2 px-6 bg-[#003366] hover:bg-[#002244] active:bg-[#001830] text-white font-bold text-base rounded-xl shadow-md shadow-[#003366]/20 transition-all duration-200 cursor-pointer disabled:opacity-75"
                >
                  <Search className="w-5 h-5 text-[#facc15]" />
                  {isSearching ? 'Finding Optimal Route...' : 'Find Optimal Route'}
                </button>
              </div>
            </form>

            {/* Quick Suggestions / Popular Spots */}
            <div className="pt-5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">Popular Campus Landmarks:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Senate Building', 'Main Library', 'Faculty of Engineering', 'Moremi Hall', 'Jaja Hall'].map((spot) => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() => {
                      if (!fromLocation) setFromLocation(spot);
                      else setToLocation(spot);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 bg-slate-50 hover:bg-[#003366]/5 hover:text-[#003366] text-slate-600 rounded-lg transition-colors border border-slate-200"
                  >
                    + {spot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Pane: Map Area with Subtle Radial Grid & Glass Tag Placeholder */}
        <section 
          id="right-pane" 
          className="w-full md:w-1/2 min-h-[350px] md:min-h-0 bg-[#f1f5f9] flex items-center justify-center relative p-6 border-t md:border-t-0 md:border-l border-[#e2e8f0] overflow-hidden"
        >
          {/* Subtle Map Radial Dot Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-60" 
            style={{ 
              backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', 
              backgroundSize: '32px 32px' 
            }} 
          />

          {/* Map component goes here later */}
          <div className="relative z-10 text-center max-w-sm p-8 bg-white/80 backdrop-blur-md border border-[#e2e8f0] rounded-2xl shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#003366]/10 text-[#003366] flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 animate-spin-slow text-[#003366]" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#003366]/5 text-[#003366] font-bold text-xs tracking-wider uppercase">
              Interactive Map Context
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive UNILAG campus map & routing layer will render inside this pane.
            </p>
          </div>
        </section>
      </main>

      {/* 3. Persistent Global Footer */}
      <footer id="app-footer" className="shrink-0 bg-white border-t border-[#e2e8f0] px-6 py-3.5 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-600">
          <div>
            Created by <span className="font-bold text-[#003366]">Idowu Oluwafemi</span> <span className="text-slate-400 font-normal">(Webkingif)</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-[11px] hidden md:inline">&copy; {new Date().getFullYear()} unilagcompass</span>
            <div className="flex items-center gap-2">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#003366] hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
                </svg>
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) Profile"
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#003366] hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="p-1.5 rounded-lg text-slate-500 hover:text-[#003366] hover:bg-slate-100 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

