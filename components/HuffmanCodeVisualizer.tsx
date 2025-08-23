import React from 'react';
import { useHuffmanCode } from '../hooks/useHuffmanCode';
import HuffmanCodeControls from './HuffmanCodeControls';

const HuffmanCodeVisualizer = () => {
    const {
        step,
        textInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useHuffmanCode('abracadabra');

    const { heap, tree, codes, message, highlights, codeGenerationPath } = step;

    const renderTree = () => {
        const nodeElements = Object.values(tree);
        const edgeElements: { key: string, x1: number, y1: number, x2: number, y2: number }[] = [];

        nodeElements.forEach(node => {
            if (node.parentX !== undefined && node.parentY !== undefined) {
                edgeElements.push({
                    key: `edge-${node.id}`,
                    x1: node.parentX,
                    y1: node.parentY,
                    x2: node.x,
                    y2: node.y
                });
            }
        });

        return (
            <div className="relative w-full h-full bg-slate-900/50 rounded-lg p-4">
                <svg className="w-full h-full" viewBox="0 0 800 350" preserveAspectRatio="xMidYMid meet">
                    <g>
                        {edgeElements.map((edge, i) => (
                            <line
                                key={edge.key}
                                x1={edge.x1} y1={edge.y1}
                                x2={edge.x2} y2={edge.y2}
                                className="stroke-slate-600 transition-all duration-500"
                                strokeWidth="2"
                            />
                        ))}
                    </g>
                     <g>
                        {nodeElements.map(node => {
                             const isHighlighted = highlights.treeId === node.id;
                             return (
                                <g key={node.id} className="transition-all duration-500" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
                                    <circle r="20" className={`transition-all duration-300 ${isHighlighted ? 'stroke-yellow-400 stroke-4' : 'stroke-cyan-400 stroke-2'}`} fill={node.symbol ? '#0891b2' : '#1e293b'} />
                                    <text
                                        textAnchor="middle"
                                        dy="-25"
                                        className="fill-white font-semibold text-base"
                                    >
                                        {node.symbol ? `'${node.symbol}'` : ''}
                                    </text>
                                     <text
                                        textAnchor="middle"
                                        dy="0.3em"
                                        className="fill-white font-bold text-sm pointer-events-none"
                                    >
                                        {node.freq}
                                    </text>
                                </g>
                            )
                        })}
                    </g>
                </svg>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Fila de Prioridade (Heap)</h3>
                     <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-lg min-h-[4rem] border border-slate-700">
                        {heap.map(node => (
                            <div key={node.id} className={`p-2 rounded-lg text-center text-white font-mono transition-all duration-300 ${highlights.heapIds?.includes(node.id) ? 'bg-yellow-600' : 'bg-slate-700'}`}>
                                <span>{node.symbol ? `'${node.symbol}'` : 'ᐃ'}</span>
                                <span className="block text-xs text-slate-300">{node.freq}</span>
                            </div>
                        ))}
                     </div>
                </div>
                 <div>
                     <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela de Códigos</h3>
                     <div className="p-2 bg-slate-900/50 rounded-lg min-h-[4rem] border border-slate-700 max-h-48 overflow-y-auto">
                        {codeGenerationPath.map(({symbol, code}) => (
                            <div key={symbol} className="font-mono text-emerald-400">
                                <span className="text-white">{`'${symbol}'`}: </span>
                                <span>{code}</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
            
            <div className="h-[350px]">
                {renderTree()}
            </div>

            <div className="h-12 text-center flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <HuffmanCodeControls
                text={textInput}
                onTextChange={actions.handleTextChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
            />
        </div>
    );
};

export default HuffmanCodeVisualizer;