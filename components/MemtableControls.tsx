import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onPut: (key: string, value: string) => void;
    onGet: (key: string) => void;
    onDelete: (key: string) => void;
    onReset: () => void;
    isPlaying: boolean;
    getResult: string | null;
}

const MemtableControls = ({ onPut, onGet, onDelete, onReset, isPlaying, getResult }: ControlsProps) => {
    const [putKey, setPutKey] = useState('c');
    const [putValue, setPutValue] = useState('5');
    const [getKey, setGetKey] = useState('d');
    const [deleteKey, setDeleteKey] = useState('f');

    const handlePut = () => {
        if (putKey && putValue && !isPlaying) {
            onPut(putKey, putValue);
        }
    };

    const handleGet = () => {
        if (getKey && !isPlaying) {
            onGet(getKey);
        }
    };

    const handleDelete = () => {
        if (deleteKey && !isPlaying) {
            onDelete(deleteKey);
        }
    }

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-6">
            {/* Put Operation */}
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="put-key" className="block text-sm font-medium text-slate-300">Chave</label>
                    <input
                        id="put-key" type="text" value={putKey} onChange={(e) => setPutKey(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="put-value" className="block text-sm font-medium text-slate-300">Valor</label>
                    <input
                        id="put-value" type="text" value={putValue} onChange={(e) => setPutValue(e.target.value)}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                <button onClick={handlePut} disabled={isPlaying || !putKey || !putValue} className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors">
                    Put
                </button>
            </div>

            {/* Get/Delete Operation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <label htmlFor="get-key" className="block text-sm font-medium text-slate-300">Chave</label>
                        <input
                            id="get-key" type="text" value={getKey} onChange={(e) => setGetKey(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                            disabled={isPlaying}
                        />
                    </div>
                    <button onClick={handleGet} disabled={isPlaying || !getKey} className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:opacity-50 transition-colors">
                        Get
                    </button>
                </div>
                 <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <label htmlFor="delete-key" className="block text-sm font-medium text-slate-300">Chave</label>
                        <input
                            id="delete-key" type="text" value={deleteKey} onChange={(e) => setDeleteKey(e.target.value)}
                            className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                            disabled={isPlaying}
                        />
                    </div>
                     <button onClick={handleDelete} disabled={isPlaying || !deleteKey} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center gap-4">
                 <div className="flex-1 p-2 bg-slate-900/50 rounded-md min-h-[42px] flex items-center">
                    <span className="text-slate-400 mr-2">Resultado Get:</span>
                    <span className="font-mono text-emerald-400">{getResult === undefined ? '-' : (getResult === null ? 'null (Tombstone)' : `"${getResult}"`)}</span>
                </div>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    <ResetIcon /> Resetar
                </button>
            </div>
        </div>
    );
};

export default MemtableControls;
