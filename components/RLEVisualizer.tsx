
import React from 'react';
import { useRLE } from '../hooks/useRLE';
import RLEControls from './RLEControls';

const RLEVisualizer = () => {
    const { step, textInput, isPlaying, speed, currentStep, totalSteps, actions } = useRLE('AAAAABBBCCDAA');
    const { sequence, compressed, message, highlights, currentRun } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Input Sequence */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Sequência de Entrada</h3>
                <div className="flex flex-wrap gap-1 p-2 bg-slate-900/70 rounded-lg border border-slate-700 min-h-[3rem]">
                    {sequence.map((char, index) => {
                        const isRunChar = index >= highlights.runStartIndex && index <= highlights.readIndex;
                        const isCurrentChar = index === highlights.readIndex;
                        let classes = 'bg-slate-700';
                        if (isRunChar) classes = 'bg-cyan-800';
                        if (isCurrentChar) classes = 'bg-yellow-600 scale-110';
                        
                        return (
                            <div key={index} className={`w-10 h-10 flex items-center justify-center rounded-md font-mono text-white text-lg transition-all duration-200 ${classes}`}>
                                {char}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Current Run */}
                <div className="md:col-span-1">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Run Atual</h3>
                    <div className="flex items-center justify-center gap-2 p-3 bg-slate-900/70 rounded-lg border border-slate-700 h-24">
                        {currentRun.value !== null ? (
                            <>
                                <span className="font-mono text-3xl text-slate-300">('{currentRun.value}',</span>
                                <span className="font-mono text-3xl text-cyan-400">{currentRun.count}</span>
                                <span className="font-mono text-3xl text-slate-300">)</span>
                            </>
                        ) : (
                             <span className="text-slate-500">-</span>
                        )}
                    </div>
                </div>

                {/* Compressed Output */}
                <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Saída Comprimida</h3>
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-900/70 rounded-lg border border-slate-700 min-h-[6rem]">
                         {compressed.map(([value, count], index) => (
                             <div key={index} className={`p-2 rounded-lg font-mono text-white transition-all duration-300 ${highlights.outputIndex === index ? 'bg-emerald-600 scale-110' : 'bg-slate-800'}`}>
                                {`('${value}', ${count})`}
                            </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <RLEControls
                textInput={textInput}
                onTextInputChange={actions.handleTextInputChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
            />
        </div>
    );
};

export default RLEVisualizer;
