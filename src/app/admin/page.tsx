'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Building, Tag, Plus, LogOut } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  // In a real app, this would come from an API
  const businessCount = 6; 

  const handleLogout = () => {
    // In a real app, you would handle logout logic here
    console.log("Logged out");
    router.push('/');
  };

  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 md:px-6 bg-background">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Админ самбар</h1>
          <p className="text-muted-foreground text-lg">Бизнес болон категори удирдах</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Гарах
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Building className="h-6 w-6" />
              Бизнесүүд
            </CardTitle>
            <CardDescription>
              Нийт {businessCount} бизнес бүртгэлтэй
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/admin/businesses">Бизнес удирдах</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/add-listing">
                <Plus className="mr-2 h-4 w-4" />
                Шинэ бизнес нэмэх
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Tag className="h-6 w-6" />
              Категориуд
            </CardTitle>
            <CardDescription>
              Бизнесийн ангилал удирдах
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button size="lg" className="w-full">Категори удирдах</Button>
            <Button size="lg" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Шинэ категори нэмэх
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
