import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/navbar";
import useAuth from "../hooks/useAuth";
import LoginRequired from "../components/LoginRequired";
import SpotForm from "../components/SpotForm"; //added

export default function AddSpotPage() {
  const { loading, isAuthenticated } = useAuth({ redirectIfUnauth: false });
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [is24Hours, setIs24Hours] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("location", location);
    formData.append("description", description);
    formData.append(
      "hours",
      JSON.stringify(
        is24Hours
          ? { open: "12:00am", close: "11:59pm" }
          : { open: openTime, close: closeTime }
      )
    );
    formData.append("tags", JSON.stringify(selectedTags));
    if (photo) formData.append("photo", photo);

    try {
      await axios.post("/api/spots", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Failed to create spot. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Checking sign-in status...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginRequired message="You must be signed in with a UCLA email to add a study spot." />
    );
  }

  return (
    <div className="pt-5 h-screen w-screen bg-tan flex flex-col overflow-auto font-[lexend]">
      <NavBar />
      <div className="flex-1 flex justify-center items-start px-4 py-8">
        <div className="w-full max-w-4xl bg-ash rounded-2xl shadow-lg p-8">
          <SpotForm
            formTitle="Add a Study Spot"
            name={name}
            setName={setName}
            location={location}
            setLocation={setLocation}
            description={description}
            setDescription={setDescription}
            openTime={openTime}
            setOpenTime={setOpenTime}
            closeTime={closeTime}
            setCloseTime={setCloseTime}
            is24Hours={is24Hours}
            setIs24Hours={setIs24Hours}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            photo={photo}
            setPhoto={setPhoto}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            onSubmit={handleSubmit}
          />
          
        </div>
      </div>
    </div>
  );

  
}