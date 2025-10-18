import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { YellowBookEntry } from '@/lib/api-client';

export function BusinessCard({ entry }: { entry: YellowBookEntry }) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      {entry.logo && (
        <div className="relative h-48 w-full">
          <Image src={entry.logo} alt={entry.name} fill className="object-cover rounded-t-lg" />
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
  );
}
