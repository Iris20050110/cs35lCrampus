import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check", {
          credentials: "include",
        });
        const data = await res.json();
        setIsLoggedIn(data.isAuthenticated);
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
    { path: "/profile", label: "Profile" },
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
      <nav className="bg-[#b2d2c3] text-[#3d6969] mx-[100px] px-[6px] py-[3px] flex justify-center gap-[24px] shadow-md rounded-[10px] position-fixed">
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

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-[16px] px-[5px] py-[10px] rounded-md bg-[#a3c1b4] hover:bg-[#8eab9e] font-[lexend] text-[#242526]"
          >
            Logout
          </button>
        )}
      </nav>

      {showPopup && (
        <div className=" fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
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
