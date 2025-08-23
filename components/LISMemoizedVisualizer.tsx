import React, { useRef, useEffect } from 'react';
import { useLISMemoized } from '../hooks/useLISMemoized';
import LISMemoizedControls from './LISMemoizedControls';

const MemoTableCell = ({ value, isHighlighted }: { value: number | undefined, isHighlighted: boolean }) => {
    let text = '-';
    let bgColor = 'bg-slate-700/50';
    if (value !== undefined) {
        text = String(value);
        bgColor = 'bg-cyan-800/70';
    }
    
    const highlightClass = isHighlighted ? 'ring-2 ring-cyan-400 scale-110 z-10' : 'ring-1 ring-slate-700';

    return (
        <div className={`relative w-10 h-10 flex items-center justify-center font-mono text-white transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const LISMemoizedVisualizer = () => {
    const {
        step,
        sequenceInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useLISMemoized('3,10,2,1,20');

    const { sequence, memo, callStack, highlights, message, result, currentMax } = step;

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const highlightedCellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedCellRef.current && tableContainerRef.current) {
            const container = tableContainerRef.current;
            const cell = highlightedCellRef.current;
            container.scrollTo({
                left: cell.offsetLeft - container.offsetWidth / 2 + cell.offsetWidth / 2,
                top: cell.offsetTop - container.offsetHeight / 2 + cell.offsetHeight / 2,
                behavior: 'smooth'
            });
        }
    }, [highlights.memoKey]);
    
    const renderMemoTable = () => {
        const n = sequence.length;

        if (n > 10) {
            return <div className="text-center text-slate-400 p-4 h-full flex items-center justify-center">A tabela de memoização é grande demais para ser exibida (n {'>'} 10).</div>
        }

        return (
             <div ref={tableContainerRef} className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700 h-full">
                <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${n + 2}, auto)` }}>
                    {/* Top-left corner */}
                    <div className="w-12 h-10 sticky top-0 left-0 z-20 bg-slate-900/70 text-slate-400 text-xs flex items-end justify-center pb-1">i\prev</div>
                    {/* Header Row (prev_idx) */}
                    {Array.from({ length: n + 1 }).map((_, j) => {
                        const prev_idx = j - 1;
                        return (
                            <div key={`header-prev-${prev_idx}`} className="w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{prev_idx === -1 ? '-1' : `${prev_idx}`}</div>
                        )
                    })}

                    {/* Table Body */}
                    {Array.from({ length: n + 1 }).map((_, i) => (
                        <React.Fragment key={`row-${i}`}>
                             <div className="w-12 h-10 flex items-center justify-center font-bold text-slate-400 sticky left-0 z-10 bg-slate-900/70">{i}</div>
                            {Array.from({ length: n + 1 }).map((_, j) => {
                                const prev_idx = j - 1;
                                const key = `${i},${prev_idx}`;
                                const isHighlighted = highlights.memoKey === key;
                                const cellRef = isHighlighted ? highlightedCellRef : null;
                                return (
                                    <div ref={cellRef} key={key}>
                                        <MemoTableCell value={memo[key]} isHighlighted={isHighlighted} />
                                    </div>
                                )
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="flex flex-wrap gap-2 mb-4">
                <h3 className="text-lg font-semibold text-slate-300 w-full">Sequência de Entrada</h3>
                {sequence.map((num, i) => (
                     <div key={i} className={`px-3 py-1 rounded-md font-bold text-white border-b-2 ${highlights.sequenceIndex === i ? 'bg-cyan-600 border-cyan-400' : (highlights.prevIndex === i ? 'bg-amber-600 border-amber-400' : 'bg-slate-700 border-slate-600')}`}>
                        {num}
                    </div>
                ))}
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 h-[300px]">
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Memoização `memo(i, prev_idx)`</h3>
                   {renderMemoTable()}
                </div>
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Pilha de Chamadas</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg h-[260px] overflow-y-auto flex flex-col-reverse border border-slate-700">
                        {callStack.map((call, index) => (
                            <div key={index} className={`font-mono p-1 rounded transition-colors duration-200 ${index === callStack.length-1 ? 'bg-cyan-900/80' : ''}`}>
                                dfs(i={call.i}, p={call.prev_idx})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <LISMemoizedControls
                sequence={sequenceInput}
                onSequenceChange={actions.handleSequenceChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                lisLength={result ?? currentMax}
            />
        </div>
    );
};

export default LISMemoizedVisualizer;
