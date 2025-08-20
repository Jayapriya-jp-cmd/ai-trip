import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';
import UserTripsCardItems from "./components/UserTripsCardItems";

function Mytrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(collection(db, 'AiTrips'), where('userEmail', '==', user?.email));

    try {
      const querySnapshot = await getDocs(q);
      setUserTrips([]);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUserTrips(prevVal => [...prevVal, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching trips: ", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {userTrips?.length > 0 ? (
          userTrips.map((trip, index) => (
            <UserTripsCardItems trip={trip} key={index} />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div className="h-[220px] w-full bg-slate-200" key={index}></div>
          ))
        )}
      </div>
    </div>
  );
}

export default Mytrips;
