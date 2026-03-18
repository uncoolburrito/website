"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// User's Travel Data
const visitedCountries = ["India", "Malaysia", "Philippines", "Thailand"];

const wishlistCountries = [
    "United States of America", "Japan", "Oman", "Yemen", "Iran", 
    "South Korea", "Botswana", "Germany", "United Arab Emirates", 
    "Mexico", "Vietnam", "Australia", "Taiwan"
];

const places = [
    { 
        name: "Kolkata, India", 
        coordinates: [22.5726, 88.3639], 
        favorite: true, 
        description: "My Home City! 🏡",
        images: [] 
    },
    { name: "Ranchi, India", coordinates: [23.3441, 85.3096], favorite: false, description: "The city of waterfalls.", images: [] },
    { name: "Hyderabad, India", coordinates: [17.3850, 78.4867], favorite: false, description: "The City of Pearls and Biryani!", images: [] },
    { name: "Bangalore, India", coordinates: [12.9716, 77.5946], favorite: false, description: "The 'Silicon Valley' of India.", images: [] },
    { name: "Jamshedpur, India", coordinates: [22.8046, 86.2029], favorite: false, description: "Steel City of India.", images: [] },
    { name: "Delhi, India", coordinates: [28.7041, 77.1025], favorite: false, description: "The capital city.", images: [] },
    { name: "Vadodara, India", coordinates: [22.3072, 73.1812], favorite: false, description: "The cultural capital of Gujarat.", images: [] },
    { name: "Surat, India", coordinates: [21.1702, 72.8311], favorite: false, description: "The Diamond City.", images: [] },
];

export default function TravelMap() {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        
        // Prevent double initialization
        if ((mapRef.current as any)._leaflet_id) {
            return;
        }

        const map = L.map(mapRef.current, {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10,
            zoomControl: false,
            attributionControl: false,
        });

        let isMounted = true;

        L.control.zoom({ position: 'topright' }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png').addTo(map);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
            pane: 'shadowPane'
        }).addTo(map);

        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(res => res.json())
            .then(data => {
                // If the component unmounted, map._container is undefined and .addTo(map) will crash.
                // This explicitly fixes the Next.js Strict Mode hot-reload crashes you were hitting.
                if (!isMounted || !map.getContainer()) return;

                L.geoJSON(data, {
                    style: (feature) => {
                        const name = feature?.properties?.name;
                        if (visitedCountries.includes(name)) {
                            return { fillColor: '#e5e5e5', fillOpacity: 0.6, color: '#e5e5e5', weight: 1, opacity: 0.8 }; 
                        } else if (wishlistCountries.includes(name) || (name === "United States" && wishlistCountries.includes("United States of America"))) {
                            return { fillColor: '#888888', fillOpacity: 0.3, color: '#888888', weight: 1, opacity: 0.6 }; 
                        }
                        return { fillColor: '#111111', fillOpacity: 0.2, color: '#333333', weight: 0.5, opacity: 0.3 };
                    },
                    onEachFeature: (feature, layer) => {
                        const name = feature?.properties?.name;
                        let popupHtml = `<div class="font-bold text-lg mb-1">${name}</div>`;
                        if (visitedCountries.includes(name)) popupHtml += `<div class="text-sm opacity-80">✓ Visited</div>`;
                        else if (wishlistCountries.includes(name) || (name === "United States" && wishlistCountries.includes("United States of America"))) popupHtml += `<div class="text-sm opacity-50">📍 Wishlist 2026</div>`;
                        
                        layer.bindPopup(popupHtml);
                        layer.on({
                            mouseover: (e) => {
                                if (visitedCountries.includes(name) || wishlistCountries.includes(name) || (name === "United States" && wishlistCountries.includes("United States of America"))) {
                                    e.target.setStyle({ fillOpacity: 0.8, weight: 2 });
                                }
                            },
                            mouseout: (e) => {
                                if (visitedCountries.includes(name)) e.target.setStyle({ fillOpacity: 0.6, weight: 1 });
                                else if (wishlistCountries.includes(name) || (name === "United States" && wishlistCountries.includes("United States of America"))) e.target.setStyle({ fillOpacity: 0.3, weight: 1 });
                            }
                        });
                    }
                }).addTo(map);

                setTimeout(() => {
                    if (!isMounted || !map.getContainer()) return;

                    places.forEach(place => {
                        const iconHtml = `<div class="w-6 h-6 flex items-center justify-center text-xs bg-background border border-foreground/20 rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-125">${place.favorite ? '⭐' : '📍'}</div>`;
                        const icon = L.divIcon({
                            className: 'bg-transparent border-none',
                            html: iconHtml,
                            iconSize: [24, 24],
                            iconAnchor: [12, 12],
                            popupAnchor: [0, -12]
                        });

                        let popupBase = `<div class="font-bold text-lg mb-1 tracking-tight">${place.name}</div><div class="text-sm opacity-80">${place.description}</div>${place.favorite ? '<div class="text-[10px] mt-2 uppercase tracking-widest font-bold text-yellow-500">⭐ Favorite place</div>' : ''}`;
                        
                        // Add Image Gallery if images exist
                        if (place.images && place.images.length > 0) {
                            popupBase += `<div class="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x" style="max-width: 250px;">`;
                            place.images.forEach(img => {
                                popupBase += `<img src="${img}" class="w-24 h-24 object-cover rounded-lg snap-center flex-shrink-0 border border-foreground/10" />`;
                            });
                            popupBase += `</div>`;
                        }

                        L.marker(place.coordinates as [number, number], { icon, zIndexOffset: place.favorite ? 1000 : 500 })
                            .bindPopup(popupBase)
                            .addTo(map);
                    });
                }, 200);
            });

        return () => {
            isMounted = false;
            map.remove();
        };
    }, []);

    return (
        <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border border-foreground/10 relative z-0 shadow-2xl">
            <div ref={mapRef} className="w-full h-full bg-[#111111]" />
            
            {/* Legend Overlay */}
            <div className="absolute bottom-4 pb-2 left-4 z-[400] bg-background/80 backdrop-blur-xl border border-foreground/10 p-4 rounded-2xl text-xs flex flex-col gap-3 shadow-xl pointer-events-none">
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#e5e5e5] rounded-sm opacity-60" /> <span className="font-medium">Visited</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#888888] rounded-sm opacity-30" /> <span className="font-medium">Wishlist 2026</span></div>
                <div className="flex items-center gap-3"><span className="text-base w-3 flex justify-center">📍</span> <span className="font-medium">Place</span></div>
                <div className="flex items-center gap-3"><span className="text-base w-3 flex justify-center">⭐</span> <span className="font-medium">Favorite</span></div>
            </div>
        </div>
    );
}
