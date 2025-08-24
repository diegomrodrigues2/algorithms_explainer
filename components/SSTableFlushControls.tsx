import React from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onFlush: () => void;
    onReset: () => void;
    isPlaying: boolean;
    memtableSize: number;
    onMemtableSizeChange: (size: number) => void;
    sparseStep: number;
    onSparseStepChange: (step: number) => void;
    speed: number;
    onSpeedChange: (speed: number) => void;
}

const SSTableFlushControls = ({ onFlush, onReset, isPlaying, memtableSize, onMemtableSizeChange, sparseStep, onSparseStepChange, speed, onSpeedChange }: ControlsProps) => {
    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                    <label htmlFor="memtable-size" className="block text-sm font-medium text-slate-300">Tamanho da Memtable: <span className="font-bold text-cyan-400">{memtableSize}</span></label>
                    <input
                        id="memtable-size" type="range" min="5" max="20" value={memtableSize}
                        onChange={(e) => onMemtableSizeChange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                 <div className="space-y-2">
                    <label htmlFor="sparse-step" className="block text-sm font-medium text-slate-300">Passo do Índice Esparso: <span className="font-bold text-cyan-400">{sparseStep}</span></label>
                    <input
                        id="sparse-step" type="range" min="1" max={memtableSize} value={sparseStep}
                        onChange={(e) => onSparseStepChange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                <div className="col-span-full space-y-2">
                    <label htmlFor="speed-sstable" className="block text-sm font-medium text-slate-300">Velocidade da Animação</label>
                    <input
                        id="speed-sstable" type="range" min="10" max="1000" value={speed}
                        onChange={(e) => onSpeedChange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        disabled={isPlaying}
                    />
                </div>
            </div>
            
            <div className="flex justify-start gap-4">
                 <button onClick={onFlush} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors">
                    Flush para SSTable
                </button>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    <ResetIcon />
                    Resetar
                </button>
            </div>
        </div>
    );
};

export default SSTableFlushControls;