import React from "react";

export default function SpotForm({
  formTitle,
  name, setName,
  location, setLocation,
  description, setDescription,
  openTime, setOpenTime,
  closeTime, setCloseTime,
  is24Hours, setIs24Hours,
  selectedTags, setSelectedTags,
  photo, setPhoto,
  errorMessage, setErrorMessage,
  onSubmit,
}) {
  const availableTags = [
    "quiet", "coffee", "outdoor", "wifi", "group", "noisy", "24/7",
    "food", "parking", "library", "lab", "outlet", "off-campus", "on-campus",
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateFileType = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Invalid file type. Please upload a JPEG, PNG, or GIF image.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFileType(file)) {
      setPhoto(file);
    } else {
      e.target.value = null;
      setPhoto(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h1 className="text-center text-[28px] font-extrabold text-slate mb-6">
        {formTitle}
      </h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
        className="bg-white placeholder:text-gray-600 px-4 py-3 rounded-md text-base focus:outline-none"
      />

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required
        className="bg-white placeholder:text-gray-600 px-4 py-3 rounded-md text-base focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is24hrs"
          checked={is24Hours}
          onChange={(e) => setIs24Hours(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="is24hrs" className="text-base">Open 24 Hours</label>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Open (e.g. 9:00am)"
          value={openTime}
          onChange={(e) => setOpenTime(e.target.value)}
          disabled={is24Hours}
          required={!is24Hours}
          pattern="^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$"
          title="Enter time in format hh:mmam or hh:mmpm (e.g. 9:00am)"
          className="w-1/2 bg-white px-4 py-3 rounded-md text-base"
        />

        <input
          type="text"
          placeholder="Close (e.g. 5:00pm)"
          value={closeTime}
          onChange={(e) => setCloseTime(e.target.value)}
          disabled={is24Hours}
          required={!is24Hours}
          pattern="^(0?[1-9]|1[0-2]):[0-5][0-9](am|pm)$"
          title="Enter time in format hh:mmam or hh:mmpm (e.g. 5:00pm)"
          className="w-1/2 bg-white px-4 py-3 rounded-md text-base"
        />
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        required
        className="bg-white px-4 py-3 rounded-md text-base resize-vertical min-h-[100px]"
      />

      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-[#1a3d3c]">Tags</label>
        <div className="flex flex-wrap gap-2 justify-center">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedTags.includes(tag)
                  ? "bg-[#b6244f] text-white"
                  : "bg-slate text-white hover:bg-[#a5c5b7]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base font-medium text-[#1a3d3c]">
          Photo <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileChange}
          required
          className="text-base p-2 rounded-md"
        />


        {photo && (
            <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="mt-2 rounded-md object-contain max-h-64 w-full"
            />
            )}
        
        {errorMessage && (
          <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
        )}
      </div>

      <button
        type="submit"
        className="bg-[#305252] hover:bg-[#1f3938] text-white px-4 py-3 rounded-md transition text-base font-medium mt-4"
      >
        Save Spot
      </button>
    </form>
  );
}
