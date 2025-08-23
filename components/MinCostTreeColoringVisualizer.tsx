import React from 'react';
import { useMinCostTreeColoring } from '../hooks/useMinCostTreeColoring';
import MinCostTreeColoringControls from './MinCostTreeColoringControls';
import type { MinCostTreeColoringHighlightType } from '../types';

const COLORS_PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#d946ef', '#ec4899'];

const MinCostTreeColoringVisualizer = () => {
    const {
        step,
        numNodes,
        numColors,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useMinCostTreeColoring(10, 3);

    const { graph, costs, dp, finalColors, highlights, message, result } = step;

    const getNodeHighlightClasses = (type: MinCostTreeColoringHighlightType | undefined) => {
        switch(type) {
            case 'visiting': return 'stroke-yellow-400 stroke-[4px] animate-pulse';
            case 'parent': return 'stroke-pink-500 stroke-[3px]';
            case 'processed': return 'stroke-slate-400 stroke-2';
            case 'solution': return 'stroke-emerald-400 stroke-[4px]';
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
                             const finalColorIndex = finalColors[node.id];
                             const nodeDP = dp[node.id] || [];
                             return (
                                <g key={`node-group-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                                <circle
                                    key={`node-${node.id}`}
                                    r="20"
                                    className={`transition-all duration-300 ${getNodeHighlightClasses(highlight)}`}
                                    fill={finalColorIndex !== null && finalColorIndex !== undefined ? COLORS_PALETTE[finalColorIndex % COLORS_PALETTE.length] : '#334155'}
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="fill-white font-bold text-sm pointer-events-none"
                                >
                                    {node.id}
                                </text>
                                <g transform="translate(25, -15)">
                                {nodeDP.map((cost, cIndex) => (
                                     <text key={cIndex} x="0" y={cIndex * 12} className="text-[9px] font-mono">
                                        <tspan fill={COLORS_PALETTE[cIndex % COLORS_PALETTE.length]}>c{cIndex+1}: </tspan>
                                        <tspan fill="white">{cost ?? '?'}</tspan>
                                    </text>
                                ))}
                                </g>
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

            <MinCostTreeColoringControls
                numNodes={numNodes}
                onNumNodesChange={actions.handleNumNodesChange}
                numColors={numColors}
                onNumColorsChange={actions.handleNumColorsChange}
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

export default MinCostTreeColoringVisualizer;
