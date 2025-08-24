
import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onInsert: (key: number) => void;
    onRecover: () => void;
    onReset: () => void;
    isPlaying: boolean;
}

const WALControls = ({ onInsert, onRecover, onReset, isPlaying }: ControlsProps) => {
    const [insertValue, setInsertValue] = useState('15');

    const handleInsert = () => {
        const key = parseInt(insertValue, 10);
        if (!isNaN(key) && !isPlaying) {
            onInsert(key);
            setInsertValue('');
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
             <div className="flex items-end gap-2">
                 <div className="flex-1">
                    <label htmlFor="insert-key-wal" className="block text-sm font-medium text-slate-300">Chave para Inserir</label>
                     <input
                        id="insert-key-wal"
                        type="number"
                        value={insertValue}
                        onChange={(e) => setInsertValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                        className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                        disabled={isPlaying}
                    />
                </div>
                 <button onClick={handleInsert} disabled={isPlaying || !insertValue} className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">
                    Insert
                </button>
            </div>
            
            <div className="flex justify-start gap-4">
                 <button onClick={onRecover} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:opacity-50 transition-colors">
                    Simular Falha e Recuperar
                </button>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50 transition-colors">
                    <ResetIcon />
                    Resetar
                </button>
            </div>
        </div>
    );
};

export default WALControls;
