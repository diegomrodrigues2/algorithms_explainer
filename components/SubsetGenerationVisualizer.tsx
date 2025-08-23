import React from 'react';
import { useSubsetGeneration } from '../hooks/useSubsetGeneration';
import SubsetGenerationControls from './SubsetGenerationControls';
import type { SubsetGenerationHighlightType } from '../types';

const getHighlightClasses = (type: SubsetGenerationHighlightType | undefined) => {
    switch (type) {
        case 'considering':
            return 'bg-yellow-500 border-yellow-400 scale-110';
        case 'included':
            return 'bg-cyan-600 border-cyan-500';
        case 'excluded':
            return 'bg-slate-600 border-slate-500 opacity-60';
        default:
            return 'bg-slate-700 border-slate-600';
    }
};

const SubsetGenerationVisualizer = () => {
    const {
        step,
        elementsInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useSubsetGeneration('a,b,c');

    const { elements, highlights, currentSubset, foundSubsets, message } = step;
    const totalPossibleSubsets = Math.pow(2, elements.length);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Main Element Set Display */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Conjunto de Entrada</h3>
                <div className="flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-lg min-h-[4rem] items-center">
                    {elements.map((el, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 rounded-lg font-bold text-white text-lg border-b-4 transition-all duration-300 ${getHighlightClasses(highlights[index])}`}
                        >
                            {el}
                        </div>
                    ))}
                    {!elements.length && <p className="text-slate-500">Insira um conjunto para começar.</p>}
                </div>
            </div>

            {/* Current Subset and Found Subsets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Construindo Subconjunto</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[6rem] items-center font-mono text-cyan-400 text-xl">
                        {`{${currentSubset.join(', ')}}`}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Subconjuntos Encontrados ({foundSubsets.length}/{totalPossibleSubsets})</h3>
                    <div className="p-3 bg-slate-900/50 rounded-lg min-h-[6rem] max-h-48 overflow-y-auto font-mono text-emerald-400 text-base">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2">
                           {foundSubsets.map((subset, index) => (
                               <code key={index} className="bg-slate-800 p-1 rounded text-center">{`{${subset.join(',')}}`}</code>
                           ))}
                        </div>
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
            <SubsetGenerationControls
                elements={elementsInput}
                onElementsChange={actions.handleElementsChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundCount={foundSubsets.length}
                totalCount={totalPossibleSubsets}
            />
        </div>
    );
};

export default SubsetGenerationVisualizer;