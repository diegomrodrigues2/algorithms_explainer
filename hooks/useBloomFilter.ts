import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BloomFilterAlgorithmStep } from '../types';

const ANIMATION_SPEED = 600;

const seededHash = (str: string, seed: number): number => {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const useBloomFilter = () => {
    const [n, setN] = useState(10); // expected items
    const [p, setP] = useState(0.05); // false positive probability
    
    const [bitArray, setBitArray] = useState<(boolean | null)[]>([]);
    const [m, setM] = useState(0); // size
    const [k, setK] = useState(0); // hash count
    
    const [steps, setSteps] = useState<BloomFilterAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const calculateParams = useCallback(() => {
        const newM = Math.ceil(-(n * Math.log(p)) / (Math.log(2) ** 2));
        const newK = Math.max(1, Math.round((newM / n) * Math.log(2)));
        setM(newM);
        setK(newK);
        setBitArray(Array(newM).fill(false));
    }, [n, p]);

    useEffect(() => {
        calculateParams();
    }, [calculateParams]);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        calculateParams();
        const initialStep: BloomFilterAlgorithmStep = {
            bitArray: Array(m).fill(false), m, k, n, p,
            message: "Filtro de Bloom inicializado. Adicione ou verifique um item.",
            highlights: {}, operation: 'idle', currentItem: null, checkResult: null, hashCalculations: []
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    }, [m, k, n, p, calculateParams]);

    useEffect(() => {
        reset();
    }, [n, p]);

    const add = (item: string) => {
        if (isPlaying) return;
        const newSteps: BloomFilterAlgorithmStep[] = [];
        const newBitArray = [...bitArray];
        const hashCalculations: { func: string, index: number }[] = [];

        const addStep = (message: string, highlights: any = {}, op: any = 'add') => {
            newSteps.push({ bitArray: [...newBitArray], m, k, n, p, message, highlights, operation: op, currentItem: item, checkResult: null, hashCalculations: [...hashCalculations] });
        };
        
        addStep(`Adicionando "${item}"...`);

        for (let i = 0; i < k; i++) {
            const hash = seededHash(item, i);
            const index = hash % m;
            hashCalculations.push({func: `hash(item, seed=${i})`, index});
            addStep(`Calculando hash ${i + 1}: índice=${index}.`, { bits: [index] });
            
            newBitArray[index] = true;
            addStep(`Definindo bit no índice ${index} para 1.`, { bits: [index] });
        }
        
        addStep(`Item "${item}" adicionado ao filtro.`, {});
        setBitArray(newBitArray);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    };

    const check = (item: string) => {
         if (isPlaying) return;
        const newSteps: BloomFilterAlgorithmStep[] = [];
        const hashCalculations: { func: string, index: number }[] = [];

        const addStep = (message: string, highlights: any = {}, op: any = 'check', result: boolean | null = null) => {
            newSteps.push({ bitArray: [...bitArray], m, k, n, p, message, highlights, operation: op, currentItem: item, checkResult: result, hashCalculations: [...hashCalculations] });
        };
        
        addStep(`Verificando "${item}"...`, {}, 'check');

        for (let i = 0; i < k; i++) {
            const hash = seededHash(item, i);
            const index = hash % m;
            hashCalculations.push({func: `hash(item, seed=${i})`, index});
            addStep(`Calculando hash ${i + 1}: índice=${index}.`, { bits: [index] }, 'check');

            if (!bitArray[index]) {
                addStep(`Bit no índice ${index} é 0. O item definitivamente NÃO está no conjunto.`, { bits: [index] }, 'result', false);
                setSteps(newSteps);
                setCurrentStepIndex(0);
                setIsPlaying(true);
                return;
            }
             addStep(`Bit no índice ${index} é 1. Continuando...`, { bits: [index] }, 'check');
        }

        addStep(`Todos os bits verificados são 1. O item PODE estar no conjunto.`, {}, 'result', true);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    };


    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), ANIMATION_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length]);

    const currentStepData: BloomFilterAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        bitArray, m, k, n, p, message: 'Bem-vindo ao Filtro de Bloom!', highlights: {}, operation: 'idle', currentItem: null, checkResult: null, hashCalculations: []
    }, [steps, currentStepIndex, bitArray, m, k, n, p]);

    return {
        step: currentStepData,
        isPlaying,
        actions: { add, check, reset, handleNChange: setN, handlePChange: setP }
    };
};