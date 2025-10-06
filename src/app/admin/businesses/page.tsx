'use client';

import { useEffect, useState } from 'react';
import { Business } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ManageBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/businesses');
        const data = await res.json();
        setBusinesses(data);
      } catch (error) {
        console.error("Failed to fetch businesses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleDelete = (id: string) => {
    // In a real app, you would show a confirmation dialog and then call an API to delete the business.
    console.log(`Delete business with id: ${id}`);
    setBusinesses(businesses.filter(b => b.id !== id));
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
                <CardTitle>Бизнес удирдлага</CardTitle>
                <CardDescription>Бүртгэлтэй бизнесүүдийг засах, устгах, шинээр нэмэх.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/add-listing">
                    <Plus className="mr-2 h-4 w-4" />
                    Шинэ бизнес нэмэх
                </Link>
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
                    <TableHead>Ангилал</TableHead>
                    <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {businesses.map((business) => (
                    <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {business.categories.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button asChild variant="outline" size="icon">
                          <Link href={`/admin/businesses/${business.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Засах</span>
                          </Link>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(business.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Устгах</span>
                        </Button>
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
