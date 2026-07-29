'use client';

import { useState } from 'react';
import { MapPin, Navigation, Search, ArrowUpDown } from 'lucide-react';
import Unimap from '@/components/unimap';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useInputContext } from '@/context/InputContext';
import L from "leaflet";

//
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";
import { useEffect } from "react";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: icon.src, shadowUrl: iconShadow.src });

//

export default function Home() {
  // const { toLocation, fromLocation } = useInputContext();
  const [isSearching, setIsSearching] = useState(false);
  const { toLocation, fromLocation } = useInputContext();

  useEffect(() => {

},[])



  const handleSwap = () => {
    let fromInput = document.getElementById("from-input")as HTMLInputElement;
    let toInput = document.getElementById("to-input")as HTMLInputElement;
    let oldfrom = fromInput.value ;
    fromInput.value = toInput.value;
    toInput.value = oldfrom;
    // setFromLocation(toLocation);
    // setToLocation(fromLocation);
  };

  const findOptimalRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const start = [fromLocation?.lat, fromLocation?.lng];
    const end = [toLocation?.lat, toLocation?.lng];

    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start[1]},${start[0]};${end[1]},${end[0]}` +
      `?overview=full&geometries=geojson`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.code !== "Ok") {
          throw new Error("Route not found");

        }
        // Get shortest route
        const route = data.routes[0];

        //Draw the route on leaflet
        L.geoJSON(route.geometry, {
          style: {
            color: "red",
            weight: 6,
            opacity: 0.8
          }
        }).addTo(map);
      })



  }

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
      <Header />

      {/* 2. Main Content Area (Two-Pane Responsive Layout) */}
      <main id="main-content" className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-scroll">
        {/* Left Pane: Route Controls & Inputs */}
        <section
          id="left-pane"
          className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between  bg-white border-b md:border-b-0 md:border-r border-[#e2e8f0]"
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
                  {/*<input
                    id="from-input"
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Starting Point (e.g., Main Gate, Senate Building)"
                    className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                  />*/}
                  <select className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                    id="from-input"
                  >
                    <option value="" disabled selected>Loading...</option>

                  </select>
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
                  {/*<input
                    id="to-input"
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Destination (e.g., Faculty of Arts, Moremi Hall)"
                    className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                  />*/}
                  <select className="w-full h-[52px] pl-11 pr-4 bg-[#fcfcfc] border-2 border-[#e2e8f0] rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:border-[#003366] focus:ring-4 focus:ring-[#003366]/10 transition-all duration-200"
                    id="to-input"
                  >
                    <option value="" disabled selected>Loading...</option>

                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="find-route-btn"
                  type="submit"
                  disabled={isSearching}
                  className="w-full h-[56px] inline-flex items-center justify-center gap-2 px-6 bg-[#003366] hover:bg-[#002244] active:bg-[#001830] text-white font-bold text-base rounded-xl shadow-md shadow-[#003366]/20 transition-all duration-200 cursor-pointer disabled:opacity-75"
                  onClick={findOptimalRoute}
                >
                  <Search className="w-5 h-5 text-[#facc15]" />
                  {isSearching ? 'Finding Optimal Route...' : 'Find Optimal Route'}
                </button>
              </div>
            </form>

          </div>
        </section>

        {/* Right Pane: Map Area with Subtle Radial Grid & Glass Tag Placeholder */}
        <section
          id="right-pane"
          className="w-full md:w-1/2 min-h-[450px] md:min-h-0 bg-[#f1f5f9] flex items-center justify-center relative p-4 border-t md:border-t-0 md:border-l border-[#e2e8f0]"
        >

            <Unimap />

        </section>
      </main>

      {/* 3. Persistent Global Footer */}
      <Footer />
    </div>
  );
}
