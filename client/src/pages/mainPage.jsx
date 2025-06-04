import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../components/searchBar";
import SpotCard from "../components/SpotCard";
import NavBar from "../components/navbar";

export default function MainPage() {
  const [spots, setSpots] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSpots = async (q = "", tags = []) => {
    try {
      const tagsParam = Array.isArray(tags) ? tags.join(",") : tags;
      const { data } = await axios.get(
        `http://localhost:5000/api/spots?search=${encodeURIComponent(
          q
        )}&tag=${encodeURIComponent(tagsParam)}`,
        { withCredentials: true }
      );
      setSpots(data);
    } catch (error) {
      console.error("Error fetching spots:", error);
      setSpots([]);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/check", {
        withCredentials: true,
      });
      setCurrentUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchSpots(), fetchUser()]);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Filter spots based on availability
  const filteredSpots = showAvailableOnly
    ? spots.filter((spot) => {
        const hours = spot.hours || {};
        if (!hours.open || !hours.close) return false;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const parseTime = (timeStr) => {
          const match = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)/i);
          if (!match) return null;

          let [_, h, m, period] = match;
          h = parseInt(h, 10);
          m = m ? parseInt(m, 10) : 0;

          if (period.toLowerCase() === "pm" && h < 12) {
            h += 12;
          }
          if (period.toLowerCase() === "am" && h === 12) {
            h = 0;
          }

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
      })
    : spots;

  return (
    <div className="mx-[0px] pt-[20px] px-[auto] bg-tan min-w-screen min-h-screen">
      <NavBar />
      <header className="flex flex-col sm:flex-row items-center">
        <h1 className="pt-[50px] pb-[15px] m-[0px] font-[yorkmade] text-[#305252] text-center text-[90px]">
          Crampus
        </h1>
        <div className="flex flex-col w-full sm:w-auto items-center pb-[30px] gap-2">
          <SearchBar onSearch={fetchSpots} />
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
              />
              <div className="w-14 h-7 bg-gray-200 rounded-[10px] peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-[12px] after:h-6 after:w-4  after:transition-all peer-checked:bg-[#305252]"></div>
              <span className="ml-2 text-sm font-medium text-[#305252]">
                Show Available Only
              </span>
            </label>
          </div>
        </div>
      </header>
      <main className="px-8 py-6">
        {isLoading ? (
          <div className="text-center text-[#305252] text-xl">Loading...</div>
        ) : filteredSpots.length === 0 ? (
          <div className="text-center text-[#305252] text-xl">
            No spots found
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredSpots?.map((spot) => (
              <div
                key={spot._id}
                className="m-[12px] p-[18px] rounded-[18px] bg-ash shadow-lg justify-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Link key={spot._id} to={`/spots/${spot._id}`} state={{ spot }}>
                  <SpotCard spot={spot} currentUser={currentUser} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Link
        to="/add"
        className="fixed m-[10px] bg-[#b6244f] hover:scale-110 py-[8px] px-[25px] pb-[10px]
                   rounded-full text-[40px] transition duration-300 ease-in-out z-[50]
                   bottom-[32px] right-[48px] text-white font-bold no-underline hover:text-white"
      >
        +
      </Link>
    </div>
  );
}
