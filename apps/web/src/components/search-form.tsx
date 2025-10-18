'use client';

import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';

type SearchFormData = {
  query: string;
  location: string;
};

export function SearchForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchFormData>();

  const onSubmit = (data: SearchFormData) => {
    const params = new URLSearchParams();
    if (data.query) params.append('q', data.query);
    if (data.location) params.append('loc', data.location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl bg-white p-4 rounded-2xl shadow-xl border border-gray-200/50 backdrop-blur-sm grid grid-cols-1 md:grid-cols-7 gap-3"
    >
      <div className="relative md:col-span-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          {...register('query')}
          type="search"
          placeholder="Ресторан, эмнэлэг, банк..."
          className="pl-12 pr-4 h-14 text-base border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50 hover:bg-white transition-all"
        />
      </div>
      <div className="relative md:col-span-3">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          {...register('location')}
          type="search"
          placeholder="Баянзүрх, Сүхбаатар, Хан-Уул..."
          className="pl-12 pr-4 h-14 text-base border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl bg-gray-50/50 hover:bg-white transition-all"
        />
      </div>
      <Button
        type="submit"
        className="w-full md:col-span-1 h-14 text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl font-semibold"
      >
        <Search className="mr-2 h-5 w-5" />
        Хайх
      </Button>
    </form>
  );
}
