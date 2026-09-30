"use client";

/**
 * Star Ratings & Reviews Component
 * Used on /template/[id] pages.
 * Reviews are seeded from localStorage and can be submitted by visitors.
 */
import { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          aria-label={readonly ? `${value} out of 5 stars` : `Rate ${star} out of 5 stars`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"}
        >
          <Star
            className={`size-4 transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-white/10 text-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function ReviewsSection({ templateId }: { templateId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`reviews_${templateId}`) ?? "[]");
      if (Array.isArray(stored)) {
        setReviews(stored);
      }
    } catch {
      setReviews([]);
    }
  }, [templateId]);

  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim() || "Verified Visitor",
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };
    try {
      const stored = JSON.parse(localStorage.getItem(`reviews_${templateId}`) ?? "[]");
      const updated = [newReview, ...(Array.isArray(stored) ? stored : [])];
      localStorage.setItem(`reviews_${templateId}`, JSON.stringify(updated));
      setReviews(updated);
    } catch {
      setReviews([newReview, ...reviews]);
    }
    setSubmitted(true);
    setShowForm(false);
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="size-5 text-white/60" />
          <h3 className="text-lg font-bold text-white">Customer Reviews</h3>
          <span className="text-sm text-white/40">({reviews.length})</span>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating value={Math.round(avgRating)} readonly />
            <span className="text-sm font-bold text-white">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.01] p-6 text-center text-sm text-white/50 mb-6">
          <p>No customer reviews submitted yet.</p>
          <p className="text-xs text-white/30 mt-1">
            Have you built with this template? Share your experience with the community below.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-bold text-white">{r.name}</span>
                  <span className="ml-2 text-xs text-white/40">{r.date}</span>
                </div>
                <StarRating value={r.rating} readonly />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}

      {/* Write a review */}
      {submitted && !showForm && (
        <p className="text-sm text-emerald-400 mb-4">✓ Thanks for your review!</p>
      )}

      <AnimatePresence>
        {showForm ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5"
          >
            <h4 className="text-sm font-bold text-white">Write a Review</h4>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Your Rating</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50"
            />
            <textarea
              required
              rows={3}
              placeholder="What did you think of this template?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-2.5 text-xs font-bold text-white hover:brightness-110">
                Submit Review
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/60 hover:text-white">
                Cancel
              </button>
            </div>
          </motion.form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            + Write a review
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
