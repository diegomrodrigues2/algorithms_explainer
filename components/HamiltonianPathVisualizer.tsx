import React from 'react';
import { useHamiltonianPath } from '../hooks/useHamiltonianPath';
import HamiltonianPathControls from './HamiltonianPathControls';
import type { HamiltonianPathHighlightType } from '../types';

const HamiltonianPathVisualizer = () => {
    const {
        step,
        numVertices,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useHamiltonianPath(6);

    const { graph, path, highlights, message, foundSolution } = step;

    const getNodeHighlightClasses = (type: HamiltonianPathHighlightType | undefined) => {
        switch(type) {
            case 'visiting': return 'stroke-yellow-400 stroke-[4px] animate-pulse';
            case 'path': return 'stroke-cyan-400 stroke-[4px]';
            case 'backtrack': return 'stroke-red-500 stroke-[4px]';
            case 'solution': return 'stroke-emerald-400 stroke-[4px]';
            default: return 'stroke-slate-500 stroke-2';
        }
    };
    
    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="relative w-full h-[350px] bg-slate-900/50 rounded-lg flex items-center justify-center mb-4">
                 <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Edges */}
                    <g>
                        {graph.edges.map((edge, i) => {
                            const sourceNode = graph.nodes.find(n => n.id === edge.source);
                            const targetNode = graph.nodes.find(n => n.id === edge.target);
                            if (!sourceNode || !targetNode) return null;

                            const isPathEdge = foundSolution && (
                                (foundSolution.indexOf(edge.source) !== -1 && foundSolution.indexOf(edge.target) === foundSolution.indexOf(edge.source) + 1) ||
                                (foundSolution.indexOf(edge.target) !== -1 && foundSolution.indexOf(edge.source) === foundSolution.indexOf(edge.target) + 1)
                            );

                            return (
                                <line
                                    key={`edge-${i}`}
                                    x1={sourceNode.x} y1={sourceNode.y}
                                    x2={targetNode.x} y2={targetNode.y}
                                    className={`transition-all duration-300 ${isPathEdge ? 'stroke-emerald-400' : 'stroke-slate-600'}`}
                                    strokeWidth={isPathEdge ? 4 : 2}
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
                                    r="15"
                                    className={`transition-all duration-300 ${getNodeHighlightClasses(highlight)}`}
                                    fill={'#334155'}
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

            {/* Path and Status */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Caminho Atual</h3>
                 <div className="flex flex-wrap gap-2 p-3 bg-slate-900/50 rounded-lg min-h-[3.5rem] items-center font-mono text-cyan-400 text-xl">
                        {path.map((nodeId, index) => (
                            <React.Fragment key={index}>
                                <span className={highlights[nodeId] === 'solution' ? 'text-emerald-400' : ''}>{nodeId}</span>
                                {index < path.length - 1 && <span className="text-slate-500">→</span>}
                            </React.Fragment>
                        ))}
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <HamiltonianPathControls
                numVertices={numVertices}
                onNumVerticesChange={actions.handleNumVerticesChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                foundSolution={foundSolution}
                currentStep={currentStep}
                totalSteps={totalSteps}
            />
        </div>
    );
};

export default HamiltonianPathVisualizer;