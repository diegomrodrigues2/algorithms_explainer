import React from 'react';
import { useOBST } from '../hooks/useOBST';
import OBSTControls from './OBSTControls';

const TableCell = ({ value, highlight = false }: { value: React.ReactNode, highlight?: boolean }) => (
    <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 text-xs sm:text-sm font-mono transition-colors duration-300 border-slate-700 border ${highlight ? 'bg-cyan-500/50 ring-2 ring-cyan-400' : 'bg-slate-800'}`}>
        {value}
    </div>
);

const OBSTVisualizer = () => {
    const {
        step,
        keysInput,
        freqsInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useOBST('a,b,c,d', '4,2,6,3');

    const { keys, freqs, costTable, rootTable, tree, highlights, totalCost, message } = step;
    const n = keys.length;

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
            <div className="relative w-full h-[350px] bg-slate-900/50 rounded-lg p-4">
                <svg className="w-full h-full" viewBox="0 0 1000 350" preserveAspectRatio="xMidYMid meet">
                    <g>
                        {edgeElements.map(edge => (
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
                        {nodeElements.map(node => (
                            <g key={node.id} className="transition-all duration-500" style={{ transform: `translate(${node.x}px, ${node.y}px)` }}>
                                <circle r="25" className="fill-cyan-600 stroke-2 stroke-cyan-400" />
                                <text
                                    textAnchor="middle"
                                    dy="0.1em"
                                    className="fill-white font-semibold text-base"
                                >
                                    {node.key}
                                     <tspan x="0" dy="1.1em" className="text-xs fill-slate-200 opacity-90">
                                        ({node.freq})
                                    </tspan>
                                </text>
                            </g>
                        ))}
                    </g>
                </svg>
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700 flex flex-col gap-4">
             {Object.keys(tree).length > 0 ? renderTree() : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2 text-center">Tabela de Custos</h3>
                        <div className="flex flex-col items-center">
                            {Array.from({ length: n }).map((_, i) => (
                                <div key={i} className="flex">
                                    {Array.from({ length: n }).map((_, j) => {
                                        if (j < i) return <div key={j} className="w-12 h-12 sm:w-14 sm:h-14" />;
                                        const isHighlighted = highlights.tableCell?.[0] === i && highlights.tableCell?.[1] === j;
                                        return <TableCell key={j} value={costTable[i]?.[j] ?? ''} highlight={isHighlighted} />;
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2 text-center">Tabela de Raízes</h3>
                        <div className="flex flex-col items-center">
                           {Array.from({ length: n }).map((_, i) => (
                                <div key={i} className="flex">
                                    {Array.from({ length: n }).map((_, j) => {
                                        if (j < i) return <div key={j} className="w-12 h-12 sm:w-14 sm:h-14" />;
                                         const isHighlighted = highlights.tableCell?.[0] === i && highlights.tableCell?.[1] === j;
                                         const rootIndex = rootTable[i]?.[j];
                                        return <TableCell key={j} value={rootIndex !== null && rootIndex !== undefined ? keys[rootIndex] : ''} highlight={isHighlighted} />;
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <div className="flex flex-wrap gap-3 p-3 bg-slate-900/50 rounded-lg min-h-[4rem] items-center justify-center">
                    {keys.map((key, index) => (
                        <div
                            key={index}
                            className={`px-3 py-1.5 rounded-md font-bold text-white text-base border-b-4 transition-all duration-300 
                                ${highlights.testingRoot === index ? 'bg-yellow-500 border-yellow-400 scale-110' : 
                                (highlights.subproblem && index >= highlights.subproblem[0] && index <= highlights.subproblem[1] ? 'bg-cyan-700 border-cyan-600' : 'bg-slate-700 border-slate-600')}`}
                        >
                            {key} ({freqs[index]})
                        </div>
                    ))}
            </div>

            <div className="h-12 text-center flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <OBSTControls
                keys={keysInput}
                onKeysChange={actions.handleKeysChange}
                freqs={freqsInput}
                onFreqsChange={actions.handleFreqsChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                totalCost={totalCost}
            />
        </div>
    );
};

export default OBSTVisualizer;