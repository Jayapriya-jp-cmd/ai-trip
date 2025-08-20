import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacestoVisit from './components/PlacestoVisit';
import ScamAlertAgent from './components/ScamAlertAgent';
import FlightSearchAgent from './components/FlightSearchAgent'; // 👈 import flight agent

const ViewTrip = () => {
  const { tripid } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    tripid && GetTripData();
  }, [tripid]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, 'AiTrips', tripid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  };

  if (!trip) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading trip details...
      </div>
    );
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56 space-y-8'>
      {/* Information section */}
      <InfoSection trip={trip} />

      {/* Scam & Fraud Alerts */}
      {trip?.userSelection?.location && (
        <ScamAlertAgent destination={trip.userSelection.location} />
      )}

      {/* Flight Search for this destination */}
      {trip?.userSelection?.location && (
        <FlightSearchAgent destination={trip.userSelection.location} />
      )}
       
      {/* Hotel recommendations */}
      <Hotels trip={trip} />

      {/* Daily plan */}
      <PlacestoVisit trip={trip} />
    </div>
  );
};

export default ViewTrip;
