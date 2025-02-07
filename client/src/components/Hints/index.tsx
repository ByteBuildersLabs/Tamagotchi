import { useState, useEffect } from "react";
import { hints } from "../../data/hints";

function Hints() {
  const [currentHint, setCurrentHint] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentHint((prevHint) => (prevHint + 1) % hints.length);
        setFade(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFade(true);
  }, [currentHint]);

  return (
    <p className={`info hint ${fade ? "fade-in" : ""}`}>{hints[currentHint]}</p>
  );
}

export default Hints;
