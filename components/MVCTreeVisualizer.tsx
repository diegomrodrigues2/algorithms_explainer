import React from 'react';
import { useMVCTree } from '../hooks/useMVCTree';
import MVCTreeControls from './MVCTreeControls';
import type { MVCTreeHighlightType } from '../types';

const MVCTreeVisualizer = () => {
    const {
        step,
        numNodes,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useMVCTree(12);

    const { graph, take, skip, highlights, message, result } = step;

    const getNodeHighlightClasses = (type: MVCTreeHighlightType | undefined) => {
        switch(type) {
            case 'visiting': return 'stroke-yellow-400 stroke-[4px] animate-pulse';
            case 'parent': return 'stroke-pink-500 stroke-[3px]';
            case 'processed': return 'stroke-slate-400 stroke-2';
            case 'solution-in': return 'stroke-emerald-400 fill-emerald-700/80 stroke-[4px]';
            case 'solution-ex': return 'stroke-red-500 fill-red-800/50 stroke-2 opacity-70';
            default: return 'stroke-slate-500 stroke-2';
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="relative w-full h-[400px] bg-slate-900/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                 <svg viewBox="0 0 500 400" className="w-full h-full">
                    {/* Edges */}
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
                    {/* Nodes */}
                     <g>
                        {graph.nodes.map(node => {
                             const highlight = highlights[node.id];
                             return (
                                <g key={`node-group-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                                <circle
                                    key={`node-${node.id}`}
                                    r="18"
                                    className={`transition-all duration-300 ${getNodeHighlightClasses(highlight)}`}
                                    fill={!highlight || highlight === 'parent' || highlight === 'visiting' || highlight === 'processed' ? '#334155' : ''}
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="fill-white font-bold text-sm pointer-events-none"
                                >
                                    {node.id}
                                </text>
                                <text textAnchor="middle" y={32} className="text-xs">
                                    <tspan className="fill-cyan-400 font-mono">I: {take[node.id] ?? '?'}</tspan>
                                    <tspan dx="5" className="fill-amber-400 font-mono">E: {skip[node.id] ?? '?'}</tspan>
                                </text>
                                </g>
                             )
                        })}
                    </g>
                </svg>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <MVCTreeControls
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

export default MVCTreeVisualizer;
