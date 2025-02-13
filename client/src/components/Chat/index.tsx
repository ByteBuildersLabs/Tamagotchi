import { useRef, useEffect, useState } from "react";
import { Beast } from "../../dojo/bindings";
import MessageComponent from "../ui/message";
import ThinkingDots from '../ui/thinking-dots';
import message from '../../assets/img/message.svg';
import { useBeastChat } from '../../hooks/useBeastChat';
import initials from '../../data/initials';
import './main.css';

interface ChatProps {
  beast: Beast;  
}

function Chat({ beast }: ChatProps) {
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage 
  } = useBeastChat({ beast });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const MAX_MESSAGE_LENGTH = 500;

  const restoreFocus = () => {
    inputRef.current?.focus();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    restoreFocus();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;
    
    await sendMessage(input);
    setInput("");
    restoreFocus();
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <MessageComponent key={index} message={message} />
        ))}
        {isLoading && <ThinkingDots />}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          placeholder={`Talk to ${initials[beast.specie - 1].name}`}
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

export default Chat;