'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8" />
            Админ самбар
          </CardTitle>
          <CardDescription>
            Тавтай морилно уу! Эндээс та системийн үндсэн тохиргоог хийх боломжтой.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">Удахгүй энд удирдлагын хэсгүүд нэмэгдэх болно.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
