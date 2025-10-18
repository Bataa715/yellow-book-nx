'use client';

import { useEffect, useRef } from 'react';

// Dynamic import to avoid SSR issues
let L: any = null;

// Load Leaflet only on client-side
const loadLeaflet = async () => {
  if (typeof window !== 'undefined' && !L) {
    L = (await import('leaflet')).default;
    // Dynamically load CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    return L;
  }
  return L;
};

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface MapIslandProps {
  locations: MapLocation[];
}

export function MapIsland({ locations }: MapIslandProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;

    const initializeMap = async () => {
      if (!mapRef.current || !mounted) return;

      // Wait a bit to ensure DOM is ready
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!mounted || !mapRef.current) return;

      // Check if already initialized and prevent double initialization
      if (isInitializedRef.current || mapInstanceRef.current) {
        return;
      }

      try {
        // Mark as being initialized
        isInitializedRef.current = true;

        // Load Leaflet dynamically
        const leaflet = await loadLeaflet();
        if (!leaflet || !mounted) return;

        // Fix for default markers in Leaflet
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Default center (Ulaanbaatar coordinates)
        const defaultCenter: [number, number] = [47.8864, 106.9057];

        // Use first location as center if available
        const center: [number, number] =
          locations.length > 0 ? [locations[0].lat, locations[0].lng] : defaultCenter;

        // Initialize map
        const map = leaflet.map(mapRef.current).setView(center, locations.length > 1 ? 12 : 15);

        // Add OpenStreetMap tiles
        leaflet
          .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          })
          .addTo(map);

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach((marker: any) => marker.remove());
        markersRef.current = [];

        // Add markers for each location
        const group = new leaflet.FeatureGroup();

        locations.forEach((location: MapLocation) => {
          const marker = leaflet.marker([location.lat, location.lng]).bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">${location.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #666;">${location.address}</p>
              </div>
            `);

          marker.addTo(map);
          group.addLayer(marker);
          markersRef.current.push(marker);
        });

        // Fit map to show all markers if multiple locations
        if (locations.length > 1) {
          map.fitBounds(group.getBounds(), { padding: [20, 20] });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        isInitializedRef.current = false;
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      mounted = false;
      isInitializedRef.current = false;

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
        mapInstanceRef.current = null;
      }
      markersRef.current = [];

      // Clear container and Leaflet references
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [locations]);

  if (locations.length === 0) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Газрын зураг дээр харуулах байршил алга</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* OpenStreetMap with Leaflet */}
      <div
        ref={mapRef}
        className="h-64 rounded-lg overflow-hidden border z-0"
        style={{ position: 'relative' }}
      />

      {/* Location list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <h4 className="font-medium text-sm">Олдсон байршлууд:</h4>
        {locations.map((location) => (
          <div
            key={location.id}
            className="p-2 bg-muted/50 rounded text-xs hover:bg-muted cursor-pointer transition-colors"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([location.lat, location.lng], 16);
                // Find and open the popup for this location
                const marker = markersRef.current.find(
                  (m) => m.getLatLng().lat === location.lat && m.getLatLng().lng === location.lng
                );
                if (marker) {
                  marker.openPopup();
                }
              }
            }}
          >
            <div className="font-medium truncate">{location.name}</div>
            <div className="text-muted-foreground truncate">{location.address}</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        🗺️ OpenStreetMap (API key шаардлагагүй, үнэгүй)
      </div>
    </div>
  );
}

// Loading skeleton for the map
export function MapIslandSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-2 space-y-1">
            <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-full bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
