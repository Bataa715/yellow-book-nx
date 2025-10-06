'use client';

import { useEffect, useState } from 'react';
import { Business } from '@/types';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
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

export default function ManageBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/yellow-books');
        const data = await res.json();
        setBusinesses(data.data || []);
      } catch (error) {
        console.error('Failed to fetch businesses', error);
        toast({
          variant: 'destructive',
          title: 'Алдаа',
          description: 'Бизнесүүдийг татахад алдаа гарлаа.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [toast]);

  const handleDelete = async (id: string, businessName: string) => {
    setDeleteLoading(id);
    try {
      const res = await fetch(`http://localhost:3001/api/yellow-books/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete business');
      }

      // Remove from local state
      setBusinesses(businesses.filter((b) => b.id !== id));

      toast({
        title: 'Амжилттай устгалаа!',
        description: `"${businessName}" нэртэй бизнесийг устгалаа.`,
      });
    } catch (error) {
      console.error('Error deleting business:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Бизнесийг устгахад алдаа гарлаа.',
      });
    } finally {
      setDeleteLoading(null);
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
                        {business.categories.map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/admin/businesses/${business.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Засах</span>
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={deleteLoading === business.id}
                          >
                            {deleteLoading === business.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Устгах</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Та итгэлтэй байна уу?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Энэ үйлдэл буцаах боломжгүй. "{business.name}" нэртэй бизнесийг
                              бүрмөсөн устгана.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Цуцлах</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(business.id, business.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Устгах
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
