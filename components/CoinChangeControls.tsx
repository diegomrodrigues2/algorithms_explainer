import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    coins: string;
    onCoinsChange: (value: string) => void;
    amount: number;
    onAmountChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    result: { count: number; combination: number[] } | null;
}

const CoinChangeControls = ({
  coins,
  onCoinsChange,
  amount,
  onAmountChange,
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
          <label htmlFor="coins-input" className="block text-sm font-medium text-slate-300">
            Moedas (separadas por vírgula)
          </label>
          <input
            id="coins-input"
            type="text"
            value={coins}
            onChange={(e) => onCoinsChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder="ex: 1,5,10"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-2">
           <label htmlFor="amount-input" className="block text-sm font-medium text-slate-300">
            Soma Alvo (máx. 30)
          </label>
          <input
            id="amount-input"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
            min="0"
            max="30"
          />
        </div>
        
        <div className="col-span-full space-y-2">
          <label htmlFor="speed-coinchange" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-coinchange"
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
             <p className="text-lg font-semibold text-slate-200">
                Mínimo de Moedas: <span className={`font-mono text-2xl ${result?.count === -1 ? 'text-red-400' : 'text-emerald-400'}`}>{result ? (result.count === -1 ? 'N/A' : result.count) : '-'}</span>
            </p>
             {result && result.count !== -1 && <p className="text-xs text-slate-400 font-mono">[{result.combination.join(', ')}]</p>}
        </div>
      </div>
    </div>
  );
};

export default CoinChangeControls;