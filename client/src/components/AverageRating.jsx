import React from "react";
import { Star, StarHalf } from "lucide-react";

const AverageRating = ({ reviews = [], size = 32 }) => {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-500 italic">No ratings yet</span>
      </div>
    );
  }

  function calculateAverage(reviews) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }
    // calculate sum of all ratings
    const total = reviews.reduce((sum, review) => {
      const r = typeof review.rating === "number" ? review.rating : 0;
      return sum + r;
    }, 0);

    return total / reviews.length;
  }

  const avgRaw = calculateAverage(reviews);
  const avgHalf = Math.round(avgRaw * 2) / 2;

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((starIdx) => {
        if (starIdx <= Math.floor(avgHalf)) {
          return (
            <Star
              key={starIdx}
              size={size}
              fill="currentColor"
              stroke="currentColor"
              className="text-yellow-400"
            />
          );
        } else if (starIdx === Math.ceil(avgHalf) && avgHalf % 1 !== 0) {
          return (
            <StarHalf
              key={starIdx}
              size={size}
              fill="currentColor"
              stroke="currentColor"
              className="text-yellow-400"
            />
          );
        } else {
          return (
            <Star
              key={starIdx}
              size={size}
              fill="none"
              stroke="currentColor"
              className="text-gray-300"
            />
          );
        }
      })}
      <span className="ml-2">{avgRaw.toFixed(1)} / 5</span>
    </div>
  );
};

export default AverageRating;
