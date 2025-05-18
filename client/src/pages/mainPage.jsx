import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import SpotCard from "../components/SpotCard";
import "../index.css";

export default function MainPage() {
  const [spots, setSpots] = useState([]);

  const fetchSpots = async (q = "") => {
    const { data } = await axios.get(
      `/api/spots?search=${encodeURIComponent(q)}`
    );
    console.log("📬 fetched spots payload:", data);
    setSpots(data);
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  return (
    <div className="min-h-screen bg-[#ffe4d4]">
      {/* 1) HEADER */}
      <header
        className="
        sticky top-0   /* stick to top when you scroll */
        bg-[#ffe4d4]   /* same background so no seam */
        z-10           /* stay above cards */
        px-8 py-4      /* padding around */
        flex flex-col sm:flex-row 
        items-center justify-between
        gap-4
      "
      >
        <h1
          className="
          font-Calibri // not working?
          text-4xl sm:text-5xl 
          text-[#1F3A4B] 
          text-center sm:text-left
        "
        >
          Study Spots at UCLA
        </h1>
        <div className="flex w-full sm:w-auto">
          <SearchBar onSearch={fetchSpots} />
        </div>
      </header>

      {/* 2) GRID */}
      <main className="px-8 py-6">
        <div
          className="
          grid 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
          gap-6
        "
        >
          {spots?.map((spot) => (
            <SpotCard key={spot._id} spot={spot} />
          ))}
        </div>
      </main>
    </div>
  );
}
