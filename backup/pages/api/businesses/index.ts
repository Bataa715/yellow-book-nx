import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBusinesses } from '@/lib/data';
import { Business } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<Business[]>) {
  const { q, loc, category } = req.query;

  let filteredBusinesses = [...mockBusinesses];

  if (q && typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm) ||
        business.categories.some((c) => c.toLowerCase().includes(searchTerm))
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

  res.status(200).json(filteredBusinesses);
}
