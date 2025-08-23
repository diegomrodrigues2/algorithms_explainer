import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SubsetGenerationAlgorithmStep, SubsetGenerationHighlightType } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useSubsetGeneration = (initialElements: string) => {
    const [elementsInput, setElementsInput] = useState(initialElements);
    const [steps, setSteps] = useState<SubsetGenerationAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((elementsStr: string) => {
        const elements = elementsStr.split(',').map(n => n.trim()).filter(Boolean);
        if (elements.length === 0) {
            setSteps([]);
            return;
        }

        const newSteps: SubsetGenerationAlgorithmStep[] = [];
        const foundSubsets: string[][] = [];

        const addStep = (
            highlights: { [index: number]: SubsetGenerationHighlightType },
            currentSubset: string[],
            message: string
        ) => {
            newSteps.push({
                elements,
                highlights,
                currentSubset: [...currentSubset],
                foundSubsets: JSON.parse(JSON.stringify(foundSubsets)),
                message,
            });
        };

        function backtrack(index: number, currentSubset: string[]) {
            const currentPathHighlights: { [index: number]: SubsetGenerationHighlightType } = {};
            currentSubset.forEach(el => {
                const elIndex = elements.indexOf(el);
                if (elIndex !== -1) currentPathHighlights[elIndex] = 'included';
            });
            for(let i=0; i < index; i++){
                if(!currentPathHighlights[i]){
                     currentPathHighlights[i] = 'excluded';
                }
            }


            if (index === elements.length) {
                foundSubsets.push([...currentSubset]);
                addStep(currentPathHighlights, currentSubset, `Subconjunto encontrado: {${currentSubset.join(', ')}}`);
                return;
            }

            const currentEl = elements[index];

            // Consider the current element
            const consideringHighlights: { [index: number]: SubsetGenerationHighlightType } = {...currentPathHighlights, [index]: 'considering'};
            addStep(consideringHighlights, currentSubset, `Considerando '${currentEl}'.`);

            // --- Path 1: Exclude the element ---
            const excludeHighlights: { [index: number]: SubsetGenerationHighlightType } = {...currentPathHighlights, [index]: 'excluded'};
            addStep(excludeHighlights, currentSubset, `Decisão: Excluir '${currentEl}'. Avançando.`);
            backtrack(index + 1, currentSubset);

            // --- Path 2: Include the element ---
            currentSubset.push(currentEl);
            const includeHighlights: { [index: number]: SubsetGenerationHighlightType } = {...currentPathHighlights, [index]: 'included'};
            addStep(includeHighlights, currentSubset, `Decisão: Incluir '${currentEl}'. Avançando.`);
            backtrack(index + 1, currentSubset);

            // --- Backtrack from inclusion ---
            currentSubset.pop();
            addStep(excludeHighlights, currentSubset, `Retrocedendo. Removendo '${currentEl}'.`);
        }

        addStep({}, [], `Iniciando a busca em {${elements.join(', ')}}`);
        backtrack(0, []);
        addStep({}, [], `Busca completa. Encontrados ${foundSubsets.length} subconjuntos.`);
        
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
        currentSubset: [],
        foundSubsets: [],
        message: 'Configure o conjunto e inicie.'
    }, [steps, currentStepIndex, elementsInput]);
    
    return {
        step: currentStepData,
        elementsInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleElementsChange,
        }
    };
};