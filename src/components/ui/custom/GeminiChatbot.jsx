import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI("AIzaSyBv_56UbHuK5wEUxRJ5pHcHWv6HNnHH2Co"); // Replace with your actual Gemini API key
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

function GeminiChatbot() {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      let chatInstance = chat;
      if (!chatInstance) {
        chatInstance = await model.startChat();
        setChat(chatInstance);
      }

      const result = await chatInstance.sendMessage(input);
      const response = result.response.text();

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { role: 'model', text: "⚠️ Something went wrong. Please try again!" }]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 border rounded-2xl shadow-lg bg-gradient-to-br from-white to-blue-50 mt-8">
      {/* Header */}
      <h2 className="text-2xl font-extrabold mb-4 text-center text-blue-800">
        ✈️ Travel Assistant
      </h2>

      {/* Chat Box */}
      <div className="h-72 overflow-y-auto border rounded-xl p-4 mb-4 bg-white shadow-inner space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20">Start chatting to plan your trip 🌍</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <span className="block font-semibold mb-1">
                {msg.role === 'user' ? 'You' : 'Bot'}
              </span>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ask about destinations, hotels, routes..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md transition-all"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default GeminiChatbot;
