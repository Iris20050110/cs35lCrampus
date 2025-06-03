import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();
        setIsLoggedIn(data.isAuthenticated);
        setUser(data.user || null);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/add", label: "Add Spot" },
    { path: "/todos", label: "Assignments" },
    ...(isLoggedIn ? [] : [{ path: "/login", label: "Login" }]),
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPopupMessage("Logged out successfully");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/login");
        }, 900);
      } else {
        setPopupMessage("Logout failed.");
        setShowPopup(true);
      }
    } catch (err) {
      console.error("Logout error:", err);
      setPopupMessage("Something went wrong.");
      setShowPopup(true);
    }
  };

  return (
    <>
      <nav className="bg-[#b2d2c3] text-[#3d6969] mx-[100px] px-[6px] py-[3px] flex items-center shadow-md rounded-[10px]">
        {/* nav links */}
        <div className="flex flex-1 justify-center gap-[24px]">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-[16px] px-[5px] py-[10px] rounded-md transition duration-200 no-underline font-[lexend] 
              ${isActive(path) ? "bg-tan font-semibold" : "hover:bg-[#3d6969]"} 
              text-[#242526] visited:text-[#242526] focus:text-[#242526]`}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="relative ml-[14px]" ref={dropdownRef}>
          {user && (user.picture || user.pictureId) && (
            <img
              src={
                user.pictureId
                  ? `http://localhost:5000/api/auth/profile-image/${user.pictureId}`
                  : user.picture
                  ? user.picture
                  : "/default-profile.png"
              }
              alt="Profile"
              className="w-[40px] h-[40px] rounded-full cursor-pointer border border-[#3d6969]"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onError={(e) => {
                console.error("Error loading navbar profile image:", e);
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = user.picture || "/default-profile.png";
              }}
            />
          )}

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#b2d2c3] border border-[#3d6969] shadow-md rounded-xl py-2 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-[#3d6969] hover:bg-[#a5c5b7] transition"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-[#3d6969] hover:bg-[#a5c5b7] transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* logout popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm w-full mx-4">
            <p className="text-lg text-[#305252] font-semibold">
              {popupMessage}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 bg-[#305252] text-white rounded hover:bg-[#203534] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
