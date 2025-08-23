import React, { useRef, useEffect } from 'react';
import { useEditDistance } from '../hooks/useEditDistance';
import EditDistanceControls from './EditDistanceControls';

const MemoTableCell = ({ value, isHighlighted }: { value: number | undefined, isHighlighted: boolean }) => {
    let text = '-';
    let bgColor = 'bg-slate-700/50';
    if (value !== undefined) {
        text = String(value);
        bgColor = 'bg-cyan-800/70';
    }
    
    const highlightClass = isHighlighted ? 'ring-2 ring-cyan-400 scale-110 z-10' : 'ring-1 ring-slate-700';

    return (
        <div className={`relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono text-white text-sm transition-all duration-300 ${bgColor} ${highlightClass}`}>
            {text}
        </div>
    );
}

const EditDistanceVisualizer = () => {
    const {
        step,
        stringAInput,
        stringBInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useEditDistance('kitten', 'sitting');

    const { stringA, stringB, memo, callStack, highlights, message, result } = step;

    const tableContainerRef = useRef<HTMLDivElement>(null);
    
    const renderMemoTable = () => {
        const m = stringA.length;
        const n = stringB.length;

        return (
             <div ref={tableContainerRef} className="bg-slate-900/70 p-2 rounded-lg overflow-auto border border-slate-700 h-full">
                <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${n + 2}, auto)` }}>
                    {/* Top-left corners */}
                    <div className="w-12 h-10 sticky top-0 left-0 z-20 bg-slate-900/70"></div>
                    <div className="w-9 sm:w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">""</div>
                    {/* Header Row (stringB) */}
                    {stringB.split('').map((char, j) => (
                        <div key={`header-b-${j}`} className="w-9 sm:w-10 h-10 flex items-center justify-center font-bold text-slate-400 sticky top-0 z-10 bg-slate-900/70">{char}</div>
                    ))}

                    {/* Table Body */}
                    {/* First row for empty stringA */}
                    <div className="w-12 h-9 sm:h-10 flex items-center justify-center font-bold text-slate-400 sticky left-0 z-10 bg-slate-900/70">""</div>
                     {Array.from({ length: n + 1 }).map((_, j) => {
                         const key = `0,${j}`;
                         return <MemoTableCell key={key} value={memo[key]} isHighlighted={highlights.memoKey === key} />;
                     })}

                    {/* Subsequent rows */}
                    {stringA.split('').map((char, i_char) => {
                        const i = i_char + 1;
                        return (
                            <React.Fragment key={`row-${i}`}>
                                <div className="w-12 h-9 sm:h-10 flex items-center justify-center font-bold text-slate-400 sticky left-0 z-10 bg-slate-900/70">{char}</div>
                                {Array.from({ length: n + 1 }).map((_, j) => {
                                    const key = `${i},${j}`;
                                    return <MemoTableCell key={key} value={memo[key]} isHighlighted={highlights.memoKey === key} />
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

             <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 h-[300px]">
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Memoização `dp(i, j)`</h3>
                   {renderMemoTable()}
                </div>
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Pilha de Chamadas</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg h-[260px] overflow-y-auto flex flex-col-reverse border border-slate-700">
                        {callStack.map((call, index) => (
                            <div key={index} className={`font-mono p-1 rounded transition-colors duration-200 ${index === callStack.length-1 ? 'bg-cyan-900/80' : ''}`}>
                                dp(i={call.i}, j={call.j})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <EditDistanceControls
                stringA={stringAInput}
                onStringAChange={actions.handleStringAChange}
                stringB={stringBInput}
                onStringBChange={actions.handleStringBChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                distance={result}
            />
        </div>
    );
};

export default EditDistanceVisualizer;
