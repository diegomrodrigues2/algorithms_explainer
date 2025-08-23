import React from 'react';
import { usePalindromePartitioning } from '../hooks/usePalindromePartitioning';
import PalindromePartitioningControls from './PalindromePartitioningControls';

const PalCell = ({ value, isHighlighted }: { value: boolean | null, isHighlighted: boolean }) => {
    let text = '-';
    let bgColor = 'bg-slate-700/50';
    if (value === true) {
        text = 'T';
        bgColor = 'bg-emerald-800/80';
    } else if (value === false) {
        text = 'F';
        bgColor = 'bg-red-800/80';
    }

    const highlightClass = isHighlighted ? 'ring-2 ring-cyan-400 scale-110 z-10' : 'ring-1 ring-slate-700';

    return (
        <div className={`w-8 h-8 flex items-center justify-center font-mono text-white text-sm transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const CutsCell = ({ value, isHighlighted }: { value: number | null, isHighlighted: boolean }) => {
     let bgColor = isHighlighted ? 'bg-cyan-600/80 ring-2 ring-cyan-400' : 'bg-slate-700/50 ring-1 ring-slate-700';

    return (
        <div className={`w-10 h-10 flex items-center justify-center font-mono text-white text-lg transition-all duration-300 rounded-md ${bgColor}`}>
            {value ?? '-'}
        </div>
    );
}


const PalindromePartitioningVisualizer = () => {
    const {
        step,
        s,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = usePalindromePartitioning('ababbbabbababa');

    const { pal, cuts, highlights, message, result } = step;
    const n = s.length;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">String de Entrada</h3>
                <div className="flex flex-wrap gap-1 p-2 bg-slate-900/50 rounded-lg font-mono text-xl tracking-widest">
                    {s.split('').map((char, i) => (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center rounded transition-colors duration-300 ${(highlights.pal_i === i || highlights.pal_j === i || highlights.cuts_i === i) ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                            {char}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela `pal[j][i]`</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700">
                         <div className="inline-grid gap-0.5">
                             {Array.from({ length: n }).map((_, j) => (
                                <div key={`row-${j}`} className="flex">
                                    {Array.from({ length: n }).map((_, i) => {
                                        const isHighlighted = highlights.pal_i === i && highlights.pal_j === j;
                                        return <PalCell key={`${j}-${i}`} value={pal[j]?.[i] ?? null} isHighlighted={isHighlighted} />
                                    })}
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Array `cuts[i]`</h3>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-900/70 rounded-lg border border-slate-700">
                        {Array.from({ length: n }).map((_, i) => {
                            const isHighlighted = highlights.cuts_i === i || highlights.cuts_j === i;
                            return <CutsCell key={i} value={cuts[i]} isHighlighted={isHighlighted} />
                        })}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>
            
            <PalindromePartitioningControls
                s={s}
                onStringChange={actions.handleStringChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                result={result}
            />
        </div>
    );
};

export default PalindromePartitioningVisualizer;
