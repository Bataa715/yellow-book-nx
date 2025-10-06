import { NextRequest, NextResponse } from 'next/server';
import { mockBusinesses } from '@/lib/data';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const loc = searchParams.get('loc');
  const category = searchParams.get('category');

  let filteredBusinesses = [...mockBusinesses];

  if (q && typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm) ||
        business.categories.some(c => c.toLowerCase().includes(searchTerm))
    );
  }

  if (loc && typeof loc === 'string') {
    const locTerm = loc.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.address.city.toLowerCase().includes(locTerm) ||
        business.address.district.toLowerCase().includes(locTerm) ||
        business.address.khoroo.toLowerCase().includes(locTerm) ||
        business.address.full.toLowerCase().includes(locTerm)
    );
  }

  if (category && typeof category === 'string') {
    filteredBusinesses = filteredBusinesses.filter((business) =>
      business.categories.includes(category as string)
    );
  }

  return NextResponse.json(filteredBusinesses);
}
