'use client';

import { useState, useRef } from 'react';
import { MapPin, Navigation, Search, ArrowUpDown } from 'lucide-react';
import dynamic from 'next/dynamic';

// 1. DYNAMICALLY IMPORT THE MAP (Disables SSR for this component)
const Unimap = dynamic(() => import('@/components/unimap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-500">Loading Map...</div>
});

import Header from '@/components/header';
import Footer from '@/components/footer';
import { useInputContext } from '@/context/InputContext';
import { useMap } from "@/context/MapContext";
import "leaflet/dist/leaflet.css";

export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const { toLocation, fromLocation, setFromLocation, setToLocation } = useInputContext();
  const { map } = useMap();
  const [distance, setDistance] = useState<number|null>(null);

  // NOTICE: There is NO useEffect here anymore! The map creation is safely handled in unimap.tsx.

  const handleSwap = () => {
    const fromInput = document.getElementById("from-input") as HTMLSelectElement;
    const toInput = document.getElementById("to-input") as HTMLSelectElement;
    const oldfrom = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = oldfrom;
	setFromLocation(fromInput.value);
	setToLocation(toInput.value);
	fromInput.dispatchEvent(new Event("change",{bubbles: true}));
  };
  const routeLayerRef = useRef<L.GeoJSON | null>(null);
  const findOptimalRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    if (!map || !fromLocation || !toLocation) {
      setIsSearching(false);
      return; 
    }

    const start = [fromLocation.lat, fromLocation.lng];
    const end = [toLocation.lat, toLocation.lng];

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${end[1]},${end[0]}` +
      `?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== "Ok") throw new Error("Route not found");

      const route = data.routes[0];
      
      const L = (await import("leaflet")).default;
	  if(routeLayerRef.current){
		map.removeLayer(routeLayerRef.current);
	  }
      routeLayerRef.current = L.geoJSON(route.geometry, {
        style: { color: "red", weight: 6, opacity: 0.8 }
      }).addTo(map);
	  setDistance(route.distance);
      console.log("Distance:", route.distance / 1000, "km");
      console.log("Duration:", route.duration / 60, "minutes");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 600);
  };

  return (
    <div id="main-container" className="flex flex-col h-screen overflow-hidden bg-[#f8fafc] text-[#1e293b] ">
      <Header />
      <main id="main-content" className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-scroll">
        
        <section id="left-pane" className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between bg-white border-b md:border-b-0 md:border-r border-[#e2e8f0]">
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
              <div className="space-y-2">
                <label htmlFor="from-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  From
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#003366]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <select className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                    id="from-input" defaultValue="disabled"
                  >
                    <option value="disabled" disabled>Loading...</option>
                  </select>
                </div>
              </div>

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

              <div className="space-y-2">
                <label htmlFor="to-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  To
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#facc15] filter drop-shadow-xs">
                    <MapPin className="w-5 h-5 fill-[#003366]" />
                  </div>
                  <select className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                    id="to-input" defaultValue="disabled"
                  >
                    <option value="disabled" disabled>Loading...</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="find-route-btn"
                  type="button"
                  disabled={isSearching}
                  className="w-full h-[56px] inline-flex items-center justify-center gap-2 px-6 bg-[#003366] hover:bg-[#002244] active:bg-[#001830] text-white font-bold text-base rounded-xl shadow-md shadow-[#003366]/20 transition-all duration-200 cursor-pointer disabled:opacity-75"
                  onClick={findOptimalRoute}
                >
                  <Search className="w-5 h-5 text-[#facc15]" />
                  {isSearching ? 'Finding Optimal Route...' : 'Find Optimal Route'}
                </button>
              </div>
            </form>
			<div className="flex">
			{ distance && 
						<div
				className="ml-auto"
			>Distance: {distance}m</div>}
			</div>

          </div>
        </section>

        <section id="right-pane" className="w-full md:w-1/2 min-h-[450px] md:min-h-0 bg-[#f1f5f9] flex items-center justify-center relative p-4 border-t md:border-t-0 md:border-l border-[#e2e8f0]">
          <Unimap /> 
        </section>
      </main>
      <Footer />
    </div>
  );
}