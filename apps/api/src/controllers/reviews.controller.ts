import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * POST /api/reviews
 * Create a new review for a business
 */
export async function createReview(req: Request, res: Response) {
  try {
    const { businessId, author, rating, comment, avatar } = req.body;

    // Validation
    if (!businessId || !author || !rating || !comment) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['businessId', 'author', 'rating', 'comment'],
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    // Check if business exists
    const business = await prisma.yellowBookEntry.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({
        error: 'Business not found',
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        businessId,
        author,
        avatar: avatar || `https://picsum.photos/seed/${author}/100/100`,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      },
    });

    // Update business rating and review count
    const allReviews = await prisma.review.findMany({
      where: { businessId },
    });

    const avgRating =
      allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / allReviews.length;

    await prisma.yellowBookEntry.update({
      where: { id: businessId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: allReviews.length,
      },
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Сэтгэгдэл амжилттай нэмэгдлээ!',
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      error: 'Failed to create review',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/reviews/:businessId
 * Get all reviews for a business
 */
export async function getReviewsByBusinessId(req: Request, res: Response) {
  try {
    const { businessId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
