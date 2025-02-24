import { Beast, BeastStatus } from "../../../dojo/bindings";
import { useEffect, useState, useRef } from "react";
import message from '../../../assets/img/message.svg';
import MessageComponent, { Message } from "../../ui/message";
import beastsDex from "../../../data/beastDex";
import { useBeastChat } from "../../../hooks/useBeastChat";
import './main.css';

const Whispers = ({ beast, expanded, beastStatus }: { beast: any, beastStatus: any, expanded: boolean }) => {
  const { messages, isLoading, error, sendMessage, sendSystemPrompt } = useBeastChat({ beast });
  
  const [whispers, setWhispers] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 300;
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    await sendMessage(input);
    setInput("");
    restoreFocus();
    
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.user !== "Me") {
        setWhispers([lastMessage]);
      }
    }
  };

  const clearWhisperMessage = () => {
    setWhispers([]);
  };

  const chat = (beast: Beast) => {
    return (
      <div className="whispers-chat">
        <div className='messages'>
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder={`Talk to ${beastsDex[beast.specie - 1]?.name}`}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading}
            className={`button ${isLoading ? 'loading' : ''}`}
          >
            <img src={message} alt="Send message" />
          </button>
        </div>
        {error && <div className="error-tooltip">{error.message}</div>}
      </div>
    );
  }

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

  const analyzeStats = (beastStatus: BeastStatus) => {
    const range = {
      LOW: 30,
      MEDIUM: 50,
      HIGH: 80
    };

    return Object.entries(beastStatus)
      .map(([stat, value]) => ({
        stat,
        value,
        priority: value < range.LOW ? 3 :
          value < range.MEDIUM ? 2 :
            value > range.HIGH ? 1 : 0
      }))
      .sort((a, b) => b.priority - a.priority)[0];
  };

  const generatePrompt = (beastStatus: BeastStatus) => {
    const criticalStat = analyzeStats(beastStatus);
    return `You are ${beastsDex[beast.specie - 1]?.name}, with the following statistics:
            Hunger: ${beastStatus.hunger}/100
            Energy: ${beastStatus.energy}/100
            Happiness: ${beastStatus.happiness}/100
            Hygiene: ${beastStatus.hygiene}/100
            
            Respond in ONE short line (max 15 words). 
            Focus on your ${criticalStat.stat.toLowerCase()} being ${criticalStat.value}%.`;
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
      
      // Configure new timeout to clear the message every 15 seconds
      messageTimeoutRef.current = setTimeout(() => {
        clearWhisperMessage();
      }, 15000); 
    }
  };
  

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if(beastStatus) {
      const prompt = generatePrompt(beastStatus);
      createWhisper(prompt);
      intervalId = setInterval(() => {
        const prompt = generatePrompt(beastStatus);
        createWhisper(prompt);
      }, 60000); // Changed to 1 minute for better interaction
    }
    
    // Clear both the interval and the timeout when unmounting
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  return expanded ? chat(beast) : uniMessage();
}

export default Whispers;