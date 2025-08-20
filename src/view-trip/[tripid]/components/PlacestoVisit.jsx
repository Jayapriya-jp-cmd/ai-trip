import React from 'react';
import PlaceCard from './PlaceCard';

function PlacestoVisit({ trip }) {
  if (!trip?.tripData?.itinerary) return null;

  let globalIndex = 0; // 🔁 Used to cycle through static images

  return (
    <div>
      <h2 className="font-bold text-xl">Places to Visit</h2>
      <div>
        {trip.tripData.itinerary.map((item, index) => (
          <div key={index}>
            <h2 className="font-medium text-lg"> {item.day}</h2>
            <div className="grid md:grid-cols-2 gap-5">
              {item.spots?.map((plan, planIndex) => {
                const currentIndex = globalIndex;
                globalIndex++; // increment for each place
                return (
                  <div className="my-4" key={planIndex}>
                    <h2 className="font-medium text-sm text-orange-400">
                      {plan.best_time_to_visit}
                    </h2>
                    <PlaceCard plan={plan} index={currentIndex} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacestoVisit;
