import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { YellowBookEntry } from '@/lib/api-client';
import { LoadMoreButton } from './load-more-button';
import { BusinessCard } from './business-card';

// ISR: Revalidate every 60 seconds  
export const revalidate = 60;

async function fetchYellowBooksServer(limit = 20, offset = 0) {
  try {
    const response = await fetch(`http://localhost:3001/api/yellow-books?limit=${limit}&offset=${offset}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch businesses');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return { data: [], pagination: { total: 0, limit, offset, hasMore: false } };
  }
}

// Streaming component with separate revalidation
async function StreamedStats() {
  try {
    const categoriesResponse = await fetch('http://localhost:3001/api/categories', {
      next: { revalidate: 60 }
    });
    
    const categories = categoriesResponse.ok ? await categoriesResponse.json() : [];
    const businessResponse = await fetch('http://localhost:3001/api/yellow-books?limit=1', {
      next: { revalidate: 60 }
    });
    const businessData = businessResponse.ok ? await businessResponse.json() : { pagination: { total: 0 } };
    
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{businessData.pagination?.total || 0}</div>
            <div className="text-muted-foreground">Нийт бизнес</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories.length || 0}</div>
            <div className="text-muted-foreground">Ангилал</div>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    return (
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">-</div>
            <div className="text-muted-foreground">Нийт бизнес</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">-</div>
            <div className="text-muted-foreground">Ангилал</div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    </div>
  );
}



export default async function YellowBooksPage() {
  // Static data fetched at build time and revalidated every 60s
  const initialData = await fetchYellowBooksServer(20, 0);

  
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Yellow Books</h1>
        <p className="text-muted-foreground">Browse all business listings in our directory</p>
      </div>

      {/* Streamed stats component */}
      <Suspense fallback={<StatsSkeleton />}>
        <StreamedStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initialData.data.map((entry: YellowBookEntry) => (
          <BusinessCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Client-side load more functionality */}
      {initialData.pagination.hasMore && (
        <div className="mt-8 text-center">
          <LoadMoreButton initialPagination={initialData.pagination} />
        </div>
      )}
    </div>
  );
}
