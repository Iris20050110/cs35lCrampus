import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include' // for cookies?
      });
      const data = await response.json();
      
      if (data.isAuthenticated) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="p-[32px] mx-auto bg-tan min-w-screen min-h-screen flex flex-col">
      <NavBar />

      {/* Sign in with Google */}
      <div className="flex-1 flex justify-center items-center">
        <button
          onClick={handleGoogleLogin}
          className="bg-slate text-white px-[16px] py-[8px] rounded"
        >
          Sign in with Google
        </button>
      </div>

    </div>
  );
};

export default LoginPage;