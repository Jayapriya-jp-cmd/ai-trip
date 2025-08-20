import React, { useState } from "react";
import AsyncSelect from "react-select/async";

const OpenStreetAutocomplete = ({ onPlaceChange }) => {
  const [selectedOption, setSelectedOption] = useState(null); // 🟢 Track selection

  const fetchOptions = async (inputValue) => {
    if (!inputValue) return [];

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
    );
    const data = await response.json();

    return data.map((place) => ({
      label: place.display_name,
      value: {
        lat: place.lat,
        lon: place.lon,
        id: place.place_id,
        details: place,
      },
    }));
  };

  const handleChange = (selected) => {
    console.log("Selected place details:", selected);
    setSelectedOption(selected); // 🟢 Update local state
    onPlaceChange(selected);     // 🟢 Pass to parent
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={fetchOptions}
      defaultOptions
      placeholder="Type a location"
      value={selectedOption}     // ✅ IMPORTANT
      onChange={handleChange}
    />
  );
};

export default OpenStreetAutocomplete;
