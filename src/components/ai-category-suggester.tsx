'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import { suggestBusinessCategories } from '@/ai/flows/suggest-business-categories';
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AiCategorySuggesterProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

export function AiCategorySuggester({ 
  description, 
  onDescriptionChange,
  selectedCategories,
  onCategoryToggle
}: AiCategorySuggesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const { toast } = useToast()

  const handleSuggestCategories = async () => {
    if (!description || description.trim().length < 20) {
        toast({
            variant: "destructive",
            title: "Тайлбар хангалтгүй",
            description: "Санал болгохын тулд дор хаяж 20 тэмдэгттэй бизнесийн тайлбар оруулна уу.",
        })
      return;
    }

    setIsLoading(true);
    setSuggestedCategories([]);
    try {
      const result = await suggestBusinessCategories({ businessDescription: description });
      setSuggestedCategories(result.suggestedCategories);
      if (result.suggestedCategories.length > 0) {
        toast({
          title: "Ангилал олдлоо!",
          description: "Санал болгосон ангиллуудаас сонголт хийнэ үү.",
        })
      } else {
        toast({
          title: "Ангилал олдсонгүй",
          description: "Таны тайлбарт тохирох ангилал олдсонгүй. Та өөрөө шивж нэмнэ үү.",
        })
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Алдаа гарлаа",
        description: "Ангилал санал болгоход алдаа гарлаа. Дараа дахин оролдоно уу.",
      })
      console.error("Error suggesting categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Танай бизнесийн талаар дэлгэрэнгүй тайлбар. Жишээ нь: 'Бид Улаанбаатар хотод байрлах итали ресторанаар пицца, паста зэрэг хоолоор үйлчилдэг...'"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        rows={6}
      />
      <Button type="button" onClick={handleSuggestCategories} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        AI-аас ангилал санал болгох
      </Button>

      {(suggestedCategories.length > 0 || isLoading) && (
         <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Санал болгож буй ангиллууд</AlertTitle>
          <AlertDescription>
            AI-н санал болгосон ангиллуудаас сонгоно уу. Эсвэл өөрөө шинээр нэмж болно.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap gap-2">
        {suggestedCategories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? 'default' : 'secondary'}
            onClick={() => onCategoryToggle(category)}
            className="cursor-pointer text-sm px-3 py-1"
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
