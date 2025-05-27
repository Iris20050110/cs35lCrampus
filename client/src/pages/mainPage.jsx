import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/searchBar";
import SpotCard from "../components/spotCard";
import NavBar from "../components/navbar";

export default function MainPage() {
  const [spots, setSpots] = useState([]);

  const fetchSpots = async (q = "", tag = "") => {
    const { data } = await axios.get(
      `/api/spots?search=${encodeURIComponent(q)}&tag=${encodeURIComponent(
        tag
      )}`
    );
    setSpots(data);
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  return (
    <div className=" mx-[0px] pt-[20px] px-[auto] bg-tan min-w-screen min-h-screen">
      <NavBar />
      {/* 1) HEADER */}
      <header
        className="
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

        <div className="flex w-full sm:w-auto justify-center pb-[30px]">
          <SearchBar onSearch={fetchSpots} />
        </div>
      </header>
      {/* 2) GRID */}
      <main className="px-8 py-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {spots?.map((spot) => (
            <div className="m-[12px] p-[18px] rounded-[18px] bg-ash shadow-lg justify-center">
              <SpotCard key={spot._id} spot={spot} />
            </div>
          ))}
        </div>
      </main>

      <Link
        to="/add"
        className="
    fixed m-[16px] 
    bg-[#b6244f]
    hover:scale-110
    py-[8px]
    px-[20px]
    rounded-full
    text-[30px]
    transition duration-300 ease-in-out z-[50]
    bottom-[32px] right-[48px]
    text-white
    font-bold
    no-underline
    focus:outline-none focus:ring-0
    hover:text-white focus:text-white active:text-white visited:text-white
  "
      >
        +
      </Link>
    </div>
  );
}
