import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LISAlgorithmStep, LISHiglightType } from '../types';

const INITIAL_SPEED = 250;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useLIS = (initialSequence: string) => {
    const [sequenceInput, setSequenceInput] = useState(initialSequence);
    const [steps, setSteps] = useState<LISAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((sequenceStr: string) => {
        const sequence = sequenceStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (sequence.length === 0) {
            setSteps([]);
            return;
        }

        const newSteps: LISAlgorithmStep[] = [];
        let bestSubsequence: number[] = [];

        const addStep = (highlights: { [index: number]: LISHiglightType }, currentSubsequence: number[], message: string) => {
            newSteps.push({
                sequence,
                highlights,
                currentSubsequence: [...currentSubsequence],
                bestSubsequence: [...bestSubsequence],
                message,
            });
        };

        function backtrack(index: number, currentSubsequence: number[]) {
            // Update best subsequence if the current one is longer
            if (currentSubsequence.length > bestSubsequence.length) {
                bestSubsequence = [...currentSubsequence];
            }

            if (index >= sequence.length) {
                const highlights: { [index: number]: LISHiglightType } = {};
                 currentSubsequence.forEach(num => {
                    const idx = sequence.indexOf(num);
                    highlights[idx] = 'included';
                });
                addStep(highlights, currentSubsequence, `Fim do caminho. Comprimento: ${currentSubsequence.length}`);
                return;
            }

            const prev = currentSubsequence.length > 0 ? currentSubsequence[currentSubsequence.length - 1] : -Infinity;
            const currentNum = sequence[index];

            const baseHighlights: { [index: number]: LISHiglightType } = {};
            currentSubsequence.forEach(num => {
                const idx = sequence.findIndex(val => val === num);
                if (idx !== -1) baseHighlights[idx] = 'included';
            });
            baseHighlights[index] = 'considering';

            addStep(baseHighlights, currentSubsequence, `Considerando o elemento ${currentNum} na posição ${index}.`);

            // Decision 1: Include the current number if it's larger than the previous one
            if (currentNum > prev) {
                currentSubsequence.push(currentNum);
                const includedHighlights: { [index: number]: LISHiglightType } = {...baseHighlights, [index]: 'included'};
                addStep(includedHighlights, currentSubsequence, `Incluindo ${currentNum}. Subsequência atual: [${currentSubsequence.join(', ')}]`);
                backtrack(index + 1, currentSubsequence);
                currentSubsequence.pop(); // Backtrack
            }

            // Decision 2: Skip the current number
            const skippedHighlights: { [index: number]: LISHiglightType } = {...baseHighlights, [index]: 'skipped'};
            addStep(skippedHighlights, currentSubsequence, `Pulando ${currentNum}.`);
            backtrack(index + 1, currentSubsequence);
        }

        addStep({}, [], `Iniciando a busca pela LIS em [${sequence.join(', ')}]`);
        backtrack(0, []);
        
        const finalHighlights: { [index: number]: LISHiglightType } = {};
        bestSubsequence.forEach(num => {
            const idx = sequence.findIndex(val => val === num);
            if(idx !== -1) finalHighlights[idx] = 'solution';
        })

        addStep(finalHighlights, bestSubsequence, `Busca completa. LIS encontrada: [${bestSubsequence.join(', ')}]. Comprimento: ${bestSubsequence.length}`);
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(sequenceInput);
    }, [sequenceInput, generateSteps]);
    
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
    const handleSequenceChange = (newSequence: string) => {
        if(isPlaying) return;
        setSequenceInput(newSequence);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        sequence: sequenceInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        highlights: {},
        currentSubsequence: [],
        bestSubsequence: [],
        message: 'Configure a sequência e inicie.'
    }, [steps, currentStepIndex, sequenceInput]);
    
    return {
        step: currentStepData,
        sequenceInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleSequenceChange,
        }
    };
};