'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Tag, Plus, LogOut, Link as LinkIcon, Search, Home, PlusSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            <Button size="lg" className="w-full">Бизнес удирдах</Button>
            <Button size="lg" variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Шинэ бизнес нэмэх
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
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Хурдан холбоосууд</h2>
        <Card className="shadow-md">
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button asChild variant="ghost" className="justify-start gap-2">
                    <Link href="/add-listing"><PlusSquare className="h-4 w-4 text-muted-foreground"/> Бизнес нэмэх (хуучин)</Link>
                </Button>
                <Button asChild variant="ghost" className="justify-start gap-2">
                    <Link href="/"><Home className="h-4 w-4 text-muted-foreground"/> Үндсэн хуудас</Link>
                </Button>
                 <Button asChild variant="ghost" className="justify-start gap-2">
                    <Link href="/search"><Search className="h-4 w-4 text-muted-foreground"/> Хайлт</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
