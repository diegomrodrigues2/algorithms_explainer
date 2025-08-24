import React, { useRef, useLayoutEffect } from 'react';
import { useBTree } from '../hooks/useBTree';
import BTreeControls from './BTreeControls';
import type { BTreeNodeData } from '../types';

const BTreeNode = ({ node }: { node: BTreeNodeData }) => {
    const keyWidth = 40;
    const keySpacing = 8;
    const nodeWidth = node.keys.length * keyWidth + (node.keys.length + 1) * keySpacing;
    
    let nodeBgClass = 'fill-slate-800';
    let strokeClass = 'stroke-slate-500';

    if(node.nodeHighlight === 'current') { nodeBgClass = 'fill-cyan-800'; strokeClass = 'stroke-cyan-400'; }
    if(node.nodeHighlight === 'search-path') { nodeBgClass = 'fill-sky-800'; strokeClass = 'stroke-sky-400'; }
    if(node.nodeHighlight === 'full') { nodeBgClass = 'fill-red-800'; strokeClass = 'stroke-red-400'; }
    if(node.nodeHighlight === 'split-target') { nodeBgClass = 'fill-yellow-800'; strokeClass = 'stroke-yellow-400'; }
    if(node.nodeHighlight === 'new-node') { nodeBgClass = 'fill-emerald-800'; strokeClass = 'stroke-emerald-400'; }

    return (
        <g transform={`translate(${node.x - nodeWidth / 2}, ${node.y})`}>
            <defs>
                <linearGradient id={`node-grad-${node.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: 'rgb(51 65 85 / 0.8)'}} />
                    <stop offset="100%" style={{stopColor: 'rgb(30 41 59 / 0.8)'}} />
                </linearGradient>
            </defs>
            <rect 
                width={nodeWidth} 
                height={40} 
                rx={8} 
                ry={8} 
                className={`transition-all duration-300 stroke-2 ${strokeClass}`}
                fill={`url(#node-grad-${node.id})`}
                style={{filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.2))'}}
            />
            {node.keys.map((key, i) => {
                const keyHighlight = node.keyHighlights?.[i];
                let keyBgClass = 'fill-slate-700';
                if(keyHighlight === 'search-compare') keyBgClass = 'fill-yellow-600';
                if(keyHighlight === 'split-median') keyBgClass = 'fill-purple-600';
                if(keyHighlight === 'new') keyBgClass = 'fill-emerald-600 animate-pulse';
                if(keyHighlight === 'found') keyBgClass = 'fill-emerald-500 ring-2 ring-white';
                
                return (
                    <g key={i} transform={`translate(${i * (keyWidth + keySpacing) + keySpacing}, 4)`}>
                        <rect width={keyWidth} height={32} rx={4} ry={4} className={`transition-colors duration-300 ${keyBgClass}`} />
                        <text x={keyWidth/2} y={21} textAnchor="middle" className="fill-white font-bold text-sm pointer-events-none">{key}</text>
                    </g>
                )
            })}
        </g>
    );
};

const BTreeVisualizer = () => {
    const {
        step,
        isPlaying,
        speed,
        t,
        actions,
        currentStep,
        totalSteps,
    } = useBTree(2);

    const { nodes, rootId, message } = step;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            if (scrollWidth > clientWidth) {
                container.scrollLeft = (scrollWidth - clientWidth) / 2;
            }
        }
    }, [step]);
    
    const nodeElements = Object.values(nodes);
    const edgeElements = nodeElements.flatMap(node => {
        const nodeWidth = node.keys.length * 40 + (node.keys.length + 1) * 8;
        return node.childrenIds.map((childId, i) => {
            const childNode = nodes[childId];
            if(!childNode) return null;
            const x1 = node.x - nodeWidth / 2 + (i * 48 + 4);
            return {
                key: `${node.id}-${childId}`,
                x1: x1,
                y1: node.y + 40,
                x2: childNode.x,
                y2: childNode.y,
            }
        }).filter(Boolean);
    });

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div ref={scrollContainerRef} className="relative w-full h-[450px] bg-slate-900/50 rounded-lg mb-4 overflow-auto">
                <svg width="1200" height="450">
                     <g>
                        {edgeElements.map(edge => {
                            if (!edge) return null;
                            return (
                                <line
                                    key={edge.key}
                                    x1={edge.x1} y1={edge.y1}
                                    x2={edge.x2} y2={edge.y2}
                                    className="stroke-slate-600 transition-all duration-300"
                                    strokeWidth="2"
                                />
                            )
                        })}
                    </g>
                     <g>
                        {nodeElements.map(node => (
                            <BTreeNode key={node.id} node={node} />
                        ))}
                    </g>
                </svg>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                 <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <BTreeControls
                t={t}
                onTChange={actions.handleTChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                onInsert={actions.insert}
                onSearch={actions.search}
            />
        </div>
    );
};

export default BTreeVisualizer;