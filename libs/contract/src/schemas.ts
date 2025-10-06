import { z } from 'zod';

/**
 * Location schema for geographical coordinates
 */
export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Address schema for business location
 */
export const AddressSchema = z.object({
  city: z.string().min(1),
  district: z.string().min(1),
  khoroo: z.string().min(1),
  full: z.string().min(1),
});

/**
 * Contact information schema
 */
export const ContactSchema = z.object({
  phone: z.array(z.string()),
  email: z.string().email().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

/**
 * Hours of operation schema
 */
export const HoursSchema = z.record(z.string(), z.string());

/**
 * Main YellowBook Entry Schema
 * Represents a business listing in the yellow book directory
 */
export const YellowBookEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000),
  categories: z.array(z.string()),
  address: AddressSchema,
  location: LocationSchema,
  contact: ContactSchema,
  hours: HoursSchema.optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  logo: z.string().url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Schema for creating a new YellowBook entry (without id and timestamps)
 */
export const CreateYellowBookEntrySchema = YellowBookEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating a YellowBook entry (all fields optional except id)
 */
export const UpdateYellowBookEntrySchema = YellowBookEntrySchema.partial().required({ id: true });

/**
 * Review schema
 */
export const ReviewSchema = z.object({
  id: z.string().optional(),
  businessId: z.string(),
  author: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500),
  date: z.string().or(z.date()),
  createdAt: z.date().optional(),
});

/**
 * Category schema
 */
export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(50),
});

/**
 * TypeScript types inferred from schemas
 */
export type YellowBookEntry = z.infer<typeof YellowBookEntrySchema>;
export type CreateYellowBookEntry = z.infer<typeof CreateYellowBookEntrySchema>;
export type UpdateYellowBookEntry = z.infer<typeof UpdateYellowBookEntrySchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Hours = z.infer<typeof HoursSchema>;
