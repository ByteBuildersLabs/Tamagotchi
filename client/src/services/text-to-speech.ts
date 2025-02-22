import axios from 'axios';
import { TextToSpeechResponse } from '../types/text-to-speech';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

export const generateSpeech = async (text: string, voice: string): Promise<TextToSpeechResponse> => {

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          Accept: 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'arraybuffer'
      }
    );
    
    if (!(response.data instanceof ArrayBuffer)) {
      throw new Error('Invalid response format');
    }

    // Convert ArrayBuffer to Base64
    const audioBuffer = new Uint8Array(response.data);
    const audioBase64 = btoa(
      audioBuffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    return { audio: audioBase64 };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail?.message || 'Failed to generate audio';
      throw new Error(errorMessage);
    }
    throw new Error('Failed to generate audio');
  }
};