import { useState, useEffect, useRef } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const searchRef = useRef(null);
  const tagInputRef = useRef(null);
  const tagDropdownRef = useRef(null);

  const availableTags = [
    "quiet",
    "coffee",
    "outdoor",
    "wifi",
    "group",
    "noisy",
    "24/7",
    "food",
    "parking",
    "library",
    "lab",
    "outlet",
  ];

  // Filter tag suggestions based on input
  useEffect(() => {
    if (!tagInput.trim()) {
      setTagSuggestions(availableTags);
    } else {
      const filtered = availableTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !selectedTags.includes(tag)
      );
      setTagSuggestions(filtered);
    }
  }, [tagInput, selectedTags]);

  // Search suggestions - simulating API call to find locations matching the query
  useEffect(() => {
    if (!query.trim()) return setSuggestions([]);

    const delayDebounce = setTimeout(() => {
      const fetchSuggestions = async () => {
        try {
          const res = await fetch(
            `/api/spots/suggestions?q=${encodeURIComponent(query)}`
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (err) {
          console.error("Failed to fetch suggestions:", err);
        }
      };
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Add tag to selected tags
  const addTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput("");
    setShowTagDropdown(false);
    tagInputRef.current?.focus();
  };

  // Remove tag from selected tags
  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle search submission
  const handleSubmit = () => {
    onSearch(query, selectedTags);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(event.target) &&
        tagInputRef.current &&
        !tagInputRef.current.contains(event.target)
      ) {
        setShowTagDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Key event handling for search input
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-[center] font-[lexend]">
      <div className="flex items-center justify-[center] w-full">
        {/* Search Bar Container */}
        <div className="relative flex items-center bg-[#b2d2c3] rounded-[16px] p-[6px] w-full border-none">
          {/* Search Input */}
          <div className="flex-grow relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search locations..."
              className="w-full bg-[#0000] font[lexend] px-[12px] border-none focus:outline-none focus:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
            />

            {/* Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-3 bg-[#FFFF] rounded-[5px] text-left px-[9px] w-full p-[3px] max-h-[5] overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className=""
                    onClick={() => {
                      setQuery(suggestion);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tag Input Container */}
          <div className="relative px-2" ref={tagDropdownRef}>
            {/* Tag Input with Selected Tags Inside */}
            <div className="bg-[#D4DEDB] rounded-[5px] px-[5px] py-[5px] m-[5px] flex flex-wrap items-center gap-1">
              {/* Selected Tags - displayed inside the input */}
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-[#b6244f] text-[#FFFF] px-[5px] py-1 rounded-full text-[12px] group hover:bg-teal-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full h-[20px] bg-[#b6244f] text-[#FFFF] flex items-center justify-center hover:bg-teal-800 border-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
              
              {/* Tag Input */}
              <input
                ref={tagInputRef}
                type="text"
                placeholder="Add tags..."
                className="bg-[#0000] border-none focus:outline-none text-[12px] flex-grow min-w-20"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onFocus={() => setShowTagDropdown(true)}
                autoComplete="off"
              />
            </div>

            {/* Tag Suggestions Dropdown */}
            {showTagDropdown && tagSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-[#FFFF] border-none rounded-[8px] px-[9px] mt-1 right-0 max-h-5 overflow-auto">
                {tagSuggestions
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                      onClick={() => addTag(tag)}
                    >
                      {tag}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className=" text-[15px] bg-[#305252] text-[#FFFF] px-[10px] py-[6px] rounded-full border-none"
          >
            ⌕
          </button>
        </div>
      </div>
    </div>
  );
}