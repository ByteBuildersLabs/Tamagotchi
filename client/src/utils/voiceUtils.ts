import { Voice } from '../types/text-to-speech';
import { AVAILABLE_VOICES } from '../config/voices';

export const findMatchingVoice = (beastName: string): Voice => {
  // Find a voice that matches the beast name (case-insensitive)
  const matchingVoice = AVAILABLE_VOICES.find(
    voice => voice.name.toLowerCase() === beastName.toLowerCase()
  );

  // If no matching voice is found, use WolfPup as default
  return matchingVoice || AVAILABLE_VOICES.find(voice => voice.name === "WolfPup") || AVAILABLE_VOICES[0];
};