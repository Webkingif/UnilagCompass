"use client";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";
import { useEffect, useRef } from "react";
import { useInputContext } from "@/context/InputContext";
import { useMap } from "@/context/MapContext";
import data from "components/data.json"; // Verify this path for your project
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: icon.src, iconRetinaUrl: iconRetina.src, shadowUrl: iconShadow.src });

export interface LocationType {
  name: string,
  lat: number,
  lng: number
}

export default function Unimap() {
  const { setFromLocation, setToLocation } = useInputContext();
  const { map, setMap } = useMap();

  // 1. Create references for the DOM element and initialization state
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);

  // EFFECT 1: Map Initialization
  useEffect(() => {
    // If the div doesn't exist yet, or we already initialized, stop here.
    if (!mapContainerRef.current || mapInitialized.current) return;

    // Pass the actual DOM element reference instead of the string "map"
    const m = L.map(mapContainerRef.current).setView([6.516, 3.390], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 14,
      maxZoom: 19,
      attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(m);

    const unilagBounds: LatLngBoundsExpression = [
      [6.505, 3.380],
      [6.528, 3.405]
    ];
    m.setMaxBounds(unilagBounds);

    setMap(m);
    mapInitialized.current = true;
  }, [setMap]);

  // EFFECT 2: Markers and Dropdown Logic
  useEffect(() => {
    // Wait until EFFECT 1 successfully creates and sets the map
    if (!map) return;

    const fromSelect = document.getElementById("from-input") as HTMLSelectElement;
    const toSelect = document.getElementById("to-input") as HTMLSelectElement;

    // Reset inner HTML to prevent duplicate options on re-renders
    if (fromSelect) fromSelect.innerHTML = '<option value="disabled" disabled selected>Choose Start...</option>';
    if (toSelect) toSelect.innerHTML = '<option value="disabled" disabled selected>Choose Destination...</option>';

    let marker1: any = null;
    let marker2: any = null;
    const unilagLocations: LocationType[] = data;

    // Populate dropdown menus
    unilagLocations.forEach((location, index) => {
      const option1 = document.createElement('option');
      option1.value = String(index);
      option1.textContent = location.name;
      if (fromSelect) fromSelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = String(index);
      option2.textContent = location.name;
      if (toSelect) toSelect.appendChild(option2);
    });

    function updateMapAndMarkers() {
      const val1 = fromSelect?.value;
      const val2 = toSelect?.value;

      if (val1 && val1 !== "disabled" && map) {
        const loc1 = unilagLocations[Number(val1)];
        setFromLocation(loc1);
        if (marker1 && map) map.removeLayer(marker1);
        marker1 = L.marker([loc1.lat, loc1.lng]).addTo(map)
          .bindPopup(`<b>Start:</b> ${loc1.name}`);
      }

      if (val2 && val2 !== "disabled" && map) {
        const loc2 = unilagLocations[Number(val2)];
        setToLocation(loc2);
        if (marker2) map.removeLayer(marker2);
        marker2 = L.marker([loc2.lat, loc2.lng]).addTo(map)
          .bindPopup(`<b>Destination:</b> ${loc2.name}`);
      }

      if (marker1 && marker2 && map) {
        const bounds: L.LatLngBounds = new L.FeatureGroup([marker1, marker2]).getBounds();
        map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
        marker1.openPopup();
      } else if (marker1 && map) {
        map.flyTo(marker1.getLatLng(), 17, { animate: true, duration: 1.5 });
        marker1.openPopup();
      } else if (marker2 && map) {
        map.flyTo(marker2.getLatLng(), 17, { animate: true, duration: 1.5 });
        marker2.openPopup();
      }
    }

    if (fromSelect) fromSelect.addEventListener('change', updateMapAndMarkers);
    if (toSelect) toSelect.addEventListener('change', updateMapAndMarkers);

    return () => {
      if (fromSelect) fromSelect.removeEventListener('change', updateMapAndMarkers);
      if (toSelect) toSelect.removeEventListener('change', updateMapAndMarkers);
    };
  }, [map, setFromLocation, setToLocation]);

  // 2. Attach the ref to your div container
  return (
    <div ref={mapContainerRef} className="bg-blue-500 h-full w-full z-0 relative"></div>
  );
}