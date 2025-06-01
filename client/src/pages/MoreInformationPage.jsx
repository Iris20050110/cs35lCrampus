import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Review from "../components/Review";
import NewReview from "../components/NewReview";
import AverageRating from "../components/AverageRating";

export default function MoreInformationPage() {
  const location = useLocation();
  const passedSpot = location.state?.spot ?? null;
  const { id: paramsId } = useParams();
  const spotId = passedSpot?._id || paramsId;

  const [spot, setSpot] = useState(passedSpot);
  const [loading, setLoading] = useState(passedSpot ? false : true);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);

  const handleReviewAdded = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (passedSpot) return;

    async function fetchSpot() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/spots/${spotId}`);
        setSpot(res.data);
        setError(null);
      } catch {
        setError("Failed to load spot information.");
      } finally {
        setLoading(false);
      }
    }

    if (spotId) {
      fetchSpot();
    } else {
      setError("No spot ID provided");
      setLoading(false);
    }
  }, [spotId, passedSpot]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="text-xl">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="text-xl text-amaranth">{error}</span>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <span className="text-xl">No spot found.</span>
      </div>
    );
  }

  const {
    name,
    photoFileId,
    hours = {},
    tags = [],
    reviews: reviewsArr = [],
    location: address = "",
    description = "",
  } = spot;

  return (
    <div className="w-screen p-8 bg-tan font-[lexend] text-oynx">
        <Link
          to="/"
          className="px-4 py-2 bg-slate text-white rounded mb-10">
          &lt; Back
        </Link>
        <h1 className="text-4xl font-bold mt-10 mb-5">{name}</h1>

      <div className="flex flex-row items-start gap-8 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-4 text-xl">
            <AverageRating reviews={reviewsArr} />
          </div>

          <div className="space-y-2 text-lg text-slate break-words mb-4">
            <div>
              <span className="font-medium text-slate">Hours:</span>{" "}
              {hours.open && hours.close
                ? `${hours.open} – ${hours.close}`
                : "Not provided"}
            </div>
            <div>
              <span className="font-medium">Location:</span> {address}
            </div>
            <div>
            <span className="font-medium">Tags:</span>{" "}
              {tags.length === 0 ? (
                <span className="text-gray-600 italic">No tags</span>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-[8px] py-[4px] m-[2px] rounded-[14px] bg-[#b6244f] text-white inline-block"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>
            <div>
              <p className="font-medium">{description}</p>
            </div>
          </div>
        </div>

        <div className="w-[600px] h-auto overflow-hidden rounded-lg mr-20 flex-shrink-0">
          {photoFileId ? (
            <img
              src={`/api/spots/image/${photoFileId}`}
              alt={name}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
      {(reviewsArr.length === 0 || reviewsArr === 0) ? (
        <p className="text-lg italic text-gray-600 mb-6">No reviews yet.</p>
      ) : (
        <div className="mb-6">
          <Review key={refreshToken} spotId={spotId} />
        </div>
      )}
        <NewReview spotId={spotId} onReviewAdded={handleReviewAdded} />
      </div>
    </div>
  );
}
