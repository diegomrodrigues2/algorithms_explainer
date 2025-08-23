import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AlgorithmStep } from '../types';

const INITIAL_SPEED = 250;
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

export const useCountInversions = (initialSize: number) => {
    const [arraySize, setArraySize] = useState(initialSize);
    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((size: number) => {
        const newArray = generateRandomArray(size);
        const newSteps: AlgorithmStep[] = [];
        let inversionsCount = 0;

        const addStep = (arr: number[], highlights: any, message: string) => {
            newSteps.push({
                array: [...arr],
                highlights: { ...highlights },
                inversionsCount,
                message,
            });
        };

        function mergeSort(arr: number[], left: number, right: number) {
            if (left >= right) {
                if(left === right) {
                    addStep(arr, {[left]: 'sorted'}, `Sub-array de tamanho 1, já ordenado.`);
                }
                return;
            }
            
            const mid = Math.floor((left + right) / 2);
            
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }

        function merge(arr: number[], left: number, mid: number, right: number) {
            const leftArr = arr.slice(left, mid + 1);
            const rightArr = arr.slice(mid + 1, right + 1);

            let i = 0; // index for leftArr
            let j = 0; // index for rightArr
            let k = left; // index for merged arr

            addStep(arr, {}, `Mesclando sub-arrays: [${leftArr}] e [${rightArr}]`);

            while (i < leftArr.length && j < rightArr.length) {
                const highlights = {
                    [left + i]: 'compare',
                    [mid + 1 + j]: 'compare',
                };
                addStep(arr, highlights, `Comparando ${leftArr[i]} e ${rightArr[j]}`);

                if (leftArr[i] <= rightArr[j]) {
                    arr[k] = leftArr[i];
                    i++;
                } else {
                    const highlightsWithInversion = { ...highlights, [mid + 1 + j]: 'inversion'};
                    const numInversions = leftArr.length - i;
                    inversionsCount += numInversions;
                    
                    addStep(arr, highlightsWithInversion, `${rightArr[j]} < ${leftArr[i]}. Inversão! +${numInversions} inversões.`);
                    
                    arr[k] = rightArr[j];
                    j++;
                }
                k++;
            }
            
            while (i < leftArr.length) {
                arr[k] = leftArr[i];
                i++;
                k++;
            }

            while (j < rightArr.length) {
                arr[k] = rightArr[j];
                j++;
                k++;
            }

            const sortedHighlights = {};
            for(let l = left; l <= right; l++) {
                 // @ts-ignore
                sortedHighlights[l] = 'sorted';
            }
             addStep(arr, sortedHighlights, `Sub-array [${arr.slice(left, right + 1)}] ordenado.`);

        }

        const initialArray = [...newArray];
        addStep(initialArray, {}, "Array inicial. Começando a ordenação...");
        mergeSort(newArray, 0, newArray.length - 1);
        addStep(newArray, {}, `Ordenação completa! Total de ${inversionsCount} inversões.`);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(arraySize);
    }, [arraySize, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length -1) {
            if (currentStepIndex >= steps.length -1 && steps.length > 0) {
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
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    };

    const currentStepData = useMemo(() => steps[currentStepIndex] || { array: [], highlights: {}, inversionsCount: 0, message: '' }, [steps, currentStepIndex]);
    
    return {
        array: currentStepData.array,
        highlights: currentStepData.highlights,
        inversionsCount: currentStepData.inversionsCount,
        message: currentStepData.message,
        arraySize,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length -1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleArraySizeChange,
            handleSpeedChange,
        }
    };
};
