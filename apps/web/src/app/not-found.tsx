import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto py-24 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Хуудас олдсонгүй</h2>
      <p className="text-muted-foreground mb-8">
        Та хайж буй хуудас олдсонгүй. URL хаягаа шалгаж дахин оролдоно уу.
      </p>
      <Button asChild>
        <Link href="/">Нүүр хуудас руу буцах</Link>
      </Button>
    </div>
  );
}
