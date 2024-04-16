import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setTime(`${hours}:${minutes}:${seconds} ${ampm}`);

      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDay = days[now.getDay()];
      setDay(currentDay);

      const currentDate = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setDate(currentDate);
    };

    updateTime(); // Call the function once to avoid a delay in showing the time
    const intervalId = setInterval(updateTime, 1000); // Update time every second

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-6 text-center">
          <h3 className="mb-1">{time}</h3>
          <p className="mb-0">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalClock;
