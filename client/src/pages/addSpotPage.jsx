import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";
import LoginRequired from "../components/LoginRequired";

export default function AddSpotPage() {
  const { loading, isAuthenticated } = useAuth({ redirectIfUnauth: false });
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [is24Hours, setIs24Hours] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const availableTags = [
    "quiet",
    "coffee",
    "outdoor",
    "wifi",
    "group",
    "noisy",
    "24/7",
    "food",
    "parking",
    "library",
    "lab",
    "outlet",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file type. Please upload a JPEG, PNG, or GIF image."
      );
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFileType(file)) {
      setPhoto(file);
    } else {
      e.target.value = null; // Reset the input
      setPhoto(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append(
      "hours",
      JSON.stringify(
        is24Hours
          ? { open: "12:00am", close: "11:59pm" }
          : { open: openTime, close: closeTime }
      )
    );
    formData.append("tags", JSON.stringify(selectedTags));
    if (photo) formData.append("photo", photo);

    try {
      await axios.post("/api/spots", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to create spot. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Checking sign-in status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginRequired message="You must be signed in with a UCLA email to add a study spot." />
    );
  }

  return (
    <div className="pt-5 h-screen w-screen bg-tan flex flex-col overflow-auto font-[lexend]">
      <NavBar />
      <div className="flex-1 flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-4xl bg-ash rounded-2xl shadow-lg p-8">
          <h1 className="text-center text-[28px] font-extrabold text-slate mb-6">
            Add a Study Spot
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="bg-white placeholder:text-gray-600 px-4 py-3 rounded-md text-base focus:outline-none focus:ring-0"
            />

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              required
              className="bg-white placeholder:text-gray-600 px-4 py-3 rounded-md text-base focus:outline-none focus:ring-0 focus:border-[#75767B]"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is24hrs"
                checked={is24Hours}
                onChange={(e) => setIs24Hours(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="is24hrs" className="text-base">
                Open 24 Hours
              </label>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Open (e.g. 9:00am)"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                disabled={is24Hours}
                required={!is24Hours}
                pattern="^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$"
                title="Enter time in format hh:mmam or hh:mmpm (e.g. 9:00am)"
                className="w-1/2 bg-white placeholder:text-gray-600 px-4 py-3 rounded-md disabled:opacity-60 text-base focus:outline-none focus:ring-0 focus:border-[#75767B]"
              />

              <input
                type="text"
                placeholder="Close (e.g. 5:00pm)"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                disabled={is24Hours}
                required={!is24Hours}
                pattern="^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$"
                title="Enter time in format hh:mmam or hh:mmpm (e.g. 5:00pm)"
                className="w-1/2 bg-white placeholder:text-gray-600 px-4 py-3 rounded-md disabled:opacity-60 text-base focus:outline-none focus:ring-0 focus:border-[#75767B]"
              />
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="bg-white placeholder:text-gray-600 px-4 py-3 rounded-md text-base resize-vertical min-h-[100px] focus:outline-none focus:ring-0 focus:border-[#75767B]"
            />

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#1a3d3c]">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 justify-center">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[#b6244f] text-white"
                        : "bg-slate text-white hover:bg-[#a5c5b7]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#1a3d3c]">
                Photo <span className="text-red-600">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                required
                className="text-base p-2 rounded-md focus:outline-none focus:ring-0 focus:border-[#75767B]"
              />
              {errorMessage && (
                <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#305252] hover:bg-[#1f3938] text-white px-4 py-3 rounded-md transition text-base font-medium mt-4"
            >
              Save Spot
            </button>
          </form>

          {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-[#bfd9cd] text-slate rounded-2xl p-8 max-w-md w-full font-[lexend]">
                <h2 className="text-xl font-bold mb-4">Heads up!</h2>
                <p className="text-base mb-6">
                  You can only delete this spot during your current session. Do
                  you still want to create it?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitForm}
                    className="bg-[#305252] hover:bg-[#1f3938] text-white px-4 py-2 rounded-md transition focus:outline-none"
                  >
                    Yes, Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
