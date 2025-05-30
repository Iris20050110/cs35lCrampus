import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/check', {
        credentials: 'include' // Important for cookies
      });
      const data = await response.json();
      
      if (data.isAuthenticated) {
        navigate('/');
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        navigate('/');
      } else {
        alert(data.message || 'Login failed.');
      }
    } 
    catch (err) {
        console.error("Login error:", err); 
        alert(`Something went wrong: ${err.message}`); 
      }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  return (
    <div className="p-[32px] mx-auto min-w-screen min-h-screen">
      <NavBar />
      {/*<h1 className="text-[24px] font-bold mb-[16px]">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>*/}

      {/* Sign in with Google */}
      <div className="mt-[16px]">
        <button
          onClick={handleGoogleLogin}
          className="bg-[#4285F4] text-white px-[16px] py-[8px] rounded"
        >
          Sign in with Google
        </button>
      </div>

      {/*<p className="mt-[16px]">
        Don't have an account?{" "}
        <Link to="/signup" className="text-[#0077cc] underline">
          Sign up here
        </Link>
      </p>*/}
    </div>
  );
};

export default LoginPage;