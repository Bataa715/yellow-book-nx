import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import prisma from '../lib/prisma';
import {
  SearchParamsSchema,
  CreateYellowBookEntrySchema,
  UpdateYellowBookEntrySchema,
} from '@yellow-book/contract';

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
    // Validate query parameters with Zod
    const validatedParams = SearchParamsSchema.safeParse(req.query);

    if (!validatedParams.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: validatedParams.error.errors,
      });
    }

    const { limit, offset, category, search, loc } = validatedParams.data;

    const limitNum = limit;
    const offsetNum = offset;

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

    // Add location search functionality
    if (loc) {
      const locationConditions = [
        { addressCity: { contains: loc as string } },
        { addressDistrict: { contains: loc as string } },
        { addressKhoroo: { contains: loc as string } },
        { addressFull: { contains: loc as string } },
      ];

      if (where.OR) {
        // If there's already an OR clause (from search), combine them
        where.AND = [{ OR: where.OR }, { OR: locationConditions }];
        delete where.OR;
      } else {
        // If no search query, just add location conditions
        where.OR = locationConditions;
      }
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
    // Validate request body with Zod
    const validatedData = CreateYellowBookEntrySchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validatedData.error.errors,
      });
    }

    const businessData = validatedData.data;

    // Generate a new unique ID
    const newId = randomUUID();

    // Create the new business entry
    const newBusiness = await prisma.yellowBookEntry.create({
      data: {
        id: newId,
        name: businessData.name,
        description: businessData.description,
        categories: JSON.stringify(businessData.categories),
        addressCity: businessData.address.city,
        addressDistrict: businessData.address.district,
        addressKhoroo: businessData.address.khoroo,
        addressFull: businessData.address.full,
        locationLat: businessData.location.lat,
        locationLng: businessData.location.lng,
        contactPhone: JSON.stringify(businessData.contact.phone),
        contactEmail: businessData.contact.email || '',
        contactWebsite: businessData.contact.website || '',
        hours: businessData.hours ? JSON.stringify(businessData.hours) : JSON.stringify({}),
        rating: businessData.rating || 0,
        reviewCount: businessData.reviewCount || 0,
        images: businessData.images ? JSON.stringify(businessData.images) : JSON.stringify([]),
        logo: businessData.logo || '',
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

    // Validate request body with Zod
    const validatedData = UpdateYellowBookEntrySchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validatedData.error.errors,
      });
    }

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

    const businessData = validatedData.data;

    // Build update data object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (businessData.name) updateData.name = businessData.name;
    if (businessData.description) updateData.description = businessData.description;
    if (businessData.categories) updateData.categories = JSON.stringify(businessData.categories);
    if (businessData.address) {
      updateData.addressCity = businessData.address.city;
      updateData.addressDistrict = businessData.address.district;
      updateData.addressKhoroo = businessData.address.khoroo;
      updateData.addressFull = businessData.address.full;
    }
    if (businessData.location) {
      updateData.locationLat = businessData.location.lat;
      updateData.locationLng = businessData.location.lng;
    }
    if (businessData.contact) {
      if (businessData.contact.phone)
        updateData.contactPhone = JSON.stringify(businessData.contact.phone);
      if (businessData.contact.email !== undefined)
        updateData.contactEmail = businessData.contact.email;
      if (businessData.contact.website !== undefined)
        updateData.contactWebsite = businessData.contact.website;
    }
    if (businessData.hours) updateData.hours = JSON.stringify(businessData.hours);
    if (businessData.images) updateData.images = JSON.stringify(businessData.images);
    if (businessData.logo !== undefined) updateData.logo = businessData.logo;

    // Update the business entry
    const updatedBusiness = await prisma.yellowBookEntry.update({
      where: { id },
      data: updateData,
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
