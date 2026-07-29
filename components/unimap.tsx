"use client";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { useInputContext } from "@/context/InputContext";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: icon.src, shadowUrl: iconShadow.src });


export interface LocationType {
  name: string,
  lat: number,
  lng: number
}

export default function Unimap() {
  const { setFromLocation, setToLocation } = useInputContext();
  useEffect(() => {
    const map = L.map("map").setView([6.516, 3.390], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 14,
        maxZoom: 19,
        attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(map);


    const unilagBounds:LatLngBoundsExpression | undefined = [
        [6.505, 3.380],
        [6.528, 3.405]
    ];

    map.setMaxBounds(unilagBounds);

    const fromSelect:HTMLSelectElement = document.getElementById("from-input") as HTMLSelectElement;
    const toSelect: HTMLSelectElement = document.getElementById("to-input") as HTMLSelectElement;

    let marker1:any = null;
    let marker2:any = null;
    let unilagLocations:LocationType[] = [];

    const query = `
      [out:json][timeout:25];
      (
        node["name"](6.505,3.380,6.528,3.405);
        way["name"]["building"](6.505,3.380,6.528,3.405);
      );
      out center;
    `;

    console.log("Dddddd")
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    fetch(overpassUrl)
        .then(response => response.json())
        .then(data => {
            unilagLocations = [];

            data.elements.forEach((element:any) => {
                if (element.tags && element.tags.name) {
                    const lat = element.lat || (element.center && element.center.lat);
                    const lng = element.lon || (element.center && element.center.lon);

                    if (lat && lng) {
                        unilagLocations.push({
                            name: element.tags.name,
                            lat: lat,
                            lng: lng
                        });
                    }
                }
            });

            // Sort alphabetically
            unilagLocations.sort((a, b) => a.name.localeCompare(b.name));
          console.log(unilagLocations);
            // Update placeholders
            fromSelect.options[0].textContent = "Choose Start...";
            toSelect.options[0].textContent = "Choose Destination...";

            // Populate BOTH dropdown menus
            unilagLocations.forEach((location, index) => {
                const option1 = document.createElement('option');
                option1.value = String(index);
                option1.textContent = location.name;
                fromSelect.appendChild(option1);

                // Create a completely separate option element for the second dropdown
                const option2 = document.createElement('option');
                option2.value = String(index);
                option2.textContent = location.name;
                toSelect.appendChild(option2);
            });
        })
        .catch(error => console.error("Error fetching map data:", error));

    function updateMapAndMarkers() {
        // Check if the user has selected a value in each box
        const val1 = fromSelect.value;
        const val2 = toSelect.value;

        // Handle Marker 1
        if (val1 !== "") {
          const loc1 = unilagLocations[Number(val1)];
          setFromLocation(loc1);
          if (marker1) map.removeLayer(marker1);
          marker1 = L.marker([loc1.lat, loc1.lng]).addTo(map)
              .bindPopup(`<b>Start:</b> ${loc1.name}`);
        }

        // Handle Marker 2
        if (val2 !== "") {
          const loc2 = unilagLocations[Number(val2)];
          setToLocation(loc2);
          if (marker2) map.removeLayer(marker2);
          marker2 = L.marker([loc2.lat, loc2.lng]).addTo(map)
              .bindPopup(`<b>Destination:</b> ${loc2.name}`);
        }

        // Adjust the map camera
        if (marker1 && marker2) {
            // Both markers exist: zoom out just enough so both are visible on screen
            const bounds:L.LatLngBounds = new L.FeatureGroup([marker1, marker2]).getBounds();
            map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });

            marker1.openPopup();
        } else if (marker1) {
            // Only marker 1 exists: fly directly to it
            map.flyTo(marker1.getLatLng(), 17, { animate: true, duration: 1.5 });
            marker1.openPopup();
        } else if (marker2) {
            // Only marker 2 exists: fly directly to it
            map.flyTo(marker2.getLatLng(), 17, { animate: true, duration: 1.5 });
            marker2.openPopup();
        }
    }

    // 5. Attach the event listeners to the dropdowns
    fromSelect.addEventListener('change', updateMapAndMarkers);
    toSelect.addEventListener('change', updateMapAndMarkers);
  }, [])



  return(
    <div id="map" className="bg-blue-500 h-full w-full"></div>
  )
}
