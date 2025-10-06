'use client';

import { useEffect, useState } from 'react';
import { fetchYellowBooks, YellowBookEntry } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function YellowBooksPage() {
  const [entries, setEntries] = useState<YellowBookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const loadEntries = async (offset = 0) => {
    try {
      setLoading(true);
      const response = await fetchYellowBooks({ limit: 20, offset });
      setEntries(offset === 0 ? response.data : [...entries, ...response.data]);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleLoadMore = () => {
    loadEntries(pagination.offset + pagination.limit);
  };

  if (error && entries.length === 0) {
    return (
      <div className="container py-12">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => loadEntries()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Yellow Books</h1>
        <p className="text-muted-foreground">Browse all business listings in our directory</p>
      </div>

      {loading && entries.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {entry.logo && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={entry.logo}
                      alt={entry.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1">{entry.name}</CardTitle>
                    {entry.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{entry.rating}</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">{entry.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {entry.categories.slice(0, 3).map((category, idx) => (
                      <Badge key={idx} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{entry.address.full}</span>
                    </div>

                    {entry.contact.phone.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{entry.contact.phone[0]}</span>
                      </div>
                    )}

                    {entry.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{entry.contact.email}</span>
                      </div>
                    )}

                    {entry.contact.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <a
                          href={entry.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <Link href={`/business/${entry.id}`}>
                      <Button className="w-full" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} disabled={loading} size="lg">
                {loading ? 'Loading...' : 'Load More'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Showing {entries.length} of {pagination.total} entries
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
