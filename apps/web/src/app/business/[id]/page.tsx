import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Business, Review } from '@/types';
import Image from 'next/image';

// Force dynamic rendering
export const dynamicParams = true;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ReviewSection } from './review-section';

async function getBusiness(id: string): Promise<Business | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/yellow-books/${id}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch business');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

async function fetchReviews(id: string): Promise<Review[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/reviews/${id}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch data in parallel
  const [business, reviews] = await Promise.all([getBusiness(id), fetchReviews(id)]);

  if (!business) {
    notFound();
  }

  const categoryIcons: Record<string, string> = {
    Ресторан: '🍽️',
    Кафе: '☕',
    Дэлгүүр: '🛒',
    Үйлчилгээ: '🔧',
    'Авто засвар': '🚗',
    'Эрүүл мэнд': '❤️',
    'Гоо сайхан': '💄',
    Бусад: '🏢',
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6 mb-6">
              {business.logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={business.logo}
                    width={120}
                    height={120}
                    alt={business.name}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{business.name}</h1>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.categories?.map((category: string) => (
                    <Badge key={category} variant="secondary" className="text-sm">
                      <span className="mr-2">{categoryIcons[category] || '🏢'}</span>
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Rating */}
                {business.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= business.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">{business.rating}</span>
                    <span className="text-gray-600">({business.reviewCount || 0} үнэлгээ)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{business.description}</p>
          </div>

          {/* Images Gallery */}
          {business.images && business.images.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Зургууд</CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  <CarouselContent>
                    {business.images.map((image: string, index: number) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="relative aspect-video">
                          <Image
                            src={image}
                            alt={`${business.name} image ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          )}

          {/* Reviews Section */}
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded"></div>}>
            <ReviewSection businessId={id} businessName={business.name} initialReviews={reviews} />
          </Suspense>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Холбоо барих</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {business.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    {business.contact.phone.map((phone: string, index: number) => (
                      <div key={index} className="text-sm">
                        <a href={`tel:${phone}`} className="hover:text-blue-600">
                          {phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {business.contact?.email && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <a
                    href={`mailto:${business.contact.email}`}
                    className="text-sm hover:text-green-600"
                  >
                    {business.contact.email}
                  </a>
                </div>
              )}

              {business.contact?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <a
                    href={business.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-purple-600"
                  >
                    Вэбсайт
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Хаяг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1" />
                <div className="text-sm">
                  <div>{business.address?.full}</div>
                  <div className="text-gray-600 mt-1">
                    {business.address?.city}, {business.address?.district},{' '}
                    {business.address?.khoroo}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          {business.hours && (
            <Card>
              <CardHeader>
                <CardTitle>Ажиллах цаг</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(business.hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">{time as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
