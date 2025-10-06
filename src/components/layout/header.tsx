'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookMarked, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      toast({
        title: 'Амжилттай нэвтэрлээ',
        description: 'Админ самбар луу шилжиж байна.',
      });
      setShowLoginDialog(false);
      router.push('/admin');
    } else {
      setError('Нэвтрэх нэр эсвэл нууц үг буруу байна.');
    }
  };

  const openLoginDialog = () => {
    setShowAdminConfirm(false);
    setShowLoginDialog(true);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <>
      <header className="bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <BookMarked className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Шар ном</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button onClick={() => setShowAdminConfirm(true)}>
              Админ самбар
            </Button>
          </nav>
        </div>
      </header>

      {/* Admin Confirmation Dialog */}
      <AlertDialog open={showAdminConfirm} onOpenChange={setShowAdminConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="text-primary" />
              Баталгаажуулалт
            </AlertDialogTitle>
            <AlertDialogDescription>
              Та админ мөн үү? Зөвхөн эрх бүхий хэрэглэгч нэвтрэх боломжтой.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Үгүй</AlertDialogCancel>
            <AlertDialogAction onClick={openLoginDialog}>Тийм</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Админ нэвтрэх</DialogTitle>
            <DialogDescription>
              Нэвтрэх нэр болон нууц үгээ оруулна уу.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Нэвтрэх нэр
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
                placeholder="admin"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Нууц үг
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="col-span-4 text-center text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleLogin}>Нэвтрэх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
