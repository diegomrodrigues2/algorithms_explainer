
import React from 'react';
import { useRowToColumn } from '../hooks/useRowToColumn';
import RowToColumnControls from './RowToColumnControls';

const RowToColumnVisualizer = () => {
    const { step, textInput, isPlaying, speed, currentStep, totalSteps, actions } = useRowToColumn();
    const { rows, columns, schema, message, highlights } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Rows View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Formato de Linha (Entrada)</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        <table className="w-full text-left table-auto">
                            <thead>
                                <tr className="sticky top-0 bg-slate-900/70">
                                    <th className="p-2 text-slate-400 w-10">#</th>
                                    {schema.map(key => <th key={key} className="p-2 text-slate-400">{key}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={`transition-colors duration-200 ${'rowIndex' in highlights && highlights.rowIndex === rowIndex ? 'bg-cyan-500/20' : ''}`}>
                                        <td className="p-2 text-slate-500">{rowIndex}</td>
                                        {schema.map(key => {
                                            const isCellHighlighted = 'cellKey' in highlights && highlights.cellKey === `${rowIndex}-${key}`;
                                            return (
                                                <td key={key} className={`p-2 transition-colors duration-200 ${isCellHighlighted ? 'bg-yellow-500/30' : ''}`}>
                                                    {row[key] === undefined || row[key] === null ? <span className="text-slate-500">null</span> : JSON.stringify(row[key])}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Columns View */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Formato Colunar (Saída)</h3>
                    <div className="bg-slate-900/70 p-3 rounded-lg h-80 overflow-y-auto font-mono text-sm border border-slate-700">
                        <div className="flex gap-4">
                            {schema.map(key => (
                                <div key={key} className={`p-2 rounded transition-colors duration-200 ${'colKey' in highlights && highlights.colKey === key && highlights.phase !== 'discover' ? 'bg-cyan-500/20' : highlights.phase === 'discover' ? 'bg-yellow-500/20' : ''}`}>
                                    <h4 className="font-bold text-amber-400 mb-2">{key}</h4>
                                    <div className="flex flex-col gap-1">
                                        {(columns[key] || []).map((value, rowIndex) => {
                                             const isCellHighlighted = 'cellKey' in highlights && highlights.cellKey === `${rowIndex}-${key}`;
                                             return (
                                                <div key={rowIndex} className={`px-2 py-1 rounded transition-colors duration-200 ${isCellHighlighted ? 'bg-yellow-500/30' : 'bg-slate-800'}`}>
                                                    {value === null ? <span className="text-slate-500">null</span> : JSON.stringify(value)}
                                                </div>
                                             );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <RowToColumnControls
                textInput={textInput}
                onTextInputChange={actions.handleTextInputChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
            />
        </div>
    );
};

export default RowToColumnVisualizer;
