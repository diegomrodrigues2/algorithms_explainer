import { useState, useEffect, useCallback, useMemo } from 'react';
import type { KnapsackTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 200;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useKnapsackTabulated = (initialValues: string, initialWeights: string, initialCapacity: number) => {
    const [valuesInput, setValuesInput] = useState(initialValues);
    const [weightsInput, setWeightsInput] = useState(initialWeights);
    const [capacityInput, setCapacityInput] = useState(initialCapacity);
    const [steps, setSteps] = useState<KnapsackTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const parseInput = (input: string) => input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 0);

    const generateSteps = useCallback((valuesStr: string, weightsStr: string, capacity: number) => {
        const values = parseInput(valuesStr);
        const weights = parseInput(weightsStr);
        if (values.length === 0 || values.length !== weights.length || capacity < 0) {
            setSteps([]);
            return;
        }
        const n = values.length;

        const newSteps: KnapsackTabulatedAlgorithmStep[] = [];
        const dpTable: (number | null)[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null));
        const dp1D: (number | null)[] = Array(capacity + 1).fill(0);

        const addStep = (message: string, highlights: any = {}, result: any = null) => {
            newSteps.push({
                values, weights, capacity,
                dpTable: JSON.parse(JSON.stringify(dpTable)),
                dp1D: [...dp1D],
                message, result, highlights,
            });
        };

        addStep("Inicializando tabelas DP com 0.", {});
        for (let i = 0; i <= n; i++) dpTable[i][0] = 0;
        for (let w = 0; w <= capacity; w++) dpTable[0][w] = 0;
        addStep("Casos base: com 0 itens ou 0 capacidade, o valor máximo é 0.", {});

        for (let i = 1; i <= n; i++) {
            const v = values[i - 1];
            const w = weights[i - 1];
            addStep(`Processando item #${i} (v=${v}, w=${w})`, { itemIndex: i - 1 });

            for (let currentW = 1; currentW <= capacity; currentW++) {
                const highlights = { itemIndex: i - 1, cell: [i, currentW] as [number,number]};
                
                const prevValue = dpTable[i - 1][currentW] ?? 0;
                let newValue = prevValue;
                addStep(`dp[${i}][${currentW}]: Não incluir o item #${i}. Valor herdado: ${prevValue}`, { ...highlights, fromCell: [i - 1, currentW]});

                if (w <= currentW) {
                    const valueWithItem = v + (dpTable[i - 1][currentW - w] ?? 0);
                    addStep(`dp[${i}][${currentW}]: Incluir o item #${i}? Valor se incluído: ${v} + dp[${i-1}][${currentW-w}] = ${valueWithItem}`, { ...highlights, fromCellWithValue: [i-1, currentW - w]});
                    newValue = Math.max(prevValue, valueWithItem);
                }
                
                dpTable[i][currentW] = newValue;
                addStep(`dp[${i}][${currentW}] = ${newValue}`, highlights);
            }
             // Otimização 1D
            for (let currentW = capacity; currentW >= w; currentW--) {
                const highlights = { itemIndex: i - 1, dp1DIndex: currentW, dp1DFromIndex: currentW - w };
                addStep(`Otimizado: dp[${currentW}] = max(dp[${currentW}], ${v} + dp[${currentW-w}])`, highlights);
                dp1D[currentW] = Math.max(dp1D[currentW] ?? 0, v + (dp1D[currentW - w] ?? 0));
                addStep(`Otimizado: dp[${currentW}] é agora ${dp1D[currentW]}`, { ...highlights, dp1DFromIndex: -1 });
            }
        }
        
        const maxValue = dpTable[n][capacity] ?? 0;
        addStep(`Cálculo completo. Valor máximo: ${maxValue}. Reconstruindo itens...`);
        
        let remainingW = capacity;
        const items: { value: number, weight: number, index: number }[] = [];
        const path: {i: number, w: number}[] = [];
        for (let i = n; i > 0 && remainingW > 0; i--) {
             path.unshift({i, w: remainingW});
             if (dpTable[i][remainingW] !== dpTable[i-1][remainingW]) {
                 const itemIndex = i - 1;
                 items.unshift({ value: values[itemIndex], weight: weights[itemIndex], index: itemIndex });
                 remainingW -= weights[itemIndex];
             }
        }
        path.unshift({i:0, w: remainingW});

        const finalResult = { value: maxValue, items };
        addStep(`Finalizado. Valor: ${maxValue}. Itens: [${items.map(it => `#${it.index+1}`).join(',')}]`, { path }, finalResult);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(valuesInput, weightsInput, capacityInput);
    }, [valuesInput, weightsInput, capacityInput, generateSteps]);
    
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

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);
    const handleValuesChange = (newValues: string) => { if(!isPlaying) setValuesInput(newValues); }
    const handleWeightsChange = (newWeights: string) => { if(!isPlaying) setWeightsInput(newWeights); }
    const handleCapacityChange = (newCapacity: number) => { if(!isPlaying) setCapacityInput(Math.max(0, newCapacity)); }

    const currentStepData = useMemo(() => {
        const values = parseInput(valuesInput);
        const weights = parseInput(weightsInput);
        return steps[currentStepIndex] || {
            values, weights, capacity: capacityInput,
            dpTable: [], dp1D: [], message: 'Configure e inicie.', result: null, highlights: {}
        }
    }, [steps, currentStepIndex, valuesInput, weightsInput, capacityInput]);
    
    return {
        step: currentStepData,
        valuesInput, weightsInput, capacityInput,
        speed, isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleValuesChange, handleWeightsChange, handleCapacityChange }
    };
};