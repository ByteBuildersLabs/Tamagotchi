import { useState } from 'react';
import { AVAILABLE_VOICES } from '../../config/voices';
import { generateSpeech } from '../../services/text-to-speech';
import { useAudio } from '../../hooks/useAudio';
import { VoiceSelector } from './VoiceSelector';

export const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(AVAILABLE_VOICES[0].id);
  const [error, setError] = useState<string | null>(null);
  
  const { audioElement, isPlaying, play, togglePlayPause } = useAudio();

  const handleGenerateAudio = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const data = await generateSpeech(text, selectedVoice);
      if (data.audio) {
        play(data.audio);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <VoiceSelector
          selectedVoice={selectedVoice}
          voices={AVAILABLE_VOICES}
          onVoiceChange={setSelectedVoice}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Enter Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            className="w-full h-32 p-2 border rounded-md resize-none"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleGenerateAudio}
            disabled={isGenerating || !text.trim()}
            className={`flex-1 px-4 py-2 rounded-md text-white ${
              isGenerating || !text.trim()
                ? "bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isGenerating ? "Generating..." : "Generate Audio"}
          </button>

          {audioElement && (
            <button
              onClick={togglePlayPause}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};