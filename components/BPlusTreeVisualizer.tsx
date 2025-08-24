
import React from 'react';
import { useBPlusTree } from '../hooks/useBPlusTree';
import BPlusTreeControls from './BPlusTreeControls';
import type { BPlusTreeNodeData } from '../types';

const BPlusTreeNode = ({ node }: { node: BPlusTreeNodeData }) => {
    const keyWidth = 40;
    const keySpacing = 4;
    const valueHeight = 20;
    const nodeWidth = node.keys.length * keyWidth + (node.keys.length + 1) * keySpacing;
    const nodeHeight = node.isLeaf ? 40 + valueHeight + 4 : 40;

    let nodeBgClass = node.isLeaf ? 'fill-emerald-900/80' : 'fill-slate-800';
    let strokeClass = node.isLeaf ? 'stroke-emerald-600' : 'stroke-slate-500';

    if (node.nodeHighlight === 'current-scan') { strokeClass = 'stroke-cyan-400'; }
    if (node.nodeHighlight === 'search-path') { strokeClass = 'stroke-sky-400'; }
    if (node.nodeHighlight === 'found-start') { strokeClass = 'stroke-yellow-400'; }
    if (node.nodeHighlight === 'next-link') { strokeClass = 'stroke-pink-400'; }
    
    return (
        <g transform={`translate(${node.x - nodeWidth / 2}, ${node.y})`}>
            <rect 
                width={nodeWidth} 
                height={nodeHeight} 
                rx={8} 
                ry={8} 
                className={`transition-all duration-300 stroke-2 ${strokeClass}`}
                fill={nodeBgClass}
                style={{filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.2))'}}
            />
            {node.keys.map((key, i) => {
                const keyHighlight = node.keyHighlights?.[i];
                let keyBgClass = node.isLeaf ? 'fill-emerald-700' : 'fill-slate-700';
                if(keyHighlight === 'compare') keyBgClass = 'fill-yellow-600';
                if(keyHighlight === 'in-range') keyBgClass = 'fill-green-600';
                if(keyHighlight === 'out-of-range') keyBgClass = 'fill-red-700';
                
                return (
                    <g key={i} transform={`translate(${i * (keyWidth + keySpacing) + keySpacing}, 4)`}>
                        <rect width={keyWidth} height={32} rx={4} ry={4} className={`transition-colors duration-300 ${keyBgClass}`} />
                        <text x={keyWidth/2} y={21} textAnchor="middle" className="fill-white font-bold text-sm pointer-events-none">{key}</text>
                         {node.isLeaf && node.values && (
                            <text x={keyWidth/2} y={32 + valueHeight/2 + 2} textAnchor="middle" className="fill-slate-300 font-mono text-xs pointer-events-none">{node.values[i]}</text>
                         )}
                    </g>
                )
            })}
        </g>
    );
};

const BPlusTreeVisualizer = () => {
    const { step, isPlaying, actions } = useBPlusTree();
    const { nodes, rootId, message, result } = step;

    const nodeElements = Object.values(nodes);
    const edgeElements = nodeElements.flatMap(node => {
        if (node.isLeaf) return [];
        return node.childrenIds?.map((childId) => {
            const childNode = nodes[childId];
            if(!childNode) return null;
            return {
                key: `${node.id}-${childId}`,
                x1: node.x, y1: node.y + 20,
                x2: childNode.x, y2: childNode.y - (childNode.isLeaf ? 32: 20),
            }
        }).filter(Boolean);
    });

    const nextLinkElements = nodeElements.flatMap(node => {
        if (!node.isLeaf || !node.nextId) return [];
        const nextNode = nodes[node.nextId];
        if (!nextNode) return [];
        const nodeWidth = node.keys.length * 40 + (node.keys.length + 1) * 4;
        const nextNodeWidth = nextNode.keys.length * 40 + (nextNode.keys.length + 1) * 4;
        const x1 = node.x + nodeWidth / 2;
        const y1 = node.y + 35;
        const x2 = nextNode.x - nextNodeWidth / 2;
        const y2 = nextNode.y + 35;
        return [{ key: `next-${node.id}`, x1, y1, x2, y2 }];
    });


    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="relative w-full h-[350px] bg-slate-900/50 rounded-lg mb-4 overflow-auto">
                <svg width="1200" height="350">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" className="fill-pink-500" />
                        </marker>
                    </defs>
                     <g>
                        {edgeElements.map(edge => edge && (
                             <line key={edge.key} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} className="stroke-slate-600" strokeWidth="2" />
                        ))}
                        {nextLinkElements.map(link => (
                            <path key={link.key}
                                d={`M ${link.x1} ${link.y1} C ${link.x1 + 40} ${link.y1 + 40}, ${link.x2 - 40} ${link.y2 + 40}, ${link.x2} ${link.y2}`}
                                className="stroke-pink-500/70 fill-none"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrowhead)"
                            />
                        ))}
                    </g>
                     <g>
                        {nodeElements.map(node => <BPlusTreeNode key={node.id} node={node} />)}
                    </g>
                </svg>
            </div>
             <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Resultado da Consulta</h3>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[3.5rem] items-center font-mono text-emerald-400 text-xl">
                    {`[${result.map(r => `(${r.key},'${r.value}')`).join(', ')}]`}
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
            </div>

            <BPlusTreeControls
                startKey={step.startKey ?? 0}
                onStartKeyChange={actions.handleStartKeyChange}
                endKey={step.endKey ?? 0}
                onEndKeyChange={actions.handleEndKeyChange}
                onSearch={actions.search}
                onReset={actions.reset}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default BPlusTreeVisualizer;
