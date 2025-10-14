import { Suspense } from 'react';
import { Business, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Globe, ArrowRight, Mail } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { mockIcons } from '@/lib/data';

// Dynamic import for SimpleMap to avoid SSR issues with Leaflet
const SimpleMap = dynamic(() => import('./simple-map').then(mod => ({ default: mod.SimpleMap })), {
  loading: () => <div className="h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center"><p>Loading map...</p></div>
});

// Type for API response category with string icon
type ApiCategory = {
  id: string;
  name: string;
  icon: string;
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function fetchSearchResults(searchParams: SearchParams) {
  const resolvedParams = await searchParams;
  const q = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const loc = Array.isArray(resolvedParams.loc) ? resolvedParams.loc[0] : resolvedParams.loc;
  const category = Array.isArray(resolvedParams.category) ? resolvedParams.category[0] : resolvedParams.category;

  const urlParams = new URLSearchParams();
  if (q) urlParams.append('search', q);
  if (loc) urlParams.append('loc', loc);
  if (category) urlParams.append('category', category);

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/yellow-books?${urlParams.toString()}`, {
      cache: 'no-store' // SSR: Always fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:3001/api/categories', {
      next: { revalidate: 3600 } // Cache categories for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

function getIconComponent(iconName: string) {
  const pascalCaseName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const iconData = mockIcons.find((icon) => 
    icon.name === pascalCaseName ||
    icon.name.toLowerCase() === iconName.toLowerCase() ||
    icon.name === iconName
  );
  
  return iconData?.component || mockIcons.find(icon => icon.name === 'MoreHorizontal')?.component;
}

function BusinessResultCard({ business }: { business: Business }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex">
        {business.logo && (
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={business.logo}
              alt={business.name}
              fill
              className="object-cover rounded-l-lg"
            />
          </div>
        )}
        <div className="flex-1 p-3">
          <CardHeader className="p-0 mb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base font-semibold">{business.name}</CardTitle>
              {business.rating && (
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-sm">{business.rating}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <p className="text-muted-foreground line-clamp-1 text-sm">{business.description}</p>

            <div className="flex flex-wrap gap-2">
              {business.categories.map((cat: string, idx: number) => {
                const IconComponent = getIconComponent(cat.toLowerCase());
                return (
                  <Badge key={idx} variant="outline" className="gap-1">
                    {IconComponent && <IconComponent className="h-3 w-3" />}
                    {cat}
                  </Badge>
                );
              })}
            </div>

            <div className="grid gap-1 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1 text-xs">{business.address.full}</span>
              </div>

              {business.contact.phone.length > 0 && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs">{business.contact.phone[0]}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Link href={`/business/${business.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Дэлгэрэнгүй
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex">
            <Skeleton className="w-20 h-20" />
            <div className="flex-1 p-4 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const results = await fetchSearchResults(searchParams);
  const categories = await fetchCategories();

  const resolvedParams = await searchParams;
  const q = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const loc = Array.isArray(resolvedParams.loc) ? resolvedParams.loc[0] : resolvedParams.loc;
  const category = Array.isArray(resolvedParams.category) ? resolvedParams.category[0] : resolvedParams.category;

  // Get locations for map
  const businessLocations = results
    .filter((business: Business) => business.location)
    .map((business: Business) => ({
      id: business.id,
      name: business.name,
      lat: business.location.lat,
      lng: business.location.lng,
      address: business.address.full
    }));

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight mb-2">
          Хайлтын үр дүн
          {(q || loc || category) && (
            <span className="text-lg font-normal text-muted-foreground ml-2">
              •{' '}
              {[q, loc, category].filter(Boolean).join(' • ')}
            </span>
          )}
        </h2>
        <div className="flex gap-2 flex-wrap">
          {q && (
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Нэр: {q}
            </Badge>
          )}
          {loc && (
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Байршил: {loc}
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="text-sm py-1 px-3">
              Ангилал: {category}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Таны хайлтад тохирох үр дүн олдсонгүй.</p>
                <p className="text-muted-foreground mt-1 text-sm">Өөр түлхүүр үг ашиглан дахин хайж үзнэ үү.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <p className="text-muted-foreground">
                {results.length} үр дүн олдлоо
              </p>
              <div className="space-y-4">
                {results.map((business: Business) => (
                  <BusinessResultCard key={business.id} business={business} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Client-side Map Island */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Газрын зураг</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <SimpleMap locations={businessLocations} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// SSR: This page will be server-rendered on each request
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container py-4">
      <div className="mb-4">
        <SearchForm />
      </div>

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}