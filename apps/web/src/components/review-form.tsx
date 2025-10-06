'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewFormProps {
  businessId: string;
  businessName: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ businessId, businessName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author || !comment || rating === 0) {
      setMessage({ type: 'error', text: 'Бүх талбарыг бөглөнө үү!' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          author,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Алдаа гарлаа');
      }

      setMessage({ type: 'success', text: data.message || 'Сэтгэгдэл амжилттай нэмэгдлээ!' });

      // Reset form
      setRating(0);
      setAuthor('');
      setComment('');

      // Call callback if provided
      if (onReviewSubmitted) {
        setTimeout(() => {
          onReviewSubmitted();
        }, 1000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Алдаа гарлаа',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Сэтгэгдэл үлдээх</CardTitle>
        <p className="text-sm text-muted-foreground">
          {businessName}-ийн талаарх өөрийн туршлагаасаа хуваалцана уу
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="space-y-2">
            <Label htmlFor="rating">Таны үнэлгээ *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="author">Таны нэр *</Label>
            <Input
              id="author"
              placeholder="Жишээ: Бат"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Сэтгэгдэл *</Label>
            <Textarea
              id="comment"
              placeholder="Энэ бизнесийн талаарх өөрийн туршлагаасаа хуваалцана уу..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">{comment.length}/500</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? 'Илгээж байна...' : 'Сэтгэгдэл илгээх'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
