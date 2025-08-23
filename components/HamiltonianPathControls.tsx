import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    numVertices: number;
    onNumVerticesChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    foundSolution: number[] | null;
    currentStep: number;
    totalSteps: number;
}

const HamiltonianPathControls = ({
  numVertices,
  onNumVerticesChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  foundSolution,
  currentStep,
  totalSteps,
}: ControlsProps) => {
  const isFinished = !isPlaying && currentStep === totalSteps && currentStep > 0;

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="num-vertices" className="block text-sm font-medium text-slate-300">
            Número de Vértices: <span className="font-bold text-cyan-400">{numVertices}</span>
          </label>
          <input
            id="num-vertices"
            type="range"
            min="4"
            max="10"
            value={numVertices}
            onChange={(e) => onNumVerticesChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>

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
            aria-label="Reiniciar"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="text-center sm:text-right bg-slate-900/50 p-3 rounded-lg flex-grow">
            {foundSolution ? (
                 <p className="text-lg font-semibold text-emerald-400">
                    Solução Encontrada!
                </p>
            ) : isFinished ? (
                 <p className="text-lg font-semibold text-red-400">
                    Nenhuma Solução Encontrada.
                </p>
            ) : (
                <p className="text-lg font-semibold text-slate-400">
                    Buscando solução...
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default HamiltonianPathControls;