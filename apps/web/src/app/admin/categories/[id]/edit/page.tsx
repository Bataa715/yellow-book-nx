'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { mockIcons } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Нэр дор хаяж 2 үсэгтэй байх ёстой.'),
  icon: z.string().min(1, 'Айкон сонгоно уу.'),
});

type EditCategoryFormValues = z.infer<typeof formSchema>;

// Type for API response category with string icon
type ApiCategory = {
  id: string;
  name: string;
  icon: string;
};

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingCategory, setFetchingCategory] = useState(true);

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '',
    },
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setFetchingCategory(true);
    try {
      const res = await fetch(`http://localhost:3001/api/categories/${id}`);
      if (!res.ok) {
        throw new Error('Category not found');
      }
      const data = await res.json();
      const category: ApiCategory = data.data;

      form.reset({
        name: category.name,
        icon: category.icon,
      });
    } catch (error) {
      console.error('Failed to fetch category', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Категорийн мэдээллийг татахад алдаа гарлаа.',
      });
      router.push('/admin/categories');
    } finally {
      setFetchingCategory(false);
    }
  };

  const onSubmit = async (data: EditCategoryFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      toast({
        title: 'Амжилттай',
        description: 'Категори амжилттай шинэчлэгдлээ.',
      });

      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Категори шинэчлэхэд алдаа гарлаа.',
      });
    } finally {
      setLoading(false);
    }
  };

  const { name, icon } = form.watch();

  // Get the selected icon component for preview
  const getIconComponent = (iconName: string) => {
    const iconData = mockIcons.find((icon) => icon.name.toLowerCase() === iconName.toLowerCase());
    return iconData?.component;
  };

  const IconComponent = getIconComponent(icon);

  if (fetchingCategory) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Буцах
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Категори засах</CardTitle>
          <CardDescription>Категорийн мэдээллийг шинэчлэнэ үү.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Категорийн нэр</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Категорийн нэрийг оруулна уу" {...field} />
                    </FormControl>
                    <FormDescription>Категорийн нэрийг оруулна уу.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Айкон</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Айкон сонгоно уу" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockIcons.map((iconOption) => {
                          const Icon = iconOption.component;
                          return (
                            <SelectItem key={iconOption.name} value={iconOption.name.toLowerCase()}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{iconOption.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>Категорид тохирох айкон сонгоно уу.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="text-sm font-medium mb-3">Урьдчилан харах</h3>
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <div className="p-2 rounded-full bg-accent">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <span className="font-medium">{name || 'Категорийн нэр'}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Шинэчилж байна...' : 'Шинэчлэх'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/categories">Цуцлах</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
