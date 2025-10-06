'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
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
import { mockCategories } from '@/lib/data';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const formSchema = z.object({
  businessName: z.string().min(2, 'Нэр дор хаяж 2 үсэгтэй байх ёстой.'),
  description: z.string().min(20, 'Тайлбар дор хаяж 20 тэмдэгттэй байх ёстой.'),
  categories: z.array(z.string()).min(1, 'Дор хаяж нэг ангилал сонгоно уу.'),
  phone: z.string().min(8, 'Утасны дугаар буруу байна.'),
  email: z.string().email('Имэйл хаяг буруу байна.').optional().or(z.literal('')),
  website: z.string().url('Вэбсайт хаяг буруу байна.').optional().or(z.literal('')),
  address: z.string().min(5, 'Хаяг дор хаяж 5 тэмдэгттэй байх ёстой.'),
  images: z.array(z.string().url("Зургийн URL буруу байна.")).min(1, "Дор хаяж нэг зураг оруулна уу."),
});

type EditBusinessFormValues = z.infer<typeof formSchema>;

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<EditBusinessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      description: '',
      categories: [],
      phone: '',
      email: '',
      website: '',
      address: '',
      images: [],
    },
  });

  useEffect(() => {
    if (id) {
      const fetchBusiness = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/businesses/${id}`);
          const data = await res.json();
          setBusiness(data);
          // Populate form with fetched data
          form.reset({
            businessName: data.name,
            description: data.description,
            categories: data.categories,
            phone: data.contact.phone.join(', '),
            email: data.contact.email,
            website: data.contact.website,
            address: data.address.full,
            images: data.images,
          });
        } catch (error) {
          console.error("Failed to fetch business", error);
          toast({ variant: 'destructive', title: 'Алдаа', description: 'Бизнесийн мэдээллийг татахад алдаа гарлаа.' });
        } finally {
          setLoading(false);
        }
      };
      fetchBusiness();
    }
  }, [id, form, toast]);

  function onSubmit(data: EditBusinessFormValues) {
    console.log("Updated data:", data);
    toast({
      title: 'Амжилттай шинэчиллээ!',
      description: `"${data.businessName}" нэртэй бизнес амжилттай засагдлаа.`,
    });
    router.push('/admin/businesses');
  }
  
  const { fields, append, remove } = form.control.register('images' as any);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
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
          <CardDescription>
            "{business.name}"-н мэдээллийг шинэчлэх.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <FormField control={form.control} name="businessName" render={({ field }) => ( <FormItem> <FormLabel>Бизнесийн нэр</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Дэлгэрэнгүй тайлбар</FormLabel> <FormControl> <Textarea rows={6} {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              
              {/* Categories */}
              <FormField control={form.control} name="categories" render={() => ( <FormItem> <FormLabel>Ангилал</FormLabel> <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2"> {mockCategories.map((item) => ( <FormField key={item.id} control={form.control} name="categories" render={({ field }) => ( <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0"> <FormControl> <Checkbox checked={field.value?.includes(item.name)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item.name]) : field.onChange( field.value?.filter( (value) => value !== item.name ) ) }} /> </FormControl> <FormLabel className="font-normal">{item.name}</FormLabel> </FormItem> )} /> ))} </div> <FormMessage /> </FormItem> )}/>
              
              {/* Images */}
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Зургийн цомог</FormLabel>
                    <FormDescription>Зургийн URL-уудыг оруулна уу.</FormDescription>
                    <div className="space-y-4">
                      {form.getValues('images').map((imageUrl, index) => (
                        <div key={index} className="flex items-center gap-2">
                           <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                              <Image src={imageUrl} alt={`Зураг ${index + 1}`} fill className="object-cover" />
                           </div>
                           <FormField
                              control={form.control}
                              name={`images.${index}`}
                              render={({ field }) => (
                                <Input {...field} className="flex-grow" placeholder="https://example.com/image.jpg" />
                              )}
                            />
                           <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => append("")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Шинэ зураг нэмэх
                      </Button>
                    </div>
                     <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Info */}
              <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Утасны дугаар</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormDescription>Олон дугаар бол таслалаар (,) тусгаарлана уу.</FormDescription> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Имэйл хаяг</FormLabel> <FormControl> <Input type="email" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel>Вэбсайт</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Дэлгэрэнгүй хаяг</FormLabel> <FormControl> <Input {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
              
              <Button type="submit" size="lg" className="w-full">Хадгалах</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
