import React from 'react';
import { Link } from 'react-router-dom';

function PlaceCard({ plan, index }) {
  // 9 images to rotate between
  const imageList = [
    "/t1.jpeg",
    "/t2.jpeg",
    "/t3.jpeg",
    "/t4.jpeg",
    "/t5.jpeg",
    "/t6.jpeg",
    "/t7.jpeg",
    "/t8.jpeg",
    "/t9.jpeg",
  ];

  const image = imageList[index % imageList.length]; // cycle through images

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.place_name)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="border mt-2 p-3 rounded-xl flex gap-5 hover:scale-105 transition-all hover:shadow-xl">
        <img
          src={image}
          className="h-[150px] w-[150px] rounded-xl"
          alt={plan.place_name}
        />
        <div>
          <h2 className="text-md font-medium">{plan.place_name}</h2>
          <p className="text-xs text-gray-400">{plan.short_description}</p>
          <p className="text-xs text-yellow-500 mt-1">Ticket Price: ${plan.ticket_pricing_usd}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCard;
