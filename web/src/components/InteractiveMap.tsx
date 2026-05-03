"use client";

import React, { useEffect, useRef, useState } from 'react';
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
    const leafletMapRef = useRef<any>(null);
    const markersLayerRef = useRef<any>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !mapRef.current || leafletMapRef.current) return;

        const initMap = async () => {
            try {
                // Importação dinâmica do Leaflet para garantir que rode apenas no cliente
                const L = (await import('leaflet')).default;

                const map = L.map(mapRef.current!, {
                    center: [-14.235, -51.925],
                    zoom: 4,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    dragging: false
                });

                // Mapa de base minimalista (CartoDB Light)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                }).addTo(map);

                leafletMapRef.current = map;
                markersLayerRef.current = L.layerGroup().addTo(map);
                
                // Redimensionamento forçado para evitar tiles quebrados no carregamento inicial
                setTimeout(() => {
                    map.invalidateSize();
                }, 250);

            } catch (error) {
                console.error("Erro ao inicializar o mapa Leaflet:", error);
            }
        };

        initMap();

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, [isMounted]);

    // Atualização Dinâmica de Marcadores
    useEffect(() => {
        const loadMarkers = async () => {
            const map = leafletMapRef.current;
            const markersLayer = markersLayerRef.current;
            if (!map || !markersLayer) return;

            const L = (await import('leaflet')).default;
            markersLayer.clearLayers();

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
                const marker = L.marker(pin.coords, { icon }).addTo(markersLayer);
                marker.bindTooltip(`<b>📍 ${pin.state}</b>`, {
                    direction: 'right',
                    offset: [10, 0],
                    className: 'custom-leaflet-tooltip bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg font-bold text-xs tracking-wide text-[#051c36] border border-[#6b7054]/10'
                });
            });

            // Ajuste automático de zoom para mostrar todos os pins
            if (pins.length > 0) {
                const bounds = L.latLngBounds(pins.map(p => p.coords));
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
            }
        };

        loadMarkers();
    }, [pins, isMounted]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={mapRef}
                className="w-full h-full mix-blend-multiply filter contrast-[1.15] brightness-[1.05]"
                style={{ background: '#ffffff' }}
            />
        </div>
    );
}
