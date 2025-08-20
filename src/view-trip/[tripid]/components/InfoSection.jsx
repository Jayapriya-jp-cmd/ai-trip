import { Button } from "@/components/ui/button";
import { generatePackingList } from "@/service/PackingAgent";
import React from "react";
import { FaSquareShareNodes } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function InfoSection({ trip }) {
  const navigate = useNavigate();

  const handleViewPacking = async () => {
    try {
      const packingList = await generatePackingList(
        trip?.userSelection?.location,
        trip?.userSelection?.noOfDays,
        trip?.userSelection?.traveler
      );
      navigate("/packing-details", { state: { packingList } });
    } catch (error) {
      console.error("❌ Error generating packing list:", error);
      alert("Failed to generate packing list. Try again.");
    }
  };



  return (
    <div>
      <img
        src="/placeholder.jpg"
        className="h-[300px] w-full object-cover rounded-xl"
      />
      <div className="my-5 flex flex-col gap-3">
        <h2 className="font-bold text-xl">{trip?.userSelection?.location}</h2>
        <div className="flex justify-between items-center">
          <div className="gap-3 flex">
            <h2 className="p-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg">
              📅 {trip?.userSelection?.noOfDays} Day
            </h2>
            <h2 className="p-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg">
              💸 {trip?.userSelection?.budget}
            </h2>
            <h2 className="p-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-lg">
              No.of Travellers : {trip?.userSelection?.traveler} 🥂
            </h2>
          </div>

          {/* Existing buttons */}
          <Button onClick={handleViewPacking}>View Packing</Button>
          <Button><FaSquareShareNodes /></Button>

         
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
