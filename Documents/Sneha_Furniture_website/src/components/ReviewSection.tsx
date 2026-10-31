'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Star } from 'lucide-react';

export type ReviewState = 'login' | 'not-purchased' | 'reviewed' | 'can-review';

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  user: { name: string } | null;
};

export default function ReviewSection({
  productId,
  reviews,
  reviewState
}: {
  productId: string,
  reviews: Review[],
  reviewState: ReviewState
}) {
  const pathname = usePathname();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewState !== 'can-review') return;

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        // Refresh page to show new review
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit review');
      }
    } catch {
      setError('An error occurred while submitting the review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          aria-hidden="true"
          className={`w-5 h-5 ${i <= ratingValue ? 'fill-black text-black' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const notice = (text: string) => (
    <div className="bg-gray-100 p-8 text-center">
      <p className="text-sm font-bold uppercase tracking-widest opacity-50">{text}</p>
    </div>
  );

  return (
    <div className="mt-24 border-t border-black pt-16">
      <h2 className="text-4xl font-black uppercase tracking-tight text-black mb-12">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Review Form */}
        <div className="w-full lg:w-1/3">
          <h3 className="text-2xl font-bold uppercase tracking-widest mb-6">Write a Review</h3>

          {reviewState === 'login' && (
            <div className="bg-gray-100 p-8 text-center">
              <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-4">Please log in to leave a review</p>
              <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} className="inline-block border border-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition">
                Log In
              </Link>
            </div>
          )}
          {reviewState === 'not-purchased' && notice('Reviews can be written by customers who have ordered this product')}
          {reviewState === 'reviewed' && notice('Thank you, you have already reviewed this product')}
          {reviewState === 'can-review' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div role="alert" className="text-red-500 font-bold text-xs uppercase">{error}</div>}

              <fieldset>
                <legend className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      aria-label={`${i} star${i > 1 ? 's' : ''}`}
                      aria-pressed={rating === i}
                    >
                      <Star className={`w-5 h-5 ${i <= rating ? 'fill-black text-black' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Your Review</label>
                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  className="w-full border border-black p-4 text-sm font-medium outline-none min-h-[120px]"
                  placeholder="What did you think about this product?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white h-14 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition disabled:opacity-50"
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div className="w-full lg:w-2/3">
          {reviews.length === 0 ? (
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">No reviews yet.</p>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{review.user?.name || 'Anonymous'}</h4>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-30 mt-1">
                        Verified buyer · {new Date(review.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex" role="img" aria-label={`${review.rating} out of 5 stars`}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
