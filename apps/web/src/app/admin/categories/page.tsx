'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Loader2, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { mockIcons } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  const iconData = mockIcons.find(
    (icon) =>
      icon.name === pascalCaseName ||
      icon.name.toLowerCase() === iconName.toLowerCase() ||
      icon.name === iconName
  );

  return iconData?.component || mockIcons.find((icon) => icon.name === 'MoreHorizontal')?.component;
};

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();

      // Transform API categories with string icons to Category type with React components
      const transformedCategories: Category[] = (data.data || []).map(
        (apiCategory: ApiCategory) => ({
          id: apiCategory.id,
          name: apiCategory.name,
          icon: getIconComponent(apiCategory.icon) || mockIcons[0].component,
        })
      );

      setCategories(transformedCategories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Ангиллуудыг татахад алдаа гарлаа.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    setDeletingId(categoryId);
    try {
      const res = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete category');
      }

      toast({
        title: 'Амжилттай',
        description: `"${categoryName}" категори устгагдлаа.`,
      });

      // Refresh the categories list
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Категори устгахад алдаа гарлаа.',
      });
    } finally {
      setDeletingId(null);
    }
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Ангилал удирдлага</CardTitle>
            <CardDescription>Ангиллуудыг засах, устгах, шинээр нэмэх.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/categories/new">Шинэ категори нэмэх</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Айкон</TableHead>
                  <TableHead className="text-right">Үйлдлүүд</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        <category.icon className="w-4 h-4" />
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={deletingId === category.id}
                            >
                              {deletingId === category.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Категори устгах</AlertDialogTitle>
                              <AlertDialogDescription>
                                Та "{category.name}" категорийг устгахдаа итгэлтэй байна уу? Энэ
                                үйлдлийг буцаах боломжгүй.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id, category.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Устгах
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
