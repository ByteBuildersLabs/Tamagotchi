import { useState } from 'react';
import { generateSpeech } from '../../services/text-to-speech';
import { findMatchingVoice } from '../../utils/voiceUtils';
import textToSpeechIcon from '../../assets/img/text-to-speech.svg';
import './main.css';

interface TextToSpeechProps {
  beastName: string;
  text: string;
}

export const TextToSpeech = ({ beastName, text }: TextToSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleStop = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  };

  const handlePlay = async () => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setIsPlaying(false);
      }

      const beastVoice = findMatchingVoice(beastName);
      const data = await generateSpeech(text, beastVoice.id);
      
      if (data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };

        audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <button
      className="audio-button"
      onClick={() => isPlaying ? handleStop() : handlePlay()}
      title={`Listen to ${beastName}'s description`}
    >
      <div className="audio-button_icon">
        <img src={textToSpeechIcon} alt="text to speech" />
      </div>
    </button>
  );
};