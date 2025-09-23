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

export async function GET(request: NextRequest) {
  console.log('GET /api/yellow-books called');
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const loc = searchParams.get('loc');
    const category = searchParams.get('category');

    console.log('Search params:', { q, loc, category });

    // Build where clause for filtering
    const where: any = {};

    if (q) {
      const searchTerm = q.toLowerCase();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { categories: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (loc) {
      const locTerm = loc.toLowerCase();
      where.OR = [
        ...(where.OR || []),
        { addressCity: { contains: locTerm, mode: 'insensitive' } },
        { addressDistrict: { contains: locTerm, mode: 'insensitive' } },
        { addressKhoroo: { contains: locTerm, mode: 'insensitive' } },
        { addressFull: { contains: locTerm, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = { contains: category };
    }

    const rawEntries = await prisma.yellowBookEntry.findMany({
      where,
      include: {
        reviews: true,
      },
    });

    // Transform database entries to match schema
    const transformedEntries = rawEntries.map((entry: any) => {
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
      // return YellowBookEntrySchema.parse(transformed);
      return transformed;
    });

    return new NextResponse(JSON.stringify(transformedEntries), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Error fetching yellow book entries:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch yellow book entries' }),
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

// Create new business entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with schema
    // const validatedData = YellowBookEntrySchema.parse(body);
    const validatedData = body;
    
    // Transform for database
    const newEntry = await prisma.yellowBookEntry.create({
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
        rating: validatedData.rating || 0,
        reviewCount: validatedData.reviewCount || 0,
        images: JSON.stringify(validatedData.images),
        logo: validatedData.logo,
      },
    });

    // Transform for response
    const transformed = {
      id: newEntry.id,
      name: newEntry.name,
      description: newEntry.description,
      categories: JSON.parse(newEntry.categories),
      address: {
        city: newEntry.addressCity,
        district: newEntry.addressDistrict,
        khoroo: newEntry.addressKhoroo,
        full: newEntry.addressFull,
      },
      location: {
        lat: newEntry.locationLat,
        lng: newEntry.locationLng,
      },
      contact: {
        phone: JSON.parse(newEntry.contactPhone),
        email: newEntry.contactEmail,
        website: newEntry.contactWebsite || '',
      },
      hours: JSON.parse(newEntry.hours),
      rating: newEntry.rating,
      reviewCount: newEntry.reviewCount,
      images: JSON.parse(newEntry.images),
      logo: newEntry.logo,
    };

    return new NextResponse(JSON.stringify(transformed), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(),
      },
    });
  } catch (error) {
    console.error('Error creating yellow book entry:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create yellow book entry' }),
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

// Update business entry
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Business ID is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    const body = await request.json();
    
    // Validate with schema
    // const validatedData = YellowBookEntrySchema.parse(body);
    const validatedData = body;
    
    // Check if business exists
    const existingEntry = await prisma.yellowBookEntry.findUnique({
      where: { id: id },
    });

    if (!existingEntry) {
      return new NextResponse(
        JSON.stringify({ error: 'Business not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }
    
    // Update entry
    const updatedEntry = await prisma.yellowBookEntry.update({
      where: { id: id },
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
        rating: validatedData.rating || 0,
        reviewCount: validatedData.reviewCount || 0,
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
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Business ID is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }

    // Check if business exists
    const existingEntry = await prisma.yellowBookEntry.findUnique({
      where: { id: id },
    });

    if (!existingEntry) {
      return new NextResponse(
        JSON.stringify({ error: 'Business not found' }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(),
          },
        }
      );
    }
    
    // Delete entry
    await prisma.yellowBookEntry.delete({
      where: { id: id },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Business deleted successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(),
        },
      }
    );
  } catch (error) {
    console.error('Error deleting yellow book entry:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete yellow book entry' }),
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