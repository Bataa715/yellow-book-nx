import { z } from 'zod';

// Address schema
export const AddressSchema = z.object({
  city: z.string(),
  district: z.string(),
  khoroo: z.string(),
  full: z.string(),
});

// Location schema
export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

// Contact schema
export const ContactSchema = z.object({
  phone: z.array(z.string()),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal('')),
});

// Yellow Book Entry (Business) schema
export const YellowBookEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  address: AddressSchema,
  location: LocationSchema,
  contact: ContactSchema,
  hours: z.record(z.string(), z.string()),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().min(0),
  images: z.array(z.string()),
  logo: z.string(),
});

// Review schema
export const ReviewSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  author: z.string(),
  avatar: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string(),
});

// Category schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
});

// Type exports
export type Address = z.infer<typeof AddressSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type YellowBookEntry = z.infer<typeof YellowBookEntrySchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Category = z.infer<typeof CategorySchema>;
