import React from 'react';
import { useFibonacciTabulated } from '../hooks/useFibonacciTabulated';
import FibonacciTabulatedControls from './FibonacciTabulatedControls';

const FibonacciTabulatedVisualizer = () => {
    const {
        step,
        nValue,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useFibonacciTabulated(10);

    const { n, dp, optimized, highlights, message, result } = step;

    const getHighlightClass = (index: number) => {
        if (highlights.dpIndex === index) return 'bg-cyan-600 border-cyan-400 scale-110';
        if (highlights.prev1 === index || highlights.prev2 === index) return 'bg-yellow-600 border-yellow-400';
        return 'bg-slate-700 border-slate-600';
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* DP Table */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP (Espaço O(n))</h3>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-900/70 rounded-lg border border-slate-700 min-h-[5rem]">
                    {dp.map((val, i) => (
                        <div key={i} className={`p-2 rounded-lg transition-all duration-300 border-b-4 ${getHighlightClass(i)}`}>
                            <span className="text-xs text-slate-400">dp[{i}]</span>
                            <div className="text-center text-xl font-bold text-white">{val ?? '?'}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Space Optimized */}
            <div className="mb-6">
                 <h3 className="text-lg font-semibold text-slate-300 mb-2">Otimizado (Espaço O(1))</h3>
                <div className="flex items-center justify-center gap-4 p-3 bg-slate-900/70 rounded-lg border border-slate-700">
                    <div className="p-3 rounded-lg bg-slate-800 w-28 text-center">
                        <span className="text-sm text-slate-400">prev</span>
                        <div className="text-2xl font-bold text-cyan-400">{optimized.prev}</div>
                    </div>
                     <div className="p-3 rounded-lg bg-slate-800 w-28 text-center">
                        <span className="text-sm text-slate-400">curr</span>
                        <div className="text-2xl font-bold text-cyan-400">{optimized.curr}</div>
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

            <FibonacciTabulatedControls
                n={nValue}
                onNChange={actions.handleNChange}
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

export default FibonacciTabulatedVisualizer;