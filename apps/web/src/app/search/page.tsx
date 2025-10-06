'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Business } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, Globe, ArrowRight, Mail, Loader2 } from 'lucide-react';
import { SearchForm } from '@/components/search-form';
import { mockCategories } from '@/lib/data';

function SearchResults() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get('q');
  const loc = searchParams.get('loc');
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (loc) params.append('loc', loc);
      if (category) params.append('category', category);

      const res = await fetch(`http://localhost:3001/api/yellow-books?${params.toString()}`);
      const data = await res.json();
      setResults(data.data || []);
      setLoading(false);
    };

    fetchResults();
  }, [q, loc, category]);

  const getCategoryIcon = (categoryName: string) => {
    const categoryData = mockCategories.find((c) => c.name === categoryName);
    return categoryData ? <categoryData.icon className="mr-2 h-4 w-4" /> : null;
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <SearchForm />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Хайлтын үр дүн</h2>
        {category && (
          <Badge variant="secondary" className="text-lg py-1 px-4">
            {category}
          </Badge>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-8">
          {results.map((business) => (
            <Card
              key={business.id}
              className="flex flex-col md:flex-row overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:w-1/3 relative h-64 md:h-auto">
                <Image
                  src={
                    business.images?.[0] ||
                    business.logo ||
                    'https://picsum.photos/800/600?grayscale'
                  }
                  alt={business.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline hover:text-primary">
                    <Link href={`/business/${business.id}`}>{business.name}</Link>
                  </CardTitle>
                  <div className="flex items-center pt-2 text-yellow-500">
                    {[...Array(Math.floor(business.rating))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                    {business.rating % 1 !== 0 && (
                      <Star
                        className="w-5 h-5 fill-current"
                        style={{ clipPath: 'inset(0 50% 0 0)' }}
                      />
                    )}
                    {[...Array(5 - Math.ceil(business.rating))].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gray-300" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({business.reviewCount} сэтгэгдэл)
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{business.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {business.categories.map((cat) => (
                      <Badge key={cat} variant="secondary">
                        {getCategoryIcon(cat)}
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm text-foreground">
                    <div className="flex items-start">
                      <MapPin className="mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{business.address.full}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>
                        {Array.isArray(business.contact.phone)
                          ? business.contact.phone.join(', ')
                          : business.contact.phone}
                      </span>
                    </div>
                    {business.contact.email && (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>{business.contact.email}</span>
                      </div>
                    )}
                    {business.contact.website && (
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4" />
                        <a
                          href={business.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Вэб хуудас
                        </a>
                      </div>
                    )}
                  </div>
                  <Button asChild className="mt-4">
                    <Link href={`/business/${business.id}`}>
                      Дэлгэрэнгүй <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold">Илэрц олдсонгүй</h3>
          <p className="text-muted-foreground mt-2">
            Хайлтын шалгуураа өөрчлөөд дахин оролдоно уу.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
