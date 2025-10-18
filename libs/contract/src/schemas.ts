import { z } from 'zod';

// Location Schema - Газарзүйн координат
export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Address Schema - Хаяг мэдээлэл
export const AddressSchema = z.object({
  city: z.string().min(1, 'Хот оруулна уу'),
  district: z.string().min(1, 'Дүүрэг оруулна уу'),
  khoroo: z.string().min(1, 'Хороо оруулна уу'),
  full: z.string().min(1, 'Бүтэн хаяг оруулна уу'),
});

// Contact Schema - Холбоо барих мэдээлэл
export const ContactSchema = z.object({
  phone: z.array(z.string().min(1, 'Утасны дугаар оруулна уу')),
  email: z.string().email('Зөв имэйл хаяг оруулна уу').optional(),
  website: z.string().url('Зөв вэб хаяг оруулна уу').optional(),
});

// Review Schema - Сэтгэгдэл
export const ReviewSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  author: z.string().min(1, 'Зохиогчийн нэр оруулна уу'),
  avatar: z.string().url().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Сэтгэгдэл оруулна уу'),
  date: z.string(),
  createdAt: z.date().optional(),
});

// Category Schema - Ангилал
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Ангиллын нэр оруулна уу'),
  icon: z.string().min(1, 'Дүрс тэмдэг оруулна уу'),
  isPrimary: z.boolean().default(false),
  order: z.number().optional(),
});

// Main Yellow Book Entry Schema - Бизнесийн мэдээлэл
export const YellowBookEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Бизнесийн нэр оруулна уу'),
  description: z.string().min(1, 'Тайлбар оруулна уу'),
  categories: z.array(z.string()).min(1, 'Наад зах нь нэг ангилал сонгоно уу'),
  address: AddressSchema,
  location: LocationSchema,
  contact: ContactSchema,
  hours: z.record(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  logo: z.string().url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  reviews: z.array(ReviewSchema).optional(),
});

// Create Input Schema - Шинэ бизнес үүсгэх
export const CreateYellowBookEntrySchema = YellowBookEntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  reviews: true,
});

// Update Input Schema - Бизнес засах
export const UpdateYellowBookEntrySchema = CreateYellowBookEntrySchema.partial();

// Search Params Schema - Хайлтын параметрүүд
export const SearchParamsSchema = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('20'),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('0'),
  category: z.string().optional(),
  search: z.string().optional(),
  loc: z.string().optional(), // "lat,lng,radius" format
});

// Pagination Response Schema - Хуудаслалтын хариу
export const PaginationSchema = z.object({
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

// API Response Schema - API хариу
export const YellowBookListResponseSchema = z.object({
  data: z.array(YellowBookEntrySchema),
  pagination: PaginationSchema,
});

// Export Types
export type Location = z.infer<typeof LocationSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type YellowBookEntry = z.infer<typeof YellowBookEntrySchema>;
export type CreateYellowBookEntry = z.infer<typeof CreateYellowBookEntrySchema>;
export type UpdateYellowBookEntry = z.infer<typeof UpdateYellowBookEntrySchema>;
export type SearchParams = z.infer<typeof SearchParamsSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type YellowBookListResponse = z.infer<typeof YellowBookListResponseSchema>;
