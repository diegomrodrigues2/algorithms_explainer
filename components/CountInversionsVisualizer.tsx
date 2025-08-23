import React from 'react';
import { useCountInversions } from '../hooks/useCountInversions';
import CountInversionsControls from './CountInversionsControls';
import type { HighlightType } from '../types';

const getHighlightColor = (type: HighlightType | undefined) => {
    if (!type) return 'bg-sky-500 border-sky-400'; // Default bar color
    switch (type) {
        case 'compare':
            return 'bg-amber-500 border-amber-400';
        case 'inversion':
            return 'bg-red-600 border-red-500 animate-pulse';
        case 'sorted':
            return 'bg-emerald-500 border-emerald-400';
        default:
            return 'bg-sky-500 border-sky-400';
    }
};

const CountInversionsVisualizer = () => {
    const {
        array,
        highlights,
        inversionsCount,
        message,
        arraySize,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useCountInversions(15);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="flex justify-center items-end min-h-[300px] mb-4 px-4 border-b-2 border-slate-700/50 pb-4 gap-[2px]">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`relative flex-grow rounded-t-md transition-all duration-300 ease-in-out border-b-4 ${getHighlightColor(highlights[index])}`}
                        style={{ height: `${(value / arraySize) * 100 * 0.9 + 10}%` }}
                        title={`Value: ${value}`}
                    >
                        {arraySize < 40 && (
                            <span 
                                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-90 pointer-events-none"
                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}
                            >
                                {value}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono">{message || 'Pronto para começar!'}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <CountInversionsControls
                arraySize={arraySize}
                onArraySizeChange={actions.handleArraySizeChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                inversions={inversionsCount}
            />
        </div>
    );
};

export default CountInversionsVisualizer;