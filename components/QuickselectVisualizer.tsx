import React from 'react';
import { useQuickselect } from '../hooks/useQuickselect';
import QuickselectControls from './QuickselectControls';
import type { QuickselectHighlightType } from '../types';

const getHighlightColor = (type: QuickselectHighlightType | undefined) => {
    if (!type) return 'bg-slate-600/50 border-slate-500/50'; // Default for out-of-scope
    switch (type) {
        case 'search':
            return 'bg-sky-500 border-sky-400';
        case 'pivot':
            return 'bg-purple-600 border-purple-500 animate-pulse';
        case 'compare':
            return 'bg-yellow-500 border-yellow-400';
        case 'less':
            return 'bg-blue-500 border-blue-400';
        case 'greater':
            return 'bg-pink-500 border-pink-400';
        case 'storeIndex':
            return 'bg-sky-500 border-sky-400'; 
        case 'final-pivot':
             return 'bg-orange-500 border-orange-400';
        case 'found':
            return 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce';
        default:
            return 'bg-slate-600/50 border-slate-500/50';
    }
};

const QuickselectVisualizer = () => {
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
        foundValue,
        actions
    } = useQuickselect(25);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="flex justify-center items-end min-h-[300px] mb-4 px-4 border-b-2 border-slate-700/50 pb-4 gap-[2px]">
                {array.map((value, index) => {
                    const highlightType = highlights[index];
                    const isStoreIndex = highlightType === 'storeIndex';
                    const colorClass = getHighlightColor(highlightType);

                    return (
                        <div key={index} className="relative flex-grow h-full pt-8">
                            {isStoreIndex && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 text-orange-400 animate-bounce" title="Store Index: Onde o próximo elemento menor que o pivô será colocado.">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V4.66L7.03 7.22a.75.75 0 01-1.06-1.06l3.5-3.5a.75.75 0 011.06 0l3.5 3.5a.75.75 0 01-1.06 1.06L10.75 4.66V17.25A.75.75 0 0110 18z" clipRule="evenodd" />
                                    </svg>
                                    <span className="absolute -top-4 -right-1 text-xs font-bold">i</span>
                                </div>
                            )}
                            <div
                                className={`absolute bottom-0 w-full rounded-t-md transition-all duration-300 ease-in-out border-b-4 ${colorClass}`}
                                style={{ height: `${(value / arraySize) * 100 * 0.9}%` }}
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
            <QuickselectControls
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

export default QuickselectVisualizer;