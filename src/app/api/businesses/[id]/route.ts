import { NextRequest, NextResponse } from 'next/server';
import { mockBusinesses } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const business = mockBusinesses.find((b) => b.id === id);

  if (business) {
    return NextResponse.json(business);
  } else {
    return NextResponse.json({ message: 'Business not found' }, { status: 404 });
  }
}
