import React from 'react';
import { useTextSegmentation } from '../hooks/useTextSegmentation';
import TextSegmentationControls from './TextSegmentationControls';
import type { TextSegmentationHighlightType } from '../types';

const getHighlightClasses = (type: TextSegmentationHighlightType) => {
    switch (type) {
        case 'considering':
            return 'bg-yellow-500/80 border-yellow-400 text-black';
        case 'valid-prefix':
            return 'bg-cyan-600 border-cyan-500 text-white';
        case 'backtracked':
            return 'bg-red-700 border-red-600 text-white line-through';
        case 'solution':
            return 'bg-emerald-500 border-emerald-400 text-white';
        case 'default':
        default:
            return 'bg-slate-700 border-slate-600 text-slate-300';
    }
};

const TextSegmentationVisualizer = () => {
    const {
        step,
        textInput,
        dictionaryInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useTextSegmentation('programacaocriativa', 'programa,programacao,ama,mar,a,cao,criativa');

    const { segments, message, foundSolution } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Segmentação da String</h3>
                <div className="flex flex-wrap p-3 bg-slate-900/50 rounded-lg min-h-[5rem] font-mono text-2xl tracking-wider">
                    {segments.map((seg, index) => (
                        <div
                            key={index}
                            className={`px-2 py-1 border-b-4 transition-all duration-300 ${getHighlightClasses(seg.type)}`}
                        >
                            {seg.word}
                        </div>
                    ))}
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
            <TextSegmentationControls
                text={textInput}
                onTextChange={actions.handleTextInputChange}
                dictionary={dictionaryInput}
                onDictionaryChange={actions.handleDictionaryChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundSolution={foundSolution}
            />
        </div>
    );
};

export default TextSegmentationVisualizer;