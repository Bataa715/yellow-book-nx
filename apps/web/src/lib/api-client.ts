const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface YellowBookEntry {
  id: string;
  name: string;
  description: string;
  categories: string[];
  address: {
    city: string;
    district: string;
    khoroo: string;
    full: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string[];
    email?: string;
    website?: string;
  };
  hours?: Record<string, string>;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  logo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  businessId: string;
  author: string;
  avatar?: string;
  rating: number;
  comment: string;
  date: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Fetch all yellow book entries
 */
export async function fetchYellowBooks(params?: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}): Promise<PaginatedResponse<YellowBookEntry>> {
  const queryParams = new URLSearchParams();

  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  if (params?.category) queryParams.set('category', params.category);
  if (params?.search) queryParams.set('search', params.search);

  const url = `${API_BASE_URL}/api/yellow-books${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch yellow books: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single yellow book entry by ID
 */
export async function fetchYellowBookById(
  id: string
): Promise<{ data: YellowBookEntry & { reviews?: Review[] } }> {
  const response = await fetch(`${API_BASE_URL}/api/yellow-books/${id}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch yellow book: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<{ data: Category[] }> {
  const response = await fetch(`${API_BASE_URL}/api/categories`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}
