// src/service/AiModel.jsx

import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use your actual Gemini API key here
const API_KEY = "AIzaSyBv_56UbHuK5wEUxRJ5pHcHWv6HNnHH2Co";

const genAI = new GoogleGenerativeAI(API_KEY);

// This function generates a trip plan using Gemini
export const generateTripPlan = async (location, days, budget, travelers) => {
  const prompt = `Generate a travel plan for the location: ${location} for ${days} days for ${travelers} travelers with a ${budget} budget.

1. Suggest at least 3 cheap hotels. Each hotel should include:
- Hotel name
- Address
- Price per night (USD)
- A realistic image URL
- Geo coordinates (latitude, longitude)
- Rating (out of 5)
- A short description

2. Suggest a ${days}-day itinerary. For each day, list at least 2-3 tourist spots with:
- Place name
- Short description
- Realistic image URL
- Geo coordinates
- Ticket pricing (USD)
- Best time to visit
- Recommended duration (in hours)

Format the entire response as a valid JSON object with two top-level keys: "hotels" and "itinerary". 
ONLY RETURN JSON. DO NOT INCLUDE ANY TEXT OR MARKDOWN OUTSIDE JSON.
In the itinerary, always use "spots" as the key and "short_description" for each activity's description.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(prompt);
    const text = await result.response.text(); // ✅ await added

    let parsedJson;
    try {
      parsedJson = JSON.parse(text); // Try parsing directly
    } catch (e) {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No valid JSON found in Gemini response");
      parsedJson = JSON.parse(match[0]);
    }

    return parsedJson;
  } catch (error) {
    console.error("Error generating trip plan with Gemini:", error);
    throw error;
  }

};

