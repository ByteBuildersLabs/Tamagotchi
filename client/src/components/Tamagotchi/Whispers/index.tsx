import { useEffect, useState, useRef } from "react";
import MessageComponent, { Message } from "../../ui/message";
import beastsDex from "../../../data/beastDex";
import { useBeastChat } from "../../../hooks/useBeastChat";
import './main.css';

const Whispers = ({ beast, expanded, beastStatus, botMessage, setBotMessage }: { beast: any, beastStatus: any, expanded: boolean, botMessage:any, setBotMessage:any }) => {
  const { isLoading, error, sendSystemPrompt } = useBeastChat({ beast, setBotMessage });

  const [whispers, setWhispers] = useState<Message[]>([]);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setWhispers([botMessage]);
  },  [botMessage])

  const uniMessage = () => {
    return (
      <div className="whispers">
        <div className='messages'>
          {whispers.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
        {error && <p>{error.message}</p>}
      </div>
    );
  }

  const generatePrompt = (beastStatus: any) => {
    if (!beast) return '';
    console.info('beastStatus', beastStatus);

    return `You are ${beastsDex[beast?.specie - 1]?.name}, with the following statistics:
            Hunger: ${beastStatus[3]}
            Energy: ${beastStatus[4]}
            Happiness: ${beastStatus[5]}
            Hygiene: ${beastStatus[6]}
            
            Respond in ONE short line (max 15 words). 
            If the stats are close to 0, let me know so I can take care of you,
            make sure to respond only with english words`;
  };

  const createWhisper = async (prompt: string) => {
    if (isLoading) return;

    // Clean previous timeout if it exists
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    const response = await sendSystemPrompt(prompt);
    if (response) {
      setWhispers([response]);
    }

    // Configure new timeout to clear the message every 15 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setBotMessage([{ user: '', text: '' }]);
      setWhispers([{ user: '', text: '' }]);
    }, 20000);
  };


  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (beastStatus && beast) {
      const prompt = generatePrompt(beastStatus);
      createWhisper(prompt);
      intervalId = setInterval(() => {
        const prompt = generatePrompt(beastStatus);
        createWhisper(prompt);
      }, 180000); // Changed to 1 minute for better interaction
    }

    // Clear both the interval and the timeout when unmounting
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  return expanded ? <></> : uniMessage();
}

export default Whispers;
