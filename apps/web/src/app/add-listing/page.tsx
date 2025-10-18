'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Category } from '@/types';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  businessName: z.string().min(2, 'Нэр дор хаяж 2 үсэгтэй байх ёстой.'),
  description: z.string().min(20, 'Тайлбар дор хаяж 20 тэмдэгттэй байх ёстой.'),
  categories: z.array(z.string()).min(1, 'Дор хаяж нэг ангилал сонгоно уу.'),
  phone: z.string().min(8, 'Утасны дугаар буруу байна.'),
  email: z.string().email('Имэйл хаяг буруу байна.').optional().or(z.literal('')),
  website: z.string().url('Вэбсайт хаяг буруу байна.').optional().or(z.literal('')),
  address: z.string().min(5, 'Хаяг дор хаяж 5 тэмдэгттэй байх ёстой.'),
  logo: z.string().url('Зөв лого URL оруулна уу.').optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
});

type AddListingFormValues = z.infer<typeof formSchema>;

export default function AddListingPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm<AddListingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      description: '',
      categories: [],
      phone: '',
      email: '',
      website: '',
      address: '',
      logo: '',
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: form.control as any,
    name: 'images',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      console.log('Fetching categories from API...');
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();
      console.log('Categories response:', data);
      
      // Check if data is an array or has a data property
      const categoriesArray = Array.isArray(data) ? data : (data.data || []);
      setCategories(categoriesArray);
      console.log('Categories set:', categoriesArray);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Ангиллуудыг татахад алдаа гарлаа.',
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  async function onSubmit(data: AddListingFormValues) {
    try {
      // Transform form data to match API schema
      const transformedData = {
        name: data.businessName,
        description: data.description,
        categories: data.categories,
        address: {
          city: 'Улаанбаатар',
          district: 'Сүхбаатар дүүрэг',
          khoroo: '1-р хороо',
          full: data.address,
        },
        location: {
          lat: 47.918888,
          lng: 106.917782,
        },
        contact: {
          phone: data.phone.split(',').map(p => p.trim()).filter(p => p.length > 0),
          email: data.email || undefined,
          website: data.website || undefined,
        },
        logo: data.logo || undefined,
        images: data.images.filter(img => img.trim().length > 0),
      };

      console.log('Sending data to API:', transformedData);

      const response = await fetch('http://localhost:3001/api/yellow-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error('Failed to create business');
      }

      const result = await response.json();
      console.warn('Business created:', result);

      toast({
        title: 'Амжилттай!',
        description: `"${data.businessName}" нэртэй бизнес амжилттай бүртгэгдлээ.`,
      });
      form.reset();
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа гарлаа',
        description: 'Бизнес бүртгэхэд алдаа гарлаа. Дахин оролдоно уу.',
      });
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Шинэ бизнес бүртгүүлэх</CardTitle>
          <CardDescription>Танай бизнесийн мэдээллийг үнэн зөв оруулна уу.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бизнесийн нэр</FormLabel>
                    <FormControl>
                      <Input placeholder="Жишээ нь: Modern Nomads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дэлгэрэнгүй тайлбар</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Танай бизнесийн талаар дэлгэрэнгүй тайлбар. Жишээ нь: 'Бид Улаанбаатар хотод байрлах итали ресторанаар пицца, паста зэрэг хоолоор үйлчилдэг...'"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Ангилал</FormLabel>
                      <FormDescription>
                        Өөрийн бизнест тохирох ангилалуудыг сонгоно уу.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      {loadingCategories ? (
                        <div className="col-span-full flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : categories.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground">
                          Ангилал олдсонгүй. API сервер ажиллаж байгаа эсэхийг шалгана уу.
                        </div>
                      ) : (
                        categories.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="categories"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.name)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.name])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== item.name)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.name}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Үндсэн утасны дугаар</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="7011-xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имэйл хаяг (заавал биш)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@company.mn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вэбсайт (заавал биш)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.company.mn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дэлгэрэнгүй хаяг</FormLabel>
                    <FormControl>
                      <Input placeholder="Сүхбаатар дүүрэг, 1-р хороо, ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logo */}
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Логоны зураг (заавал биш)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Бизнесийн логоны зургийн URL хаягийг оруулна уу.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Зургийн цомог (заавал биш)</FormLabel>
                    <FormDescription>Бизнесийн зургийн URL-уудыг оруулна уу.</FormDescription>
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                            <Image
                              src={
                                form.watch(`images.${index}`) ||
                                'https://picsum.photos/200/200?grayscale'
                              }
                              alt={`Зураг ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`images.${index}`}
                            render={({ field }) => (
                              <FormItem className="flex-grow">
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => append('')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Шинэ зураг нэмэх
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                Бүртгүүлэх
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
