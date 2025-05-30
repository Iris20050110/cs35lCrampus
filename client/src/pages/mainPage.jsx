import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/searchBar";
import SpotCard from "../components/spotCard";
import NavBar from "../components/navbar";

export default function MainPage() {
  const [spots, setSpots] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchSpots = async (q = "", tag = "") => {
    const { data } = await axios.get(
      `/api/spots?search=${encodeURIComponent(q)}&tag=${encodeURIComponent(
        tag
      )}`
    );
    setSpots(data);
  };

  const fetchUser = async () => {
    const res = await fetch("http://localhost:5000/api/auth/check", {
      credentials: "include",
    });
    const data = await res.json();
    setCurrentUser(data.user);
  };

  useEffect(() => {
    fetchSpots();
    fetchUser();
  }, []);

  return (
    <div className="mx-[0px] pt-[20px] px-[auto] bg-tan min-w-screen min-h-screen">
      <NavBar />
      <header className="flex flex-col sm:flex-row items-center">
        <h1 className="pt-[50px] pb-[15px] m-[0px] font-[yorkmade] text-[#305252] text-center text-[90px]">
          Crampus
        </h1>
        <div className="flex w-full sm:w-auto justify-center pb-[30px]">
          <SearchBar onSearch={fetchSpots} />
        </div>
      </header>
      <main className="px-8 py-6">
        <div className="flex flex-wrap gap-6 justify-center">
          {spots?.map((spot) => (
            <div
              key={spot._id}
              className="m-[12px] p-[18px] rounded-[18px] bg-ash shadow-lg justify-center transition-transform duration-300 hover:scale-103 hover:shadow-2xl"
            >
              <Link to={`/spots/${spot._id}`}>
                <SpotCard spot={spot} currentUser={currentUser} />
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Link
        to="/add"
        className="fixed m-[10px] bg-[#b6244f] hover:scale-110 py-[8px] px-[25px] pb-[10px]
                   rounded-full text-[40px] transition duration-300 ease-in-out z-[50]
                   bottom-[32px] right-[48px] text-white font-bold no-underline"
      >
        +
      </Link>
    </div>
  );
}
