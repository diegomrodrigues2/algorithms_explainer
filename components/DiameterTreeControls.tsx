import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    numNodes: number;
    onNumNodesChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    result: number | null;
}

const DiameterTreeControls = ({
  numNodes,
  onNumNodesChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  result
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="num-nodes-diameter" className="block text-sm font-medium text-slate-300">
            Número de Nós: <span className="font-bold text-cyan-400">{numNodes}</span>
          </label>
          <input
            id="num-nodes-diameter"
            type="range"
            min="3"
            max="25"
            value={numNodes}
            onChange={(e) => onNumNodesChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="speed-diameter" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-diameter"
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
      
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
            aria-label="Nova Árvore"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="text-center sm:text-right bg-slate-900/50 p-3 rounded-lg flex-grow">
            <p className="text-lg font-semibold text-slate-200">
                Diâmetro: <span className="font-mono text-emerald-400 text-2xl">{result ?? '-'}</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default DiameterTreeControls;