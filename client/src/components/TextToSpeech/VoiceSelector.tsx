import { Voice } from '../../types/text-to-speech';

interface VoiceSelectorProps {
  selectedVoice: string;
  voices: Voice[];
  onVoiceChange: (voiceId: string) => void;
}

export const VoiceSelector = ({ selectedVoice, voices, onVoiceChange }: VoiceSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Select Voice</label>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceChange(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
};