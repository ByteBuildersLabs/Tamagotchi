import { useEffect, useState, useRef } from "react";
import MessageComponent, { Message } from "../../ui/message";
import { useBeastChat } from "../../../hooks/useBeastChat";
import './main.css';

const Whispers = ({ beast, expanded, beastStatus, botMessage, setBotMessage }: { beast: any, beastStatus: any, expanded: boolean, botMessage:any, setBotMessage:any }) => {
  const { isLoading, error } = useBeastChat({ beast, setBotMessage });

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

    setWhispers([{
      user: 'System',
      text: message
    }]);

    // Configure new timeout to clear the message every 20 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setBotMessage([{ user: '', text: '' }]);
      setWhispers([{ user: '', text: '' }]);
    }, 20000);
  };


  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (beastStatus && beast) {
      const firstMessage = generateMessage();
      createWhisper(firstMessage);

      intervalId = setInterval(() => {
        const message = generateMessage();
        createWhisper(message);
      }, 180000);
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
