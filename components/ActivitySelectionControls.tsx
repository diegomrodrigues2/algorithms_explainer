import React from 'react';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';

interface ControlsProps {
    numActivities: number;
    onNumActivitiesChange: (value: number) => void;
    speed: number;
    onSpeedChange: (value: number) => void;
    isPlaying: boolean;
    onPlayPause: () => void;
    onReset: () => void;
    selectedCount: number;
}

const ActivitySelectionControls = ({
  numActivities,
  onNumActivitiesChange,
  speed,
  onSpeedChange,
  isPlaying,
  onPlayPause,
  onReset,
  selectedCount
}: ControlsProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="num-activities" className="block text-sm font-medium text-slate-300">
            Número de Atividades: <span className="font-bold text-cyan-400">{numActivities}</span>
          </label>
          <input
            id="num-activities"
            type="range"
            min="5"
            max="20"
            value={numActivities}
            onChange={(e) => onNumActivitiesChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
            disabled={isPlaying}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="speed-activity" className="block text-sm font-medium text-slate-300">
            Velocidade da Animação
          </label>
          <input
            id="speed-activity"
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
            aria-label="Novas Atividades"
          >
            <ResetIcon />
          </button>
        </div>
        <div className="text-center sm:text-right bg-slate-900/50 p-3 rounded-lg flex-grow">
            <p className="text-lg font-semibold text-slate-200">
                Atividades Selecionadas: <span className="font-mono text-emerald-400 text-2xl">{selectedCount}</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default ActivitySelectionControls;
