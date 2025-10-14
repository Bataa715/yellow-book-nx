'use client';

import Link from 'next/link';
import { mockCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

async function getPrimaryCategories() {
  // During build time, just return mock data
  if (process.env.NODE_ENV === 'production' && !process.env.API_URL) {
    return mockCategories.slice(0, 7);
  }
  
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/categories/primary`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch primary categories');
    }
    
    const data = await response.json();
    
    // Ensure data is an array
    const categories = Array.isArray(data) ? data : [];
    
    // If no primary categories in DB, return first 7 mock categories
    if (!categories || categories.length === 0) {
      return mockCategories.slice(0, 7);
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching primary categories:', error);
    // Fallback to mock categories if API fails
    return mockCategories.slice(0, 7);
  }
}

function getIconComponent(iconName: string) {
  const mockCategory = mockCategories.find(cat => 
    cat.name.toLowerCase() === iconName.toLowerCase()
  );
  
  if (mockCategory) {
    return mockCategory.icon;
  }
  
  // Default fallback icon
  return mockCategories.find(cat => cat.name === 'Бусад')?.icon || mockCategories[0].icon;
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>(mockCategories.slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getPrimaryCategories();
        setCategories(result);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories(mockCategories.slice(0, 7));
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category: any) => {
        const IconComponent = getIconComponent(category.name);
        return (
          <Link
            key={category.id}
            href={`/search?category=${encodeURIComponent(category.name)}`}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                </div>
                <h3 className="font-medium text-sm text-center leading-tight">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          </Link>
        );
      })}
      
      {/* "Бусад" - Show All Categories Button */}
      <Link href="/categories" className="group">
        <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <Plus className="h-8 w-8 text-primary transition-all group-hover:scale-110" />
            </div>
            <h3 className="font-medium text-sm text-center leading-tight text-primary group-hover:text-primary/80 transition-colors">
              Бусад
            </h3>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}