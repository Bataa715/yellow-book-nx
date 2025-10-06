import { NextRequest, NextResponse } from 'next/server';
import { mockReviews } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const reviews = mockReviews.filter((r) => r.businessId === id);

  return NextResponse.json(reviews);
}
