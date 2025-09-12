import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PickupStation } from "@/types/pickup-station";
import { Card } from "@/components/ui/card";

// Fix for default markers in Leaflet
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3b82f6" stroke="#1e40af" stroke-width="1" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 8.5 12.5 28.5 12.5 28.5s12.5-20 12.5-28.5C25 5.6 19.4 0 12.5 0zm0 17.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

interface PickupStationMapProps {
  stations: PickupStation[];
  selectedStation?: PickupStation;
}

export function PickupStationMap({ stations, selectedStation }: PickupStationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create map
    map.current = L.map(mapContainer.current).setView([6.5244, 3.3792], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when stations change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    stations.forEach((station) => {
      const isSelected = selectedStation?.name === station.name;
      const icon = isSelected ? selectedIcon : defaultIcon;

      const marker = L.marker([station.latitude, station.longitude], { icon })
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${station.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${station.address}</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">📞 ${station.number}</p>
            <p style="font-size: 12px; color: #666;">⏰ ${station.timeOpenedWeek}</p>
            ${station.landmark ? `<p style="font-size: 12px; color: #888; margin-top: 4px;">📍 ${station.landmark}</p>` : ''}
          </div>
        `)
        .addTo(map.current);

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (stations.length > 0) {
      const group = new L.FeatureGroup(markers.current);
      map.current.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [stations, selectedStation]);

  // Handle selected station
  useEffect(() => {
    if (!map.current || !selectedStation) return;

    // Center map on selected station
    map.current.setView([selectedStation.latitude, selectedStation.longitude], 15);
  }, [selectedStation]);

  return (
    <Card className="h-full overflow-hidden">
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[400px]"
        style={{ borderRadius: '8px' }}
      />
    </Card>
  );
}