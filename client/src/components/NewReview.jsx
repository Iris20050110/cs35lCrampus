import React, { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function NewReview({ spotId, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setSubmitting(true);
    try {
      const url = `/api/spots/${spotId}/reviews`;

      const payload = {
        rating,
        text: text.trim(),
      };

      await axios.post(url, payload, {
        withCredentials: true,
      });

      setRating(5);
      setText("");

      if (typeof onReviewAdded === "function") {
        onReviewAdded();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(
        err.response?.data?.error ||
          "An unexpected error occurred while adding your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg font-[lexend] bg-ash p-5">
      <h2 className="text-2xl font-bold text-onyx mb-4">Add Your Review</h2>

      {error && <p className="mb-4 text-amaranth">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="font-medium text-slate mb-2">Rating:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((starIndex) => {
              const isActive = hoverRating
                ? starIndex <= hoverRating
                : starIndex <= rating;
              return (
                <Star
                  key={starIndex}
                  size={28}
                  fill={isActive ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`cursor-pointer ${
                    isActive ? "text-yellow-400" : "text-oynx"
                  }`}
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(starIndex)}
                />
              );
            })}
          </div>
        </div>

        <label className="flex flex-col">
          <span className="font-medium text-oynx">Review:</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your thoughts here..."
            rows={4}
            className="mt-1 p-2 rounded-md bg-white text-oynx focus:outline-none focus:ring-2 focus:ring-slate resize-none"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 px-4 py-2 hover:scale-102 font-semibold bg-slate text-white rounded-md transition-transform duration-150"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
