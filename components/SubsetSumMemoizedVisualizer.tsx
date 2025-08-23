import React, { useRef, useEffect } from 'react';
import { useSubsetSumMemoized } from '../hooks/useSubsetSumMemoized';
import SubsetSumMemoizedControls from './SubsetSumMemoizedControls';

const MemoTableCell = ({ value, isHighlighted }: { value: boolean | undefined, isHighlighted: boolean }) => {
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
        <div className={`relative w-10 h-10 flex items-center justify-center font-mono text-white transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const SubsetSumMemoizedVisualizer = () => {
    const {
        step,
        numbersInput,
        targetInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useSubsetSumMemoized('3,4,5,2', 7);

    const { numbers, target, memo, callStack, highlights, message, result } = step;

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const highlightedCellRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedCellRef.current && tableContainerRef.current) {
            const container = tableContainerRef.current;
            const cell = highlightedCellRef.current;
            const containerRect = container.getBoundingClientRect();
            const cellRect = cell.getBoundingClientRect();

            const scrollLeft = container.scrollLeft + cellRect.left - containerRect.left - (containerRect.width / 2) + (cellRect.width / 2);
            const scrollTop = container.scrollTop + cellRect.top - containerRect.top - (containerRect.height / 2) + (cellRect.height / 2);
            
            container.scrollTo({
                left: scrollLeft,
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }, [highlights.memoKey]);


    const renderMemoTable = () => {
        const rowCount = numbers.length + 1;
        const colCount = target + 1;

        if (target > 30) {
            return <div className="text-center text-slate-400 p-4 h-[334px] flex items-center justify-center">A tabela de memoização é muito grande para ser exibida (alvo {'>'} 30).</div>
        }

        return (
             <div ref={tableContainerRef} className="bg-slate-900/70 p-4 rounded-lg overflow-auto border border-slate-700 h-[334px]">
                <div className="inline-grid" style={{ gridTemplateColumns: `repeat(${colCount + 1}, auto)` }}>
                    {/* Header Row */}
                    <div className="w-12 h-10 sticky top-0 left-0 z-20 bg-slate-900/70"></div> {/* Top-left corner */}
                    {Array.from({ length: colCount }).map((_, t) => (
                        <div key={`header-t-${t}`} className="w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{t}</div>
                    ))}

                    {/* Table Body */}
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <React.Fragment key={`row-${i}`}>
                             <div className="w-12 h-10 flex items-center justify-center font-bold text-slate-400 text-xs sticky left-0 z-10 bg-slate-900/70">
                                {i < numbers.length ? `{${numbers.slice(i).join(',')}}` : '{}'}
                            </div>
                            {Array.from({ length: colCount }).map((_, t) => {
                                const key = `${i},${t}`;
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Memoização `memo(i, t)`</h3>
                   {renderMemoTable()}
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Pilha de Chamadas</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg h-48 overflow-y-auto flex flex-col-reverse border border-slate-700">
                        {callStack.map((call, index) => (
                            <div key={index} className={`font-mono p-1 rounded transition-colors duration-200 ${index === callStack.length-1 ? 'bg-cyan-900/80' : ''}`}>
                                dp(i={call.i}, t={call.t})
                            </div>
                        ))}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2 mt-4">Conjunto de Números</h3>
                    <div className="flex flex-wrap gap-2">
                        {numbers.map((num, i) => (
                             <div key={i} className={`px-3 py-1 rounded-md font-bold text-white border-b-2 ${highlights.numberIndex === i ? 'bg-cyan-600 border-cyan-400' : 'bg-slate-700 border-slate-600'}`}>
                                {num}
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

            <SubsetSumMemoizedControls
                numbers={numbersInput}
                onNumbersChange={actions.handleNumbersChange}
                target={targetInput}
                onTargetChange={actions.handleTargetChange}
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

export default SubsetSumMemoizedVisualizer;
