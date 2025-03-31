import { useState, useRef } from "react";
import MessageComponent from "../../ui/message";
import beastsDex from "../../../data/beastDex";
import messageIcon from '../../../assets/img/message.svg';
import { useBeastChat } from "../../../hooks/useBeastChat";
import './main.css';

const context = `Remembre this is your context, 
          these are the rules of how to take care of you:
          - The Status will decrease every 3 minutes
          - I have a favourite food that will boost my energy better than the other foods
          - The purporse of the game is to stay alive as many days as possible, my birthday is every day
          - If you don't keep me clean, there will be poop around
          - If you die, the player will need to hatch a new egg and start all over
          - When I go to sleep, I need to rest some hours to get all my energy back
          
          these the lore of the world:
          - In a distant future, humanity left behind the cities of metal and concrete to inhabit a reborn world: Terra Noctis, a planet where primordial energy flows like an invisible river, giving life to ancient creatures that emerge from mystical eggs
          - These beings, known as Primordial Beasts, are the embodiment of the elements and the Earth's very emotions. Among them, Celestial Dragons soar through the skies with wings of fire and lightning, while Umbral Wolves roam the forests, shrouded in magical mist and living shadows.
          - Humans (us), now divided into clans, compete for dominance over these beings, seeking to forge bonds with the beasts or subjugate them for war. In this world where technology and magic intertwine, the key to power lies with those who can truly understand the spirit of the Primordial Beasts.
          - But deep within Terra Noctis, an ancient egg pulses with dark energy, waiting for the moment to awaken...
          `;


const Chat = ({ beast, expanded, botMessage, setBotMessage }: { beast: any, expanded: boolean, botMessage: any, setBotMessage: any }) => {
  const { isLoading, error, sendMessage } = useBeastChat({ beast, setBotMessage });

  const [input, setInput] = useState("");
  const [myMessage, setMyMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 300;

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    const messageWithContext = `${context}\n\nUser: ${input}`;
    await sendMessage(messageWithContext);
    setMyMessage(input);
    setInput("");
    restoreFocus();
  };

  const chat = (beast: any) => {
    return (
      <div className="whispers-chat">
        <div className='pet-message'>
          <MessageComponent message={botMessage} />
        </div>
        <div className='my-message'>
          <MessageComponent message={{
            user: 'me',
            text: myMessage
          }} />
          <div className="chat-input">
            <input
              ref={inputRef}
              type="text"
              placeholder={`Talk to ${beastsDex[beast?.specie - 1]?.name}`}
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
              className={`send-button`}
            >
              {isLoading ? <div className="loader"></div> : <img src={isLoading ? '' : messageIcon} alt="Send message" />}
            </button>
          </div>
          {error && <div className="error-tooltip">{error.message}</div>}
        </div>
      </div>
    );
  }

  return expanded ? chat(beast) : <></>;
}

export default Chat;
