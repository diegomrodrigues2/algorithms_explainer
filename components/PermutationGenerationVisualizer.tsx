import React from 'react';
import { usePermutationGeneration } from '../hooks/usePermutationGeneration';
import PermutationGenerationControls from './PermutationGenerationControls';
import type { PermutationGenerationHighlightType } from '../types';

const getHighlightClasses = (type: PermutationGenerationHighlightType | undefined) => {
    switch (type) {
        case 'fixed':
            return 'bg-cyan-600 border-cyan-500';
        case 'swap-candidate':
            return 'bg-yellow-500 border-yellow-400 scale-110';
        case 'swap-target':
            return 'bg-pink-500 border-pink-400 scale-110';
        case 'backtrack-swap':
            return 'bg-red-600 border-red-500 opacity-80';
        case 'solution':
            return 'bg-emerald-500 border-emerald-400 animate-pulse';
        default:
            return 'bg-slate-700 border-slate-600';
    }
};

const PermutationGenerationVisualizer = () => {
    const {
        step,
        elementsInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        totalPermutations,
        actions
    } = usePermutationGeneration('A,B,C');

    const { elements, highlights, foundPermutations, message } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Main Element Set Display */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Estado Atual do Array</h3>
                <div className="flex flex-wrap justify-center gap-3 p-3 bg-slate-900/50 rounded-lg min-h-[4rem] items-center">
                    {elements.map((el, index) => (
                        <div
                            key={index}
                            className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-white text-lg border-b-4 transition-all duration-300 ${getHighlightClasses(highlights[index])}`}
                        >
                            {el}
                        </div>
                    ))}
                    {!elements.length && <p className="text-slate-500">Insira um conjunto para começar.</p>}
                </div>
            </div>

            {/* Found Permutations */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Permutações Encontradas ({foundPermutations.length}/{totalPermutations})</h3>
                <div className="p-3 bg-slate-900/50 rounded-lg min-h-[8rem] max-h-48 overflow-y-auto font-mono text-emerald-400 text-base">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {foundPermutations.map((perm, index) => (
                            <code key={index} className="bg-slate-800 p-1 rounded text-center">{`[${perm.join(',')}]`}</code>
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

            {/* Controls Area */}
            <PermutationGenerationControls
                elements={elementsInput}
                onElementsChange={actions.handleElementsChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundCount={foundPermutations.length}
                totalCount={totalPermutations}
            />
        </div>
    );
};

export default PermutationGenerationVisualizer;