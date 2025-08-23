import React from 'react';
import { useLISTabulated } from '../hooks/useLISTabulated';
import LISTabulatedControls from './LISTabulatedControls';

const DataBox = ({ label, value, highlightClass }: { label: string, value: React.ReactNode, highlightClass: string }) => (
    <div className={`p-2 rounded-lg transition-all duration-300 border-b-4 ${highlightClass}`}>
        <span className="text-xs text-slate-400">{label}</span>
        <div className="text-center text-xl font-bold text-white h-8 flex items-center justify-center">{value ?? '?'}</div>
    </div>
);

const LISTabulatedVisualizer = () => {
    const {
        step,
        sequenceInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useLISTabulated('3, 10, 2, 1, 20');

    const { sequence, dp, parent, highlights, message, result } = step;

    const getHighlightClass = (index: number) => {
        if (highlights.pathIndices?.includes(index)) return 'bg-emerald-600 border-emerald-400';
        if (highlights.currentIndex_i === index) return 'bg-cyan-600 border-cyan-400 scale-110';
        if (highlights.compareIndex_j === index) return 'bg-yellow-600 border-yellow-400';
        return 'bg-slate-700 border-slate-600';
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Tables */}
            <div className="space-y-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Sequência (índice)</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                        {sequence.map((_, i) => <DataBox key={i} label={`A[${i}]`} value={sequence[i]} highlightClass={getHighlightClass(i)} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP (comprimento)</h3>
                     <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                        {dp.map((val, i) => <DataBox key={i} label={`dp[${i}]`} value={val} highlightClass={getHighlightClass(i)} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela Parent (predecessor)</h3>
                     <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
                        {parent.map((val, i) => <DataBox key={i} label={`p[${i}]`} value={val} highlightClass={getHighlightClass(i)} />)}
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
            <LISTabulatedControls
                sequence={sequenceInput}
                onSequenceChange={actions.handleSequenceChange}
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

export default LISTabulatedVisualizer;
