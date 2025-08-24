import React from 'react';
import { useLSMTree } from '../hooks/useLSMTree';
import LSMTreeControls from './LSMTreeControls';
import type { MemtableEntry, SSTableSegment } from '../types';

const MemtablePanel = ({ memtable, highlights }: { memtable: MemtableEntry[], highlights: any }) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Memória: Memtable (Ordenada)</h3>
        <div className="bg-slate-900/70 p-3 rounded-lg h-24 overflow-y-auto font-mono text-sm border border-slate-700">
            {memtable.map(({ key, value }) => (
                <div key={key} className={`p-1 rounded transition-colors duration-300 ${highlights.memtableKey === key ? 'bg-cyan-500/20' : ''}`}>
                    <span className="text-amber-400">"{key}"</span>
                    <span className="text-slate-400">: </span>
                    <span className={value === null ? "text-red-400" : "text-emerald-400"}>{value === null ? 'TOMBSTONE' : `"${value}"`}</span>
                </div>
            ))}
            {memtable.length === 0 && <div className="text-slate-500 italic">Memtable vazia.</div>}
        </div>
    </div>
);

const SSTablePanel = ({ segments, highlights }: { segments: SSTableSegment[], highlights: any }) => (
    <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Disco: SSTables (Imutáveis)</h3>
        <div className="bg-slate-900/70 p-3 rounded-lg h-[28rem] overflow-y-auto font-mono text-sm border border-slate-700 space-y-3">
            {segments.length > 0 ? segments.map(segment => {
                let ringColor = 'ring-slate-700';
                if (highlights.segmentId === segment.id) ringColor = 'ring-cyan-400';
                else if (highlights.compactSourceIds?.includes(segment.id)) ringColor = 'ring-yellow-400';
                else if (highlights.compactTargetId === segment.id) ringColor = 'ring-emerald-400';
                
                return (
                    <div key={segment.id} className={`p-2 rounded-lg border transition-all duration-300 ring-2 ${ringColor}`}>
                        <h4 className="font-bold text-slate-400 mb-1">Segmento-{segment.id}.sst</h4>
                        {segment.entries.map(({ key, value }) => (
                             <div key={key} className={`p-1 rounded transition-colors duration-300 ${highlights.segmentId === segment.id && highlights.segmentKey === key ? 'bg-cyan-500/20' : ''}`}>
                                <span className="text-amber-400">"{key}"</span>: <span className={value === null ? "text-red-400" : "text-emerald-400"}>{value === null ? 'TOMBSTONE' : `"${value}"`}</span>
                            </div>
                        ))}
                    </div>
                );
            }) : <div className="text-slate-500 italic">Nenhum segmento em disco.</div>}
        </div>
    </div>
);

const LSMTreeVisualizer = () => {
    const { step, isPlaying, memtableLimit, setMemtableLimit, actions } = useLSMTree(4);
    const { memtable, segments, message, highlights, getResult } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <MemtablePanel memtable={memtable} highlights={highlights} />
                    <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                        <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <SSTablePanel segments={segments} highlights={highlights} />
                </div>
            </div>
            
            <LSMTreeControls
                onPut={actions.put}
                onGet={actions.get}
                onCompact={actions.compact}
                onReset={actions.reset}
                isPlaying={isPlaying}
                memtableLimit={memtableLimit}
                onMemtableLimitChange={setMemtableLimit}
                getResult={getResult}
            />
        </div>
    );
};
export default LSMTreeVisualizer;
