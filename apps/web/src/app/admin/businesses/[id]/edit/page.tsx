'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Business } from '@/types';
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
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

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

type EditBusinessFormValues = z.infer<typeof formSchema>;

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const form = useForm<EditBusinessFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
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

  useEffect(() => {
    fetchCategories();
    if (id) {
      const fetchBusiness = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:3001/api/yellow-books/${id}`);
          const data = await res.json();
          setBusiness(data.data);
          // Populate form with fetched data
          form.reset({
            businessName: data.data.name,
            description: data.data.description,
            categories: data.data.categories,
            phone: Array.isArray(data.data.contact.phone)
              ? data.data.contact.phone.join(', ')
              : data.data.contact.phone,
            email: data.data.contact.email || '',
            website: data.data.contact.website || '',
            address: data.data.address.full,
            logo: data.data.logo || '',
            images: data.data.images || [],
          });
        } catch (error) {
          console.error('Failed to fetch business', error);
          toast({
            variant: 'destructive',
            title: 'Алдаа',
            description: 'Бизнесийн мэдээллийг татахад алдаа гарлаа.',
          });
        } finally {
          setLoading(false);
        }
      };
      fetchBusiness();
    }
  }, [id, form, toast]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('http://localhost:3001/api/categories');
      const data = await res.json();
      setCategories(data.data || []);
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

  async function onSubmit(data: EditBusinessFormValues) {
    try {
      // Transform form data to match API schema
      const transformedData = {
        name: data.businessName,
        description: data.description,
        categories: data.categories,
        address: {
          city: business?.address?.city || 'Улаанбаатар',
          district: business?.address?.district || 'Сүхбаатар дүүрэг',
          khoroo: business?.address?.khoroo || '1-р хороо',
          full: data.address,
        },
        location: business?.location || {
          lat: 47.918888,
          lng: 106.917782,
        },
        contact: {
          phone: data.phone
            .split(',')
            .map((p) => p.trim())
            .filter((p) => p.length > 0),
          email: data.email || undefined,
          website: data.website || undefined,
        },
        logo: data.logo || undefined,
        images: data.images.filter((img) => img.trim().length > 0),
      };

      const res = await fetch(`http://localhost:3001/api/yellow-books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('API Error:', errorData);
        throw new Error('Failed to update business');
      }

      await res.json();

      toast({
        title: 'Амжилттай шинэчиллээ!',
        description: `"${data.businessName}" нэртэй бизнес амжилттай засагдлаа.`,
      });

      router.push('/admin/businesses');
    } catch (error) {
      console.error('Error updating business:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Бизнесийн мэдээллийг шинэчлэхэд алдаа гарлаа.',
      });
    }
  }

  const { fields, append, remove } = useFieldArray({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: form.control as any,
    name: 'images',
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!business) {
    return <div className="container text-center py-10">Бизнес олдсонгүй.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/businesses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Бизнесийн жагсаалт руу буцах
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Бизнес засах</CardTitle>
          <CardDescription>"{business.name}"-н мэдээллийг шинэчлэх.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Бизнесийн нэр</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Textarea rows={6} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categories */}
              <FormField
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>Ангилал</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      {loadingCategories ? (
                        <div className="col-span-full flex justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        categories.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
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
                            )}
                          />
                        ))
                      )}
                    </div>
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
                    <FormLabel>Зургийн цомог</FormLabel>
                    <FormDescription>Зургийн URL-уудыг оруулна уу.</FormDescription>
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
                                  <Input {...field} placeholder="https://example.com/image.jpg" />
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

              {/* Contact Info */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Утасны дугаар</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Олон дугаар бол таслалаар (,) тусгаарлана уу.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имэйл хаяг</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                    <FormLabel>Вэбсайт</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                    <FormLabel>Логоны зураг</FormLabel>
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

              <Button type="submit" size="lg" className="w-full">
                Хадгалах
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
