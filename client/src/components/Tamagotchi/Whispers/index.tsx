import { useEffect, useState } from "react";
import { Beast } from "../../../dojo/bindings";
import MessageComponent, { Message } from "../../ui/message";
import axios from "axios";
import './main.css';

interface ApiError {
  message: string;
  status?: number;
}

const Whispers = ({ beast }: { beast: Beast }) => {
  const [whispers, setWhispers] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const analyzeStats = (beast: Beast) => {
    const range = {
      LOW: 30,
      MEDIUM: 50,
      HIGH: 80
    };
  
    return Object.entries(beast)
      .map(([stat, value]) => ({
        stat,
        value,
        priority: value < range.LOW ? 3 : 
                  value < range.MEDIUM ? 2 : 
                  value > range.HIGH ? 1 : 0
      }))
      .sort((a, b) => b.priority - a.priority)[0];
  };

  const generatePrompt = (beast: Beast) => {
    const criticalStat = analyzeStats(beast);
    return `You are Pou, a virtual BabyBeast with the following statistics:
            Hunger: ${beast.hunger}/100
            Energy: ${beast.energy}/100
            Happiness: ${beast.happiness}/100
            Hygiene: ${beast.hygiene}/100
            
            Responds as a friendly and playful virtual pet, in 2 lines max.,
            focusing on your most urgent need: ${criticalStat.stat} (${criticalStat.value}/100);`
  };

  const createWhisper = async (prompt:any) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_ELIZA_URL || "", {
        text: prompt,
      });

      if (response.data && response.data.length > 0) {
        const { user, text } = response.data[0];
        const botWhisper = { user, text };
        setWhispers((prevMessages) => [...prevMessages, botWhisper]);
      } else {
        throw new Error("Received empty response from server");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError({
        message: "Oops! Couldn't get a response. Please try again in a moment.",
        status: 500
      });
      setWhispers((prevMessages) => [...prevMessages, {
        user: "System",
        text: "Failed to get response. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      const prompt = generatePrompt(beast);
      createWhisper(prompt);
  }, []);

  return (
    <div className="whispers">
      <p className='messages'>
        {whispers.map((message, index) => (
          <MessageComponent key={index} message={message} />
        ))}
      </p>
      {error && <p>{error.message}</p>}
    </div>
  );
}

export default Whispers;
