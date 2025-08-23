import React from 'react';
import { useNQueens } from '../hooks/useNQueens';
import NQueensControls from './NQueensControls';
import { QueenIcon } from './Icons';
import type { NQueensHighlightType } from '../types';

const getHighlightColor = (type: NQueensHighlightType | undefined) => {
    switch (type) {
        case 'trying':
            return 'bg-yellow-500/50';
        case 'attack':
            return 'bg-red-600/60 animate-pulse';
        case 'queen':
            return ''; // Queen icon will be shown instead
        default:
            return '';
    }
};

const NQueensVisualizer = () => {
    const {
        board,
        highlights,
        message,
        boardSize,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        solutionsCount,
        actions
    } = useNQueens(4);

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="flex flex-col items-center mb-4">
                <div className="bg-slate-900 p-2 rounded-lg shadow-inner border border-slate-700 w-full max-w-md mx-auto">
                    <div 
                        className="grid"
                        style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
                    >
                        {Array.from({ length: boardSize * boardSize }).map((_, i) => {
                            const row = Math.floor(i / boardSize);
                            const col = i % boardSize;
                            const isLightSquare = (row + col) % 2 !== 0;
                            const highlightType = highlights?.[row]?.[col];
                            const hasQueen = board[row] === col;

                            return (
                                <div
                                    key={i}
                                    className={`relative aspect-square w-full flex items-center justify-center ${isLightSquare ? 'bg-slate-400' : 'bg-slate-600'}`}
                                >
                                    <div className={`absolute inset-0 transition-colors duration-300 ${getHighlightColor(highlightType)}`} />
                                    {hasQueen && (
                                        <div className="relative text-white z-10 w-4/5 h-4/5">
                                            <QueenIcon />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <NQueensControls
                boardSize={boardSize}
                onBoardSizeChange={actions.handleBoardSizeChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                solutionsCount={solutionsCount}
            />
        </div>
    );
};

export default NQueensVisualizer;