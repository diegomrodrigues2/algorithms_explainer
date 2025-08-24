
import React, { useRef, useLayoutEffect } from 'react';
import { useWAL } from '../hooks/useWAL';
import WALControls from './WALControls';
import type { BTreeNodeData, WALRecord } from '../types';

// Reusable B-Tree Node component
const BTreeNode = ({ node }: { node: BTreeNodeData }) => {
    const keyWidth = 40;
    const keySpacing = 8;
    const nodeWidth = node.keys.length * keyWidth + (node.keys.length + 1) * keySpacing;
    
    let nodeBgClass = 'fill-slate-800';
    let strokeClass = 'stroke-slate-500';

    if (node.nodeHighlight) {
        nodeBgClass = 'fill-cyan-800';
        strokeClass = 'stroke-cyan-400';
    }

    return (
        <g transform={`translate(${node.x - nodeWidth / 2}, ${node.y})`}>
            <rect 
                width={nodeWidth} 
                height={40} 
                rx={8} 
                ry={8} 
                className={`transition-all duration-300 stroke-2 ${strokeClass}`}
                fill={nodeBgClass}
                style={{filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.2))'}}
            />
            {node.keys.map((key, i) => (
                <g key={i} transform={`translate(${i * (keyWidth + keySpacing) + keySpacing}, 4)`}>
                    <rect width={keyWidth} height={32} rx={4} ry={4} className="fill-slate-700" />
                    <text x={keyWidth/2} y={21} textAnchor="middle" className="fill-white font-bold text-sm pointer-events-none">{key}</text>
                </g>
            ))}
        </g>
    );
};


const WALVisualizer = () => {
    const { step, isPlaying, actions } = useWAL();
    const { wal, btreeNodes, btreeRootId, message, highlights } = step;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const walContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
        }
    }, [step]);
    
    useLayoutEffect(() => {
        if(walContainerRef.current && highlights.walIndex !== undefined) {
             const container = walContainerRef.current;
             const el = container.children[highlights.walIndex];
             if(el) {
                 el.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
        }
    }, [highlights.walIndex])

    const nodeElements = Object.values(btreeNodes);
    const edgeElements = nodeElements.flatMap(node => 
        node.childrenIds.map((childId) => {
            const childNode = btreeNodes[childId];
            if (!childNode) return null;
            return {
                key: `${node.id}-${childId}`,
                x1: node.x, y1: node.y + 20,
                x2: childNode.x, y2: childNode.y - 20,
            };
        }).filter(Boolean)
    );

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* WAL View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Write-Ahead Log (WAL)</h3>
                     <div ref={walContainerRef} className="bg-slate-900/70 p-3 rounded-lg h-[450px] overflow-y-auto font-mono text-sm border border-slate-700">
                        {wal.map((record, index) => (
                            <div key={record.lsn} className={`p-1 rounded transition-colors duration-200 ${highlights.walIndex === index ? 'bg-cyan-500/30' : ''}`}>
                                <span className="text-slate-500">{`LSN ${record.lsn}: `}</span>
                                <span className="text-slate-300">{`{op: "${record.op}", key: ${record.key}}`}</span>
                            </div>
                        ))}
                         {wal.length === 0 && <div className="text-slate-500 italic">Log vazio.</div>}
                    </div>
                </div>

                {/* B-Tree View */}
                <div className="lg:col-span-2">
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">B-Tree (em memória)</h3>
                    <div ref={scrollContainerRef} className="relative w-full h-[450px] bg-slate-900/50 rounded-lg overflow-auto border border-slate-700">
                        <svg width="1200" height="450">
                            <g>
                                {edgeElements.map(edge => edge && (
                                    <line key={edge.key} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} className="stroke-slate-600" strokeWidth="2" />
                                ))}
                            </g>
                            <g>
                                {nodeElements.map(node => <BTreeNode key={node.id} node={node} />)}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>
            
            <WALControls
                onInsert={actions.insert}
                onRecover={actions.recover}
                onReset={actions.reset}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default WALVisualizer;
