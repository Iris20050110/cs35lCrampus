// import React from 'react';
// import {useState} from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   //handleSubmit - async (e)
//   // e.preventDefault whe

//   const handleSubmit = async(e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('http://localhost:5050/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         alert('Login successful!');
//         window.location.href = '/';
//       } else {
//         alert(data.message || 'Login failed.');
//       }
//     } catch (err) {
//       console.error('Error logging in:', err);
//       alert('Something went wrong.');
//     }
//   };
  
//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }

// export default LoginPage;


// import React, { useState } from 'react';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch('http://localhost:5050/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         localStorage.setItem('token', data.token);
//         alert('Login successful!');
//         window.location.href = '/';
//       } else {
//         alert(data.message || 'Login failed.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Something went wrong.');
//     }
//   };

//   return (
//     <div>loginPage</div>
//   )
// }

// export default LoginPage


import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5050/api/auth/login', {
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
        console.error("Login error:", err); // 👈 Show full error
        alert(`Something went wrong: ${err.message}`); // 👈 Show detail in alert
      }
  };


return (
  <div>
    <h2>Login</h2>
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
    </form>

    {/* 👇 Add this */}
    <p style={{ marginTop: "10px" }}>
      Don’t have an account?{" "}
      <Link to="/signup" style={{ color: "#0077cc", textDecoration: "underline" }}>
        Sign up here
      </Link>
    </p>
  </div>
);

};

export default LoginPage;