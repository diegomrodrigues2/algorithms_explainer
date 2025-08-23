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

        function partition(arr: number[], left: number, right: number) {
            const pivotValue = arr[right];
            let baseHighlights: { [key: number]: string } = {};
            for(let i = left; i <= right; i++) baseHighlights[i] = 'search';
            addStep(arr, { ...baseHighlights, [right]: 'pivot' }, `Particionando [${left}, ${right}]. Pivô: ${pivotValue}.`, left, right);
        
            let storeIndex = left;
            for (let i = left; i < right; i++) {
                // Build highlights for current state
                const highlights: { [key: number]: string } = { ...baseHighlights };
                for(let j=left; j < storeIndex; j++) highlights[j] = 'less';
                highlights[right] = 'pivot';
                highlights[i] = 'compare';
                highlights[storeIndex] = 'storeIndex';
                addStep(arr, highlights, `Comparando ${arr[i]} com o pivô ${pivotValue}. 'Store index' está em ${storeIndex}.`, left, right);
                
                if (arr[i] < pivotValue) {
                    addStep(arr, { ...highlights, [i]: 'less' }, `${arr[i]} < ${pivotValue}. Trocando com o elemento no 'store index' (${arr[storeIndex]}).`, left, right);
                    [arr[i], arr[storeIndex]] = [arr[storeIndex], arr[i]];
                    
                    const postSwapHighlights = { ...baseHighlights, [right]: 'pivot' };
                     for(let j=left; j <= storeIndex; j++) postSwapHighlights[j] = 'less';
                     if (i > storeIndex) postSwapHighlights[i] = 'search'; // reset previous color
                     addStep(arr, postSwapHighlights, `Troca efetuada.`, left, right);
                    
                    storeIndex++;
                    const swappedHighlights: { [key: number]: string } = { ...baseHighlights, [right]: 'pivot' };
                    for(let j=left; j < storeIndex; j++) swappedHighlights[j] = 'less';
                    if (storeIndex <= right) {
                        swappedHighlights[storeIndex] = 'storeIndex';
                    }
                     addStep(arr, swappedHighlights, `Incrementando 'store index' para ${storeIndex}.`, left, right);
                } else {
                    addStep(arr, { ...highlights, [i]: 'greater' }, `${arr[i]} >= ${pivotValue}. Nenhuma troca necessária.`, left, right);
                }
            }
            
            const partitionEndHighlights = { ...baseHighlights, [right]: 'pivot', [storeIndex]: 'storeIndex' };
            for(let j=left; j < storeIndex; j++) partitionEndHighlights[j] = 'less';
            for (let i = storeIndex; i < right; i++) {
                if(arr[i] >= pivotValue) partitionEndHighlights[i] = 'greater';
            }
            addStep(arr, partitionEndHighlights, `Fim da partição. Trocando pivô com o elemento no 'store index'.`, left, right);
        
            [arr[right], arr[storeIndex]] = [arr[storeIndex], arr[right]];
            
            const finalHighlights: { [key: number]: string } = {};
            for(let i = left; i < storeIndex; i++) finalHighlights[i] = 'less';
            finalHighlights[storeIndex] = 'final-pivot';
            for(let i = storeIndex + 1; i <= right; i++) finalHighlights[i] = 'greater';
            
            addStep(arr, finalHighlights, `Pivô ${pivotValue} movido para a posição final ${storeIndex}.`, left, right);
            return storeIndex;
        }

        function quickselect(arr: number[], left: number, right: number, k: number): number | null {
            while (left <= right) {
                let searchHighlights: { [key: number]: string } = {};
                for(let i = left; i <= right; i++) searchHighlights[i] = 'search';
                addStep(arr, searchHighlights, `Buscando o ${k}º elemento no sub-array [${left}, ${right}]`, left, right);
                
                if (left === right) {
                    addStep(arr, {[left]: 'found'}, `Encontrado! O sub-array tem tamanho 1, então o ${k}º elemento é ${arr[left]}.`, left, right, arr[left]);
                    return arr[left];
                }
        
                const pivotIndex = partition(arr, left, right);
                const pivotRank = pivotIndex + 1;
        
                if (k === pivotRank) {
                    addStep(arr, {[pivotIndex]: 'found'}, `Encontrado! O pivô está no índice k-1=${k-1}. O ${k}º elemento é ${arr[pivotIndex]}.`, left, right, arr[pivotIndex]);
                    return arr[pivotIndex];
                } else if (k < pivotRank) {
                    right = pivotIndex - 1;
                    addStep(arr, {}, `O rank do pivô (${pivotRank}) é maior que o alvo (${k}). A busca continua na partição da ESQUERDA: [${left}, ${right}].`, left, right);
                } else {
                    left = pivotIndex + 1;
                     addStep(arr, {}, `O rank do pivô (${pivotRank}) é menor que o alvo (${k}). A busca continua na partição da DIREITA: [${left}, ${right}].`, left, right);
                }
            }
            return null;
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