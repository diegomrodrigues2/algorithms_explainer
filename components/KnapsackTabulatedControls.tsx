import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    values: string;
    onValuesChange: (value: string) => void;
    weights: string;
    onWeightsChange: (value: string) => void;
    capacity: number;
    onCapacityChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    result: { value: number; items: { value: number, weight: number, index: number }[] } | null;
}

const KnapsackTabulatedControls = ({
  values,
  onValuesChange,
  weights,
  onWeightsChange,
  capacity,
  onCapacityChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  result
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="values-input" className="block text-sm font-medium text-slate-300">
            Valores (v)
          </label>
          <input
            id="values-input"
            type="text"
            value={values}
            onChange={(e) => onValuesChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder="ex: 60,100,120"
            disabled={isPlaying}
          />
        </div>
         <div className="space-y-2">
          <label htmlFor="weights-input" className="block text-sm font-medium text-slate-300">
            Pesos (w)
          </label>
          <input
            id="weights-input"
            type="text"
            value={weights}
            onChange={(e) => onWeightsChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder="ex: 10,20,30"
            disabled={isPlaying}
          />
        </div>
         <div className="space-y-2">
           <label htmlFor="capacity-input" className="block text-sm font-medium text-slate-300">
            Capacidade (W)
          </label>
          <input
            id="capacity-input"
            type="number"
            value={capacity}
            onChange={(e) => onCapacityChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
            min="0"
            max="50"
          />
        </div>
      </div>
      
      <div className="col-span-full space-y-2 mt-4">
          <label htmlFor="speed-knapsack" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-knapsack"
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
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
             <p className="text-lg font-semibold text-slate-200">
                Valor Máximo: <span className="font-mono text-emerald-400 text-2xl">{result?.value ?? '-'}</span>
            </p>
             {result && <p className="text-xs text-slate-400 font-mono">Itens: {result.items.map(it => `#${it.index+1}`).join(', ') || 'Nenhum'}</p>}
        </div>
      </div>
    </div>
  );
};

export default KnapsackTabulatedControls;