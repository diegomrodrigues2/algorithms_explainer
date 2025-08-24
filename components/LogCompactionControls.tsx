import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onSet: (key: string, value: string) => void;
    onCompact: () => void;
    onReset: () => void;
    isPlaying: boolean;
}

const LogCompactionControls = ({ onSet, onCompact, onReset, isPlaying }: ControlsProps) => {
    const [key, setKey] = useState('c');
    const [value, setValue] = useState('6');

    const handleSet = () => {
        if (key && value && !isPlaying) {
            onSet(key, value);
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="set-key-lc" className="block text-sm font-medium text-slate-300">Chave</label>
                    <input
                        id="set-key-lc"
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="set-value-lc" className="block text-sm font-medium text-slate-300">Valor</label>
                    <input
                        id="set-value-lc"
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                <button onClick={handleSet} disabled={isPlaying || !key || !value} className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors">
                    Adicionar ao Log
                </button>
            </div>
            
            <div className="flex justify-start gap-4">
                 <button onClick={onCompact} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:opacity-50 transition-colors">
                    Compactar Log
                </button>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    <ResetIcon />
                    Resetar
                </button>
            </div>
        </div>
    );
};

export default LogCompactionControls;
