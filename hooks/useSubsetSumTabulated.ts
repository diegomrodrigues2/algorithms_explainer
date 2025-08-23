import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SubsetSumTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 200;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useSubsetSumTabulated = (initialNumbers: string, initialTarget: number) => {
    const [numbersInput, setNumbersInput] = useState(initialNumbers);
    const [targetInput, setTargetInput] = useState(initialTarget);
    const [steps, setSteps] = useState<SubsetSumTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numbersStr: string, target: number) => {
        const numbers = numbersStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
        if (numbers.length === 0 || target < 0) {
            setSteps([]);
            return;
        }
        const n = numbers.length;

        const newSteps: SubsetSumTabulatedAlgorithmStep[] = [];
        const dpTable: (boolean | null)[][] = Array(n + 1).fill(null).map(() => Array(target + 1).fill(null));
        const dp1D: (boolean | null)[] = Array(target + 1).fill(null);

        const addStep = (message: string, highlights: any = {}, result: boolean | null = null) => {
            newSteps.push({
                numbers,
                target,
                dpTable: JSON.parse(JSON.stringify(dpTable)),
                dp1D: [...dp1D],
                message,
                result,
                highlights,
            });
        };

        addStep("Inicializando tabelas.", {});

        // Initialize base cases
        for (let i = 0; i <= n; i++) {
            dpTable[i][0] = true;
        }
        dp1D[0] = true;
        addStep("Caso base: Soma 0 é sempre possível com um subconjunto vazio.", { cell: [n,0], dp1DIndex: 0 });

        // Fill the DP table
        for (let i = 1; i <= n; i++) {
            const num = numbers[i - 1];
            addStep(`Processando o número: ${num}`, { numberIndex: i - 1 });

            for (let t = 1; t <= target; t++) {
                const highlights = { numberIndex: i - 1, cell: [i, t] as [number,number]};

                // Opção 1: Não incluir o número
                const notIncluding = dpTable[i - 1][t];
                addStep(
                    `dp[${i}][${t}]: Opção 1 (não incluir ${num}). Herdar de dp[${i-1}][${t}] => ${notIncluding}.`,
                    { ...highlights, fromCell: [i - 1, t] }
                );
                dpTable[i][t] = notIncluding ?? false;
                addStep(
                    `dp[${i}][${t}] agora é ${dpTable[i][t]}`,
                    { ...highlights }
                );

                // Opção 2: Incluir o número
                if (t >= num) {
                    const including = dpTable[i - 1][t - num];
                    addStep(
                        `dp[${i}][${t}]: Opção 2 (incluir ${num}). Verificar dp[${i-1}][${t-num}] => ${including}.`,
                        { ...highlights, fromCellWithValue: [i - 1, t - num] }
                    );
                    if(including){
                         dpTable[i][t] = dpTable[i][t] || including;
                    }
                    addStep(
                        `dp[${i}][${t}] atualizado para ${dpTable[i][t]}`,
                        { ...highlights }
                    );
                }
            }
             // Update 1D table after processing one number
            for (let t = target; t >= num; t--) {
                const highlights = { numberIndex: i - 1, dp1DIndex: t, dp1DFromIndex: t-num};
                addStep(`Otimizado: dp[${t}] = dp[${t}] OR dp[${t - num}]`, highlights);
                dp1D[t] = dp1D[t] || dp1D[t - num];
                 addStep(`Otimizado: dp[${t}] é agora ${dp1D[t]}`, { numberIndex: i - 1, dp1DIndex: t});
            }
        }
        
        const finalResult = dpTable[n][target] ?? false;
        addStep(`Finalizado. É possível somar ${target}? ${finalResult}`, { cell: [n, target] }, finalResult);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numbersInput, targetInput);
    }, [numbersInput, targetInput, generateSteps]);
    
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
    const handleNumbersChange = (newNumbers: string) => { if(!isPlaying) setNumbersInput(newNumbers); }
    const handleTargetChange = (newTarget: number) => { if(!isPlaying) setTargetInput(Math.max(0, newTarget)); }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        numbers: numbersInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        target: targetInput,
        dpTable: [],
        dp1D: [],
        message: 'Configure e inicie.',
        result: null,
        highlights: {}
    }, [steps, currentStepIndex, numbersInput, targetInput]);
    
    return {
        step: currentStepData,
        numbersInput,
        targetInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNumbersChange, handleTargetChange }
    };
};
