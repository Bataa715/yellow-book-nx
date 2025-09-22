import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBusinesses } from '@/lib/data';
import { Business } from '@/types';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Business | { message: string }>
) {
  const { id } = req.query;

  const business = mockBusinesses.find((b) => b.id === id);

  if (business) {
    res.status(200).json(business);
  } else {
    res.status(404).json({ message: 'Business not found' });
  }
}
