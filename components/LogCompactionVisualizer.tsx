import React, { useRef, useEffect } from 'react';
import { useLogCompaction } from '../hooks/useLogCompaction';
import LogCompactionControls from './LogCompactionControls';

const LogPanel = React.forwardRef<HTMLDivElement, { title: string, log: {line: string, offset: number, size: number}[], highlightedIndex?: number }>(({ title, log, highlightedIndex }, ref) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
        <div ref={ref} className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
            {log.map((entry, index) => {
                const isHighlighted = highlightedIndex === index;
                const bgColor = isHighlighted ? 'bg-cyan-500/20' : 'bg-transparent';
                return (
                    <div key={index} className={`flex gap-4 transition-colors duration-200 rounded px-2 py-0.5 ${bgColor}`}>
                        <span className="text-slate-500 select-none w-20">off:{entry.offset}, sz:{entry.size}</span>
                        <span className="text-slate-300 whitespace-pre-wrap">{entry.line}</span>
                    </div>
                );
            })}
             {log.length === 0 && <div className="text-slate-500 italic">Log vazio.</div>}
        </div>
    </div>
));


const LogCompactionVisualizer = () => {
    const {
        step,
        isPlaying,
        actions
    } = useLogCompaction();

    const { log, compactedLog, keydir, message, highlights, phase } = step;

    const logContainerRef = useRef<HTMLDivElement>(null);
    const compactedLogContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <LogPanel ref={logContainerRef} title="Log Original" log={log} highlightedIndex={highlights.logIndex} />

                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Índice Final (`keydir`)</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                         {Object.keys(keydir).length > 0 ? (
                            Object.entries(keydir).sort((a,b) => a[0].localeCompare(b[0])).map(([key, value]) => {
                                const isHighlighted = highlights.keydirKey === key;
                                return (
                                    <div key={key} className={`p-1 rounded transition-colors duration-300 ${isHighlighted ? 'bg-cyan-500/20' : ''}`}>
                                        <span className="text-amber-400">"{key}"</span>
                                        <span className="text-slate-400">: </span>
                                        <span className="text-emerald-400">{`{off: ${value.offset}, sz: ${value.size}}`}</span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-slate-500 italic">O índice está vazio.</div>
                        )}
                    </div>
                </div>

                <LogPanel ref={compactedLogContainerRef} title="Log Compactado" log={compactedLog} highlightedIndex={highlights.compactedLogIndex} />
            </div>
            
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>
            
            <LogCompactionControls
                onSet={actions.db_set}
                onCompact={actions.compact}
                onReset={actions.reset}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default LogCompactionVisualizer;
