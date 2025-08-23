import React from 'react';
import { useBFPRT } from '../hooks/useBFPRT';
import BFPRTControls from './BFPRTControls';
import type { BFPRTHighlightType } from '../types';

const getHighlightColor = (type: BFPRTHighlightType | undefined) => {
    if (!type) return 'bg-sky-500/50 border-sky-400/50';
    switch (type) {
        case 'search':
            return 'bg-sky-500 border-sky-400';
        case 'group':
            return 'bg-gray-500 border-gray-400';
        case 'group-median':
            return 'bg-yellow-500 border-yellow-400';
        case 'pivot-candidate':
            return 'bg-orange-500 border-orange-400';
        case 'pivot':
            return 'bg-purple-600 border-purple-500 animate-pulse';
        case 'compare':
            return 'bg-pink-500 border-pink-400';
        case 'less':
            return 'bg-blue-500 border-blue-400';
        case 'found':
            return 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce';
        default:
            return 'bg-sky-500/50 border-sky-400/50';
    }
};

const BFPRTVisualizer = () => {
    const {
        array,
        highlights,
        message,
        arraySize,
        kValue,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        left,
        right,
        foundValue,
        actions
    } = useBFPRT(25);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="flex justify-center items-end min-h-[300px] mb-4 px-4 border-b-2 border-slate-700/50 pb-4 gap-[2px]">
                {array.map((value, index) => {
                    const highlightType = highlights[index];
                    let colorClass = getHighlightColor(highlightType);
                    
                    const isOutsideSearch = index < left || index > right;
                    if (!highlightType && isOutsideSearch && isPlaying) {
                         colorClass = 'bg-slate-600/50 border-slate-500/50 opacity-50';
                    }

                    return (
                        <div
                            key={index}
                            className={`relative flex-grow rounded-t-md transition-all duration-300 ease-in-out border-b-4 ${colorClass}`}
                            style={{ height: `${(value / (arraySize * 1.1)) * 100}%` }}
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
                    );
                })}
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message || 'Pronto para começar!'}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <BFPRTControls
                arraySize={arraySize}
                onArraySizeChange={actions.handleArraySizeChange}
                k={kValue}
                onKChange={actions.handleKChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundValue={foundValue}
            />
        </div>
    );
};

export default BFPRTVisualizer;