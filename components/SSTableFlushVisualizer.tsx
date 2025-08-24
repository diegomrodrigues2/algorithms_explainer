import React, { useRef, useEffect } from 'react';
import { useSSTableFlush } from '../hooks/useSSTableFlush';
import SSTableFlushControls from './SSTableFlushControls';

const FilePanel = React.forwardRef<HTMLDivElement, { title: string, content: {line: string, offset?: number}[], highlightedIndex?: number }>(({ title, content, highlightedIndex }, ref) => {
    const highlightedLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlightedLineRef.current && ref && 'current' in ref && ref.current) {
            const line = highlightedLineRef.current;
            line.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [highlightedIndex, ref]);
    
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
            <div ref={ref} className="bg-slate-900/70 p-3 rounded-lg h-64 overflow-y-auto font-mono text-sm border border-slate-700">
                {content.map((item, index) => {
                    const isHighlighted = highlightedIndex === index;
                    const lineRef = isHighlighted ? highlightedLineRef : null;
                    const bgColor = isHighlighted ? 'bg-cyan-500/20' : 'bg-transparent';
                    return (
                        <div key={index} ref={lineRef} className={`flex gap-4 transition-colors duration-200 rounded px-2 py-0.5 ${bgColor}`}>
                            {item.offset !== undefined && <span className="text-slate-500 select-none w-16">off:{item.offset}</span>}
                            <span className="text-slate-300 whitespace-pre-wrap">{item.line}</span>
                        </div>
                    );
                })}
                {content.length === 0 && <div className="text-slate-500 italic">Arquivo vazio.</div>}
            </div>
        </div>
    )
});


const SSTableFlushVisualizer = () => {
    const {
        step,
        memtableSize,
        sparseStep,
        speed,
        isPlaying,
        actions
    } = useSSTableFlush(10, 3);

    const { memtableKeys, memtableValues, sstableContent, indexContent, message, highlights } = step;

    const sstableContainerRef = useRef<HTMLDivElement>(null);
    const indexContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Memtable View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Memtable</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-64 overflow-y-auto border border-slate-700 font-mono text-sm">
                        {memtableKeys.map((key, index) => (
                            <div key={index} className={`p-1 rounded transition-colors duration-300 ${highlights.memtableIndex === index ? 'bg-cyan-500/20' : ''}`}>
                                <span className="text-amber-400">"{key}"</span>
                                <span className="text-slate-400">: </span>
                                <span className="text-emerald-400">"{memtableValues[index]}"</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SSTable and Index Views */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FilePanel ref={sstableContainerRef} title="segment-0001.sst" content={sstableContent} highlightedIndex={highlights.sstableIndex} />
                    <FilePanel ref={indexContainerRef} title="segment-0001.idx" content={indexContent.map(c => ({...c, offset:undefined}))} highlightedIndex={highlights.indexIndex} />
                </div>
            </div>
            
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>
            
            <SSTableFlushControls
                onFlush={actions.flush}
                onReset={actions.reset}
                isPlaying={isPlaying}
                memtableSize={memtableSize}
                onMemtableSizeChange={actions.handleMemtableSizeChange}
                sparseStep={sparseStep}
                onSparseStepChange={actions.handleSparseStepChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
            />
        </div>
    );
};

export default SSTableFlushVisualizer;
