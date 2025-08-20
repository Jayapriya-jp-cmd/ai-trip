import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import OpenStreetAutocomplete from "../components/ui/custom/OpenStreetAutocomplete";
import { SelectTravelsList, SelectBudgetOptions } from '../constants/options';
import { Button } from "@/components/ui/button";
import { generateTripPlan } from "../service/AiModel"; // import Gemini API function
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from '../service/firebaseConfig'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {useNavigate} from 'react-router-dom';
const CreateTrip = () => {
  const[openDialog,setOpenDialog]=useState(false);
  const [location, setLocation] = useState(null);
  const [noOfDays, setNoOfDays] = useState("");
  const [budget, setBudget] = useState("");
  const [traveler, setTraveler] = useState("");
  const[loading,setLoading]=useState(false);
  const navigate=useNavigate();
  useEffect(() => {
    const tripData = { location, noOfDays, budget, traveler };
    console.log(tripData);
  }, [location, noOfDays, budget, traveler]);

  const login = useGoogleLogin({
  onSuccess: (codeResp) => {
    console.log("Login success", codeResp);
    GetUserProfile(codeResp);  // <--- Important!
  },
  onError: (error) => console.log("Login error", error),
});
  const handleDestinationSelect = (value) => {
    setLocation(value);
  };

  const handleDaysChange = (e) => {
    setNoOfDays(e.target.value);
  };

  const handleBudgetSelect = (title) => {
    setBudget(title);
  };

  const handleTravelerSelect = (title) => {
    setTraveler(title);
  };

  const handleGenerateTrip = async () => {
    const user=localStorage.getItem('user');
   if(!user){
    setOpenDialog(true)
    return ;
   }
    const tripData = { location, noOfDays, budget, traveler };
    console.log("Generating Trip with Data:", tripData);
  setLoading(true);
    // Input validation
    if (!location?.label || !noOfDays || !budget || !traveler) {
      console.warn("Please fill all the fields before generating trip.");
      return;
    }

    try {
      const result = await generateTripPlan(
        location.label,
        noOfDays,
        budget,
        traveler
      );
      SaveAiTrip(result)
      setLoading(true)
      console.log("Generated Trip Plan (from Gemini):", result);
    } catch (error) {
      console.error("Error generating trip plan:", error);
    }
  };
  const GetUserProfile=async(tokenInfo)=>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,{
      headers:{
        Authorization:`Bearer ${tokenInfo?.access_token}`,
        Accept:'Application/json'
      }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user',JSON.stringify(resp.data));
      setOpenDialog(false);
      handleGenerateTrip();
    })
  }
  const SaveAiTrip = async (TripData) => {
  setLoading(true);
  const docId = Date.now().toString(); // Move outside to retain scope in finally
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: {
        location: location?.label || "",
        noOfDays: noOfDays || "",
        budget: budget || "",
        traveler: traveler || "",
      },
      tripData: TripData || "Failed to generate trip", // Don't parse if already an object
      userEmail: user?.email || "guest",
      id: docId,
    });

    console.log("✅ Trip saved to Firestore.");
  } catch (error) {
    console.error("❌ Firestore Save Failed:", error.message || error);
  } finally {
    setLoading(false);
    navigate("/view-trip/" + docId); // docId accessible here now
  }
};



  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 my-10">
      <h2 className="text-3xl font-bold">Tell us Your Preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary.
      </p>

      {/* Destination */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">What is your next Destination</h2>
        <OpenStreetAutocomplete onPlaceChange={handleDestinationSelect} />
        {location?.label && (
          <p className="mt-2 text-blue-600 text-sm"></p>
        )}
      </div>

      {/* Days */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
        <Input
          placeholder="Ex. 3"
          type="number"
          value={noOfDays}
          onChange={handleDaysChange}
        />
      </div>

      {/* Budget */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">What is your Budget</h2>
        <div className="grid grid-cols-3 gap-6 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer ${budget === item.title ? "border-blue-500 shadow-md" : "hover:shadow-lg"}`}
              onClick={() => handleBudgetSelect(item.title)}
            >
              <h2 className="text-xl">{item.icon}</h2>
              <h2 className="font-bold text-xl">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Traveler */}
      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">Who do you plan on travelling with?</h2>
        <div className="grid grid-cols-3 gap-6 mt-5">
          {SelectTravelsList.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer ${traveler === item.title ? "border-blue-500 shadow-md" : "hover:shadow-lg"}`}
              onClick={() => handleTravelerSelect(item.title)}
            >
              <h2 className="text-xl">{item.icon}</h2>
              <h2 className="font-bold text-xl">{item.title}</h2>
              <h2 className="text-sm text-gray-600">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 justify-end flex">
        <Button 
        disabled={loading}
        onClick={handleGenerateTrip}>
          {loading?
         <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin text-blue-600" />: 'Generate Trip'
      }
         </Button>
      </div>

      <Dialog open={openDialog}>
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Sign In</DialogTitle>
      <DialogDescription>
        <img src="/logo.svg" className="h-20 w-20" ></img>
        <h2 className="font-bold text-lg mt-3">Sign In with Google</h2>
        <p>Sign in ot the App with Google authentication securely</p>
        <Button 
        className="w-full mt-5 flex gap-4 items-center" 
        onClick={login}>
         
        
        
          <FcGoogle className="h-7 w-7" />
          Sign In with Google
          </Button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default CreateTrip;
