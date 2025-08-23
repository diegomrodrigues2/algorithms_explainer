import React, { useRef } from 'react';
import { useSubsetSumTabulated } from '../hooks/useSubsetSumTabulated';
import SubsetSumTabulatedControls from './SubsetSumTabulatedControls';

const TableCell = ({ value, isHighlighted, isFrom, isFromWithValue }: { value: boolean | null, isHighlighted: boolean, isFrom: boolean, isFromWithValue: boolean }) => {
    let text = '-';
    let bgColor = 'bg-slate-700/50';
    if (value === true) {
        text = 'T';
        bgColor = 'bg-emerald-800/80';
    } else if (value === false) {
        text = 'F';
        bgColor = 'bg-red-800/80';
    }
    
    let highlightClass = 'ring-1 ring-slate-700';
    if (isHighlighted) {
         highlightClass = 'ring-2 ring-cyan-400 scale-110 z-10';
    } else if (isFrom) {
         highlightClass = 'ring-2 ring-yellow-400/80';
    } else if (isFromWithValue) {
         highlightClass = 'ring-2 ring-pink-400/80';
    }

    return (
        <div className={`relative w-9 h-9 flex items-center justify-center font-mono text-white text-sm transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const SubsetSumTabulatedVisualizer = () => {
    const {
        step,
        numbersInput,
        targetInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useSubsetSumTabulated('3,4,5', 7);

    const { numbers, target, dpTable, dp1D, highlights, message, result } = step;

    const tableContainerRef = useRef<HTMLDivElement>(null);
    
    const renderTable = (is1D = false) => {
        if (target > 25) {
            return <div className="text-center text-slate-400 p-4 h-full flex items-center justify-center">A tabela é muito grande para exibir (alvo {'>'} 25).</div>;
        }

        if(is1D) {
            return (
                <div className="flex flex-wrap gap-1">
                    {dp1D.map((val, t) => {
                         const isHighlighted = highlights.dp1DIndex === t;
                         const isFrom = highlights.dp1DFromIndex === t;
                        return (
                             <div key={`1d-${t}`} className={`p-1 rounded-md transition-all duration-300 ${isHighlighted ? 'bg-cyan-700' : isFrom ? 'bg-yellow-700' : 'bg-slate-800'}`}>
                                <span className="text-xs text-slate-400">dp[{t}]</span>
                                <div className="text-center font-bold text-white">{val === null ? '-' : val ? 'T' : 'F'}</div>
                            </div>
                        )
                    })}
                </div>
            )
        }

        return (
             <div ref={tableContainerRef} className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700 h-full">
                <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${target + 1}, auto)` }}>
                    {/* Header Row */}
                     <div className="w-16 h-9 flex items-center justify-center font-bold text-slate-400 text-xs sticky top-0 z-10 bg-slate-900/70">Soma →</div>
                    {Array.from({ length: target + 1 }).map((_, t) => (
                        <div key={`header-t-${t}`} className="w-9 h-9 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{t}</div>
                    ))}

                    {/* Table Body */}
                    {dpTable.map((row, i) => (
                        <React.Fragment key={`row-${i}`}>
                             <div className="w-16 h-9 flex items-center justify-center font-bold text-slate-400 text-xs sticky left-0 z-10 bg-slate-900/70">
                                {i === 0 ? '{}' : `{..${numbers[i-1]}}`}
                            </div>
                            {row.map((val, t) => {
                                const isHighlighted = highlights.cell?.[0] === i && highlights.cell?.[1] === t;
                                const isFrom = highlights.fromCell?.[0] === i && highlights.fromCell?.[1] === t;
                                const isFromWithValue = highlights.fromCellWithValue?.[0] === i && highlights.fromCellWithValue?.[1] === t;
                                return <TableCell key={`${i}-${t}`} value={val} isHighlighted={isHighlighted} isFrom={isFrom} isFromWithValue={isFromWithValue} />
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
                <h3 className="text-lg font-semibold text-slate-300 w-full">Conjunto de Números</h3>
                {numbers.map((num, i) => (
                     <div key={i} className={`px-3 py-1 rounded-md font-bold text-white text-lg border-b-2 ${highlights.numberIndex === i ? 'bg-cyan-600 border-cyan-400 scale-110' : 'bg-slate-700 border-slate-600'}`}>
                        {num}
                    </div>
                ))}
            </div>

             <div className="grid grid-cols-1 gap-4 mb-4">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP `dp[i][t]` (Espaço O(n*T))</h3>
                    <div className="h-[200px]">
                        {renderTable(false)}
                    </div>
                 </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP Otimizada `dp[t]` (Espaço O(T))</h3>
                    {renderTable(true)}
                 </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <SubsetSumTabulatedControls
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

export default SubsetSumTabulatedVisualizer;