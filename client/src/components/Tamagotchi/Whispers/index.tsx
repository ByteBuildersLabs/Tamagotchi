// React and external libraries
import { useEffect, useState, useRef } from "react";

// Internal components
import MessageComponent, { Message } from "../../ui/message";

// Hooks and Contexts
import { useBeastChat } from "../../../hooks/useBeastChat";

// Styles
import './main.css';

const MESSAGE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const MESSAGE_DISPLAY_TIME = 20 * 1000; // 20 seconds in milliseconds

const Whispers = ({ beast, expanded, beastStatus, botMessage, setBotMessage }: { beast: any, beastStatus: any, expanded: boolean, botMessage:any, setBotMessage:any }) => {
  const { isLoading, error } = useBeastChat({ beast, setBotMessage });

  const [whispers, setWhispers] = useState<Message[]>([]);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setWhispers([botMessage]);
  }, [botMessage]);

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

  const generateMessage = () => {
    if (!beast) return '';

    const messages = [
      '👁️ My stats will decrease every 3 minutes ⏰',
      '🍖 I have a favourite food that will boost my energy better than the other foods 🍅🥕',
      '😺 Keep me alive as many days as possible, my birthday is every day 🎂',
      "🧼 If you don't keep me clean, there will be poop around 🥺",
      '😔 If I die, you will need to hatch a new egg and start all over 🐣',
      '🌝 When you go to sleep, I need to rest some hours to get all my energy back',
      "🎮 Let's play a mini game to get some food 🚀",
      "🍉 Every time we play a mini game, we find new food, there are 16 types 🍓",
    ]

    const randomFunction = Math.floor(Math.random() * messages.length);
    return messages[randomFunction];
  };

  const createWhisper = async (message: string) => {
    if (isLoading) return;

    // Clean previous timeout if it exists
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    const newMessage = {
      user: 'System',
      text: message
    };

    setWhispers([newMessage]);
    setBotMessage(newMessage);

    // Clear the message after 20 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setBotMessage({ user: '', text: '' });
      setWhispers([{ user: '', text: '' }]);
    }, MESSAGE_DISPLAY_TIME);
  };

  useEffect(() => {
    // Clear any existing interval and timeout
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    // Only set up the interval if we have a beast and it's not sleeping
    if (beastStatus && beast && beastStatus[2] !== 0) {
      // Send initial message
      const firstMessage = generateMessage();
      createWhisper(firstMessage);

      // Set up interval for periodic messages
      intervalRef.current = setInterval(() => {
        const message = generateMessage();
        createWhisper(message);
      }, MESSAGE_INTERVAL);
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [beast, beastStatus]); // Only re-run if beast or beastStatus changes

  return expanded ? <></> : uniMessage();
}

export default Whispers;
