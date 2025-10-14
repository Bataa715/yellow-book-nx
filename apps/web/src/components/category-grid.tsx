'use client';

import Link from 'next/link';
import { mockIcons } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Category } from '@/types';

import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Type for API response category with string icon
type ApiCategory = {
  id: string;
  name: string;
  icon: string;
};

// Helper function to get icon component from string name
const getIconComponent = (iconName: string) => {
  // Convert kebab-case to PascalCase (e.g., 'heart-pulse' -> 'HeartPulse')
  const pascalCaseName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  
  const iconData = mockIcons.find((icon) => 
    icon.name === pascalCaseName ||
    icon.name.toLowerCase() === iconName.toLowerCase() ||
    icon.name === iconName
  );
  
  return iconData?.component || mockIcons.find(icon => icon.name === 'MoreHorizontal')?.component;
};

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();
      
      // Transform API categories with string icons to Category type with React components
      const transformedCategories: Category[] = (data.data || []).map((apiCategory: ApiCategory) => ({
        id: apiCategory.id,
        name: apiCategory.name,
        icon: getIconComponent(apiCategory.icon) || mockIcons[0].component,
      }));
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      // Fallback to empty array on error
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Define priority categories that should be shown first
  const priorityCategories = [
    'Ресторан',
    'Кафе', 
    'Дэлгүүр',
    'Үйлчилгээ',
    'Авто засвар',
    'Эрүүл мэнд',
    'Гоо сайхан'
  ];

  // Sort categories: priority ones first, then alphabetically
  const sortedCategories = categories
    .filter((c) => c.name !== 'Бусад')
    .sort((a, b) => {
      const aIndex = priorityCategories.indexOf(a.name);
      const bIndex = priorityCategories.indexOf(b.name);
      
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex; // Both are priority, sort by priority order
      } else if (aIndex !== -1) {
        return -1; // a is priority, b is not
      } else if (bIndex !== -1) {
        return 1; // b is priority, a is not
      } else {
        return a.name.localeCompare(b.name); // Both are not priority, sort alphabetically
      }
    });

  // Show first 7 categories as main, rest go to "Бусад" dropdown
  const maxMainCategories = 7;
  const mainCategories = sortedCategories.slice(0, maxMainCategories);
  const otherCategories = sortedCategories.slice(maxMainCategories);
  
  // Only show "Бусад" if there are categories to show in dropdown
  const showOthersSection = otherCategories.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {mainCategories.map((category) => (
          <Link
            href={`/search?category=${category.name}`}
            key={category.id}
            className="block group"
          >
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">
                  {category.name}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}

        {showOthersSection && (
          <CollapsibleTrigger asChild>
            <div className="block group h-full">
              <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                  <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                    <ChevronsUpDown className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">
                      Бусад ({otherCategories.length})
                    </span>
                    <ChevronsUpDown
                      className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-primary transition-transform"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CollapsibleTrigger>
        )}
      </div>
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 pt-4">
          {otherCategories.map((category) => (
            <Link
              href={`/search?category=${category.name}`}
              key={category.id}
              className="block group"
            >
              <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                  <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                    <category.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
