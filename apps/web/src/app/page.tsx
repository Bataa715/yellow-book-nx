import { Suspense } from 'react';
import Image from 'next/image';
import { SearchForm } from '@/components/search-form';
import { CategoryGrid } from '@/components/category-grid';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center p-4 space-y-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-bg');

  return (
    <div className="flex flex-col items-center">
      <section className="relative w-full py-20 md:py-32 flex items-center justify-center bg-secondary/50">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover z-0 opacity-20"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="container px-4 md:px-6 z-10 flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">
            Хайсан бизнесээ <span className="text-primary">хялбархан</span> олоорой
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Монголын бүх бизнес, үйлчилгээний газрууд нэг дор. Ангилал, байршил, нэрээр хайлт
            хийгээрэй.
          </p>
          <SearchForm />
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Түгээмэл ангиллууд</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Өөрт хэрэгтэй үйлчилгээгээ сонгон хайлтаа эхлүүлээрэй.
            </p>
          </div>
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
