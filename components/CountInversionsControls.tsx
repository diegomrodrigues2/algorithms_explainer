import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    arraySize: number;
    onArraySizeChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    inversions: number;
}

const CountInversionsControls = ({
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  inversions
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Array Size Selector */}
        <div className="space-y-2">
          <label htmlFor="arraySize" className="block text-sm font-medium text-slate-300">
            Tamanho do Array: <span className="font-bold text-cyan-400">{arraySize}</span>
          </label>
          <input
            id="arraySize"
            type="range"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPlaying}
          />
        </div>

        {/* Speed Selector */}
        <div className="space-y-2">
          <label htmlFor="speed" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed"
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
      
      {/* Buttons and Info */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
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
            aria-label="Novo Array"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="text-center sm:text-right">
            <p className="text-lg font-semibold text-slate-200">
                Inversões: <span className="font-mono text-cyan-400 text-2xl">{inversions}</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default CountInversionsControls;
