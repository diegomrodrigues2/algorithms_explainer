
import React, { useState } from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    startKey: number;
    onStartKeyChange: (value: number) => void;
    endKey: number;
    onEndKeyChange: (value: number) => void;
    onSearch: () => void;
    onReset: () => void;
    isPlaying: boolean;
}

const BPlusTreeControls = ({
  startKey,
  onStartKeyChange,
  endKey,
  onEndKeyChange,
  onSearch,
  onReset,
  isPlaying,
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="start-key" className="block text-sm font-medium text-slate-300">
            Chave de Início
          </label>
          <input
            id="start-key"
            type="number"
            value={startKey}
            onChange={(e) => onStartKeyChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-2">
           <label htmlFor="end-key" className="block text-sm font-medium text-slate-300">
            Chave de Fim
          </label>
          <input
            id="end-key"
            type="number"
            value={endKey}
            onChange={(e) => onEndKeyChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-start gap-4">
        <button
          onClick={onSearch}
          disabled={isPlaying}
          className="w-full sm:w-auto px-6 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors"
        >
          Buscar Intervalo
        </button>
        <button
          onClick={onReset}
          disabled={isPlaying}
          className="flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-transform transform hover:scale-110 disabled:opacity-50"
          aria-label="Nova Árvore"
        >
          <ResetIcon />
        </button>
      </div>
    </div>
  );
};

export default BPlusTreeControls;
