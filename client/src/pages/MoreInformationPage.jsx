import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Review from "../components/Review";
import NewReview from "../components/NewReview";
import AverageRating from "../components/AverageRating";
import { Pencil } from "lucide-react";


export default function MoreInformationPage() {
  const Location = useLocation();
  const navigate = useNavigate();
  const passedSpot = Location.state?.spot ?? null;
  const { id: paramsId } = useParams();
  const spotId = passedSpot?._id || paramsId;

  const [spot, setSpot] = useState(passedSpot);
  const [loading, setLoading] = useState(passedSpot ? false : true);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCount, setReportCount] = useState(passedSpot?.reportCount || 0);
  const [reportError, setReportError] = useState("");


  const [isEditingSpot, setIsEditingSpot] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [editPhoto, setEditPhoto] = useState(null);
  const [editOpenTime, setEditOpenTime] = useState("");
  const [editCloseTime, setEditCloseTime] = useState("");
  const [editIs24Hours, setEditIs24Hours] = useState(false);
  const [editError, setEditError] = useState("");

  const availableTags = [
  "quiet", "coffee", "outdoor", "wifi", "group", "noisy", "24/7",
  "food", "parking", "library", "lab", "outlet", "off-campus", "on-campus"
  ];


  const fetchSpotData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/spots/${spotId}`, {
        withCredentials: true,
      });
      setSpot(res.data);
      setReportCount(res.data.reportCount || 0);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch spot data:", err);
      setError("Failed to load spot information.");
    }
  }, [spotId]);

  const handleReviewAdded = useCallback(async () => {
    try {
      await fetchSpotData();
      setRefreshToken((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to refresh spot data:", err);
    }
  }, [fetchSpotData]);

  const handleReport = async () => {
    try {
      const response = await axios.post(
        `/api/spots/${spotId}/report`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.deleted) {
        navigate("/");
      } else {
        setReportCount(response.data.reportCount);
        await fetchSpotData();
      }
      setReportError("");
    } catch (err) {
      console.error("Failed to report spot:", err);
      setReportError(err.response?.data?.error || "You can only report once");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (passedSpot) {
      setReportCount(passedSpot.reportCount || 0);
      return;
    }

    async function fetchSpot() {
      try {
        setLoading(true);
        await fetchSpotData();
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
  }, [spotId, passedSpot, fetchSpotData]);

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

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviewsArr.length / reviewsPerPage);

  const safePage =
    currentPage > totalPages ? (totalPages > 0 ? totalPages : 1) : currentPage;

  const paginatedReviews = reviewsArr.slice(
    (safePage - 1) * reviewsPerPage,
    safePage * reviewsPerPage
  );

  const handleInlineEditSubmit = async () => {
  try {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("location", editLocation);
    formData.append("description", editDescription);
    formData.append(
      "hours",
      JSON.stringify(
        editIs24Hours
          ? { open: "12:00am", close: "11:59pm" }
          : { open: editOpenTime, close: editCloseTime }
      )
    );
    formData.append("tags", JSON.stringify(editTags));
    if (editPhoto) formData.append("photo", editPhoto);

    await axios.put(`/api/spots/${spotId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    await fetchSpotData();
    setIsEditingSpot(false);
  } catch (err) {
    console.error("Edit failed", err);
    setEditError("Failed to update spot.");
  }
};

  return (
    <div className="w-screen p-8 bg-tan font-[lexend] text-oynx">
      <Link to="/" className="px-4 py-2 bg-slate text-white rounded mb-10">
        &lt; Back
      </Link>
      <div className="flex items-center gap-4 mt-10 mb-5">
        <h1 className="text-4xl font-bold">{name}</h1>
        {currentUser?._id === spot.userId?._id && !isEditingSpot && (
          <Pencil
          onClick={() => {
            setIsEditingSpot(true);
            setEditName(spot.name);
            setEditLocation(spot.location);
            setEditDescription(spot.description);
            setEditTags(spot.tags || []);
            setEditPhoto(null);
            setEditOpenTime(spot.hours?.open || "");
            setEditCloseTime(spot.hours?.close || "");
            setEditIs24Hours(
              spot.hours?.open === "12:00am" && spot.hours?.close === "11:59pm"
            );
          }}
          className="w-5 h-5 text-[#305252] cursor-pointer hover:text-[#1f3938] transition-colors ml-3"
          fill="currentColor"
          stroke="currentColor"
        />
        )}
      </div>

      <div className="flex flex-row items-start gap-8 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xl">
              <AverageRating reviews={reviewsArr} />
            </div>
            <div className="flex flex-col items-end">


              {currentUser && (
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-[#b6244f] text-white rounded-md hover:bg-[#a01d43] transition-colors"
                >
                  Report Spot
                </button>
              )}
              {reportError && (
                <span className="text-amaranth text-sm mt-2">
                  {reportError}
                </span>
              )}
            </div>
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
        
        {isEditingSpot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-[#b2d2c3] p-6 rounded-2xl w-full max-w-2xl mx-4 overflow-auto max-h-[90vh]">
              {/* Edit Form Begins */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-[#305252]">Edit Spot</h2>

                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Name"
                  className="p-2 rounded-md bg-white"
                />
                <input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="Location"
                  className="p-2 rounded-md bg-white"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="p-2 rounded-md bg-white"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Open (e.g. 9:00am)"
                    value={editOpenTime}
                    onChange={(e) => setEditOpenTime(e.target.value)}
                    disabled={editIs24Hours}
                    className="flex-1 p-2 rounded-md bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Close (e.g. 5:00pm)"
                    value={editCloseTime}
                    onChange={(e) => setEditCloseTime(e.target.value)}
                    disabled={editIs24Hours}
                    className="flex-1 p-2 rounded-md bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editIs24Hours}
                    onChange={() => setEditIs24Hours(!editIs24Hours)}
                  />
                  Open 24 Hours
                </label>

                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() =>
                        setEditTags(prev =>
                          prev.includes(tag)
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      className={`px-3 py-1 text-sm rounded-full ${
                        editTags.includes(tag)
                          ? "bg-[#b6244f] text-white"
                          : "bg-slate text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium">Upload new photo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditPhoto(e.target.files[0])}
                    className="block mt-1"
                  />
                </div>

                {editError && <p className="text-red-600 text-sm">{editError}</p>}

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleInlineEditSubmit}
                    className="bg-[#305252] text-white px-4 py-2 rounded hover:bg-[#1f3938]"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingSpot(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              {/* Edit Form Ends */}
            </div>
          </div>
        )}

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
        {reviewsArr.length === 0 || reviewsArr === 0 ? (
          <p className="text-lg italic text-gray-600 mb-6">No reviews yet.</p>
        ) : (
          <div className="mb-6">
            <Review
              key={refreshToken}
              onReviewChanged={handleReviewAdded}
              spotId={spotId}
              currentUser={currentUser}
              reviews={paginatedReviews} //pagination
            />
          </div>
        )}

        {reviewsArr.length > reviewsPerPage && ( /// pagination
          <div className="flex justify-center gap-2 mt-4 mb-8">
            {Array.from({
              length: Math.ceil(reviewsArr.length / reviewsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-[#305252] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        <NewReview spotId={spotId} onReviewAdded={handleReviewAdded} />
      </div>

      {/* report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-[#305252] mb-2">
              Report this spot?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This spot has been reported {reportCount} times. At 5 reports, it
              will be automatically deleted.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  await handleReport();
                  if (!reportError) {
                    setShowReportModal(false);
                  }
                }}
                className="bg-[#b6244f] text-white px-4 py-2 rounded hover:bg-[#a01d43] text-sm"
              >
                Yes, Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
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
