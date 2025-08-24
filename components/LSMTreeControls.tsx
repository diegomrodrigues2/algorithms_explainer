import React, { useState } from 'react';
import { ResetIcon } from './Icons';

interface ControlsProps {
    onPut: (key: string, value: string) => void;
    onGet: (key: string) => void;
    onCompact: () => void;
    onReset: () => void;
    isPlaying: boolean;
    memtableLimit: number;
    onMemtableLimitChange: (limit: number) => void;
    getResult: string | null | undefined;
}

const LSMTreeControls = ({ onPut, onGet, onCompact, onReset, isPlaying, memtableLimit, onMemtableLimitChange, getResult }: ControlsProps) => {
    const [putKey, setPutKey] = useState('c');
    const [putValue, setPutValue] = useState('5');
    const [getKey, setGetKey] = useState('a');

    const handlePut = () => {
        if (putKey && putValue && !isPlaying) onPut(putKey, putValue);
    };
    const handleGet = () => {
        if (getKey && !isPlaying) onGet(getKey);
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 items-end">
                    <div className="flex-1"><label htmlFor="put-key" className="block text-sm font-medium text-slate-300">Chave</label><input id="put-key" type="text" value={putKey} onChange={(e) => setPutKey(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50" disabled={isPlaying} /></div>
                    <div className="flex-1"><label htmlFor="put-value" className="block text-sm font-medium text-slate-300">Valor</label><input id="put-value" type="text" value={putValue} onChange={(e) => setPutValue(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50" disabled={isPlaying} /></div>
                    <button onClick={handlePut} disabled={isPlaying || !putKey || !putValue} className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-cyan-600 disabled:opacity-50">Put</button>
                </div>
                 <div className="flex gap-2 items-end">
                    <div className="flex-1"><label htmlFor="get-key" className="block text-sm font-medium text-slate-300">Chave</label><input id="get-key" type="text" value={getKey} onChange={(e) => setGetKey(e.target.value)} className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50" disabled={isPlaying} /></div>
                    <div className="flex-1 p-2 bg-slate-900/50 rounded-md min-h-[42px] flex items-center"><span className="text-slate-400 mr-2">Get:</span><span className="font-mono text-emerald-400">{getResult === undefined ? '?' : getResult === null ? 'DEL' : `"${getResult}"`}</span></div>
                    <button onClick={handleGet} disabled={isPlaying || !getKey} className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 disabled:opacity-50">Get</button>
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="memtable-limit" className="block text-sm font-medium text-slate-300">Limite da Memtable (aciona Flush): <span className="font-bold text-cyan-400">{memtableLimit}</span></label>
                <input id="memtable-limit" type="range" min="2" max="10" value={memtableLimit} onChange={(e) => onMemtableLimitChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50" disabled={isPlaying}/>
            </div>
            <div className="flex justify-start gap-4">
                <button onClick={onCompact} disabled={isPlaying} className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:opacity-50">Compactar (2 mais antigos)</button>
                <button onClick={onReset} disabled={isPlaying} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-700 disabled:opacity-50"><ResetIcon /> Resetar</button>
            </div>
        </div>
    );
};
export default LSMTreeControls;
