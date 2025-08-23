import React from 'react';
import { useLCSTabulated } from '../hooks/useLCSTabulated';
import LCSTabulatedControls from './LCSTabulatedControls';

const TableCell = ({ value, isHighlighted, isSource, isPath }: { value: number | null, isHighlighted: boolean, isSource: boolean, isPath: boolean }) => {
    let text = '-';
    let bgColor = 'bg-slate-700/50';
    if (value !== null) {
        text = String(value);
        bgColor = 'bg-cyan-800/70';
    }
    
    let highlightClass = 'ring-1 ring-slate-700';
    if(isPath) {
        highlightClass = 'bg-emerald-700/80 ring-2 ring-emerald-500';
    } else if (isHighlighted) {
         highlightClass = 'ring-2 ring-cyan-400 scale-110 z-10';
    } else if (isSource) {
         highlightClass = 'ring-2 ring-yellow-400/80';
    }

    return (
        <div className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono text-white text-sm transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const LCSTabulatedVisualizer = () => {
    const {
        step,
        stringAInput,
        stringBInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useLCSTabulated('ABCBDAB', 'BDCABA');

    const { stringA, stringB, dpTable, highlights, message, result } = step;

    const renderTable = () => {
        const m = stringA.length;
        const n = stringB.length;

        if (m > 12 || n > 12) {
            return <div className="text-center text-slate-400 p-4 h-full flex items-center justify-center">A tabela é muito grande para exibir (tamanho da string {'>'} 12).</div>;
        }

        const isPathCell = (i: number, j: number) => {
            return highlights.path?.some(p => p[0] === i && p[1] === j) ?? false;
        }

        return (
             <div className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700 h-full">
                <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${n + 2}, auto)` }}>
                    <div className="w-12 h-10 sticky top-0 left-0 z-20 bg-slate-900/70"></div>
                    <div className="w-9 sm:w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">""</div>
                    {stringB.split('').map((char, j) => (
                        <div key={`header-b-${j}`} className="w-9 sm:w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{char}</div>
                    ))}

                    <div className="w-12 h-9 sm:h-10 flex items-center justify-center font-bold text-slate-400 sticky left-0 z-10 bg-slate-900/70">""</div>
                    {Array.from({ length: n + 1 }).map((_, j) => {
                        const isHighlighted = highlights.cell?.[0] === 0 && highlights.cell?.[1] === j;
                        return <TableCell key={`0-${j}`} value={dpTable[0]?.[j] ?? null} isHighlighted={isHighlighted} isSource={false} isPath={isPathCell(0, j)} />;
                    })}

                    {stringA.split('').map((char, i_char) => {
                        const i = i_char + 1;
                        return (
                            <React.Fragment key={`row-${i}`}>
                                <div className="w-12 h-9 sm:h-10 flex items-center justify-center font-bold text-slate-400 sticky left-0 z-10 bg-slate-900/70">{char}</div>
                                {Array.from({ length: n + 1 }).map((_, j) => {
                                    const isHighlighted = highlights.cell?.[0] === i && highlights.cell?.[1] === j;
                                    const isSource = (highlights.matchCell?.[0] === i && highlights.matchCell?.[1] === j) ||
                                                   (highlights.upCell?.[0] === i && highlights.upCell?.[1] === j) ||
                                                   (highlights.leftCell?.[0] === i && highlights.leftCell?.[1] === j);
                                    return <TableCell key={`${i}-${j}`} value={dpTable[i]?.[j] ?? null} isHighlighted={isHighlighted} isSource={isSource} isPath={isPathCell(i, j)} />
                                })}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                 <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">String A</h3>
                    <div className="flex flex-wrap gap-1 p-2 bg-slate-900/50 rounded-lg font-mono text-xl">
                        {stringA.split('').map((char, i) => (
                             <div key={i} className={`w-8 h-8 flex items-center justify-center rounded ${highlights.stringAIndex === i ? 'bg-cyan-600' : 'bg-slate-700'}`}>{char}</div>
                        ))}
                    </div>
                 </div>
                 <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">String B</h3>
                     <div className="flex flex-wrap gap-1 p-2 bg-slate-900/50 rounded-lg font-mono text-xl">
                        {stringB.split('').map((char, i) => (
                             <div key={i} className={`w-8 h-8 flex items-center justify-center rounded ${highlights.stringBIndex === i ? 'bg-cyan-600' : 'bg-slate-700'}`}>{char}</div>
                        ))}
                    </div>
                 </div>
            </div>

            <div className="h-[300px] mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Tabulação `dp[i][j]`</h3>
                {renderTable()}
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <LCSTabulatedControls
                stringA={stringAInput}
                onStringAChange={actions.handleStringAChange}
                stringB={stringBInput}
                onStringBChange={actions.handleStringBChange}
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

export default LCSTabulatedVisualizer;
