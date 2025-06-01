// src/components/Review.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Review({ spotId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/spots/${spotId}/reviews`);
        setReviews(res.data);
        setError(null);
      } catch {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }
    if (spotId) {
      fetchReviews();
    }
  }, [spotId]);

  if (loading) return <div>Loading reviews…</div>;
  if (error) return <div className="text-amaranth">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review._id} className="border-b pb-3">
              <div className="flex items-center">
                <span className="font-medium">Rating:</span>
                <span className="ml-2">{review.rating} / 5</span>
              </div>
              {review.text && (
                <p className="mt-1 text-slate break-words">{review.text}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
