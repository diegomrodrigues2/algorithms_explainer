import React, { useRef, useEffect } from 'react';
import { useAppendOnlyLog } from '../hooks/useAppendOnlyLog';
import AppendOnlyLogControls from './AppendOnlyLogControls';

const AppendOnlyLogVisualizer = () => {
    const {
        step,
        isPlaying,
        actions
    } = useAppendOnlyLog();

    const { log, currentState, message, highlights, getResult } = step;

    const logContainerRef = useRef<HTMLDivElement>(null);
    const highlightedLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedLineRef.current && logContainerRef.current) {
            const container = logContainerRef.current;
            const line = highlightedLineRef.current;
            
            const containerRect = container.getBoundingClientRect();
            const lineRect = line.getBoundingClientRect();
            
            if (lineRect.bottom > containerRect.bottom || lineRect.top < containerRect.top) {
                line.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [highlights.logIndex]);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Log File View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Arquivo de Log (`kv.log`)</h3>
                    <div ref={logContainerRef} className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        {log.map((line, index) => {
                            const isHighlighted = highlights.logIndex === index;
                            const ref = isHighlighted ? highlightedLineRef : null;
                            let bgColor = 'bg-transparent';
                            if (isHighlighted) {
                                bgColor = highlights.foundKey ? 'bg-emerald-500/30' : 'bg-cyan-500/20';
                            }
                            return (
                                <div key={index} ref={ref} className={`flex gap-4 transition-colors duration-200 rounded px-2 ${bgColor}`}>
                                    <span className="text-slate-500 select-none">{index + 1}</span>
                                    <span className="text-slate-300 whitespace-pre-wrap">{line}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current State View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Estado Atual (Valores Finais)</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        {Object.entries(currentState).length > 0 ? (
                            Object.entries(currentState).map(([key, value]) => (
                                <div key={key} className={`p-1 rounded transition-colors duration-300 ${(highlights.writtenKey === key || highlights.foundKey === key) ? 'bg-cyan-500/20' : ''}`}>
                                    <span className="text-amber-400">"{key}"</span>
                                    <span className="text-slate-400">: </span>
                                    <span className="text-emerald-400">"{value}"</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-slate-500 italic">O estado está vazio.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>

            {/* Controls */}
            <AppendOnlyLogControls
                onSet={actions.db_set}
                onGet={actions.db_get}
                onReset={actions.reset}
                isPlaying={isPlaying}
                getResult={getResult}
            />
        </div>
    );
};

export default AppendOnlyLogVisualizer;
