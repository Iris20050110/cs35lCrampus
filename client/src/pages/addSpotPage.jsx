import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";

export default function AddSpotPage() {
  const { loading, isAuthenticated } = useAuth({ redirectIfUnauth: false }); // 🛑 don't auto-redirect
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-[#fdfcf9]">
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
    <div className="p-[32px] mx-auto min-w-screen min-h-screen">
      <NavBar />
      <h1 className="text-[24px] font-bold mb-[16px]">Add a Study Spot</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-[12px] py-[8px] rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-[12px] py-[8px] rounded"
        />
        <div className="flex items-center gap-[8px]">
          <input
            type="checkbox"
            id="24hrs"
            checked={is24Hours}
            onChange={(e) => setIs24Hours(e.target.checked)}
            className="w-[16px] h-[16px]"
          />
          <label htmlFor="24hrs" className="text-[14px]">
            Open 24 Hours
          </label>
        </div>
        <div className="flex gap-[8px]">
          <input
            type="text"
            placeholder="Open (e.g. 9:00am)"
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            disabled={is24Hours}
            className="border px-[12px] py-[8px] rounded w-1/2 bg-white disabled:bg-gray-100"
          />
          <input
            type="text"
            placeholder="Close (e.g. 5:00pm)"
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            disabled={is24Hours}
            className="border px-[12px] py-[8px] rounded w-1/2 bg-white disabled:bg-gray-100"
          />
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-[12px] py-[8px] rounded"
          rows={3}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border px-[12px] py-[8px] rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="border px-[12px] py-[8px] rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-[16px] py-[8px] rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
}
