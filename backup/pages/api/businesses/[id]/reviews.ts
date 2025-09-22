import type { NextApiRequest, NextApiResponse } from 'next';
import { mockReviews } from '@/lib/data';
import { Review } from '@/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Review[] | { message: string }>
) {
  const { id } = req.query;

  const reviews = mockReviews.filter((r) => r.businessId === id);

  res.status(200).json(reviews);
}
