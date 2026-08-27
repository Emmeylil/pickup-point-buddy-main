import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PickupStation } from "@/types/pickup-station";
import { Card } from "@/components/ui/card";

// Default Lagos coords as fallback for map view
const DEFAULT_CENTER: [number, number] = [6.5244, 3.3792];

// Custom Numbered Icon Generator
const createNumberedIcon = (num: number, isSelected: boolean) => {
  const bgColor = isSelected ? '#000000' : '#ff9900';
  const borderColor = isSelected ? '#ff9900' : '#ffffff';
  
  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `
      <div style="
        background-color: ${bgColor}; 
        color: white; 
        width: 32px; 
        height: 32px; 
        border-radius: 50%; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-weight: 800; 
        font-size: 13px; 
        border: 2px solid ${borderColor}; 
        box-shadow: 0 3px 8px rgba(0,0,0,0.3); 
        font-family: system-ui, -apple-system, sans-serif;
        transition: transform 0.2s ease;
        ${isSelected ? 'transform: scale(1.15);' : ''}
      ">
        ${num}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

interface PickupStationMapProps {
  stations: PickupStation[];
  selectedStation?: PickupStation;
  onSelectStation?: (station: PickupStation) => void;
}

export default function PickupStationMap({ stations, selectedStation, onSelectStation }: PickupStationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  // Helper: Build Google Maps link safely
  const buildDirectionsLink = (lat: number, lng: number) => {
    if (isNaN(lat) || isNaN(lng)) return "";
    return `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${lat},${lng}`;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = L.map(mapContainer.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(DEFAULT_CENTER, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    stations.forEach((station, index) => {
      const isSelected = selectedStation?.name === station.name;
      const icon = createNumberedIcon(index + 1, isSelected);

      const lat = parseFloat(String(station.latitude));
      const lng = parseFloat(String(station.longitude));
      const directionsLink = buildDirectionsLink(lat, lng);

      const marker = L.marker(
        !isNaN(lat) && !isNaN(lng) ? [lat, lng] : DEFAULT_CENTER,
        { icon }
      ).bindPopup(`
        <div style="padding: 6px; min-width: 200px;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom: 4px;">
            <span style="background:#ff9900; color:white; border-radius:50%; width:20px; height:20px; font-size:11px; font-weight:bold; display:inline-flex; align-items:center; justify-content:center;">${index + 1}</span>
            <h3 style="font-weight: 700; font-size: 14px; margin: 0; color: #111;">${station.name}</h3>
          </div>
          <p style="font-size: 12px; color: #555; margin-bottom: 4px;">${station.address}</p>
          <p style="font-size: 12px; color: #555; margin-bottom: 2px;">⏰ <strong>Weekdays:</strong> ${station.timeOpenedWeek || "Closed"}</p>
          ${station.landmark ? `<p style="font-size: 11px; color: #777; margin-top: 2px;">📍 ${station.landmark}</p>` : ''}
          ${directionsLink
          ? `<a 
                href="${directionsLink}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="display:inline-block; margin-top:6px; font-size:12px; color:#ff9900; font-weight:600; text-decoration:none;"
              >
                🧭 Get Directions
              </a>`
          : ""
        }
        </div>
      `).addTo(map.current!);

      marker.on('click', () => {
        onSelectStation?.(station);
      });

      markers.current.push(marker);
    });

    // Fit view bounds smoothly
    if (markers.current.length > 0) {
      const group = new L.FeatureGroup(markers.current);
      map.current.fitBounds(group.getBounds(), { padding: [30, 30], maxZoom: 14 });
    } else {
      map.current.setView(DEFAULT_CENTER, 10);
    }

    setTimeout(() => map.current?.invalidateSize(), 250);
  }, [stations, selectedStation]);

  // Focus on selected station
  useEffect(() => {
    if (!map.current || !selectedStation) return;

    const lat = parseFloat(String(selectedStation.latitude));
    const lng = parseFloat(String(selectedStation.longitude));

    if (!isNaN(lat) && !isNaN(lng)) {
      map.current.setView([lat, lng], 15, { animate: true });
    }
  }, [selectedStation]);

  return (
    <Card className="w-full h-full min-h-[450px] overflow-hidden border border-border/60 shadow-sm relative">
      <div
        ref={mapContainer}
        className="w-full h-full min-h-[450px]"
      />
    </Card>
  );
}

