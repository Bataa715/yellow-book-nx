import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookMarked } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <BookMarked className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">
            Шар ном
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button asChild>
            <Link href="/add-listing">Бизнес нэмэх</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
