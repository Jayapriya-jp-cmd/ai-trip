import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBv_56UbHuK5wEUxRJ5pHcHWv6HNnHH2Co";
const genAI = new GoogleGenerativeAI(API_KEY);

// Generate Packing List
export const generatePackingList = async (location, days, travelers) => {
  const prompt = `Create a detailed packing list for ${travelers} travelers going to ${location} for ${days} days. Include:
- Clothes (weather appropriate)
- Toiletries
- Electronics
- Travel documents
- Medications
- Any location-specific items

Return only valid JSON array, no explanation. Example:
[
  {
    "category": "Clothing",
    "items": ["T-shirts", "Jeans", "Raincoat"]
  },
  {
    "category": "Electronics",
    "items": ["Phone charger", "Power bank"]
  }
]`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("🔹 Raw Gemini output:", text);

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No valid JSON array found in response");

    const parsedJson = JSON.parse(jsonMatch[0]);
    return parsedJson;
  } catch (error) {
    console.error("❌ Error generating packing list:", error);
    return [];
  }
};
