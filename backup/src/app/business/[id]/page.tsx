'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Business, Review } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe, Clock, Loader2, User, MessageSquare } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { mockCategories } from '@/lib/data';

function BusinessDetails() {
  const params = useParams();
  const id = params.id as string;
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchBusinessData = async () => {
        setLoading(true);
        try {
          const [businessRes, reviewsRes] = await Promise.all([
            fetch(`/api/businesses/${id}`),
            fetch(`/api/businesses/${id}/reviews`),
          ]);
          const businessData = await businessRes.json();
          const reviewsData = await reviewsRes.json();

          setBusiness(businessData);
          setReviews(reviewsData);
        } catch (error) {
          console.error('Failed to fetch business data', error);
        } finally {
          setLoading(false);
        }
      };
      fetchBusinessData();
    }
  }, [id]);

  const getCategoryIcon = (categoryName: string) => {
    const categoryData = mockCategories.find((c) => c.name === categoryName);
    return categoryData ? <categoryData.icon className="mr-2 h-4 w-4" /> : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-bold">Бизнес олдсонгүй</h3>
        <p className="text-muted-foreground mt-2">Таны хайсан бизнес бүртгэлгүй байна.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-6">
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="p-0">
          <div className="relative h-64 md:h-96">
            <Image
              src={business.images[0]}
              alt={business.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <CardTitle className="text-4xl md:text-5xl font-headline text-white drop-shadow-lg">
                {business.name}
              </CardTitle>
              <div className="flex items-center pt-2 text-yellow-400">
                {[...Array(Math.floor(business.rating))].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
                {business.rating % 1 !== 0 && (
                  <Star className="w-6 h-6 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                )}
                {[...Array(5 - Math.ceil(business.rating))].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-gray-300 fill-current" />
                ))}
                <span className="ml-2 text-lg font-medium text-white">
                  ({business.reviewCount} сэтгэгдэл)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 border-b pb-2">Бидний тухай</h3>
              <p className="text-muted-foreground leading-relaxed">{business.description}</p>
            </div>

            {business.images.length > 1 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 border-b pb-2">Зургийн цомог</h3>
                <Carousel className="w-full">
                  <CarouselContent>
                    {business.images.map((img, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                          <Card>
                            <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                              <Image
                                src={img}
                                alt={`${business.name} image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-12" />
                  <CarouselNext className="mr-12" />
                </Carousel>
              </div>
            )}

            <div>
              <h3 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center">
                <MessageSquare className="mr-3" />
                Сэтгэгдлүүд
              </h3>
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <Card key={review.id} className="bg-card/50">
                      <CardContent className="p-4 flex gap-4">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold">{review.author}</p>
                            <div className="flex items-center text-yellow-500">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                              {[...Array(5 - review.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-gray-300" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground italic mb-2">
                            "{review.comment}"
                          </p>
                          <p className="text-xs text-muted-foreground text-right">{review.date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">Сэтгэгдэл одоогоор байхгүй байна.</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Мэдээлэл</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <MapPin className="mt-1 mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{business.address.full}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-primary" />
                  <span>{business.contact.phone.join(', ')}</span>
                </div>
                {business.contact.website && (
                  <div className="flex items-center">
                    <Globe className="mr-3 h-5 w-5 text-primary" />
                    <a
                      href={business.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {business.contact.website}
                    </a>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {business.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {getCategoryIcon(cat)}
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-3" />
                  Цагийн хуваарь
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {Object.entries(business.hours).map(([day, time]) => (
                    <li key={day} className="flex justify-between">
                      <span className="font-semibold">{day}:</span>
                      <span className="text-muted-foreground">{time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-3" />
                  Байршил
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://maps.google.com/maps?q=${business.location.lat},${business.location.lng}&hl=mn&z=15&output=embed`}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <BusinessDetails />
    </Suspense>
  );
}
