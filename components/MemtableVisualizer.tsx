import React from 'react';
import { useMemtable } from '../hooks/useMemtable';
import MemtableControls from './MemtableControls';
import type { MemtableHighlightType } from '../types';

const getHighlightClasses = (type: MemtableHighlightType | undefined) => {
    switch (type) {
        case 'low': return 'border-b-4 border-sky-400';
        case 'high': return 'border-t-4 border-pink-400';
        case 'mid': return 'bg-yellow-500/80 scale-110 ring-2 ring-yellow-400';
        case 'found': return 'bg-emerald-500/90 ring-2 ring-emerald-400';
        case 'insert': return 'bg-cyan-600/90 ring-2 ring-cyan-400';
        case 'update': return 'bg-purple-600/90 ring-2 ring-purple-400';
        default: return 'bg-slate-700';
    }
};

const MemtableVisualizer = () => {
    const {
        step,
        isPlaying,
        actions
    } = useMemtable();

    const { keys, values, message, highlights, getResult, searchState } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Memtable (Arrays Ordenados)</h3>
                <div className="bg-slate-900/70 p-4 rounded-lg min-h-[12rem] border border-slate-700">
                    {/* Keys Array */}
                    <div className="flex gap-2 items-end">
                        <div className="w-12 font-bold text-slate-400">Keys:</div>
                        {keys.map((key, index) => (
                             <div key={`key-${index}`} className={`relative w-12 h-12 flex items-center justify-center rounded-md font-mono text-white transition-all duration-300 ${getHighlightClasses(highlights[index])}`}>
                                {searchState?.low === index && <div className="absolute -top-3 text-sky-400 text-xs">▼ L</div>}
                                {searchState?.high === index && <div className="absolute -bottom-3 text-pink-400 text-xs">▲ H</div>}
                                {searchState?.mid === index && <div className="absolute -top-3 text-yellow-400 text-xs">M</div>}
                                {key}
                            </div>
                        ))}
                    </div>
                     {/* Values Array */}
                    <div className="flex gap-2 items-start mt-2">
                        <div className="w-12 font-bold text-slate-400">Values:</div>
                         {values.map((value, index) => (
                             <div key={`val-${index}`} className={`w-12 h-12 flex items-center justify-center rounded-md font-mono text-white transition-all duration-300 ${getHighlightClasses(highlights[index])}`}>
                                {value === null ? <span className="text-red-400 text-xs">DEL</span> : value}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>

            <MemtableControls
                onPut={actions.put}
                onGet={actions.get}
                onDelete={(key) => actions.put(key, null)}
                onReset={actions.reset}
                isPlaying={isPlaying}
                getResult={getResult}
            />
        </div>
    );
};

export default MemtableVisualizer;
