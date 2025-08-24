import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onAdd: (item: string) => void;
    onCheck: (item: string) => void;
    onReset: () => void;
    isPlaying: boolean;
    n: number;
    onNChange: (n: number) => void;
    p: number;
    onPChange: (p: number) => void;
    checkResult: boolean | null;
    currentItem: string | null;
}

const BloomFilterControls = ({ onAdd, onCheck, onReset, isPlaying, n, onNChange, p, onPChange, checkResult, currentItem }: ControlsProps) => {
    const [addItem, setAddItem] = useState('apple');
    const [checkItem, setCheckItem] = useState('banana');

    const handleAdd = () => !isPlaying && addItem && onAdd(addItem);
    const handleCheck = () => !isPlaying && checkItem && onCheck(checkItem);

    const resultText = () => {
        if (checkResult === null) return '-';
        if (checkResult) return <span className="text-emerald-400">Pode Estar no Conjunto</span>;
        return <span className="text-red-400">Definitivamente Não Está</span>;
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="n-items" className="block text-sm font-medium text-slate-300">Itens Esperados (n): <span className="font-bold text-cyan-400">{n}</span></label>
                    <input id="n-items" type="range" min="5" max="50" value={n} onChange={(e) => onNChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50" disabled={isPlaying} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="p-prob" className="block text-sm font-medium text-slate-300">Prob. Falso Positivo (p): <span className="font-bold text-cyan-400">{p.toFixed(2)}</span></label>
                    <input id="p-prob" type="range" min="0.01" max="0.2" step="0.01" value={p} onChange={(e) => onPChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50" disabled={isPlaying} />
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="add-item" className="block text-sm font-medium text-slate-300">Item</label>
                    <input id="add-item" type="text" value={addItem} onChange={(e) => setAddItem(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50" disabled={isPlaying} />
                </div>
                <button onClick={handleAdd} disabled={isPlaying || !addItem} className="w-full sm:w-auto px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">Adicionar</button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-1">
                    <label htmlFor="check-item" className="block text-sm font-medium text-slate-300">Item</label>
                    <input id="check-item" type="text" value={checkItem} onChange={(e) => setCheckItem(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50" disabled={isPlaying} />
                </div>
                <button onClick={handleCheck} disabled={isPlaying || !checkItem} className="w-full sm:w-auto px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:opacity-50">Verificar</button>
            </div>
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1 p-2 bg-slate-900/50 rounded-md min-h-[42px] flex items-center text-sm">
                    <span className="text-slate-400 mr-2">Resultado para '{currentItem}':</span>
                    <span className="font-mono font-bold">{resultText()}</span>
                </div>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50"><ResetIcon /> Resetar</button>
            </div>
        </div>
    );
};

export default BloomFilterControls;