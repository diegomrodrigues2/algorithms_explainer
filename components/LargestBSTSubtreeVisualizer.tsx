import React from 'react';
import { useLargestBSTSubtree } from '../hooks/useLargestBSTSubtree';
import LargestBSTSubtreeControls from './LargestBSTSubtreeControls';
import type { LargestBSTSubtreeHighlightType } from '../types';

const LargestBSTSubtreeVisualizer = () => {
    const {
        step,
        numNodes,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useLargestBSTSubtree(12);

    const { graph, nodeData, highlights, message, result } = step;

    const getNodeHighlightClasses = (type: LargestBSTSubtreeHighlightType | undefined) => {
        switch(type) {
            case 'visiting': return 'stroke-yellow-400 stroke-[4px] animate-pulse';
            case 'parent': return 'stroke-pink-500 stroke-[3px]';
            case 'processed': return 'stroke-slate-400 stroke-2';
            case 'solution-bst': return 'stroke-emerald-400 fill-emerald-700/80 stroke-[4px]';
            case 'not-bst': return 'stroke-red-500 fill-red-800/50 stroke-2 opacity-80';
            default: return 'stroke-slate-500 stroke-2';
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="relative w-full h-[400px] bg-slate-900/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                 <svg viewBox="0 0 500 400" className="w-full h-full">
                    <g>
                        {graph.edges.map((edge, i) => {
                            const sourceNode = graph.nodes.find(n => n.id === edge.source);
                            const targetNode = graph.nodes.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode) return null;
                            return (
                                <line
                                    key={`edge-${i}`}
                                    x1={sourceNode.x} y1={sourceNode.y}
                                    x2={targetNode.x} y2={targetNode.y}
                                    className="stroke-slate-600 transition-all duration-300"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </g>
                     <g>
                        {graph.nodes.map(node => {
                             const highlight = highlights[node.id];
                             const data = nodeData[node.id];
                             const isBST = data?.isBST;
                             return (
                                <g key={`node-group-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                                <circle
                                    key={`node-${node.id}`}
                                    r="20"
                                    className={`transition-all duration-300 ${getNodeHighlightClasses(highlight)}`}
                                    fill={!highlight || ['parent', 'visiting', 'processed'].includes(highlight) ? '#334155' : ''}
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="fill-white font-bold text-sm pointer-events-none"
                                >
                                    {node.value}
                                </text>
                                <text textAnchor="middle" y={32} className="text-[10px] font-mono">
                                    <tspan className={isBST ? 'fill-emerald-400' : (isBST === false ? 'fill-red-400' : 'fill-slate-400')}>BST:{data?.isBST === null ? '?' : data?.isBST ? 'T' : 'F'}</tspan>
                                    <tspan dx="4" className="fill-cyan-400">S:{data?.size ?? '?'}</tspan>
                                </text>
                                 <text textAnchor="middle" y={42} className="text-[10px] font-mono fill-amber-400">
                                     <tspan>m:{data?.min === Infinity ? '-∞' : data?.min ?? '?'}</tspan>
                                     <tspan dx="4">M:{data?.max === -Infinity ? '+∞' : data?.max ?? '?'}</tspan>
                                 </text>
                                </g>
                             )
                        })}
                    </g>
                </svg>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <LargestBSTSubtreeControls
                numNodes={numNodes}
                onNumNodesChange={actions.handleNumNodesChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                result={result}
            />
        </div>
    );
};

export default LargestBSTSubtreeVisualizer;
