import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-card/50 py-6 mt-auto">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Шар ном. Бүх эрх хуулиар хамгаалагдсан.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            prefetch={false}
          >
            Бидний тухай
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            prefetch={false}
          >
            Үйлчилгээний нөхцөл
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            prefetch={false}
          >
            Холбоо барих
          </Link>
        </nav>
      </div>
    </footer>
  );
}
