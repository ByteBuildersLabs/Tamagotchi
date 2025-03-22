import { useState, useRef } from "react";
import MessageComponent from "../../ui/message";
import beastsDex from "../../../data/beastDex";
import messageIcon from '../../../assets/img/message.svg';
import { useBeastChat } from "../../../hooks/useBeastChat";
import './main.css';

const Chat = ({ beast, expanded, botMessage, setBotMessage }: { beast: any, expanded: boolean, botMessage:any, setBotMessage:any }) => {
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

    await sendMessage(input);
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
