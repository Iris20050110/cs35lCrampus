import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";

export default function AddSpotPage() {
  const { loading, isAuthenticated } = useAuth({ redirectIfUnauth: false });
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [is24Hours, setIs24Hours] = useState(false);
  const [tags, setTags] = useState("");
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

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
    formData.append(
      "tags",
      JSON.stringify(
        tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
    if (photo) formData.append("photo", photo);

    await axios.post("/api/spots", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/");
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
      <div className="min-h-screen bg-[#fef6ee] flex flex-col items-center justify-center text-center p-8">
        <NavBar />
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mt-6">
          <h2 className="text-2xl font-semibold text-[#305252] mb-4">
            UCLA Login Required
          </h2>
          <p className="text-gray-700 mb-6">
            You must be signed in with a UCLA email to add a study spot.
          </p>
          <a
            href="http://localhost:5000/api/auth/google"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Sign in with Google
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#fef6ee] flex flex-col overflow-auto">
      <NavBar />
      <div className="flex-1 flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-center text-[28px] font-extrabold text-[#1a3d3c] mb-6">
            Add a Study Spot
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md text-base"
              required
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md text-base"
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
                className="w-1/2 bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md disabled:opacity-60 text-base"
              />
              <input
                type="text"
                placeholder="Close (e.g. 5:00pm)"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                disabled={is24Hours}
                className="w-1/2 bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md disabled:opacity-60 text-base"
              />
            </div>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md text-base resize-vertical min-h-[100px]"
            />

            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-[#bfd9cd] placeholder:text-gray-600 px-4 py-3 rounded-md text-base"
            />

            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#1a3d3c]">
                Photo (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="text-base p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="bg-[#305252] hover:bg-[#1f3938] text-white px-4 py-3 rounded-md transition text-base font-medium mt-4"
            >
              Save Spot
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
