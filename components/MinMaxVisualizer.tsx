import React from 'react';
import { useMinMax } from '../hooks/useMinMax';
import MinMaxControls from './MinMaxControls';
import type { MinMaxHighlightType } from '../types';

const getHighlightColor = (type: MinMaxHighlightType | undefined) => {
    if (!type) return 'bg-slate-600 border-slate-500'; // Default bar color for non-active elements
    switch (type) {
        case 'compare-pair':
            return 'bg-yellow-500 border-yellow-400';
        case 'compare-global':
            return 'bg-pink-500 border-pink-400';
        case 'current-min':
            return 'bg-cyan-500 border-cyan-400';
        case 'current-max':
            return 'bg-red-500 border-red-400';
        case 'final-min':
            return 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50 animate-bounce';
        case 'final-max':
            return 'bg-red-400 border-red-300 shadow-lg shadow-red-400/50 animate-bounce';
        default:
            return 'bg-sky-500 border-sky-400';
    }
};

const MinMaxVisualizer = () => {
    const {
        array,
        highlights,
        message,
        arraySize,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        comparisonCount,
        minValue,
        maxValue,
        actions
    } = useMinMax(20);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="flex justify-center items-end min-h-[300px] mb-4 px-4 border-b-2 border-slate-700/50 pb-4 gap-[2px]">
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`relative flex-grow rounded-t-md transition-all duration-300 ease-in-out border-b-4 ${getHighlightColor(highlights[index] || (isPlaying ? undefined : 'current-min'))}`}
                        style={{ height: `${(value / arraySize) * 100 * 0.9 + 10}%` }}
                        title={`Valor: ${value}`}
                    >
                         {arraySize <= 30 && (
                            <span 
                                className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-90 pointer-events-none"
                                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                            >
                                {value}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message || 'Pronto para começar!'}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <MinMaxControls
                arraySize={arraySize}
                onArraySizeChange={actions.handleArraySizeChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                comparisonCount={comparisonCount}
                minValue={minValue}
                maxValue={maxValue}
            />
        </div>
    );
};

export default MinMaxVisualizer;
