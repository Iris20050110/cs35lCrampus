import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

const LoginPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    checkAuthStatus()
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/check", {
        credentials: "include", // for cookies?
      });
      const data = await response.json()

      if (data.isAuthenticated) {
        navigate("/")
      }
    } catch (err) {
      console.error("Error checking auth status:", err)
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self")
  };

  return (
    <div className="p-[32px] mx-auto bg-tan min-w-screen min-h-screen flex font-[lexend] flex-col">
      <NavBar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="bg-ash p-6 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-[#305252] mb-4">
          UCLA Login Required
        </h2>
        <p className="text-gray-700 mb-6">You must be signed in with a UCLA email.</p>
        <button
                onClick={handleGoogleLogin}
                className="bg-slate text-white px-[16px] py-[8px] rounded">
                Sign in with Google
        </button>
      </div>
  </div>
</div>
  );
};

export default LoginPage;
