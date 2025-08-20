import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use the same Gemini setup as your packing list agent
const API_KEY = "AIzaSyBv_56UbHuK5wEUxRJ5pHcHWv6HNnHH2Co";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ScamAlertAgent() {
  const [location, setLocation] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Classify news with Gemini
  const classifyArticle = async (article) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

      const prompt = `Classify this news as either "Scam" or "Other". 
Return only one word (Scam or Other). 
News: ${article.title}. ${article.description}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      return text === "Scam" ? "Scam" : "Other";
    } catch (error) {
      console.error("❌ Error classifying article:", error);
      return "Other";
    }
  };

  // ✅ Fetch news from GNews API
  const fetchScamNews = async () => {
    if (!location) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(
          location
        )}&lang=en&country=us&max=5&apikey=fbfc3006cd9142c02e98aeaadb58d267`
      );
      const data = await response.json();

      if (!data.articles) {
        setArticles([]);
        return;
      }

      // Classify each article with Gemini
      const classifiedArticles = await Promise.all(
        data.articles.map(async (article) => {
          const category = await classifyArticle(article);
          return { ...article, category };
        })
      );

      setArticles(classifiedArticles);
    } catch (error) {
      console.error("❌ Error fetching scam news:", error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <h2 className="text-2xl font-extrabold mb-4 text-blue-600 flex items-center gap-2">
        🚨 Scam Alert Agent
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Enter a city or location to check the latest scam-related news and alerts.
      </p>

      {/* Input + Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchScamNews()}
          placeholder="Enter a location (e.g., Paris)"
          className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={fetchScamNews}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          🔍 Fetch
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-blue-500 font-medium animate-pulse">
          Fetching latest news...
        </p>
      )}

      {/* Results */}
      <ul className="mt-6 space-y-4">
        {articles.map((a, i) => (
          <li
            key={i}
            className="border p-4 rounded-xl shadow-md hover:shadow-lg transition bg-gray-50"
          >
            <h3 className="font-bold text-lg text-gray-800">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{a.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Source: <span className="font-medium">{a.source?.name}</span> |{" "}
              Category:{" "}
              <span
                className={
                  a.category === "Scam"
                    ? "text-red-600 font-bold"
                    : "text-green-600 font-semibold"
                }
              >
                {a.category}
              </span>
            </p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-600 font-medium hover:underline text-sm"
            >
              🔗 Read More
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
