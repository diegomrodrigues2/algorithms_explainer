import React from 'react';
import { useBloomFilter } from '../hooks/useBloomFilter';
import BloomFilterControls from './BloomFilterControls';

const Bit = ({ value, isHighlighted }: { value: boolean | null, isHighlighted: boolean }) => {
    let bgColor = 'bg-slate-700/50';
    if (value === true) bgColor = 'bg-emerald-500/80';
    
    const highlightClass = isHighlighted ? 'ring-2 ring-cyan-400 scale-110 z-10' : 'ring-1 ring-slate-700';

    return (
        <div className={`w-6 h-6 flex items-center justify-center font-mono text-white text-xs transition-all duration-300 rounded-sm ${bgColor} ${highlightClass}`}>
            {value ? 1 : 0}
        </div>
    );
};

const BloomFilterVisualizer = () => {
    const { step, isPlaying, actions } = useBloomFilter();
    const { bitArray, m, k, n, p, message, highlights, operation, currentItem, checkResult, hashCalculations } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Filtro de Bloom (Array de Bits)</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-64 overflow-y-auto border border-slate-700 flex flex-wrap gap-1">
                        {bitArray.map((bit, index) => (
                            <Bit key={index} value={bit} isHighlighted={highlights.bits?.includes(index) ?? false} />
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Parâmetros & Hashes</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-64 border border-slate-700 space-y-2 text-sm">
                        <p>n (itens): <span className="font-mono text-cyan-400">{n}</span></p>
                        <p>p (erro): <span className="font-mono text-cyan-400">{p.toFixed(2)}</span></p>
                        <hr className="border-slate-700 my-2" />
                        <p>m (bits): <span className="font-mono text-amber-400">{m}</span></p>
                        <p>k (hashes): <span className="font-mono text-amber-400">{k}</span></p>
                         <hr className="border-slate-700 my-2" />
                         {currentItem && (
                             <div>
                                 <p>Item: <span className="font-mono text-yellow-400">"{currentItem}"</span></p>
                                 <div className="mt-1 space-y-1">
                                    {hashCalculations.map((calc, i) => (
                                        <p key={i} className="font-mono text-slate-400">{calc.func} % {m} = <span className="text-white">{calc.index}</span></p>
                                    ))}
                                 </div>
                             </div>
                         )}
                    </div>
                </div>
            </div>
            
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>

            <BloomFilterControls
                onAdd={actions.add}
                onCheck={actions.check}
                onReset={actions.reset}
                isPlaying={isPlaying}
                n={n}
                onNChange={actions.handleNChange}
                p={p}
                onPChange={actions.handlePChange}
                checkResult={checkResult}
                currentItem={currentItem}
            />
        </div>
    );
};

export default BloomFilterVisualizer;