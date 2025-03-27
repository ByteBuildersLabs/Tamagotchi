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

  const generateLore = () => {
    if (!beast) return '';

    return `You are ${beastsDex[beast?.specie - 1]?.name}, these the lore of the world:
            - In a distant future, humanity left behind the cities of metal and concrete to inhabit a reborn world: Terra Noctis, a planet where primordial energy flows like an invisible river, giving life to ancient creatures that emerge from mystical eggs
            - These beings, known as Primordial Beasts, are the embodiment of the elements and the Earth's very emotions. Among them, Celestial Dragons soar through the skies with wings of fire and lightning, while Umbral Wolves roam the forests, shrouded in magical mist and living shadows.
            - Humans (us), now divided into clans, compete for dominance over these beings, seeking to forge bonds with the beasts or subjugate them for war. In this world where technology and magic intertwine, the key to power lies with those who can truly understand the spirit of the Primordial Beasts.
            - But deep within Terra Noctis, an ancient egg pulses with dark energy, waiting for the moment to awaken...
            
            Please tell me about the lore in your own way
            `;
  };

  const generateAdvise = () => {
    if (!beast) return '';

    return `You are ${beastsDex[beast?.specie - 1]?.name}, these are the rules of how to take care of you:
            - The Status will decrease every 3 minutes
            - I have a favourite food that will boost my energy better than the other foods
            - The purporse of the game is to stay alive as many days as possible, my birthday is every day
            - If you don't keep me clean, there will be poop around
            - If you die, the player will need to hatch a new egg and start all over
            - When I go to sleep, I need to rest some hours to get all my energy back
            
            Please tell me one of these advices in your own way
            `;
  };

  const generateStatus = (beastStatus: any) => {
    if (!beast) return '';

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
      const randomFunction = Math.floor(Math.random() * 3);
      let initialPrompt = '';
      if (randomFunction === 0) {
        initialPrompt = generateLore();
      } else if (randomFunction === 1) {
        initialPrompt = generateAdvise();
      } else {
        initialPrompt = generateStatus(beastStatus);
      }
      createWhisper(initialPrompt);
      intervalId = setInterval(() => {
        const randomFunction = Math.floor(Math.random() * 3);
        let prompt = '';
        if (randomFunction === 0) {
          prompt = generateLore();
        } else if (randomFunction === 1) {
          prompt = generateAdvise();
        } else {
          prompt = generateStatus(beastStatus);
        }
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
