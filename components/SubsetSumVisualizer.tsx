import React from 'react';
import { useSubsetSum } from '../hooks/useSubsetSum';
import SubsetSumControls from './SubsetSumControls';
import type { SubsetSumHighlightType } from '../types';

const getHighlightClasses = (type: SubsetSumHighlightType | undefined) => {
    switch (type) {
        case 'considering':
            return 'bg-yellow-500 border-yellow-400 scale-110';
        case 'included':
            return 'bg-cyan-600 border-cyan-500';
        case 'solution':
            return 'bg-emerald-500 border-emerald-400 animate-pulse';
        case 'pruned':
            return 'bg-red-700 border-red-600 opacity-60';
        case 'excluded':
        default:
            return 'bg-slate-700 border-slate-600';
    }
};

const SubsetSumVisualizer = () => {
    const {
        step,
        numbersInput,
        targetInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useSubsetSum('2, 3, 7, 8, 10', 17);

    const { numbers, highlights, currentSubset, currentSum, target, foundSolution, message } = step;

    const progressPercentage = target > 0 ? Math.min((currentSum / target) * 100, 100) : 0;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Number Set Display */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Conjunto de Números (Ordenado)</h3>
                <div className="flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-lg min-h-[5rem]">
                    {numbers.map((num, index) => (
                        <div
                            key={index}
                            className={`px-4 py-2 rounded-lg font-bold text-white text-lg border-b-4 transition-all duration-300 ${getHighlightClasses(highlights[index])}`}
                        >
                            {num}
                        </div>
                    ))}
                </div>
            </div>

            {/* Current Subset and Sum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div className="">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Soma Atual</h3>
                    <div className="w-full bg-slate-700 rounded-full h-8 border border-slate-600">
                        <div
                            className="bg-cyan-500 h-full rounded-full flex items-center justify-end px-2 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        >
                           <span className="font-bold text-white text-shadow">{currentSum}</span>
                        </div>
                    </div>
                     <div className="text-right font-bold text-slate-400 mt-1">Alvo: {target}</div>
                </div>
                <div className="">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Subconjunto Atual</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[3.5rem] items-center">
                        <span className="text-slate-400 font-mono text-xl">{`[`}</span>
                         {currentSubset.map((num, index) => (
                            <span key={index} className="text-cyan-400 font-bold text-xl font-mono">
                                {num}{index < currentSubset.length - 1 ? ',' : ''}
                            </span>
                        ))}
                         <span className="text-slate-400 font-mono text-xl">{`]`}</span>
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
            <SubsetSumControls
                numbers={numbersInput}
                onNumbersChange={actions.handleNumbersChange}
                target={targetInput}
                onTargetChange={actions.handleTargetChange}
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

export default SubsetSumVisualizer;