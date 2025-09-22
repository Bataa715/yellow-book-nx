'use client';

import { useForm, Controller } from 'react-hook-form';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  businessName: z.string().min(2, 'Нэр дор хаяж 2 үсэгтэй байх ёстой.'),
  description: z.string().min(20, 'Тайлбар дор хаяж 20 тэмдэгттэй байх ёстой.'),
  categories: z.array(z.string()).min(1, 'Дор хаяж нэг ангилал сонгоно уу.'),
  phone: z.string().min(8, 'Утасны дугаар буруу байна.'),
  email: z.string().email('Имэйл хаяг буруу байна.').optional().or(z.literal('')),
  website: z.string().url('Вэбсайт хаяг буруу байна.').optional().or(z.literal('')),
  address: z.string().min(5, 'Хаяг дор хаяж 5 тэмдэгттэй байх ёстой.'),
});

type AddListingFormValues = z.infer<typeof formSchema>;

export default function AddListingPage() {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState('');

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
    },
  });

  const handleAddNewCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCategory.trim() !== '') {
      e.preventDefault();
      const currentCategories = form.getValues('categories');
      if (!currentCategories.includes(newCategory.trim())) {
        form.setValue('categories', [...currentCategories, newCategory.trim()], { shouldValidate: true });
      }
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    const currentCategories = form.getValues('categories');
    form.setValue('categories', currentCategories.filter(c => c !== category), { shouldValidate: true });
  };

  function onSubmit(data: AddListingFormValues) {
    console.log(data);
    toast({
      title: 'Амжилттай!',
      description: `"${data.businessName}" нэртэй бизнес амжилттай бүртгэгдлээ.`,
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Шинэ бизнес бүртгүүлэх</CardTitle>
          <CardDescription>
            Танай бизнесийн мэдээллийг үнэн зөв оруулна уу.
          </CardDescription>
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
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ангилал</FormLabel>
                    <FormDescription>
                       Өөрийн бизнест тохирох ангилалуудыг шивж оруулаад Enter товчийг дарна уу.
                    </FormDescription>
                     <div className="flex items-center gap-2 pt-2">
                      <Input 
                        placeholder="Шинэ ангилал нэмээд Enter дарна уу"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        onKeyDown={handleAddNewCategory}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 min-h-[2.5rem]">
                        {field.value.map(category => (
                            <Badge key={category} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                                {category}
                                <button type="button" onClick={() => removeCategory(category)} className="ml-2 rounded-full p-0.5 hover:bg-destructive/80 hover:text-destructive-foreground transition-colors">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
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

              <Button type="submit" size="lg" className="w-full">Бүртгүүлэх</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
