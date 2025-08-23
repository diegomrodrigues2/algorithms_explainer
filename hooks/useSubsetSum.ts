import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SubsetSumAlgorithmStep } from '../types';

const INITIAL_SPEED = 250;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useSubsetSum = (initialNumbers: string, initialTarget: number) => {
    const [numbersInput, setNumbersInput] = useState(initialNumbers);
    const [targetInput, setTargetInput] = useState(initialTarget);
    const [steps, setSteps] = useState<SubsetSumAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numbersStr: string, target: number) => {
        const parsedNumbers = numbersStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
        if (parsedNumbers.length === 0) {
            setSteps([]);
            return;
        }

        const sortedNumbers = [...parsedNumbers].sort((a, b) => b - a);
        const newSteps: SubsetSumAlgorithmStep[] = [];
        let foundSolution: number[] | null = null;
        
        const remainingSums = new Array(sortedNumbers.length).fill(0);
        remainingSums[sortedNumbers.length - 1] = sortedNumbers[sortedNumbers.length - 1];
        for (let i = sortedNumbers.length - 2; i >= 0; i--) {
            remainingSums[i] = sortedNumbers[i] + remainingSums[i + 1];
        }

        const addStep = (highlights: any, currentSubset: number[], currentSum: number, message: string) => {
            newSteps.push({
                numbers: sortedNumbers,
                highlights,
                currentSubset: [...currentSubset],
                currentSum,
                target,
                foundSolution,
                message,
            });
        };

        function backtrack(index: number, currentSum: number, currentSubset: number[]) {
            if (foundSolution) return true; // Early exit if one solution is enough

            const highlights = {};
            currentSubset.forEach(num => {
                const idx = sortedNumbers.indexOf(num); // This is not ideal for duplicates
                highlights[idx] = 'included';
            });
            
            if (currentSum === target) {
                foundSolution = [...currentSubset];
                const solutionHighlights = {};
                foundSolution.forEach(num => {
                   const idx = sortedNumbers.findIndex(val => val === num && !solutionHighlights[val]);
                   solutionHighlights[idx] = 'solution';
                });
                addStep(solutionHighlights, currentSubset, currentSum, `Solução encontrada! Soma: ${currentSum}`);
                return true;
            }

            if (index >= sortedNumbers.length || currentSum > target) {
                addStep(highlights, currentSubset, currentSum, "Caminho sem saída. Retrocedendo.");
                return false;
            }
            
            // Pruning
            if (currentSum + remainingSums[index] < target) {
                 highlights[index] = 'pruned';
                 addStep(highlights, currentSubset, currentSum, `Poda: Soma restante (${remainingSums[index]}) insuficiente.`);
                 return false;
            }

            const num = sortedNumbers[index];
            highlights[index] = 'considering';
            addStep(highlights, currentSubset, currentSum, `Considerando o número ${num}.`);

            // Include num
            currentSubset.push(num);
            highlights[index] = 'included';
            addStep(highlights, currentSubset, currentSum + num, `Incluindo ${num}. Soma atual: ${currentSum + num}`);
            if (backtrack(index + 1, currentSum + num, currentSubset)) {
                return true;
            }

            // Exclude num (backtrack)
            currentSubset.pop();
            delete highlights[index];
            addStep(highlights, currentSubset, currentSum, `Excluindo ${num}. Retrocedendo.`);
            if (backtrack(index + 1, currentSum, currentSubset)) {
                return true;
            }
            
            return false;
        }

        addStep({}, [], 0, `Iniciando com o array ordenado: [${sortedNumbers.join(', ')}] e alvo ${target}`);
        backtrack(0, 0, []);

        if (!foundSolution) {
            addStep({}, [], 0, `Busca completa. Nenhuma solução encontrada.`);
        }

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numbersInput, targetInput);
    }, [numbersInput, targetInput, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [reset]);

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

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);
    const handleNumbersChange = (newNumbers: string) => {
        if(isPlaying) return;
        setNumbersInput(newNumbers);
    }
    const handleTargetChange = (newTarget: number) => {
        if(isPlaying) return;
        setTargetInput(newTarget);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        numbers: numbersInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0).sort((a,b)=>b-a),
        highlights: {},
        currentSubset: [],
        currentSum: 0,
        target: targetInput,
        foundSolution: null,
        message: 'Configure o array e o alvo e inicie.'
    }, [steps, currentStepIndex, numbersInput, targetInput]);
    
    return {
        step: currentStepData,
        numbersInput,
        targetInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleNumbersChange,
            handleTargetChange,
        }
    };
};