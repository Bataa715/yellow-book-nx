'use client';

import Link from 'next/link';
import { mockCategories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

export function CategoryGrid() {
  const mainCategories = mockCategories.filter(c => c.name !== 'Бусад');
  const otherCategory = mockCategories.find(c => c.name === 'Бусад');
  const otherCategories = mockCategories.filter(c => 
    !['Ресторан', 'Кафе', 'Дэлгүүр', 'Үйлчилгээ', 'Авто засвар', 'Эрүүл мэнд', 'Гоо сайхан', 'Бусад'].includes(c.name)
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {mainCategories.map((category) => (
          <Link href={`/search?category=${category.name}`} key={category.id} className="block group">
            <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
              <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                </div>
                <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}

        {otherCategory && (
            <CollapsibleTrigger asChild>
                 <div className="block group h-full">
                     <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full cursor-pointer">
                        <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                            <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                            <otherCategory.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">{otherCategory.name}</span>
                                <ChevronsUpDown className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-primary transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}/>
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
              <Link href={`/search?category=${category.name}`} key={category.id} className="block group">
                  <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                  <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 gap-3 aspect-square">
                      <div className="p-3 rounded-full bg-accent group-hover:bg-primary/20 transition-colors">
                      <category.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-semibold text-center text-foreground group-hover:text-primary">{category.name}</span>
                  </CardContent>
                  </Card>
              </Link>
              ))}
          </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
