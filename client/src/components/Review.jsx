import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star } from "lucide-react";

export default function Review({ spotId, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [editingID, setEditingID] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState("");

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
  }, [spotId, currentUser]);

  if (loading) return <div>Loading reviews…</div>;
  if (error) return <div className="text-amaranth">{error}</div>;

  const refresh = async () => {
    const res = await axios.get(`/api/spots/${spotId}/reviews`);
    setReviews(res.data);
  };

  const startEdit = (r) => {
    setEditingID(r._id);
    setEditRating(r.rating);
    setEditText(r.text || "");
  };

  const cancelEdit = () => {
    setEditingID(null);
    setEditRating(5);
    setEditText("");
  };

  const saveEdit = async () => {
    try {
      setError(null);
      await axios.patch(
        `/api/spots/${spotId}/reviews/${editingID}`,
        { rating: editRating, text: editText.trim() },
        { withCredentials: true }
      );
      await refresh();
      cancelEdit();
    } catch (err) {
      console.error("Failed to update review:", err);
      setError(err.response?.data?.error || "Failed to update review.");
    }
  };

  const deleteReview = async (id) => {
    try {
      setError(null);
      await axios.delete(`/api/spots/${spotId}/reviews/${id}`, {
        withCredentials: true,
      });
      await refresh();
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError(err.response?.data?.error || "Failed to delete review.");
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const isReviewOwner = (review) => {
    if (!currentUser) return false;
    const reviewUserId = review.userId?._id || review.userId;
    return currentUser._id === reviewUserId;
  };

  return (
    <div className="mt-8 font-[lexend]">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="border-b pb-4">
              {editingID === r._id ? (
                <div className="space-y-4 bg-ash p-4 rounded-lg">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-slate">Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((idx) => (
                        <Star
                          key={idx}
                          size={28}
                          fill={idx <= editRating ? "currentColor" : "none"}
                          stroke="currentColor"
                          className={
                            idx <= editRating
                              ? "text-yellow-400 cursor-pointer"
                              : "text-gray-400 cursor-pointer"
                          }
                          onClick={() => setEditRating(idx)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-slate">Review:</span>
                    <textarea
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 rounded-md bg-white text-onyx focus:outline-none focus:ring-2 focus:ring-slate resize-none"
                      placeholder="Write your thoughts here..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-slate text-white rounded-md hover:scale-102 transition-transform duration-150"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-150"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-slate">Rating:</span>
                      <div className="flex ml-2 space-x-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star
                            key={`f-${i}`}
                            size={20}
                            fill="currentColor"
                            stroke="currentColor"
                            className="text-yellow-400"
                          />
                        ))}
                        {Array.from({ length: 5 - r.rating }).map((_, i) => (
                          <Star
                            key={`e-${i}`}
                            size={20}
                            fill="none"
                            stroke="currentColor"
                            className="text-gray-300"
                          />
                        ))}
                      </div>
                    </div>
                    {isReviewOwner(r) && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEdit(r)}
                          className="px-4 py-2 bg-slate text-white rounded-md hover:scale-102 transition-transform duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(r)}
                          className="px-4 py-2 bg-[#b6244f] text-white rounded-md hover:scale-102 transition-transform duration-150"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {r.text && (
                    <p className="mt-3 text-slate break-words">{r.text}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    by {r.userId?.name || "unknown"}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-[#305252] mb-2">
              Delete this review?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => deleteReview(reviewToDelete._id)}
                className="bg-[#b6244f] text-white px-4 py-2 rounded hover:bg-[#a01d43] text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReviewToDelete(null);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
