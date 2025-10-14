'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, Send, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewSectionProps {
  businessId: string;
  businessName: string;
  initialReviews: Review[];
}

export function ReviewSection({ businessId, businessName, initialReviews }: ReviewSectionProps) {
  console.log('ReviewSection rendered with:', { businessId, businessName, initialReviews });
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Үнэлгээг сонгоно уу.',
      });
      return;
    }
    if (author.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Нэрээ оруулна уу.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        businessId,
        author: author.trim(),
        rating,
        comment: comment.trim(),
        date: new Date().toLocaleDateString('mn-MN'),
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      // Reset form
      setRating(0);
      setHoverRating(0);
      setComment('');
      setAuthor('');

      // Refresh reviews
      const reviewsResponse = await fetch(`${apiUrl}/api/reviews/${businessId}`);
      if (reviewsResponse.ok) {
        const updatedReviewsData = await reviewsResponse.json();
        setReviews(updatedReviewsData.data || updatedReviewsData);
      }

      toast({
        title: 'Амжилттай',
        description: 'Таны үнэлгээ амжилттай нэмэгдлээ.',
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: 'destructive',
        title: 'Алдаа',
        description: 'Үнэлгээ нэмэхэд алдаа гарлаа. Дахин оролдоно уу.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Write Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {businessName}-д үнэлгээ өгөх
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Үнэлгээ</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Таны нэр</label>
            <Input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Нэрээ оруулна уу"
              className="mb-4"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Сэтгэгдэл</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Энэ бизнесийн талаар сэтгэгдэл үлдээнэ үү..."
              className="min-h-24"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || rating === 0 || !author.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Send className="h-4 w-4 mr-2 animate-spin" />
                Илгээж байна...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Үнэлгээ илгээх
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Үнэлгээнүүд ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Одоогоор үнэлгээ алга байна. Эхний үнэлгээг та өгөөрэй!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback>
                        {review.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{review.author}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}