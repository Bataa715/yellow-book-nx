import Link from 'next/link';
import { mockCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {mockCategories.map((category) => (
        <Link href={`/search?category=${category.name}`} key={category.id} className="block group">
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
  );
}
