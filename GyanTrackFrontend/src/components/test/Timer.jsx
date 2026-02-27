import { useEffect, useState } from "react";

const Timer = ({ duration, onComplete }) => {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (time <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return <div>Time Left: {time}s</div>;
};

export default Timer;