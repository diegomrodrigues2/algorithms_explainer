import React from 'react';
import { useTextSegmentationMemoized } from '../hooks/useTextSegmentationMemoized';
import TextSegmentationMemoizedControls from './TextSegmentationMemoizedControls';

const TextSegmentationMemoizedVisualizer = () => {
    const {
        step,
        textInput,
        dictionaryInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useTextSegmentationMemoized('programacaocriativa', 'programa,programacao,ama,mar,a,cao,criativa');

    const { text, memo, callStack, currentComputation, message, result, path, highlights } = step;

    const renderText = () => {
        let parts: { text: string; type: string }[] = [];
        let currentIndex = 0;

        path.forEach(word => {
            const wordIndex = text.indexOf(word, currentIndex);
            if (wordIndex !== -1) {
                if (wordIndex > currentIndex) {
                    parts.push({ text: text.substring(currentIndex, wordIndex), type: 'default' });
                }
                parts.push({ text: word, type: 'path' });
                currentIndex = wordIndex + word.length;
            }
        });

        if (currentComputation) {
            const { start, end, prefix } = currentComputation;
            if (start > currentIndex) {
                 parts.push({ text: text.substring(currentIndex, start), type: 'default' });
            }
             parts.push({ text: prefix, type: 'considering' });
             if (text.length > end) {
                 parts.push({ text: text.substring(end), type: 'default' });
             }
        } else if (currentIndex < text.length) {
            parts.push({ text: text.substring(currentIndex), type: 'default' });
        }

        if(result) {
            parts = result.map(word => ({text: word, type: 'solution'}));
        }

        return (
            <div className="flex flex-wrap p-3 bg-slate-900/50 rounded-lg min-h-[5rem] font-mono text-2xl tracking-wider">
                {parts.map((part, index) => {
                    let classes = "px-2 py-1 border-b-4 transition-all duration-300 ";
                    switch(part.type) {
                        case 'path': classes += 'bg-cyan-700 border-cyan-600 text-white'; break;
                        case 'considering': classes += 'bg-yellow-500 border-yellow-400 text-black'; break;
                        case 'solution': classes += 'bg-emerald-500 border-emerald-400 text-white'; break;
                        default: classes += 'bg-slate-700/50 border-slate-600 text-slate-300'; break;
                    }
                    return <div key={index} className={classes}>{part.text}</div>
                })}
            </div>
        )
    };

    const isFinished = !isPlaying && currentStep === totalSteps && currentStep > 0;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
             <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Segmentação da String</h3>
                {renderText()}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Memoização `dp(i)`</h3>
                     <div className="bg-slate-900/70 p-2 rounded-lg h-48 overflow-y-auto border border-slate-700">
                        {Array.from({ length: text.length + 1 }).map((_, i) => {
                            const val = memo[i];
                            let displayValue = '-';
                            let bgColor = 'bg-slate-800/50';
                            if(val === 'computing') {
                                displayValue = '...';
                                bgColor = 'bg-yellow-800/70';
                            } else if (Array.isArray(val)) {
                                displayValue = 'Sol';
                                bgColor = 'bg-emerald-800/80';
                            } else if (val === null) {
                                displayValue = 'Null';
                                bgColor = 'bg-red-800/80';
                            }
                            const isHighlighted = highlights.memoIndex === i;

                            return (
                                <div key={i} className={`font-mono p-1 my-0.5 rounded transition-all duration-200 ${bgColor} ${isHighlighted ? 'ring-2 ring-cyan-400' : ''}`}>
                                    <span>dp({i}): </span>
                                    <span className="text-white">{displayValue}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Pilha de Chamadas</h3>
                    <div className="bg-slate-900/70 p-2 rounded-lg h-48 overflow-y-auto flex flex-col-reverse border border-slate-700">
                        {callStack.map((start, index) => (
                            <div key={index} className={`font-mono p-1 rounded transition-colors duration-200 ${index === callStack.length-1 ? 'bg-cyan-900/80' : ''}`}>
                                canBreak(start={start})
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <TextSegmentationMemoizedControls
                text={textInput}
                onTextChange={actions.handleTextInputChange}
                dictionary={dictionaryInput}
                onDictionaryChange={actions.handleDictionaryChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                result={result}
                isFinished={isFinished}
            />
        </div>
    );
};

export default TextSegmentationMemoizedVisualizer;