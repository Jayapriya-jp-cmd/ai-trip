import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { Plane, MessageCircle, Package, Shield } from "lucide-react";

function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
      {/* Background 3D Effect */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://cdn.pixabay.com/photo/2022/03/10/17/21/travel-7059828_960_720.jpg" // replace with your 3D/AI-styled background image
          alt="AI Travel Background"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/90" />
      </div>

      {/* Main Hero Content */}
      <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl text-blue-800 drop-shadow-lg">
        Discover Your Next Adventure with AI
      </h1>

      <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
        Your personal trip planner and travel curator — powered by{" "}
        <span className="font-semibold text-blue-700">Gemini AI 2.5 Pro</span>.  
        Plan smarter with real-time language help, packing lists, flight search, and scam alerts.
      </p>

      <div className="mt-8">
        <Link to={"/create-trip"}>
          <Button className="px-8 py-3 text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
            Get Started – It’s Free 🚀
          </Button>
        </Link>
      </div>

      {/* Feature Highlights */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl">
        {/* Language Buddy */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <MessageCircle className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="font-semibold text-xl text-gray-800 mb-2">
            Language Buddy
          </h3>
          <p className="text-gray-600 text-sm">
            Real-time chatbot with translation & voice support, helping you
            communicate anywhere in the world.
          </p>
        </div>

        {/* Packing Assistant */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <Package className="h-10 w-10 text-green-600 mb-3" />
          <h3 className="font-semibold text-xl text-gray-800 mb-2">
            Smart Packing Assistant
          </h3>
          <p className="text-gray-600 text-sm">
            Get AI-generated packing lists based on destination, weather, and
            trip duration.
          </p>
        </div>

        {/* Flight Search */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <Plane className="h-10 w-10 text-red-500 mb-3" />
          <h3 className="font-semibold text-xl text-gray-800 mb-2">
            Flight Search AI
          </h3>
          <p className="text-gray-600 text-sm">
            Find the best flights instantly with AI-based price comparison and
            smart travel suggestions.
          </p>
        </div>

        {/* Scam News Discover */}
        <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition">
          <Shield className="h-10 w-10 text-purple-600 mb-3" />
          <h3 className="font-semibold text-xl text-gray-800 mb-2">
            Scam Alerts
          </h3>
          <p className="text-gray-600 text-sm">
            Stay safe with real-time scam & fraud alerts in your travel
            destination, powered by AI news scanning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
