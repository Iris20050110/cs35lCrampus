import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/searchBar";
import SpotCard from "../components/spotCard";
import NavBar from "../components/navbar";

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
    <div className="min-h-screen">
      <NavBar />
      {/* 1) HEADER */}
      <header
        className="
        sticky top-0
        flex flex-col sm:flex-row 
        items-center
      "
      >
        <h1
          className="
        pt-[50px]
        pb-[15px]
        m-[0px]           
        font-[yorkmade] 
        text-[#305252]
        text-center
        text-[75px]"
        >
          Crampus
        </h1>

        <div className="flex w-full sm:w-auto">
          <SearchBar onSearch={fetchSpots} />
        </div>
      </header>
      {/* 2) GRID */}
      <main className="px-8 py-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {spots?.map((spot) => (
            <div className="m-[12px] p-[18px] rounded-[18px] bg-ash shadow-lg">
              <SpotCard key={spot._id} spot={spot} />
            </div>
          ))}
        </div>
      </main>

      <Link
        to="/add"
        className="
        text-[#FFFF]
        fixed bottom-6 right-6 
        w-16 h-16 
        bg-amaranth hover:bg-amaranth/90 
        rounded-full flex items-center justify-center 
        text-[30px] text-white shadow-lg 
        transition duration-300 ease-in-out z-50"
      >
        +
      </Link>
    </div>
  );
}
