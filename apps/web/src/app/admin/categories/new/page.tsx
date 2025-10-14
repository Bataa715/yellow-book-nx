'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { mockIcons } from '@/lib/data';

export default function NewCategoryPage() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Категорийн нэрийг оруулна уу.',
      });
      return;
    }

    if (!icon) {
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Айкон сонгоно уу.',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          icon: icon,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      toast({
        title: 'Амжилттай',
        description: 'Шинэ категори амжилттай нэмэгдлээ.',
      });

      router.push('/admin/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: error instanceof Error ? error.message : 'Категори нэмэхэд алдаа гарлаа.',
      });
    } finally {
      setLoading(false);
    }
  };

  const convertToKebabCase = (iconName: string) => {
    // Convert PascalCase to kebab-case (e.g., 'HeartPulse' -> 'heart-pulse')
    return iconName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
  };

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
          <CardTitle>Шинэ категори нэмэх</CardTitle>
          <CardDescription>Шинэ бизнесийн категори үүсгэнэ үү.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Категорийн нэр</Label>
              <Input
                id="name"
                type="text"
                placeholder="Жишээ: Ресторан"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Айкон</Label>
              <Select value={icon} onValueChange={setIcon} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Айкон сонгоно уу" />
                </SelectTrigger>
                <SelectContent>
                  {mockIcons.map((iconData) => {
                    const IconComponent = iconData.component;
                    const kebabCaseValue = convertToKebabCase(iconData.name);
                    return (
                      <SelectItem key={iconData.name} value={kebabCaseValue}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{iconData.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {icon && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600 mb-2">Танилцуулга:</p>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const selectedIcon = mockIcons.find(iconData => 
                      convertToKebabCase(iconData.name) === icon
                    );
                    if (selectedIcon) {
                      const IconComponent = selectedIcon.component;
                      return <IconComponent className="w-5 h-5" />;
                    }
                    return null;
                  })()}
                  <span className="font-medium">{name || 'Категорийн нэр'}</span>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Нэмж байна...' : 'Категори нэмэх'}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/categories">Цуцлах</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}