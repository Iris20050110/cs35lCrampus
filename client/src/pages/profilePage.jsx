import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const backColor = '#FFE4D4';
  const textColor = '#305252';
  const accentColor1 = '#B2D2C3';

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/${id}`)
      .then(res => setUser(res.data))
      .catch(err => console.error("Error fetching user:", err));
  }, [id]);

  if (!user) return <div style={{ padding: '2rem', color: textColor }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: backColor, minHeight: '100vh', minWidth: '100vw', padding: '1.5rem' }}>
      <h1 style={{ color: textColor, textAlign: 'center' }}>{user.name}'s Profile</h1>
      <div style={{ backgroundColor: accentColor1, padding: '1.5rem', borderRadius: '10px', maxWidth: '400px', margin: '2rem auto', boxShadow: '0 4px 8px rgba(0,0,0,0,.1)' }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* You can add more fields here later like profile image etc. */}
      </div>
    </div>
  );
};

export default ProfilePage;
