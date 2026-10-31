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

  const renderStars = (ratingValue: number) =>
    [1, 2, 3, 4, 5].map((i) => (
      <Star 
        key={i} 
        aria-hidden="true"
        size={15}
        className={i <= ratingValue ? 'fill-brass text-brass' : 'text-line'}
      />
    ));

  const notice = (text: string) => (
    <div className="card p-8">
      <p className="text-stone leading-relaxed">{text}</p>
    </div>
  );

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;

  return (
    <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
      <div>
        <p className="eyebrow">Reviews</p>
        <h2 className="font-display text-5xl leading-none mt-5">What owners say</h2>
        {avg !== null && (
          <p className="mt-6 flex items-center gap-3">
            <span className="font-display text-5xl">{avg.toFixed(1)}</span>
            <span className="flex flex-col gap-1">
              <span className="flex" role="img" aria-label={`${avg.toFixed(1)} out of 5 stars`}>{renderStars(Math.round(avg))}</span>
              <span className="text-xs text-stone">{reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </span>
          </p>
        )}

        <div className="mt-10">
          {reviewState === 'login' && (
            <div className="card p-8">
              <p className="text-stone leading-relaxed mb-6">Bought this piece? Sign in to share your experience with other customers.</p>
              <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} className="btn btn-outline">
                Sign in to review
              </Link>
            </div>
          )}
          {reviewState === 'not-purchased' && notice('Reviews can be written by customers who have ordered this piece, so every review here comes from a real owner.')}
          {reviewState === 'reviewed' && notice('Thank you, you have already reviewed this piece.')}
          {reviewState === 'can-review' && (
            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
              <h3 className="font-display text-3xl">Write a review</h3>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

              <fieldset>
                <legend className="field-label mb-3">Your rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      aria-label={`${i} star${i > 1 ? 's' : ''}`}
                      aria-pressed={rating === i}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star size={24} strokeWidth={1.4} className={i <= rating ? 'fill-brass text-brass' : 'text-stone/50'} />
                    </button>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="review-comment" className="field-label">Your review</label>
                <textarea 
                  id="review-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="field resize-none"
                  placeholder="How does it look and feel in your home?"
                  required
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                {isSubmitting ? 'Submitting…' : 'Submit review'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div>
        {reviews.length === 0 ? (
          <div className="h-full min-h-[200px] rounded-2xl border border-dashed border-line grid place-items-center p-10 text-center">
            <p className="font-display text-3xl text-stone">No reviews yet.<br />Be the first owner to share.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {reviews.map((review) => (
              <li key={review.id} className="py-8">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="font-display text-2xl">{review.user?.name || 'Customer'}</p>
                    <p className="text-xs text-stone mt-1">
                      Verified buyer · {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex" role="img" aria-label={`${review.rating} out of 5 stars`}>
                    {renderStars(review.rating)}
                  </div>
                </div>
                {review.comment && <p className="text-stone leading-relaxed">{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
