import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    text: string;
    onTextChange: (value: string) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
}

const HuffmanCodeControls = ({
  text,
  onTextChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="huffman-text" className="block text-sm font-medium text-slate-300">
            Texto de Entrada
          </label>
          <input
            id="huffman-text"
            type="text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder="ex: aabc"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="speed-huffman" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-huffman"
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-start gap-4">
          <button
            onClick={onPlayPause}
            className="flex items-center justify-center w-12 h-12 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-transform transform hover:scale-110"
            aria-label={isPlaying ? 'Pausar' : 'Iniciar'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-transform transform hover:scale-110"
            aria-label="Reiniciar"
          >
            <ResetIcon />
          </button>
      </div>
    </div>
  );
};

export default HuffmanCodeControls;