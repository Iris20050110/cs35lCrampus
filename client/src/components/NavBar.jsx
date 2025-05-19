// components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/add", label: "Add Spot" },
    { path: "/assignments", label: "Assignments" },
    { path: "/profile", label: "Profile" },
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="bg-[#b2d2c3] text-[#3d6969] px-6 py-3 flex justify-center gap-[24px] shadow-md rounded-[10px]">
      {navItems.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={`text-[16px] px-[5px] py-[10px] rounded-md transition duration-200 hover:bg-[#3d6969] ${
            isActive(path) ? "bg-tan font-semibold" : ""
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
