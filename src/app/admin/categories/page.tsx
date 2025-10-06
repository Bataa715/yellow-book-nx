'use client';

import { useState } from 'react';
import { mockCategories as initialCategories } from '@/lib/data';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleDelete = (id: string) => {
    // In a real app, you would show a confirmation dialog and then call an API to delete.
    console.log(`Delete category with id: ${id}`);
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Админ самбар луу буцах
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Категори удирдлага</CardTitle>
                <CardDescription>Бүртгэлтэй категориудыг засах, устгах, шинээр нэмэх.</CardDescription>
            </div>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Шинэ категори нэмэх
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Нэр</TableHead>
                    <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                    <TableCell><category.icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Засах</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Устгах</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
