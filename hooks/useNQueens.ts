import { useState, useEffect, useCallback, useMemo } from 'react';
import type { NQueensAlgorithmStep } from '../types';

const INITIAL_SPEED = 200;
const MIN_SPEED = 5;
const MAX_SPEED = 500;

export const useNQueens = (initialSize: number) => {
    const [boardSize, setBoardSize] = useState(initialSize);
    const [steps, setSteps] = useState<NQueensAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [solutions, setSolutions] = useState<number[][]>([]);

    const generateSteps = useCallback((size: number) => {
        const newSteps: NQueensAlgorithmStep[] = [];
        const solutionsFound: number[][] = [];
        let solutionsCount = 0;

        const addStep = (board: (number|null)[], highlights: any, message: string) => {
            newSteps.push({
                board: [...board],
                highlights: JSON.parse(JSON.stringify(highlights)), // Deep copy
                solutionsCount,
                message,
            });
        };
        
        function isSafe(board: (number|null)[], row: number, col: number) {
            // Check column
            for (let i = 0; i < row; i++) {
                if (board[i] === col) return false;
            }
            // Check upper-left diagonal
            for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
                if (board[i] === j) return false;
            }
            // Check upper-right diagonal
            for (let i = row - 1, j = col + 1; i >= 0 && j < size; i--, j++) {
                if (board[i] === j) return false;
            }
            return true;
        }

        function backtrack(board: (number|null)[], row: number) {
            if (row === size) {
                solutionsCount++;
                solutionsFound.push([...board] as number[]);
                
                const finalHighlights = {};
                 for (let r = 0; r < size; r++) {
                    finalHighlights[r] = { [board[r]]: 'queen' };
                }
                addStep(board, finalHighlights, `Solução ${solutionsCount} encontrada!`);
                // Briefly pause on solution
                for(let i=0; i< Math.max(1, Math.floor(250 / (MAX_SPEED - speed + MIN_SPEED))) ; i++) {
                     addStep(board, finalHighlights, `Solução ${solutionsCount} encontrada!`);
                }
                return;
            }

            for (let col = 0; col < size; col++) {
                const highlights = {};
                for (let r=0; r<row; r++) {
                    highlights[r] = { [board[r]]: 'queen' };
                }
                highlights[row] = { [col]: 'trying' };
                addStep(board, highlights, `Linha ${row+1}: Tentando coluna ${col+1}.`);

                if (isSafe(board, row, col)) {
                    board[row] = col;
                    highlights[row] = { [col]: 'queen' };
                    addStep(board, highlights, `Linha ${row+1}: Posição (${row+1}, ${col+1}) é segura. Colocando rainha.`);
                    backtrack(board, row + 1);
                    
                    // After returning from recursion (either from finding a solution or a dead end)
                    board[row] = null; // Backtrack
                    const backtrackHighlights = {};
                    for (let r=0; r<row; r++) {
                        backtrackHighlights[r] = { [board[r]]: 'queen' };
                    }
                     addStep(board, backtrackHighlights, `Linha ${row+1}: Backtracking para encontrar mais soluções.`);

                } else {
                     highlights[row] = { [col]: 'attack' };
                     addStep(board, highlights, `Linha ${row+1}: Posição (${row+1}, ${col+1}) está sob ataque.`);
                }
            }
        }
        
        const initialBoard = Array(size).fill(null);
        addStep(initialBoard, {}, `Iniciando busca por soluções para N=${size}.`);
        backtrack(initialBoard, 0);
        addStep(Array(size).fill(null), {}, `Busca completa. Encontradas ${solutionsCount} soluções.`);

        setSteps(newSteps);
        setSolutions(solutionsFound);
        setCurrentStepIndex(0);
        setIsPlaying(false);

    }, [speed]);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(boardSize);
    }, [boardSize, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [boardSize]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1 && steps.length > 0) setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, MAX_SPEED - speed + MIN_SPEED);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);
    
    const togglePlayPause = () => {
        if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
            reset();
            setTimeout(() => setIsPlaying(true), 100);
        } else {
            setIsPlaying(!isPlaying);
        }
    };
    
    const handleBoardSizeChange = (newSize: number) => {
        if (isPlaying) return;
        setBoardSize(newSize);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    };

    const currentStepData = useMemo(() => steps[currentStepIndex] || { board: Array(boardSize).fill(null), highlights: {}, solutionsCount: 0, message: 'Pronto para começar.' }, [steps, currentStepIndex, boardSize]);
    
    return {
        board: currentStepData.board,
        highlights: currentStepData.highlights,
        solutionsCount: currentStepData.solutionsCount,
        message: currentStepData.message,
        boardSize,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        solutions,
        actions: {
            reset,
            togglePlayPause,
            handleBoardSizeChange,
            handleSpeedChange,
        }
    };
};