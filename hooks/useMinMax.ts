import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MinMaxAlgorithmStep } from '../types';

const INITIAL_SPEED = 300;
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

export const useMinMax = (initialSize: number) => {
    const [arraySize, setArraySize] = useState(initialSize);
    const [steps, setSteps] = useState<MinMaxAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((size: number) => {
        const arr = generateRandomArray(size);
        const newSteps: MinMaxAlgorithmStep[] = [];
        let comparisonCount = 0;
        let minValue: number | null = null;
        let maxValue: number | null = null;
        let minIndex: number | null = null;
        let maxIndex: number | null = null;

        const addStep = (array: number[], highlights: any, message: string) => {
            newSteps.push({
                array: [...array],
                highlights: { ...highlights },
                comparisonCount,
                minValue,
                maxValue,
                message,
            });
        };

        addStep(arr, {}, 'Array inicial. Pronto para encontrar o mínimo e o máximo.');

        if (size === 0) {
            addStep(arr, {}, 'Array vazio. Nada a fazer.');
            setSteps(newSteps);
            return;
        }

        let i = 0;
        // Se o tamanho do array for ímpar, o primeiro elemento é o min/max inicial
        if (size % 2 !== 0) {
            minValue = arr[0];
            maxValue = arr[0];
            minIndex = 0;
            maxIndex = 0;
            i = 1;
            addStep(arr, { [0]: 'current-min' }, `Ímpar. Inicializando min/max com o primeiro elemento: ${arr[0]}`);
        } else { // Se for par, o primeiro par determina o min/max inicial
            addStep(arr, { [0]: 'compare-pair', [1]: 'compare-pair' }, `Comparando o primeiro par: ${arr[0]} e ${arr[1]}`);
            comparisonCount++;
            if (arr[0] > arr[1]) {
                minValue = arr[1];
                maxValue = arr[0];
                minIndex = 1;
                maxIndex = 0;
            } else {
                minValue = arr[0];
                maxValue = arr[1];
                minIndex = 0;
                maxIndex = 1;
            }
            i = 2;
            addStep(arr, { [minIndex]: 'current-min', [maxIndex]: 'current-max' }, `Min inicial: ${minValue}, Max inicial: ${maxValue}. Comparações: ${comparisonCount}`);
        }

        // Processa os elementos restantes em pares
        while (i < size - 1) {
            const currentMinIndex = minIndex;
            const currentMaxIndex = maxIndex;

            addStep(arr, { [i]: 'compare-pair', [i + 1]: 'compare-pair', [currentMinIndex]: 'current-min', [currentMaxIndex]: 'current-max' }, `Comparando o par: ${arr[i]} e ${arr[i + 1]}`);
            comparisonCount++;
            let localMin, localMax, localMinIndex, localMaxIndex;

            if (arr[i] > arr[i + 1]) {
                localMin = arr[i + 1]; localMinIndex = i + 1;
                localMax = arr[i]; localMaxIndex = i;
            } else {
                localMin = arr[i]; localMinIndex = i;
                localMax = arr[i + 1]; localMaxIndex = i + 1;
            }

            // Compara o menor do par com o mínimo global
            addStep(arr, { [localMinIndex]: 'compare-global', [currentMinIndex]: 'current-min', [currentMaxIndex]: 'current-max' }, `Comparando menor do par (${localMin}) com min global (${minValue}).`);
            comparisonCount++;
            if (localMin < minValue) {
                minValue = localMin;
                minIndex = localMinIndex;
            }

            // Compara o maior do par com o máximo global
            addStep(arr, { [localMaxIndex]: 'compare-global', [minIndex]: 'current-min', [currentMaxIndex]: 'current-max' }, `Comparando maior do par (${localMax}) com max global (${maxValue}).`);
            comparisonCount++;
            if (localMax > maxValue) {
                maxValue = localMax;
                maxIndex = localMaxIndex;
            }

            addStep(arr, { [minIndex]: 'current-min', [maxIndex]: 'current-max' }, `Min atual: ${minValue}, Max atual: ${maxValue}. Comparações: ${comparisonCount}`);
            i += 2;
        }

        addStep(arr, { [minIndex]: 'final-min', [maxIndex]: 'final-max' }, `Finalizado! Mínimo: ${minValue}, Máximo: ${maxValue}. Total de comparações: ${comparisonCount}.`);
        
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
    
    const handleArraySizeChange = (newSize: number) => {
        if (isPlaying) return;
        setArraySize(newSize);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    };

    const currentStepData = useMemo(() => steps[currentStepIndex] || { array: [], highlights: {}, comparisonCount: 0, minValue: null, maxValue: null, message: '' }, [steps, currentStepIndex]);
    
    return {
        array: currentStepData.array,
        highlights: currentStepData.highlights,
        comparisonCount: currentStepData.comparisonCount,
        minValue: currentStepData.minValue,
        maxValue: currentStepData.maxValue,
        message: currentStepData.message,
        arraySize,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleArraySizeChange,
            handleSpeedChange,
        }
    };
};
