import { useState, useCallback } from 'react';
import axios from 'axios';
import { Beast } from '../dojo/bindings';
import beastsDex from '../data/beastDex';

export interface Message {
  user: string;
  text: string;
  isSystem?: boolean;
}

interface UseBeastChatProps {
  beast: Beast | null;
  baseUrl?: string;
  setBotMessage?: any;
}

export const useBeastChat = ({ 
  beast,
  baseUrl = import.meta.env.VITE_ELIZA_URL,
  setBotMessage,
}: UseBeastChatProps) => {
  const [message, setMessage] = useState<Message>({ user: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getBeastEndpoint = useCallback((specie: number) => {
    const beastData = beastsDex[specie - 1];
    if (!beastData) throw new Error(`Invalid beast species: ${specie}`);
    return `${baseUrl}/${beastData.name}/message`;
  }, [baseUrl]);

  const sendMessage = useCallback(async (text: string, isSystemPrompt = false) => {
    if (text.trim() === "" || isLoading || !beast) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = getBeastEndpoint(beast.specie);
      const response = await axios.post(endpoint, { text });

      if (response.data && response.data.length > 0) {
        const { user, text: responseText } = response.data[0];
        const botMessage: Message = { 
          user, 
          text: responseText,
          isSystem: isSystemPrompt 
        };
        setBotMessage(botMessage);
        setMessage(botMessage);
        return botMessage; 
      } else {
        throw new Error("Received empty response from server");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (!isSystemPrompt) {
        const errorMessage: Message = {
          user: "System",
          text: "Failed to get response. Please try again.",
          isSystem: true
        };
        setBotMessage(errorMessage)
        setMessage(errorMessage);
      }
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, beast, getBeastEndpoint]);

  const sendSystemPrompt = useCallback(async (text: string) => {
    return sendMessage(text, true);
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessage({ user: '', text: '' });
    setError(null);
  }, []);

  return {
    message,
    isLoading,
    error,
    sendMessage,
    sendSystemPrompt,
    clearMessages
  };
};