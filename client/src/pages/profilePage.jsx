import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/navbar';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const backColor = '#FFE4D4';
  const textColor = '#305252';
  const accentColor = '#B2D2C3';
  const darkColor = '#373E40';
  const buttonColor = '#B6244F';

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/${id}`)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Error fetching user:", err.response ? err.response.data : err.message);
        setError(true);
    });
  }, [id]);

  if (error) {
    return (
      <div style={{ backgroundColor: backColor, height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', color: textColor }}>
        <div style={{ width: '100%', position: 'sticky', top: 20, zIndex: 10 }}>
          <NavBar />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Oops! You're not logged in.</h1>
          <button 
            onClick={() => navigate('/login')} 
            style={{ backgroundColor: buttonColor, color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem' }}>
            Log in here
          </button>
        </div>
      </div>
    );
  }

  if (!user) return <div style={{ padding: '2rem', color: textColor }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: backColor, minHeight: '100vh' }}>
      <div style={{ width: '100%', position: 'sticky', top: 20, zIndex: 10 }}>
        <NavBar />
      </div>
      <div style={{ maxWidth: '800px', margin: '2rem auto', backgroundColor: accentColor, borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h1 style={{ color: textColor, fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>{user.name}'s Profile</h1>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: darkColor, marginRight: '1.5rem' }}></div>
          <div>
            <p style={{ margin: '0.5rem 0', color: darkColor }}><strong>Name:</strong> {user.name}</p>
            <p style={{ margin: '0.5rem 0', color: darkColor }}><strong>Email:</strong> {user.email}</p>
          </div>
        </div>

        <button style={{ backgroundColor: buttonColor, color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', display: 'block', margin: '0 auto' }}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;