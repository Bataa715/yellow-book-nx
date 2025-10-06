import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Transform database entry to API response format
 */
function transformEntry(entry: any) {
  return {
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
      email: entry.contactEmail || undefined,
      website: entry.contactWebsite || undefined,
    },
    hours: entry.hours ? JSON.parse(entry.hours) : undefined,
    rating: entry.rating,
    reviewCount: entry.reviewCount,
    images: entry.images ? JSON.parse(entry.images) : undefined,
    logo: entry.logo || undefined,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

/**
 * GET /api/yellow-books
 * Fetches all yellow book entries
 */
export async function getYellowBooks(req: Request, res: Response) {
  try {
    const { limit = '20', offset = '0', category, search } = req.query;

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    // Build where clause
    const where: any = {};

    if (category) {
      where.categories = {
        contains: category as string,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { description: { contains: search as string } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.yellowBookEntry.findMany({
        where,
        take: limitNum,
        skip: offsetNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.yellowBookEntry.count({ where }),
    ]);

    const transformedEntries = entries.map(transformEntry);

    res.json({
      data: transformedEntries,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Error fetching yellow books:', error);
    res.status(500).json({
      error: 'Failed to fetch yellow books',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/yellow-books/:id
 * Fetches a single yellow book entry by ID
 */
export async function getYellowBookById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const entry = await prisma.yellowBookEntry.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!entry) {
      return res.status(404).json({ error: 'Yellow book entry not found' });
    }

    res.json({
      data: {
        ...transformEntry(entry),
        reviews: entry.reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching yellow book:', error);
    res.status(500).json({
      error: 'Failed to fetch yellow book',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/categories
 * Fetches all categories
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    res.json({ data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * POST /api/yellow-books
 * Creates a new yellow book entry
 */
export async function createYellowBook(req: Request, res: Response) {
  try {
    const { businessName, description, categories, phone, email, website, address } = req.body;

    // Validate required fields
    if (!businessName || !description || !categories || !phone || !address) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'businessName, description, categories, phone, and address are required',
      });
    }

    // Generate a new ID (simple increment based on existing entries)
    const lastEntry = await prisma.yellowBookEntry.findFirst({
      orderBy: { id: 'desc' },
    });
    const newId = lastEntry ? (parseInt(lastEntry.id) + 1).toString() : '1';

    // Create the new business entry
    const newBusiness = await prisma.yellowBookEntry.create({
      data: {
        id: newId,
        name: businessName,
        description,
        categories: JSON.stringify(categories),
        addressCity: 'Улаанбаатар', // Default city
        addressDistrict: '', // Will be extracted from address later
        addressKhoroo: '', // Will be extracted from address later
        addressFull: address,
        locationLat: 47.9184, // Default coordinates for UB
        locationLng: 106.9177,
        contactPhone: JSON.stringify([phone]),
        contactEmail: email || '',
        contactWebsite: website || '',
        hours: JSON.stringify({}),
        rating: 0,
        reviewCount: 0,
        images: JSON.stringify([]),
        logo: '',
      },
    });

    const transformedBusiness = transformEntry(newBusiness);
    res.status(201).json({
      data: transformedBusiness,
      message: 'Business created successfully',
    });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({
      error: 'Failed to create business',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * PUT /api/yellow-books/:id
 * Updates a yellow book entry by ID
 */
export async function updateYellowBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { businessName, description, categories, phone, email, website, address, images } =
      req.body;

    // Check if the business exists
    const existingBusiness = await prisma.yellowBookEntry.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return res.status(404).json({
        error: 'Business not found',
        message: `Business with ID ${id} does not exist`,
      });
    }

    // Validate required fields
    if (!businessName || !description || !categories || !phone || !address) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'businessName, description, categories, phone, and address are required',
      });
    }

    // Parse phone numbers if it's a string
    const phoneArray = typeof phone === 'string' ? phone.split(',').map((p) => p.trim()) : phone;

    // Update the business entry
    const updatedBusiness = await prisma.yellowBookEntry.update({
      where: { id },
      data: {
        name: businessName,
        description,
        categories: JSON.stringify(categories),
        addressFull: address,
        contactPhone: JSON.stringify(phoneArray),
        contactEmail: email || '',
        contactWebsite: website || '',
        images: JSON.stringify(images || []),
        updatedAt: new Date(),
      },
    });

    const transformedBusiness = transformEntry(updatedBusiness);
    res.json({
      data: transformedBusiness,
      message: 'Business updated successfully',
    });
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({
      error: 'Failed to update business',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * DELETE /api/yellow-books/:id
 * Deletes a yellow book entry by ID
 */
export async function deleteYellowBook(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if the business exists
    const existingBusiness = await prisma.yellowBookEntry.findUnique({
      where: { id },
    });

    if (!existingBusiness) {
      return res.status(404).json({
        error: 'Business not found',
        message: `Business with ID ${id} does not exist`,
      });
    }

    // Delete related reviews first (due to foreign key constraints)
    await prisma.review.deleteMany({
      where: { businessId: id },
    });

    // Delete the business
    await prisma.yellowBookEntry.delete({
      where: { id },
    });

    res.json({
      message: 'Business deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({
      error: 'Failed to delete business',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
