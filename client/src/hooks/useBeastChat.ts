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
  setBotMessage?: (message: Message) => void;
}

interface ChatResponse {
  user: string;
  text: string;
}

const DEFAULT_ERROR_MESSAGE: Message = {
  user: "System",
  text: "Failed to get response. Please try again.",
  isSystem: true
};

const getBeastEndpoint = (baseUrl: string, specie: number): string => {
  const beastData = beastsDex[specie - 1];
  if (!beastData) {
    throw new Error(`Invalid beast species: ${specie}`);
  }
  return `${baseUrl}/${beastData.name}/message`;
};

const sendChatRequest = async (
  endpoint: string, 
  text: string
): Promise<ChatResponse> => {
  const response = await axios.post(endpoint, { text });
  
  if (!response.data?.length) {
    throw new Error("Received empty response from server");
  }

  return response.data[0];
};

export const useBeastChat = ({ 
  beast,
  baseUrl = import.meta.env.VITE_ELIZA_URL,
  setBotMessage,
}: UseBeastChatProps) => {
  const [message, setMessage] = useState<Message>({ user: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: unknown, isSystemPrompt: boolean) => {
    console.error("Error sending message:", err);
    const errorMessage = err instanceof Error ? err : new Error('Failed to send message');
    setError(errorMessage);

    if (!isSystemPrompt && setBotMessage) {
      setBotMessage(DEFAULT_ERROR_MESSAGE);
      setMessage(DEFAULT_ERROR_MESSAGE);
    }
  }, [setBotMessage]);

  const sendMessage = useCallback(async (text: string, isSystemPrompt = false) => {
    if (text.trim() === "" || isLoading || !beast) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = getBeastEndpoint(baseUrl, beast.specie);
      const { user, text: responseText } = await sendChatRequest(endpoint, text);
      
      const botMessage: Message = { 
        user, 
        text: responseText,
        isSystem: isSystemPrompt 
      };

      if (setBotMessage) {
        setBotMessage(botMessage);
      }
      setMessage(botMessage);
      return botMessage;
    } catch (err) {
      handleError(err, isSystemPrompt);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, beast, baseUrl, handleError]);

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