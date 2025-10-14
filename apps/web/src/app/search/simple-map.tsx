'use client';

import { useEffect, useRef, useState } from 'react';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface SimpleMapProps {
  locations: MapLocation[];
}

export function SimpleMap({ locations }: SimpleMapProps) {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapId = useRef(`map-${Date.now()}-${Math.random()}`);

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      if (!containerRef.current || mapInstance) return;

      try {
        setIsLoading(true);
        
        // Dynamic import
        const L = (await import('leaflet')).default;
        
        // Load CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Wait for DOM and styles to be ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (!isMounted || !containerRef.current) return;

        // Set up default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Default center (Ulaanbaatar)
        const defaultCenter: [number, number] = [47.8864, 106.9057];
        const center: [number, number] = locations.length > 0 
          ? [locations[0].lat, locations[0].lng] 
          : defaultCenter;

        // Create map
        const map = L.map(containerRef.current, {
          center,
          zoom: locations.length > 1 ? 12 : 15,
        });

        // Add tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add markers
        const group = new L.FeatureGroup();
        locations.forEach((location) => {
          const marker = L.marker([location.lat, location.lng])
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${location.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${location.address}</p>
              </div>
            `);
          marker.addTo(map);
          group.addLayer(marker);
        });

        // Fit bounds if multiple locations
        if (locations.length > 1) {
          map.fitBounds(group.getBounds(), { padding: [20, 20] });
        }

        if (isMounted) {
          setMapInstance(map);
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Map initialization failed:', error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (error) {
          console.warn('Map cleanup error:', error);
        }
      }
    };
  }, [locations.length]); // Only re-init if number of locations changes

  if (locations.length === 0) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Газрын зураг дээр харуулах байршил алга</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center z-10">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
        <div 
          key={mapId.current}
          ref={containerRef}
          className="h-64 rounded-lg overflow-hidden border"
          style={{ minHeight: '256px' }}
        />
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>📍 {locations.length} байршил харуулж байна</p>
      </div>
    </div>
  );
}