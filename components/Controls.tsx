
import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    numDisks: number;
    onNumDisksChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    currentMove: number;
    totalMoves: number;
}

const Controls = ({
  numDisks,
  onNumDisksChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  currentMove,
  totalMoves
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Disk Selector */}
        <div className="space-y-2">
          <label htmlFor="numDisks" className="block text-sm font-medium text-slate-300">
            Número de Discos: <span className="font-bold text-cyan-400">{numDisks}</span>
          </label>
          <input
            id="numDisks"
            type="range"
            min="1"
            max="10"
            value={numDisks}
            onChange={(e) => onNumDisksChange(Number(e.target.value))}
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
            min="50"
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
            disabled={isPlaying}
            className="flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Reiniciar"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="text-center sm:text-right">
            <p className="text-lg font-semibold text-slate-200">
                Movimento: <span className="font-mono text-cyan-400">{currentMove}</span> / <span className="font-mono text-slate-400">{totalMoves}</span>
            </p>
            <p className="text-xs text-slate-400">(mínimo de movimentos necessários)</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
