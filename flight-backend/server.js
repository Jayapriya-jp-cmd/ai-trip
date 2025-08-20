import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const apiKey = "29ffa93625e252b06af6675e3212af5a9e997a50d52c758002caa3792f78a903"; // 🔑 Replace with your SerpAPI key

// 🔹 Flight search endpoint
app.get("/flights", async (req, res) => {
  try {
    const { departure_id, arrival_id, outbound_date, return_date, currency = "USD" } = req.query;

    if (!departure_id || !arrival_id || !outbound_date || !return_date) {
      return res.status(400).json({ error: "All flight parameters are required" });
    }

    const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(
      departure_id
    )}&arrival_id=${encodeURIComponent(arrival_id)}&outbound_date=${encodeURIComponent(
      outbound_date
    )}&return_date=${encodeURIComponent(return_date)}&currency=${currency}&hl=en&api_key=${apiKey}`;

    console.log("Fetching flights:", url);

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// 🔹 Flight details endpoint (using departure_token)
app.post("/flightDetails", async (req, res) => {
  try {
    const { departure_token } = req.body;

    if (!departure_token) {
      return res.status(400).json({ error: "departure_token is required" });
    }

    const url = `https://serpapi.com/search.json?engine=google_flights&departure_token=${encodeURIComponent(
      departure_token
    )}&api_key=${apiKey}`;

    console.log("Fetching flight details:", url);

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error("Error fetching flight details:", error);
    res.status(500).json({ error: "Failed to fetch flight details" });
  }
});

// 🔹 Local Utilities endpoint


app.listen(PORT, () =>
  console.log(`✅ Backend is running on http://localhost:${PORT}`)
);
