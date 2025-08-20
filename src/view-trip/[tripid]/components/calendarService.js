import axios from "axios";

export const addEventToCalendar = async (accessToken, event) => {
  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(event),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error("Failed to add event: " + JSON.stringify(err));
  }
  
  return await res.json();
};
