import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MoreHorizontal, Utensils, Coffee, ShoppingCart, Wrench, Car, Palette, Building2, GraduationCap, Hotel, Dumbbell, ShoppingBag, DollarSign, Map, Book } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

async function getAllCategories() {
  try {
    // Use environment variable or fallback to localhost
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/categories`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-cache', // Disable cache for debugging
    });
    
    console.log('Fetching categories from:', `${apiUrl}/api/categories`);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // API returns direct array, not wrapped in data object
    const categories = Array.isArray(data) ? data : [];
    
    // Filter out test categories and invalid ones
    const validCategories = categories.filter((cat: any) => 
      cat.name && 
      cat.name.trim() !== '' && 
      cat.name !== 'Test' &&
      !cat.name.toLowerCase().includes('test')
    );
    
    console.log('Categories fetched:', validCategories.length, 'categories');
    return validCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array if API fails
    return [];
  }
}

function getIconComponent(category: any) {
  // Map API icon strings to Lucide React components
  const iconMap: { [key: string]: any } = {
    'utensils': Utensils,
    'coffee': Coffee,
    'shopping-cart': ShoppingCart,
    'wrench': Wrench,
    'car': Car,
    'palette': Palette,
    'building-2': Building2,
    'graduation-cap': GraduationCap,
    'hotel': Hotel,
    'dumbbell': Dumbbell,
    'shopping-bag': ShoppingBag,
    'dollar-sign': DollarSign,
    'map': Map,
    'book': Book,
    'more-horizontal': MoreHorizontal,
  };
  
  // If category has icon field from API, use it
  if (category.icon && iconMap[category.icon]) {
    return iconMap[category.icon];
  }
  
  // Fallback based on category name
  const nameMap: { [key: string]: any } = {
    'Ресторан': Utensils,
    'Кафе': Coffee,
    'Дэлгүүр': ShoppingCart,
    'Үйлчилгээ': Wrench,
    'Авто засвар': Car,
    'Гоо сайхан': Palette,
    'Банк': Building2,
    'Боловсрол': GraduationCap,
    'Зочид буудал': Hotel,
    'Спорт': Dumbbell,
    'Монгол хоол': Utensils,
    'Кофе шоп': Coffee,
    'Хүнсний бүтээгдэхүүн': ShoppingBag,
    'Засвар': Wrench,
    'Санхүү': DollarSign,
    'Фитнес': Dumbbell,
    'Аялал': Map,
    'Сургалт': Book,
  };
  
  if (category.name && nameMap[category.name]) {
    return nameMap[category.name];
  }
  
  // Default fallback icon
  return MoreHorizontal;
}

function CategoriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="h-32">
          <CardContent className="flex flex-col items-center justify-center p-4 space-y-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function CategoriesList() {
  const categories = await getAllCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {categories.map((category: any) => {
        const IconComponent = getIconComponent(category);
        return (
          <Link
            key={category.id}
            href={`/search?category=${encodeURIComponent(category.name)}`}
            className="group"
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-3">
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
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Буцах
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Бүх ангилал
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Таны хэрэгцээнд тохирсон байгууллагыг олохын тулд ангиллаас сонгоно уу
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container py-8">
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesList />
        </Suspense>
      </div>
    </div>
  );
}