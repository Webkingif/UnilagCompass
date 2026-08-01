"use client";
import { createContext, useContext, useState } from "react";
import L from "leaflet";

const MapContext = createContext<{
  map: L.Map | null;
  setMap: React.Dispatch<React.SetStateAction<L.Map | null>>;
} | null>(null);

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<L.Map | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used inside MapProvider");
  }
  return context;
}