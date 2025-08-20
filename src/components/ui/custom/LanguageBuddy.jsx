import React, { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Chinese" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "ru", label: "Russian" },
];

const LanguageBuddy = () => {
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("ta");
  const [spokenText, setSpokenText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const synthRef = useRef(window.speechSynthesis);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = fromLang;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript;
      setSpokenText(result);
      const translated = await translateText(result, fromLang, toLang);
      setTranslatedText(translated);
    };

    recognitionRef.current = recognition;
  }, [fromLang, toLang]);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const translateText = async (text, from, to) => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(
          text
        )}`
      );
      const result = await response.json();
      return result[0][0][0];
    } catch (error) {
      console.error("Translation error:", error);
      return "Translation failed.";
    }
  };

  const speak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    synthRef.current.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          🌐 AI Language Buddy
        </h1>

        {/* Language selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Speak (From Language):
            </label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Translate To:
            </label>
            <select
              className="w-full p-2 mt-1 border rounded"
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start speaking button */}
        <button
          onClick={startListening}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
        >
          🎤 Start Speaking
        </button>

        {/* Spoken text */}
        <div>
          <p className="text-sm text-gray-600">You said:</p>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
            <p className="text-gray-800 flex-1">{spokenText}</p>
            {spokenText && (
              <button
                onClick={() => speak(spokenText, fromLang)}
                className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                🔊
              </button>
            )}
          </div>
        </div>

        {/* Translation */}
        <div>
          <p className="text-sm text-gray-600">Translation:</p>
          <div className="flex items-center justify-between bg-green-100 p-3 rounded-md">
            <p className="text-green-800 flex-1">{translatedText}</p>
            {translatedText && (
              <button
                onClick={() => speak(translatedText, toLang)}
                className="ml-3 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                🔊
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageBuddy;

