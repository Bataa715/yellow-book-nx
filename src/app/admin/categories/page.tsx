'use client';

import { useState } from 'react';
import { mockCategories as initialCategories, mockIcons } from '@/lib/data';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIconName, setSelectedIconName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = (id: string) => {
    console.log(`Delete category with id: ${id}`);
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleAddNewCategory = () => {
    if (newCategoryName && selectedIconName) {
        const IconComponent = mockIcons.find(icon => icon.name === selectedIconName)?.component;
        if (!IconComponent) return;

        const newCategory: Category = {
            id: (categories.length + 1).toString(),
            name: newCategoryName,
            icon: IconComponent
        };
        setCategories([...categories, newCategory]);
        setShowAddDialog(false);
        setNewCategoryName('');
        setSelectedIconName('');
    }
  };

  const handleEditCategory = () => {
     if (!editingCategory || !newCategoryName || !selectedIconName) return;

     const IconComponent = mockIcons.find(icon => icon.name === selectedIconName)?.component;
     if (!IconComponent) return;

     setCategories(categories.map(c => 
        c.id === editingCategory.id ? { ...c, name: newCategoryName, icon: IconComponent } : c
     ));

     setEditingCategory(null);
     setNewCategoryName('');
     setSelectedIconName('');
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    const iconData = mockIcons.find(icon => icon.component === category.icon);
    if(iconData) {
        setSelectedIconName(iconData.name);
    }
    setShowAddDialog(false); // Close add dialog if open
  }

  const closeDialogs = () => {
    setShowAddDialog(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setSelectedIconName('');
  }


  const isEditing = editingCategory !== null;

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
                <CardTitle>Категори удирдлага</CardTitle>
                <CardDescription>Бүртгэлтэй категориудыг засах, устгах, шинээр нэмэх.</CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Шинэ категори нэмэх
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Нэр</TableHead>
                    <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {categories.map((category) => (
                    <TableRow key={category.id}>
                    <TableCell><category.icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Засах</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Устгах</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || isEditing} onOpenChange={closeDialogs}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Категори засах' : 'Шинэ категори нэмэх'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Категорийн мэдээллийг шинэчилнэ үү.' : 'Шинэ категорийн нэр болон icon-г сонгоно уу.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Нэр
              </Label>
              <Input 
                id="name" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                className="col-span-3" 
                placeholder="Жишээ: Спорт"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <Select value={selectedIconName} onValueChange={setSelectedIconName}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Icon сонгох..." />
                </SelectTrigger>
                <SelectContent>
                   {mockIcons.map(icon => {
                       const IconComponent = icon.component;
                       return (
                            <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    <span>{icon.name}</span>
                                </div>
                            </SelectItem>
                       )
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialogs}>Болих</Button>
            <Button onClick={isEditing ? handleEditCategory : handleAddNewCategory}>{isEditing ? 'Хадгалах' : 'Нэмэх'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
