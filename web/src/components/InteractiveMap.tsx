import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Pin {
    id: string;
    state: string;
    coords: [number, number]; // lat, lng
}

interface InteractiveMapProps {
    pins: Pin[];
}

export default function InteractiveMap({ pins }: InteractiveMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;

        // Initialize map centering on Brazil
        // coordinates for south america / brazil
        const map = L.map(mapRef.current, {
            center: [-14.235, -51.925],
            zoom: 4,
            zoomControl: false,
            attributionControl: false,
            scrollWheelZoom: false,
            dragging: false // Clean display map
        });

        // Use CartoDB Light No Labels so it's a very bright map (water is bright gray/white)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        leafletMapRef.current = map;

        // Custom icon that looks like the glowing pin
        const createCustomIcon = () => {
            const html = `
        <div class="relative flex h-6 w-6 justify-center items-center group cursor-pointer">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-[#6b7054] shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-white group-hover:scale-150 transition-transform"></span>
        </div>
      `;
            return L.divIcon({
                html: html,
                className: 'custom-leaflet-pin',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
        };

        const icon = createCustomIcon();

        pins.forEach(pin => {
            const marker = L.marker(pin.coords, { icon }).addTo(map);
            marker.bindTooltip(`<b>📍 ${pin.state}</b>`, {
                direction: 'right',
                offset: [10, 0],
                className: 'custom-leaflet-tooltip bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg font-bold text-xs tracking-wide text-[#051c36] border border-[#6b7054]/10'
            });
        });

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, [pins]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* 
        This is the magic class: mix-blend-multiply combines with pure white to turn invisible.
        contrast-[1.1] or 1.2 forces the lightly grey water to become purely white. 
        As a result, ONLY the landforms/roads remain visible!
      */}
            <div
                ref={mapRef}
                className="w-full h-full mix-blend-multiply filter contrast-[1.15] brightness-[1.05]"
                style={{ background: 'transparent' }}
            />
        </div>
    );
}
