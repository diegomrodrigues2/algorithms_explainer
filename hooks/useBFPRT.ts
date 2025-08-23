import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BFPRTAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

const generateRandomArray = (size: number): number[] => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const useBFPRT = (initialSize: number) => {
    const [arraySize, setArraySize] = useState(initialSize);
    const [k, setK] = useState(Math.floor(initialSize / 2) || 1);
    const [steps, setSteps] = useState<BFPRTAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((size: number, kValue: number) => {
        const arr = generateRandomArray(size);
        const newSteps: BFPRTAlgorithmStep[] = [];

        const addStep = (array: number[], highlights: any, message: string, left: number, right: number, foundValue: number | null = null) => {
            newSteps.push({ array: [...array], highlights: { ...highlights }, k: kValue, foundValue, message, left, right });
        };

        const findMedianOfFive = (subArr: number[], start: number, end: number) => {
            const group = arr.slice(start, end + 1);
            group.sort((a, b) => a - b);
            return group[Math.floor(group.length / 2)];
        };

        const partition = (arr: number[], left: number, right: number, pivotValue: number) => {
            let pivotIndex = -1;
            for (let i = left; i <= right; i++) {
                if (arr[i] === pivotValue) {
                    pivotIndex = i;
                    break;
                }
            }
            [arr[pivotIndex], arr[right]] = [arr[right], arr[pivotIndex]];
            
            let storeIndex = left;
            for (let i = left; i < right; i++) {
                addStep(arr, { [i]: 'compare', [right]: 'pivot' }, `Particionando: comparando ${arr[i]} com o pivô ${pivotValue}`, left, right);
                if (arr[i] < pivotValue) {
                    addStep(arr, { [i]: 'less', [storeIndex]:'less', [right]: 'pivot' }, `Trocando ${arr[i]} e ${arr[storeIndex]}`, left, right);
                    [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
                    storeIndex++;
                }
            }
            [arr[right], arr[storeIndex]] = [arr[storeIndex], arr[right]];
            return storeIndex;
        };

        function select(arr: number[], left: number, right: number, k: number): number | null {
            if (k < 1 || k > right - left + 1) return null;
            if (left === right) {
                addStep(arr, { [left]: 'found'}, `Elemento encontrado: ${arr[left]}`, left, right, arr[left]);
                return arr[left];
            }
            
            // 1. Divide em grupos de 5 e encontra medianas
            let medians = [];
            let baseHighlights = {};
            for(let i = left; i <= right; i++) baseHighlights[i] = 'search';

            for (let i = left; i <= right; i += 5) {
                const groupEnd = Math.min(i + 4, right);
                let highlights = {...baseHighlights};
                for(let j=i; j<=groupEnd; j++) highlights[j] = 'group';
                addStep(arr, highlights, `Analisando grupo [${i}, ${groupEnd}]`, left, right);
                const median = findMedianOfFive(arr, i, groupEnd);
                medians.push(median);
            }
            
            let medianHighlights = {...baseHighlights};
            let medianIndices = [];
            medians.forEach(m => {
                const idx = arr.indexOf(m, left);
                if(idx !== -1 && idx <= right) {
                    medianHighlights[idx] = 'pivot-candidate';
                    medianIndices.push(idx);
                }
            });
            addStep(arr, medianHighlights, `Medianas dos grupos: [${medians.join(', ')}]`, left, right);
            
            // 2. Encontra a mediana das medianas (pivô)
            const pivot = medians.length <= 5 ? findMedianOfFive(medians, 0, medians.length - 1) : select(medians, 0, medians.length-1, Math.floor(medians.length/2)+1);
            if(pivot === null) return null; // Should not happen

            const pivotIdxInArr = arr.indexOf(pivot);
            medianHighlights[pivotIdxInArr] = 'pivot';
            addStep(arr, medianHighlights, `Pivô (mediana das medianas) escolhido: ${pivot}`, left, right);

            // 3. Particiona ao redor do pivô
            const pivotFinalIndex = partition(arr, left, right, pivot);

            // 4. Recurso
            const rank = pivotFinalIndex - left + 1;
            if (k === rank) {
                addStep(arr, {[pivotFinalIndex]: 'found'}, `Encontrado! O ${kValue}º elemento é ${arr[pivotFinalIndex]}.`, 0, size-1, arr[pivotFinalIndex]);
                return arr[pivotFinalIndex];
            } else if (k < rank) {
                 addStep(arr, {}, `Pivô grande demais. Buscando na partição esquerda.`, left, pivotFinalIndex - 1);
                return select(arr, left, pivotFinalIndex - 1, k);
            } else {
                addStep(arr, {}, `Pivô pequeno demais. Buscando na partição direita.`, pivotFinalIndex + 1, right);
                return select(arr, pivotFinalIndex + 1, right, k - rank);
            }
        }
        
        addStep([...arr], {}, `Array inicial. Buscando o ${kValue}º menor elemento.`, 0, size - 1);
        select(arr, 0, arr.length - 1, kValue);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        const newK = k > arraySize ? arraySize : k;
        if(k > arraySize) setK(newK);
        generateSteps(arraySize, newK);
    }, [arraySize, k, generateSteps]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1 && steps.length > 0) setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), MAX_SPEED - speed + MIN_SPEED);
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
    
    const handleArraySizeChange = (newSize: number) => {
        if (isPlaying) return;
        setArraySize(newSize);
        if (k > newSize) setK(newSize);
    };
    
    const handleKChange = (newK: number) => {
        if (isPlaying) return;
        setK(newK);
    };

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStepData = useMemo(() => steps[currentStepIndex] || { array: [], highlights: {}, k: 1, foundValue: null, message: '', left: 0, right: 0 }, [steps, currentStepIndex]);
    
    return {
        array: currentStepData.array,
        highlights: currentStepData.highlights,
        k: currentStepData.k,
        foundValue: currentStepData.foundValue,
        message: currentStepData.message,
        left: currentStepData.left,
        right: currentStepData.right,
        arraySize,
        kValue: k,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleArraySizeChange, handleSpeedChange, handleKChange }
    };
};