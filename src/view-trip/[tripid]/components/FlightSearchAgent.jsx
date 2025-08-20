import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// City → Airport code mapping
const cityToAirport = {
  "new york": "JFK",
  "nyc": "JFK",
  "austin": "AUS",
  "los angeles": "LAX",
  "san francisco": "SFO",
  "chicago": "ORD",
  "houston": "IAH",
};

function FlightSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!origin || !destination || !departDate || !returnDate) {
      setError("⚠️ Please fill in all fields including dates");
      return;
    }

    const departureCode = cityToAirport[origin.toLowerCase()];
    const arrivalCode = cityToAirport[destination.toLowerCase()];

    if (!departureCode || !arrivalCode) {
      setError("⚠️ Unknown city entered. Try using major US cities.");
      return;
    }

    setError("");
    setLoading(true);
    setFlights([]);

    try {
      const res = await fetch(
        `http://localhost:5000/flights?departure_id=${departureCode}&arrival_id=${arrivalCode}&outbound_date=${departDate.toISOString().split("T")[0]}&return_date=${returnDate.toISOString().split("T")[0]}`
      );

      const data = await res.json();

      if (data.best_flights) {
        setFlights(data.best_flights);
      } else {
        setError("❌ No flights found!");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Error fetching flights.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-blue-600 mb-8 flex items-center gap-2">
        ✈️ Flight Search
      </h1>

      {/* Search Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="From (e.g., New York)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="To (e.g., Austin)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <DatePicker
            selected={departDate}
            onChange={(date) => setDepartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Departure"
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Return"
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
          >
            🔍 Search
          </button>
        </div>

        {/* Error / Loading */}
        <div className="mt-4 text-center">
          {loading && <p className="text-blue-500 animate-pulse">Loading flights...</p>}
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mt-10">
        {flights.map((flight, idx) => (
          <div
            key={idx}
            className="bg-white shadow-xl p-6 rounded-2xl border border-gray-100 hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ✈️ Best Flight Option #{idx + 1}
            </h2>

            {flight.flights.map((f, i) => (
              <div key={i} className="mb-2">
                <p>
                  <span className="font-semibold">Airline:</span>{" "}
                  <span className="text-blue-600">{f.airline}</span>
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {f.duration}
                </p>
              </div>
            ))}

            <p className="mt-3">
              <span className="font-semibold">Price:</span>{" "}
              <span className="text-green-600 font-extrabold text-lg">
                ${flight.price}
              </span>
            </p>

            <a
              href={`https://www.google.com/flights?hl=en#flt=${flight.flights[0].departure_airport.id}.${flight.flights[0].arrival_airport.id}.${flight.flights[0].departure_airport.time.split(" ")[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-blue-500 font-medium hover:underline"
            >
              🔗 View on Google Flights
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightSearch;
