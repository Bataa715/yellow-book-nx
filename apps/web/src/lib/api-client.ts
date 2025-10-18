import { 
  YellowBookEntry, 
  YellowBookListResponse, 
  Category, 
  Review,
  Pagination 
} from '@yellow-book/contract';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Re-export types from contract
export type { YellowBookEntry, Category, Review } from '@yellow-book/contract';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
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
