import React from 'react';
import { useLIS } from '../hooks/useLIS';
import LISControls from './LISControls';
import type { LISHiglightType } from '../types';

const getHighlightClasses = (type: LISHiglightType | undefined) => {
    switch (type) {
        case 'considering':
            return 'bg-yellow-500 border-yellow-400 scale-110';
        case 'included':
            return 'bg-cyan-600 border-cyan-500';
        case 'skipped':
            return 'bg-slate-600 border-slate-500 opacity-50';
        case 'solution':
            return 'bg-emerald-500 border-emerald-400 animate-pulse';
        default:
            return 'bg-slate-700 border-slate-600';
    }
};

const LISVisualizer = () => {
    const {
        step,
        sequenceInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useLIS('3, 10, 2, 1, 20');

    const { sequence, highlights, currentSubsequence, bestSubsequence, message } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Main Sequence Display */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Sequência de Entrada</h3>
                <div className="flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-lg min-h-[5rem] items-center">
                    {sequence.map((num, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 rounded-lg font-bold text-white text-lg border-b-4 transition-all duration-300 ${getHighlightClasses(highlights[index])}`}
                        >
                            {num}
                        </div>
                    ))}
                     {!sequence.length && <p className="text-slate-500">Insira uma sequência para começar.</p>}
                </div>
            </div>

            {/* Current and Best Subsequences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Subsequência Atual</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[3.5rem] items-center font-mono text-cyan-400 text-xl">
                        {`[${currentSubsequence.join(', ')}]`}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Melhor LIS Encontrada</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[3.5rem] items-center font-mono text-emerald-400 text-xl">
                        {`[${bestSubsequence.join(', ')}]`}
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

            {/* Controls Area */}
            <LISControls
                sequence={sequenceInput}
                onSequenceChange={actions.handleSequenceChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                bestSubsequence={bestSubsequence}
            />
        </div>
    );
};

export default LISVisualizer;