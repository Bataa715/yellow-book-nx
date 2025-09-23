import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { YellowBookEntrySchema } from '@yellow-book/contract';

const prisma = new PrismaClient();

// CORS headers helper
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders() });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const entry = await prisma.yellowBookEntry.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!entry) {
      return new NextResponse(
        JSON.stringify({ error: 'Yellow book entry not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // Transform database entry to match schema
    const transformed = {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      categories: JSON.parse(entry.categories),
      address: {
        city: entry.addressCity,
        district: entry.addressDistrict,
        khoroo: entry.addressKhoroo,
        full: entry.addressFull,
      },
      location: {
        lat: entry.locationLat,
        lng: entry.locationLng,
      },
      contact: {
        phone: JSON.parse(entry.contactPhone),
        email: entry.contactEmail,
        website: entry.contactWebsite || '',
      },
      hours: JSON.parse(entry.hours),
      rating: entry.rating,
      reviewCount: entry.reviewCount,
      images: JSON.parse(entry.images),
      logo: entry.logo,
    };

    // Validate with schema
    // const validatedEntry = YellowBookEntrySchema.parse(transformed);

    return new NextResponse(JSON.stringify(transformed), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Error fetching yellow book entry:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch yellow book entry' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update business entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate with schema
    // const validatedData = YellowBookEntrySchema.parse(body);
    const validatedData = body;
    
    // Update in database
    const updatedEntry = await prisma.yellowBookEntry.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        categories: JSON.stringify(validatedData.categories),
        addressCity: validatedData.address.city,
        addressDistrict: validatedData.address.district,
        addressKhoroo: validatedData.address.khoroo,
        addressFull: validatedData.address.full,
        locationLat: validatedData.location.lat,
        locationLng: validatedData.location.lng,
        contactPhone: JSON.stringify(validatedData.contact.phone),
        contactEmail: validatedData.contact.email,
        contactWebsite: validatedData.contact.website || '',
        hours: JSON.stringify(validatedData.hours),
        rating: validatedData.rating,
        reviewCount: validatedData.reviewCount,
        images: JSON.stringify(validatedData.images),
        logo: validatedData.logo,
      },
    });

    // Transform for response
    const transformed = {
      id: updatedEntry.id,
      name: updatedEntry.name,
      description: updatedEntry.description,
      categories: JSON.parse(updatedEntry.categories),
      address: {
        city: updatedEntry.addressCity,
        district: updatedEntry.addressDistrict,
        khoroo: updatedEntry.addressKhoroo,
        full: updatedEntry.addressFull,
      },
      location: {
        lat: updatedEntry.locationLat,
        lng: updatedEntry.locationLng,
      },
      contact: {
        phone: JSON.parse(updatedEntry.contactPhone),
        email: updatedEntry.contactEmail,
        website: updatedEntry.contactWebsite || '',
      },
      hours: JSON.parse(updatedEntry.hours),
      rating: updatedEntry.rating,
      reviewCount: updatedEntry.reviewCount,
      images: JSON.parse(updatedEntry.images),
      logo: updatedEntry.logo,
    };

    return new NextResponse(JSON.stringify(transformed), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Error updating yellow book entry:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update yellow book entry' }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Delete business entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.yellowBookEntry.delete({
      where: { id },
    });

    return new NextResponse(JSON.stringify({ message: 'Entry deleted successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Error deleting yellow book entry:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete yellow book entry' }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}