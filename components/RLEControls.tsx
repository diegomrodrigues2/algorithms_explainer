
import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    textInput: string;
    onTextInputChange: (value: string) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
}

const RLEControls = ({
  textInput,
  onTextInputChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="rle-input" className="block text-sm font-medium text-slate-300">
            Sequência de Entrada
          </label>
          <input
            id="rle-input"
            type="text"
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder="Ex: AAAAABBBC"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="speed-rle" className="block text-sm font-medium text-slate-300">
                Velocidade da Animação
              </label>
              <input
                id="speed-rle"
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
             <div className="flex items-center gap-4 pt-2">
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
      </div>
    </div>
  );
};

export default RLEControls;
