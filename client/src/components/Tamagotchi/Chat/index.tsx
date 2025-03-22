import { useState, useRef } from "react";
import MessageComponent from "../../ui/message";
import beastsDex from "../../../data/beastDex";
import { useBeastChat } from "../../../hooks/useBeastChat";
import message from '../../../assets/img/message.svg'
import './main.css';

const Chat = ({ beast, expanded, beastStatus }: { beast: any, beastStatus: any, expanded: boolean }) => {
  const { messages, isLoading, error, sendMessage } = useBeastChat({ beast });
  
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 300;

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    await sendMessage(input);
    setInput("");
    restoreFocus();
  };

  const chat = (beast: any) => {
    return (
      <div className="whispers-chat">
        <div className='pet-message'>
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
        <div className='my-message'>
          {messages.map((message, index) => (
            <MessageComponent key={index} message={message} />
          ))}
        </div>
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
            {isLoading ? <div className="loader"></div> :<img src={isLoading ? '' : message} alt="Send message" />}
          </button>
        </div>
        {error && <div className="error-tooltip">{error.message}</div>}
      </div>
    );
  }

  return expanded ? chat(beast) : <></>;
}

export default Chat;
