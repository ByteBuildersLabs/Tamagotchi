import React, { useEffect, useState } from 'react';
import trophy from "../../assets/img/trophy2.svg";
import "./main.css";

interface CountdownProps {
  targetDate: string; // Format: "YYYY-MM-DDTHH:mm:ss"
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft({ days, hours, minutes });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className='countdown loading-aura'>
      <img src={trophy} alt="trophy" />
      <p>Tournament ends in</p>
      <p>{timeLeft.days}d</p>
      <p>{timeLeft.hours}h</p>
      <p>{timeLeft.minutes}m</p>
    </div>
  );
};

export default Countdown;