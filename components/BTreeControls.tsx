import React, { useState } from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    t: number;
    onTChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    onInsert: (key: number) => void;
    onSearch: (key: number) => void;
}

const BTreeControls = ({
  t,
  onTChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  onInsert,
  onSearch
}: ControlsProps) => {
    const [insertValue, setInsertValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const handleInsert = () => {
        const key = parseInt(insertValue, 10);
        if (!isNaN(key)) {
            onInsert(key);
            setInsertValue('');
        }
    };

    const handleSearch = () => {
        const key = parseInt(searchValue, 10);
        if (!isNaN(key)) {
            onSearch(key);
        }
    };


  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="t-value" className="block text-sm font-medium text-slate-300">
            Grau Mínimo (t): <span className="font-bold text-cyan-400">{t}</span>
          </label>
          <input
            id="t-value"
            type="range"
            min="2"
            max="4"
            value={t}
            onChange={(e) => onTChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="speed-btree" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-btree"
            type="range"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>
      
       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="flex items-end gap-2">
                 <div className="flex-1">
                    <label htmlFor="insert-key" className="block text-sm font-medium text-slate-300">Chave para Inserir</label>
                     <input
                        id="insert-key"
                        type="number"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                 <button onClick={handleInsert} disabled={isPlaying || !insertValue} className="px-4 py-2 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 disabled:opacity-50">
                    Inserir
                </button>
            </div>
             <div className="flex items-end gap-2">
                 <div className="flex-1">
                    <label htmlFor="search-key" className="block text-sm font-medium text-slate-300">Chave para Buscar</label>
                     <input
                        id="search-key"
                        type="number"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                 <button onClick={handleSearch} disabled={isPlaying || !searchValue} className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:opacity-50">
                    Buscar
                </button>
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
            disabled={isPlaying}
            className="flex items-center justify-center w-12 h-12 bg-slate-600 text-white rounded-full hover:bg-slate-700 disabled:opacity-50"
            aria-label="Reiniciar"
          >
            <ResetIcon />
          </button>
        </div>
    </div>
  );
};

export default BTreeControls;