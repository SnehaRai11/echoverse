
import React from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface AudioPlayerProps {
  isSpeaking: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
  disabled?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isSpeaking, onPlayPause, onDownload, disabled = false }) => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-slate-900 rounded-lg border-2 border-slate-700">
      <button
        onClick={onPlayPause}
        disabled={disabled}
        className="p-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label={isSpeaking ? 'Pause' : 'Play'}
      >
        {isSpeaking ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
      </button>
      <div className="text-center flex-grow">
        <p className="font-bold text-lg">{isSpeaking ? 'Playing Audio...' : 'Ready to Play'}</p>
        <p className="text-sm text-slate-400">Click play to hear the synthesized voice</p>
      </div>
      <button
        onClick={onDownload}
        disabled={disabled}
        className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label="Download Script"
        title="Download Script as .txt"
      >
        <DownloadIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AudioPlayer;
