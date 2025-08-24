import React, { useRef, useEffect } from 'react';
import { useBitcask } from '../hooks/useBitcask';
import BitcaskControls from './BitcaskControls';

const BitcaskVisualizer = () => {
    const {
        step,
        isPlaying,
        actions
    } = useBitcask();

    const { log, keydir, message, highlights, getResult } = step;

    const logContainerRef = useRef<HTMLDivElement>(null);
    const keydirContainerRef = useRef<HTMLDivElement>(null);
    const highlightedLogRef = useRef<HTMLDivElement>(null);
    const highlightedKeydirRef = useRef<HTMLDivElement>(null);

    const scrollToRef = (containerRef: React.RefObject<HTMLDivElement>, elementRef: React.RefObject<HTMLDivElement>) => {
        if (elementRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = elementRef.current;
            
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            
            if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    useEffect(() => scrollToRef(logContainerRef, highlightedLogRef), [highlights.logIndex]);
    useEffect(() => scrollToRef(keydirContainerRef, highlightedKeydirRef), [highlights.keydirKey]);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Arquivo de Log (`kv_bitcask.log`)</h3>
                    <div ref={logContainerRef} className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        {log.map((entry, index) => {
                            const isHighlighted = highlights.logIndex === index;
                            const ref = isHighlighted ? highlightedLogRef : null;
                            const bgColor = isHighlighted ? 'bg-cyan-500/20' : 'bg-transparent';
                            return (
                                <div key={index} ref={ref} className={`flex gap-4 transition-colors duration-200 rounded px-2 py-0.5 ${bgColor}`}>
                                    <span className="text-slate-500 select-none w-20">off:{entry.offset}, sz:{entry.size}</span>
                                    <span className="text-slate-300 whitespace-pre-wrap">{entry.line}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Índice em Memória (`keydir`)</h3>
                    <div ref={keydirContainerRef} className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        {Object.keys(keydir).length > 0 ? (
                            Object.entries(keydir).sort((a,b) => a[0].localeCompare(b[0])).map(([key, value]) => {
                                const isHighlighted = highlights.keydirKey === key;
                                const ref = isHighlighted ? highlightedKeydirRef : null;
                                return (
                                    <div key={key} ref={ref} className={`p-1 rounded transition-colors duration-300 ${isHighlighted ? 'bg-cyan-500/20' : ''}`}>
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
            </div>
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>
            <BitcaskControls
                onSet={actions.db_set}
                onGet={actions.db_get}
                onRebuild={actions.rebuild_keydir}
                onReset={actions.reset}
                isPlaying={isPlaying}
                getResult={getResult}
            />
        </div>
    );
};

export default BitcaskVisualizer;