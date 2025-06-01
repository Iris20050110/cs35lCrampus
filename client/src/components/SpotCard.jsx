import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Star } from "lucide-react";
import AverageRating from "./AverageRating";

export default function SpotCard({ spot, currentUser }) {
  const {
    name,
    photoFileId,
    hours = {},
    tags = [],
    rating = 0,
    reviews: reviewsArr = [], 
    location = "",
    userId,
    _id,
  } = spot;

  const [showModal, setShowModal] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()
  const reviewCount = Array.isArray(reviewsArr) ? reviewsArr.length : reviewsArr

  const isCurrentlyOpen = () => {
    if (!hours?.open || !hours?.close) return false
    try {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()

      const parseTime = (timeStr) => {
        const match = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
        if (!match) return null

        let [_, h, m, period] = match;
        h = parseInt(h, 10);
        m = m ? parseInt(m, 10) : 0;
        if (period.toLowerCase() === "pm" && h < 12) h += 12;
        if (period.toLowerCase() === "am" && h === 12) h = 0;

        return { hours: h, minutes: m };
      };

      const openTime = parseTime(hours.open);
      const closeTime = parseTime(hours.close);
      if (!openTime || !closeTime) return false;

      const nowMins = currentHour * 60 + currentMinute;
      const openMins = openTime.hours * 60 + openTime.minutes;
      const closeMins = closeTime.hours * 60 + closeTime.minutes;

      return openMins <= closeMins
        ? nowMins >= openMins && nowMins <= closeMins
        : nowMins >= openMins || nowMins <= closeMins;
    } catch {
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/spots/${_id}`, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete spot.");
    }
  };

  return (
    <div className="w-full font-[lexend] relative">
      <div className="relative">
        {imageLoading && photoFileId && (
          <div className="absolute inset-0 bg-[#bfd9cd] animate-pulse rounded-[13px] flex items-center justify-center">
            <span className="text-[#305252]">Loading...</span>
          </div>
        )}
        <img
          src={photoFileId ? `/api/spots/image/${photoFileId}` : ""}
          alt={name}
          className="h-[275px] w-full object-cover rounded-[13px]"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          style={{ display: imageError ? "none" : "block" }}
        />
        {imageError && (
          <div className="h-[275px] w-full bg-[#bfd9cd] rounded-[13px] flex items-center justify-center">
            <span className="text-[#305252]">Failed to load image</span>
          </div>
        )}
        <Link to={`/spots/${_id}`}>
          <h3 className="ml-[6px] text-[24px] font-extrabold text-[#1a3d3c] drop-shadow-sm tracking-wide mb-[4px] mt-[4px]">
            {name}
          </h3>
        </Link>

        {}
        {currentUser && currentUser._id === userId && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowModal(true);
            }}
            className="absolute top-3 right-3 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 shadow-md transition focus:outline-none focus:ring-0"
            aria-label="Delete Spot"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        )}
      </div>

      <p className="ml-[6px] text-[14px] text-[#4d4d4d] italic my-[2px]">
        {typeof location === "string"
          ? location
          : location?.address || "No address provided"}
      </p>

      <p className="ml-[6px] text-[17px] my-[5px] text-[#305252]">
        {hours?.open === "12:00am" && hours?.close === "11:59pm"
          ? "Open 24 Hours"
          : hours?.open && hours?.close
          ? `Open ${hours.open} – ${hours.close}`
          : "Hours not available"}
      </p>

      <div className="flex flex-wrap my-[5px] justify-center">
        {hours?.open &&
          hours?.close &&
          (isCurrentlyOpen() ? (
            <span className="text-[15px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#305252] text-white">
              Available
            </span>
          ) : (
            <span className="text-[13px] px-[9px] py-[4px] m-[4px] rounded-full bg-[#A9A9A9] text-white">
              NOT AVAILABLE
            </span>
          ))}

        {tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] px-[8px] py-[9px] m-[2px] rounded-[14px] bg-[#b6244f] text-[#DDDD]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1 text-[14px] mt-[5px] pt-[5px] ml-[5px]">
        <span className="text-[#333]">
            <AverageRating reviews={reviewsArr} size={20} />
        </span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-40 flex items-center justify-center rounded-[13px]">
          <div className="bg-white rounded-xl shadow-lg p-5 w-[95%] text-center animate-scaleIn">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete this spot?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>
            <div className="flex flex-col gap-2 outline-none">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModal(false);
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
