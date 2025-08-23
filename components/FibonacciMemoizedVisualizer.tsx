import React from 'react';
import { useFibonacciMemoized } from '../hooks/useFibonacciMemoized';
import FibonacciMemoizedControls from './FibonacciMemoizedControls';

const FibonacciMemoizedVisualizer = () => {
    const {
        step,
        nValue,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useFibonacciMemoized(10);

    const { n, memo, callStack, highlights, message, result } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                {/* Memoization Array */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Cache de Memoização</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2 p-3 bg-slate-900/70 rounded-lg border border-slate-700 min-h-[16rem]">
                        {Array.from({ length: n + 1 }).map((_, i) => {
                            const val = memo[i];
                            let text: React.ReactNode = '-';
                            let bgColor = 'bg-slate-700/50';
                            if (val === 'computing') {
                                text = <span className="animate-pulse">...</span>;
                                bgColor = 'bg-yellow-800/70';
                            } else if (typeof val === 'number') {
                                text = val;
                                bgColor = 'bg-emerald-800/80';
                            }
                             const isHighlighted = highlights.memoIndex === i;

                            return (
                                <div key={i} className={`relative p-2 rounded-lg transition-all duration-300 ${bgColor} ${isHighlighted ? 'ring-2 ring-cyan-400' : 'ring-1 ring-slate-700'}`}>
                                    <span className="absolute top-1 left-1.5 text-xs text-slate-400">F({i})</span>
                                    <div className="text-center text-xl font-bold mt-3 h-8 flex items-center justify-center">{text}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Call Stack */}
                <div>
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Pilha de Chamadas</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg h-[16rem] overflow-y-auto flex flex-col-reverse border border-slate-700">
                        {callStack.map((k, index) => (
                            <div key={index} className={`font-mono text-center p-1 my-0.5 rounded transition-colors duration-200 ${index === callStack.length-1 ? 'bg-cyan-900/80 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                fib({k})
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

            <FibonacciMemoizedControls
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

export default FibonacciMemoizedVisualizer;