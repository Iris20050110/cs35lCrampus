import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Review from "../components/Review";
import NewReview from "../components/NewReview";

export default function MoreInformationPage() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0)

  const handleReviewAdded = () => {
        setRefreshToken((prev) => prev + 1);
      };

  useEffect(() => {
    async function fetchSpot() {
      try {
        setLoading(true);
        const res = await axios.get(`/api/spots/${id}`);
        setSpot(res.data);
        setError(null);
      } catch {
        setError("Failed to load spot information.");
      } finally {
        setLoading(false);
      }
    }
    fetchSpot();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!spot) return <div>No spot found.</div>;

  return (
    <div className="font-[lexend] p-8 max-w-4xl mx-auto">
      <Link to="/" className="underline mb-4 inline-block">
        ← Back to all spots
      </Link>

      <h1 className="text-4xl font-bold mb-4">{spot.name}</h1>
      <p className="mb-2">{spot.description}</p>
      <p>
        <strong>Location:</strong> {spot.location}
      </p>
      <p>
        <strong>Tags:</strong> {spot.tags?.join(", ")}
      </p>

      {spot.photoFileId && (
        <img
          src={`/api/spots/image/${spot.photoFileId}`}
          alt={spot.name}
          className="mt-6 rounded shadow-md max-w-full"
        />
      )}

      <Review key={refreshToken} spotId={id}/>
      <NewReview spotId={id} onReviewAdded={handleReviewAdded}/>
    </div>
  );
}
