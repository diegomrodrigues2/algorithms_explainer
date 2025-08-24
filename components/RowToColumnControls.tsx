
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

const RowToColumnControls = ({
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
          <label htmlFor="json-input" className="block text-sm font-medium text-slate-300">
            Dados de Entrada (JSON Array de Objetos)
          </label>
          <textarea
            id="json-input"
            value={textInput}
            onChange={(e) => onTextInputChange(e.target.value)}
            className="w-full h-40 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white font-mono text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            placeholder='[{"id": 1, "val": "a"}, {"id": 2, "val": "b"}]'
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="speed-rtc" className="block text-sm font-medium text-slate-300">
                Velocidade da Animação
              </label>
              <input
                id="speed-rtc"
                type="range"
                min="50"
                max="1000"
                step="50"
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
             <div className="flex items-center gap-4 pt-4">
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
                disabled={isPlaying}
              >
                <ResetIcon />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RowToColumnControls;
