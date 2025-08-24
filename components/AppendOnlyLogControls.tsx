import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onSet: (key: string, value: string) => void;
    onGet: (key: string) => void;
    onReset: () => void;
    isPlaying: boolean;
    getResult: string | null;
}

const AppendOnlyLogControls = ({ onSet, onGet, onReset, isPlaying, getResult }: ControlsProps) => {
    const [key, setKey] = useState('a');
    const [value, setValue] = useState('1');
    const [getKey, setGetKey] = useState('a');

    const handleSet = () => {
        if (key && value && !isPlaying) {
            onSet(key, value);
        }
    };

    const handleGet = () => {
        if (getKey && !isPlaying) {
            onGet(getKey);
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-6">
            {/* Set Operation */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="set-key" className="block text-sm font-medium text-slate-300">Chave</label>
                    <input
                        id="set-key"
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        placeholder="ex: user:1"
                        disabled={isPlaying}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="set-value" className="block text-sm font-medium text-slate-300">Valor</label>
                    <input
                        id="set-value"
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        placeholder="ex: {'{'}name: 'Alice'}"
                        disabled={isPlaying}
                    />
                </div>
                <button
                    onClick={handleSet}
                    disabled={isPlaying || !key || !value}
                    className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Set
                </button>
            </div>

            {/* Get Operation */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="get-key" className="block text-sm font-medium text-slate-300">Chave</label>
                    <input
                        id="get-key"
                        type="text"
                        value={getKey}
                        onChange={(e) => setGetKey(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        placeholder="ex: user:1"
                        disabled={isPlaying}
                    />
                </div>
                <div className="flex-1 p-2 bg-slate-900/50 rounded-md min-h-[42px] flex items-center">
                    <span className="text-slate-400 mr-2">Resultado:</span>
                    <span className="font-mono text-emerald-400">{getResult === null ? 'N/A' : `"${getResult}"`}</span>
                </div>
                <button
                    onClick={handleGet}
                    disabled={isPlaying || !getKey}
                    className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Get
                </button>
            </div>
            
             {/* Reset Button */}
            <div className="flex justify-start">
                <button
                    onClick={onReset}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Limpar Log"
                >
                    <ResetIcon />
                    Limpar Log
                </button>
            </div>
        </div>
    );
};

export default AppendOnlyLogControls;
