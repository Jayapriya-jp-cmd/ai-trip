import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PackingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get packing list from state OR trip object
  const { packingList = [], trip } = location.state || {};
  const finalPackingList = packingList.length ? packingList : trip?.packingList || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <button 
          onClick={() => navigate(-1)} 
          className="text-blue-600 hover:text-blue-800 mb-4 underline"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🧳 Packing List Details
        </h1>

        {finalPackingList.length > 0 ? (
          <div className="space-y-6">
            {finalPackingList.map((section, index) => (
              <div key={index} className="border rounded-xl shadow-md p-4 bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                  {section.category}
                </h2>
                <ul className="list-disc pl-6 space-y-1 text-gray-600">
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No packing details available.</p>
        )}
      </div>
    </div>
  );
};

export default PackingDetails;
