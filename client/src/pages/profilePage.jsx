import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";
import LoginRequired from "../components/LoginRequired";

const ProfilePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth({
    redirectIfUnauth: false,
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPicture, setNewPicture] = useState(null);

  const backColor = "#FCEFE6";
  const textColor = "#305252";
  const accentColor = "#B2D2C3";
  const darkColor = "#373E40";
  const buttonColor = "#B6244F";

  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("http://localhost:5000/api/auth/check", { withCredentials: true })
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.error(
            "Error fetching user:",
            err.response ? err.response.data : err.message
          );
          setError(true);
        });
    }
  }, [isAuthenticated]);

  const handleUpdate = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user._id);
    if (newName) formData.append("name", newName);
    if (newEmail) formData.append("email", newEmail);
    if (newPassword) formData.append("password", newPassword);
    if (newPicture) formData.append("picture", newPicture);

    try {
      await axios.put("http://localhost:5000/api/auth/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated!");
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  if (authLoading)
    return (
      <div style={{ padding: "2rem", color: textColor }}>
        Checking authentication...
      </div>
    );

  if (!isAuthenticated || error) {
    return (
      <LoginRequired message="You must be signed in with a UCLA email to view your profile." />
    );
  }

  if (!user)
    return (
      <div style={{ padding: "2rem", color: textColor }}>
        Loading profile...
      </div>
    );

  return (
    <div
      style={{
        backgroundColor: backColor,
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", position: "sticky", top: 20, zIndex: 10 }}>
        <NavBar />
      </div>
      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          backgroundColor: accentColor,
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        <h1
          style={{
            color: textColor,
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {user.name}'s Profile
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <img
            src={user.picture || "/default-profile.png"}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "1.5rem",
            }}
          />
          <div>
            <p style={{ margin: "0.5rem 0", color: darkColor }}>
              <strong>Name:</strong> {user.name}
            </p>
            <p style={{ margin: "0.5rem 0", color: darkColor }}>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>

        {editing ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="New Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="email"
              placeholder="New Email (optional)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="file"
              onChange={(e) => setNewPicture(e.target.files[0])}
              style={{}}
            />
            <div>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: buttonColor,
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  backgroundColor: darkColor,
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{
              backgroundColor: buttonColor,
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              display: "block",
              margin: "0 auto",
            }}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
