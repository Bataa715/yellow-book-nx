'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchYellowBooks, YellowBookEntry } from '@/lib/api-client';
import { BusinessCard } from './business-card';

interface LoadMoreButtonProps {
  initialPagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function LoadMoreButton({ initialPagination }: LoadMoreButtonProps) {
  const [entries, setEntries] = useState<YellowBookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  const handleLoadMore = async () => {
    try {
      setLoading(true);
      const response = await fetchYellowBooks({
        limit: pagination.limit,
        offset: pagination.offset + pagination.limit,
      });

      setEntries([...entries, ...response.data]);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading more entries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {entries.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {entries.map((entry) => (
            <BusinessCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {pagination.hasMore && (
        <div className="text-center">
          <Button onClick={handleLoadMore} disabled={loading} size="lg">
            {loading ? 'Loading...' : 'Load More'}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {20 + entries.length} of {pagination.total} entries
          </p>
        </div>
      )}
    </>
  );
}
