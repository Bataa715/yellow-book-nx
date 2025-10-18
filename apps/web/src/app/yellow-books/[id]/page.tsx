import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:3001/api/yellow-books?limit=100');
    
    if (!response.ok) {
      console.error('Failed to fetch businesses for static generation');
      return [];
    }
    
    const data = await response.json();
    
    return data.data.map((business: any) => ({
      id: business.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe, Clock, MessageSquare } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ReviewForm } from '@/components/review-form';
import { ReviewList } from '@/components/review-list';
import { Skeleton } from '@/components/ui/skeleton';

async function fetchBusiness(id: string) {
  try {
    const response = await fetch(`http://localhost:3001/api/yellow-books/${id}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

async function fetchReviews(businessId: string) {
  try {
    const response = await fetch(`http://localhost:3001/api/yellow-books/${businessId}/reviews`, {
      next: { revalidate: 300 } // Revalidate reviews every 5 minutes
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

function BusinessSkeleton() {
  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Skeleton className="h-96 w-full mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function BusinessImages({ business }: { business: any }) {
  const images = business.images || [business.logo].filter(Boolean);
  
  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-square relative">
        <Image
          src={images[0]}
          alt={business.name}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(1, 5).map((image: string, index: number) => (
            <div key={index} className="aspect-square relative">
              <Image
                src={image}
                alt={`${business.name} ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function BusinessReviews({ businessId, businessName }: { businessId: string; businessName: string }) {
  const reviews = await fetchReviews(businessId);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Reviews ({reviews.length})
        </h3>
      </div>
      
      <ReviewForm businessId={businessId} businessName={businessName} />
      <ReviewList businessId={businessId} />
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const business = await fetchBusiness(resolvedParams.id);

  if (!business) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images Section */}
        <div>
          <Suspense fallback={<Skeleton className="aspect-square w-full" />}>
            <BusinessImages business={business} />
          </Suspense>
        </div>

        {/* Business Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              {business.rating && (
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-muted-foreground">
                    ({business.reviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {business.categories.map((category: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground">{business.description}</p>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">{business.address.full}</p>
                </div>
              </div>

              {business.contact.phone.length > 0 && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <div className="space-y-1">
                      {business.contact.phone.map((phone: string, index: number) => (
                        <p key={index} className="text-muted-foreground">{phone}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {business.contact.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Website</p>
                    <a
                      href={business.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}

              {business.hours && Object.keys(business.hours).length > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <div className="space-y-1 text-muted-foreground">
                      {Object.entries(business.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between gap-4">
                          <span className="capitalize">{day}:</span>
                          <span>{hours as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Suspense fallback={<ReviewsSkeleton />}>
          <BusinessReviews businessId={resolvedParams.id} businessName={business.name} />
        </Suspense>
      </div>
    </div>
  );
}