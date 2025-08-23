import React from 'react';
import { useGraphColoring } from '../hooks/useGraphColoring';
import GraphColoringControls from './GraphColoringControls';
import type { GraphColoringHighlightType } from '../types';

const GraphColoringVisualizer = () => {
    const {
        step,
        numVertices,
        numColors,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        colorPalette,
        actions
    } = useGraphColoring(6, 3);

    const { graph, colors, highlights, message, foundSolution } = step;

    const getNodeHighlightClasses = (type: GraphColoringHighlightType | undefined) => {
        switch(type) {
            case 'considering': return 'stroke-yellow-400 stroke-[4px]';
            case 'safe': return 'stroke-green-400 stroke-[4px]';
            case 'unsafe': return 'stroke-red-500 stroke-[4px] animate-pulse';
            case 'final': return 'stroke-emerald-400 stroke-[4px]';
            default: return 'stroke-slate-500 stroke-2';
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="relative w-full h-[400px] bg-slate-900/50 rounded-lg flex items-center justify-center mb-4">
                 <svg viewBox="0 0 400 400" className="w-full h-full">
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
                                    className="stroke-slate-600"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </g>
                    {/* Nodes */}
                     <g>
                        {graph.nodes.map(node => {
                             const color = colors[node.id];
                             const highlight = highlights[node.id];
                             return (
                                <g key={`node-group-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                                <circle
                                    key={`node-${node.id}`}
                                    r="15"
                                    className={`transition-all duration-300 ${getNodeHighlightClasses(highlight)}`}
                                    fill={color ? colorPalette[(color - 1) % colorPalette.length] : '#334155'}
                                />
                                <text
                                    textAnchor="middle"
                                    dy=".3em"
                                    className="fill-white font-bold text-sm pointer-events-none"
                                >
                                    {node.id}
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
            <GraphColoringControls
                numVertices={numVertices}
                onNumVerticesChange={actions.handleNumVerticesChange}
                numColors={numColors}
                onNumColorsChange={actions.handleNumColorsChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundSolution={foundSolution}
                currentStep={currentStep}
            />
        </div>
    );
};

export default GraphColoringVisualizer;