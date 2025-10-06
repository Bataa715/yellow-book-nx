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
      className="w-full max-w-3xl bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-5 gap-2 border"
    >
      <div className="relative md:col-span-2">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          {...register('query')}
          type="search"
          placeholder="Түлхүүр үг, нэр, ангилал..."
          className="pl-10 w-full h-12 text-base"
        />
      </div>
      <div className="relative md:col-span-2">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          {...register('location')}
          type="search"
          placeholder="Байршил, хот, дүүрэг..."
          className="pl-10 w-full h-12 text-base"
        />
      </div>
      <Button type="submit" className="w-full md:col-span-1 h-12 text-base">
        <Search className="mr-2 h-4 w-4" /> Хайх
      </Button>
    </form>
  );
}
