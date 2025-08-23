import React from 'react';
import { useKnapsackTabulated } from '../hooks/useKnapsackTabulated';
import KnapsackTabulatedControls from './KnapsackTabulatedControls';

const TableCell = ({ value, isHighlighted, isFrom, isFromWithValue, isPath }: { value: number | null, isHighlighted: boolean, isFrom: boolean, isFromWithValue: boolean, isPath: boolean }) => {
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
    } else if (isFrom) {
         highlightClass = 'ring-2 ring-yellow-400/80';
    } else if (isFromWithValue) {
        highlightClass = 'ring-2 ring-pink-500/80';
    }

    return (
        <div className={`relative w-9 h-9 flex items-center justify-center font-mono text-white text-sm transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const KnapsackTabulatedVisualizer = () => {
    const {
        step,
        valuesInput,
        weightsInput,
        capacityInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useKnapsackTabulated('60,100,120', '10,20,30', 50);

    const { values, weights, capacity, dpTable, dp1D, highlights, message, result } = step;

    const renderTable = () => {
        const n = values.length;

        if (capacity > 25) {
            return <div className="text-center text-slate-400 p-4 h-full flex items-center justify-center">A tabela é muito grande para exibir (capacidade {'>'} 25).</div>;
        }

        const isPathCell = (i: number, w: number) => {
            return highlights.path?.some(p => p.i === i && p.w === w) ?? false;
        }

        return (
             <div className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700 h-full">
                <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${capacity + 2}, auto)` }}>
                    {/* Header */}
                    <div className="w-20 h-9 sticky top-0 left-0 z-20 bg-slate-900/70 text-xs flex items-center justify-center text-slate-400">Item (v,w)</div>
                    {Array.from({ length: capacity + 1 }).map((_, w) => (
                        <div key={`header-w-${w}`} className="w-9 h-9 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{w}</div>
                    ))}

                    {/* Table Body */}
                    {dpTable.map((row, i) => (
                        <React.Fragment key={`row-${i}`}>
                             <div className={`w-20 h-9 flex items-center justify-center font-bold text-slate-400 text-xs sticky left-0 z-10 bg-slate-900/70 transition-colors duration-300 ${highlights.itemIndex === i - 1 ? 'bg-cyan-900/80' : ''}`}>
                                {i === 0 ? '{}' : `#${i} (${values[i-1]},${weights[i-1]})`}
                            </div>
                            {row.map((val, w) => {
                                const isHighlighted = highlights.cell?.[0] === i && highlights.cell?.[1] === w;
                                const isFrom = highlights.fromCell?.[0] === i && highlights.fromCell?.[1] === w;
                                const isFromWithValue = highlights.fromCellWithValue?.[0] === i && highlights.fromCellWithValue?.[1] === w;
                                return <TableCell key={`${i}-${w}`} value={val} isHighlighted={isHighlighted} isFrom={isFrom} isFromWithValue={isFromWithValue} isPath={isPathCell(i, w)} />
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="h-[250px] mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP `dp[i][w]`</h3>
                {renderTable()}
            </div>
            
            <div className="mb-4">
                 <h3 className="text-lg font-semibold text-slate-300 mb-2">DP Otimizado `dp[w]`</h3>
                 <div className="flex flex-wrap gap-1 p-2 bg-slate-900/70 rounded-lg border border-slate-700">
                    {dp1D.map((val, w) => {
                         const isHighlighted = highlights.dp1DIndex === w;
                         const isFrom = highlights.dp1DFromIndex === w;
                        return (
                             <div key={`1d-${w}`} className={`p-1 rounded-md transition-all duration-300 ${isHighlighted ? 'bg-cyan-700' : isFrom ? 'bg-yellow-700' : 'bg-slate-800'}`}>
                                <span className="text-xs text-slate-400">dp[{w}]</span>
                                <div className="text-center font-bold text-white">{val === null ? '-' : val}</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <KnapsackTabulatedControls
                values={valuesInput}
                onValuesChange={actions.handleValuesChange}
                weights={weightsInput}
                onWeightsChange={actions.handleWeightsChange}
                capacity={capacityInput}
                onCapacityChange={actions.handleCapacityChange}
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

export default KnapsackTabulatedVisualizer;