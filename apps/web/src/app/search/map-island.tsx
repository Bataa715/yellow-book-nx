'use client';

import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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

// Declare google maps global type
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Real Google Maps integration
export function MapIsland({ locations }: MapIslandProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
          reject(new Error('Google Maps API key багаа тохируулна уу'));
          return;
        }

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Google Maps script ачаалагдсангүй'));
        
        document.head.appendChild(script);
      });
    };

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        
        if (!mapRef.current) return;

        // Default center (Ulaanbaatar coordinates)
        const defaultCenter = { lat: 47.8864, lng: 106.9057 };
        
        // Use first location as center if available
        const center = locations.length > 0 
          ? { lat: locations[0].lat, lng: locations[0].lng }
          : defaultCenter;

        const map = new google.maps.Map(mapRef.current, {
          zoom: locations.length > 1 ? 12 : 15,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Add markers for each location
        const bounds = new google.maps.LatLngBounds();
        
        locations.forEach((location) => {
          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="8" fill="#ef4444" stroke="white" stroke-width="2"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16)
            }
          });

          // Info window for each marker
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold text-sm">${location.name}</h3>
                <p class="text-xs text-gray-600 mt-1">${location.address}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          markersRef.current.push(marker);
          bounds.extend({ lat: location.lat, lng: location.lng });
        });

        // Fit map to show all markers if multiple locations
        if (locations.length > 1) {
          map.fitBounds(bounds);
          const listener = google.maps.event.addListener(map, 'bounds_changed', () => {
            if (map.getZoom()! > 15) map.setZoom(15);
            google.maps.event.removeListener(listener);
          });
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Google Maps алдаа:', err);
        setError('Газрын зургийг ачаалахад алдаа гарлаа');
        setIsLoading(false);
      }
    };

    if (locations.length > 0) {
      initializeMap();
    } else {
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [locations]);

  if (locations.length === 0) {
    return (
      <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Газрын зураг дээр харуулах байршил алга</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground font-medium">⚠️ {error}</p>
            <p className="text-xs text-muted-foreground mt-2">
              .env.local файлд Google Maps API key нэмнэ үү
            </p>
          </div>
        </div>
        
        {/* Fallback location list */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Олдсон байршлууд:</h4>
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-2 bg-muted/50 rounded text-xs"
            >
              <div className="font-medium truncate">{location.name}</div>
              <div className="text-muted-foreground truncate">{location.address}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real Google Maps */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Газрын зураг ачаалж байна...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapRef}
          className="h-64 rounded-lg overflow-hidden border"
        />
      </div>

      {/* Location list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <h4 className="font-medium text-sm">Олдсон байршлууд:</h4>
        {locations.map((location) => (
          <div
            key={location.id}
            className="p-2 bg-muted/50 rounded text-xs hover:bg-muted cursor-pointer transition-colors"
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setCenter({ lat: location.lat, lng: location.lng });
                mapInstanceRef.current.setZoom(16);
              }
            }}
          >
            <div className="font-medium truncate">{location.name}</div>
            <div className="text-muted-foreground truncate">{location.address}</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        ✅ Google Maps интеграци хийгдсэн
      </div>
    </div>
  );
}

// Loading skeleton for the map
export function MapIslandSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-2 space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}