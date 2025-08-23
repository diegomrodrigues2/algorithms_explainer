import { useState, useEffect, useCallback, useMemo } from 'react';
import type { QuickselectAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
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

export const useQuickselect = (initialSize: number) => {
    const [arraySize, setArraySize] = useState(initialSize);
    const [k, setK] = useState(Math.floor(initialSize / 2) || 1);
    const [steps, setSteps] = useState<QuickselectAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((size: number, kValue: number) => {
        const arr = generateRandomArray(size);
        const newSteps: QuickselectAlgorithmStep[] = [];

        const addStep = (array: number[], highlights: any, message: string, left: number, right: number, foundValue: number | null = null) => {
            newSteps.push({
                array: [...array],
                highlights: { ...highlights },
                k: kValue,
                foundValue,
                message,
                left,
                right,
            });
        };

        function quickselect(arr: number[], left: number, right: number, k: number) {
            while (left <= right) {
                addStep(arr, {}, `Buscando o ${k}º elemento no sub-array [${left}, ${right}]`, left, right);
                
                if (left === right) {
                    addStep(arr, {[left]: 'found'}, `Elemento encontrado na posição ${left}`, left, right, arr[left]);
                    return arr[left];
                }

                const pivotIndex = partition(arr, left, right, k);

                if (k - 1 === pivotIndex) {
                    addStep(arr, {[pivotIndex]: 'found'}, `Encontrado! O ${k}º menor elemento é ${arr[pivotIndex]}.`, left, right, arr[pivotIndex]);
                    return arr[pivotIndex];
                } else if (k - 1 < pivotIndex) {
                    right = pivotIndex - 1;
                    addStep(arr, {}, `O pivô ${arr[pivotIndex]} é grande. Buscando na partição esquerda.`, left, right);
                } else {
                    left = pivotIndex + 1;
                    addStep(arr, {}, `O pivô ${arr[pivotIndex]} é pequeno. Buscando na partição direita.`, left, right);
                }
            }
        }
        
        function partition(arr: number[], left: number, right: number, k: number) {
            const pivotValue = arr[right];
            const highlights = {};
            for(let i = left; i <= right; i++) highlights[i] = 'search';
            highlights[right] = 'pivot';
            addStep(arr, highlights, `Particionando. Pivô: ${pivotValue}`, left, right);

            let storeIndex = left;
            for (let i = left; i < right; i++) {
                 const currentHighlights = {...highlights, [i]: 'compare', [storeIndex]: 'less'};
                 addStep(arr, currentHighlights, `Comparando ${arr[i]} com o pivô ${pivotValue}`, left, right);
                if (arr[i] < pivotValue) {
                    [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
                     addStep(arr, {...currentHighlights, [i]:'less'}, `Trocando ${arr[storeIndex]} com ${arr[i]}`, left, right);
                    storeIndex++;
                }
            }
            [arr[right], arr[storeIndex]] = [arr[storeIndex], arr[right]];
            const finalHighlights = {};
            for(let i = left; i <= right; i++) finalHighlights[i] = 'search';
            finalHighlights[storeIndex] = 'final';

            addStep(arr, finalHighlights, `Pivô ${pivotValue} movido para a posição final ${storeIndex}.`, left, right);
            return storeIndex;
        }

        addStep([...arr], {}, `Array inicial. Buscando o ${kValue}º menor elemento.`, 0, arr.length - 1);
        quickselect(arr, 0, arr.length - 1, kValue);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        if (k > arraySize) {
            setK(arraySize);
            generateSteps(arraySize, arraySize);
        } else {
            generateSteps(arraySize, k);
        }
    }, [arraySize, k, generateSteps]);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
                setIsPlaying(false);
            }
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
    
    const handleArraySizeChange = (newSize: number) => {
        if (isPlaying) return;
        setArraySize(newSize);
        if (k > newSize) {
            setK(newSize);
        }
    };
    
    const handleKChange = (newK: number) => {
        if (isPlaying) return;
        setK(newK);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    };

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
        actions: {
            reset,
            togglePlayPause,
            handleArraySizeChange,
            handleSpeedChange,
            handleKChange
        }
    };
};