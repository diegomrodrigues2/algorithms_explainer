import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PermutationGenerationAlgorithmStep, PermutationGenerationHighlightType } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

function factorial(n: number): number {
    if (n < 0) return 0;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export const usePermutationGeneration = (initialElements: string) => {
    const [elementsInput, setElementsInput] = useState(initialElements);
    const [steps, setSteps] = useState<PermutationGenerationAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((elementsStr: string) => {
        const elements = elementsStr.split(',').map(n => n.trim()).filter(Boolean);
        if (elements.length === 0) {
            setSteps([]);
            return;
        }

        const newSteps: PermutationGenerationAlgorithmStep[] = [];
        const foundPermutations: string[][] = [];

        const addStep = (
            currentElements: string[],
            highlights: { [index: number]: PermutationGenerationHighlightType },
            message: string
        ) => {
            newSteps.push({
                elements: [...currentElements],
                highlights,
                foundPermutations: JSON.parse(JSON.stringify(foundPermutations)),
                message,
            });
        };

        function backtrack(start: number, currentElements: string[]) {
            if (start === currentElements.length) {
                foundPermutations.push([...currentElements]);
                const highlights: { [key: number]: PermutationGenerationHighlightType } = {};
                for(let i=0; i<currentElements.length; i++) highlights[i] = 'solution';
                addStep(currentElements, highlights, `Permutação encontrada: [${currentElements.join(', ')}]`);
                return;
            }

            for (let i = start; i < currentElements.length; i++) {
                // Highlight elements to be swapped
                const highlights: { [key: number]: PermutationGenerationHighlightType } = {};
                for (let j = 0; j < start; j++) highlights[j] = 'fixed';
                highlights[start] = 'swap-candidate';
                highlights[i] = 'swap-target';
                addStep(currentElements, highlights, `Fixando posição ${start}: trocando '${currentElements[start]}' com '${currentElements[i]}'`);

                // Swap
                [currentElements[start], currentElements[i]] = [currentElements[i], currentElements[start]];
                
                const swappedHighlights: { [key: number]: PermutationGenerationHighlightType } = {};
                 for (let j = 0; j < start; j++) swappedHighlights[j] = 'fixed';
                 swappedHighlights[start] = 'fixed';
                addStep(currentElements, swappedHighlights, `Recursão para a posição ${start + 1}.`);

                backtrack(start + 1, currentElements);

                // Backtrack (swap back)
                const backtrackHighlights: { [key: number]: PermutationGenerationHighlightType } = {};
                 for (let j = 0; j < start; j++) backtrackHighlights[j] = 'fixed';
                 backtrackHighlights[start] = 'backtrack-swap';
                 backtrackHighlights[i] = 'backtrack-swap';
                addStep(currentElements, backtrackHighlights, `Retrocedendo: trocando '${currentElements[start]}' de volta com '${currentElements[i]}'`);
                [currentElements[start], currentElements[i]] = [currentElements[i], currentElements[start]];
                
                const afterBacktrackHighlights: { [key: number]: PermutationGenerationHighlightType } = {};
                for (let j = 0; j < start; j++) afterBacktrackHighlights[j] = 'fixed';
                 addStep(currentElements, afterBacktrackHighlights, `Pronto para a próxima iteração na posição ${start}.`);
            }
        }

        addStep([...elements], {}, `Iniciando a busca por permutações em [${elements.join(', ')}]`);
        backtrack(0, [...elements]);
        addStep([...elements], {}, `Busca completa. Encontradas ${foundPermutations.length} permutações.`);
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(elementsInput);
    }, [elementsInput, generateSteps]);
    
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
    const handleElementsChange = (newElements: string) => {
        if(isPlaying) return;
        setElementsInput(newElements);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        elements: elementsInput.split(',').map(n => n.trim()).filter(Boolean),
        highlights: {},
        foundPermutations: [],
        message: 'Configure o conjunto e inicie.'
    }, [steps, currentStepIndex, elementsInput]);
    
    return {
        step: currentStepData,
        elementsInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        totalPermutations: factorial(elementsInput.split(',').map(n => n.trim()).filter(Boolean).length),
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleElementsChange,
        }
    };
};