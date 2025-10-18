import { Suspense } from 'react';
import { Business } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, ArrowRight, Search } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Force this page to be dynamic - no static generation
export const dynamicParams = true;

// Dynamic import for SimpleMap to avoid SSR issues with Leaflet
const SimpleMap = dynamic(
  () => import('./simple-map').then((mod) => ({ default: mod.SimpleMap })),
  {
    loading: () => (
      <div className="h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading interactive map...</p>
        </div>
      </div>
    ),
  }
);

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function fetchSearchResults(searchParams: SearchParams) {
  const resolvedParams = await searchParams;
  const q = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const loc = Array.isArray(resolvedParams.loc) ? resolvedParams.loc[0] : resolvedParams.loc;
  const category = Array.isArray(resolvedParams.category)
    ? resolvedParams.category[0]
    : resolvedParams.category;

  const urlParams = new URLSearchParams();
  if (q) urlParams.append('search', q);
  if (loc) urlParams.append('loc', loc);
  if (category) urlParams.append('category', category);

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE_URL}/api/yellow-books?${urlParams.toString()}`, {
      cache: 'no-store', // SSR: Always fresh data
      next: { revalidate: 0 }, // SSR: Disable caching for search
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

function getIconComponent(_iconName: string) {
  // Simple fallback icon component
  return Star;
}

function BusinessResultCard({ business }: { business: Business }) {
  return (
    <Link href={`/business/${business.id}`} className="block">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-[1.01] max-w-full cursor-pointer">
        <div className="flex flex-col sm:flex-row h-auto sm:h-40">
          {/* Image Section */}
          <div className="relative w-full h-48 sm:w-36 sm:h-full flex-shrink-0 overflow-hidden">
            <Image
              src={business.logo || 'https://picsum.photos/seed/default/400/300'}
              alt={business.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/20 via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
            {/* Header */}
            <div className="space-y-2.5 flex-1">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <h3 className="font-bold text-base sm:text-lg leading-tight text-gray-900 group-hover:text-primary transition-colors truncate pr-2 min-w-0 flex-1">
                  {business.name}
                </h3>
                {business.rating && (
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full shadow-sm flex-shrink-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    <span className="font-semibold text-amber-700 text-xs">{business.rating}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 pr-2">
                {business.description}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 pr-2">
                {business.categories.slice(0, 2).map((cat: string, idx: number) => {
                  const IconComponent = getIconComponent(cat.toLowerCase());
                  return (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors flex-shrink-0"
                    >
                      {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                      <span className="truncate max-w-20">{cat}</span>
                    </Badge>
                  );
                })}
                {business.categories.length > 2 && (
                  <Badge variant="outline" className="text-xs text-gray-500 flex-shrink-0">
                    +{business.categories.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-3 mt-auto">
              <div className="grid gap-1.5 text-sm">
                <div className="flex items-start gap-2 text-gray-500 min-w-0">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span className="line-clamp-1 text-xs leading-relaxed truncate pr-2">
                    {business.address.full}
                  </span>
                </div>

                {business.contact.phone.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-500 min-w-0">
                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="text-xs font-medium truncate pr-2">
                      {business.contact.phone[0]}
                    </span>
                  </div>
                )}
              </div>

              <div className="pr-2">
                <div className="w-full bg-primary/10 text-primary border border-primary/20 rounded-md px-3 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all">
                  Дэлгэрэнгүй үзэх
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 xl:gap-12">
        {/* Results Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="w-2 h-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-md">
                <div className="flex flex-col sm:flex-row h-auto sm:h-40">
                  <Skeleton className="w-full h-48 sm:w-36 sm:h-full" />
                  <div className="flex-1 p-4 sm:p-5 space-y-3 min-w-0">
                    <div className="flex justify-between gap-2 min-w-0">
                      <Skeleton className="h-5 w-3/4 min-w-0 flex-1" />
                      <Skeleton className="h-5 w-12 rounded-full flex-shrink-0" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 flex-wrap">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-9 w-full rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="overflow-hidden shadow-xl">
            <div className="p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <div>
                  <Skeleton className="h-5 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-64 sm:h-72 lg:h-80 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}

async function SearchResults({ searchParams }: { searchParams: SearchParams }) {
  const results = await fetchSearchResults(searchParams);

  const resolvedParams = await searchParams;
  const q = Array.isArray(resolvedParams.q) ? resolvedParams.q[0] : resolvedParams.q;
  const loc = Array.isArray(resolvedParams.loc) ? resolvedParams.loc[0] : resolvedParams.loc;
  const category = Array.isArray(resolvedParams.category)
    ? resolvedParams.category[0]
    : resolvedParams.category;

  // Get locations for map
  const businessLocations = results
    .filter((business: Business) => business.location)
    .map((business: Business) => ({
      id: business.id,
      name: business.name,
      lat: business.location.lat,
      lng: business.location.lng,
      address: business.address.full,
    }));

  return (
    <div className="space-y-4">
      {/* Search Results Header */}
      <div className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Хайлтын үр дүн</h2>
        </div>

        {(q || loc || category) && (
          <div className="space-y-2">
            <p className="text-gray-600 text-sm">Таны хайсан:</p>
            <div className="flex gap-2 flex-wrap">
              {q && (
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 px-3 py-1.5">
                  <Search className="h-3 w-3 mr-1" />
                  {q}
                </Badge>
              )}
              {loc && (
                <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 px-3 py-1.5">
                  <MapPin className="h-3 w-3 mr-1" />
                  {loc}
                </Badge>
              )}
              {category && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1.5">
                  {category}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 xl:gap-12">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {results.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Үр дүн олдсонгүй</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Таны хайлтад тохирох байгууллага олдсонгүй. Өөр түлхүүр үг эсвэл байршил ашиглан
                  дахин хайж үзээрэй.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>💡 Зөвлөмжүүд:</p>
                  <ul className="text-left inline-block space-y-1">
                    <li>• Үсгийн алдаа шалгаарай</li>
                    <li>• Илүү ерөнхий нэр түлхүүр үг хэрэглээрэй</li>
                    <li>• Байршлын мэдээллийг өөрчилж үзээрэй</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {results.length} байгууллага олдлоо
                  </h3>
                  <p className="text-sm text-gray-500">
                    Таны хайлтад тохирсон байгууллагуудын жагсаалт
                  </p>
                </div>
              </div>

              {/* Results Grid */}
              <div className="space-y-4">
                {results.map((business: Business) => (
                  <BusinessResultCard key={business.id} business={business} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Enhanced Map Section */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-4 space-y-4">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">Газрын зураг</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{businessLocations.length} байршил</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Suspense
                  fallback={
                    <div className="h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary/20 border-t-primary mx-auto mb-3"></div>
                        <h4 className="font-medium text-gray-900 mb-1 text-sm">
                          Зураг ачаалж байна
                        </h4>
                        <p className="text-xs text-gray-600">{businessLocations.length} байршил</p>
                      </div>
                    </div>
                  }
                >
                  <div className="h-64 sm:h-72 lg:h-80">
                    <SimpleMap locations={businessLocations} />
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            {/* Map Legend */}
            {businessLocations.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-4 bg-red-500 rounded-sm"></div>
                    Тэмдэглэгээ
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                      <span className="text-gray-600">Байгууллагын байршил</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                      <span className="text-gray-600">Таны байршил</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// SSR: This page will be server-rendered on each request
export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Search Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Хайх хэрэгтэй зүйлээ олоорой</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Улаанбаатар хотын мянга мянган байгууллага, үйлчилгээний мэдээлэл нэг дор
            </p>
          </div>
          <div className="flex justify-center">
            <SearchForm />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
