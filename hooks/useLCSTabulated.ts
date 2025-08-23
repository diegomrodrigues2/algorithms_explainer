import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LCSTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useLCSTabulated = (initialStringA: string, initialStringB: string) => {
    const [stringAInput, setStringAInput] = useState(initialStringA);
    const [stringBInput, setStringBInput] = useState(initialStringB);
    const [steps, setSteps] = useState<LCSTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((stringA: string, stringB: string) => {
        const m = stringA.length;
        const n = stringB.length;
        const newSteps: LCSTabulatedAlgorithmStep[] = [];
        const dpTable: (number | null)[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

        const addStep = (message: string, highlights: any = {}, result: any = null) => {
            newSteps.push({
                stringA,
                stringB,
                dpTable: JSON.parse(JSON.stringify(dpTable)),
                message,
                result,
                highlights,
            });
        };

        addStep("Inicializando a tabela DP com zeros.", {});

        for (let i = 0; i <= m; i++) {
            dpTable[i][0] = 0;
        }
        for (let j = 0; j <= n; j++) {
            dpTable[0][j] = 0;
        }
        addStep("Casos base: LCS com uma string vazia é 0.", {});

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const highlights = { cell: [i, j] as [number,number], stringAIndex: i - 1, stringBIndex: j - 1 };
                addStep(`Calculando dp[${i}][${j}] para A[${i-1}]='${stringA[i-1]}' e B[${j-1}]='${stringB[j-1]}'.`, highlights);

                if (stringA[i - 1] === stringB[j - 1]) {
                    dpTable[i][j] = (dpTable[i - 1][j - 1] ?? 0) + 1;
                    addStep(`Caracteres são iguais. dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dpTable[i][j]}.`, { ...highlights, matchCell: [i - 1, j - 1]});
                } else {
                    const up = dpTable[i - 1][j] ?? 0;
                    const left = dpTable[i][j - 1] ?? 0;
                    dpTable[i][j] = Math.max(up, left);
                    addStep(`Caracteres diferentes. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${up}, ${left}) = ${dpTable[i][j]}.`, { ...highlights, upCell: [i - 1, j], leftCell: [i, j - 1]});
                }
            }
        }
        
        addStep("Cálculo da tabela DP concluído. Reconstruindo a LCS...");

        // Reconstruct path
        let lcs = "";
        let i = m, j = n;
        const path: [number, number][] = [];
        while(i > 0 && j > 0) {
            path.unshift([i,j]);
            if (stringA[i-1] === stringB[j-1]) {
                lcs = stringA[i-1] + lcs;
                i--;
                j--;
            } else if ((dpTable[i-1][j] ?? 0) >= (dpTable[i][j-1] ?? 0)) {
                i--;
            } else {
                j--;
            }
        }
        path.unshift([i,j]);

        const finalResult = { length: dpTable[m][n] as number, subsequence: lcs };
        addStep(`Finalizado. LCS: "${lcs}", Comprimento: ${finalResult.length}.`, { path }, finalResult);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(stringAInput, stringBInput);
    }, [stringAInput, stringBInput, generateSteps]);
    
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
    const handleStringAChange = (newString: string) => { if(!isPlaying) setStringAInput(newString); }
    const handleStringBChange = (newString: string) => { if(!isPlaying) setStringBInput(newString); }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        stringA: stringAInput,
        stringB: stringBInput,
        dpTable: [],
        message: 'Configure as strings e inicie.',
        result: null,
        highlights: {}
    }, [steps, currentStepIndex, stringAInput, stringBInput]);
    
    return {
        step: currentStepData,
        stringAInput,
        stringBInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleStringAChange, handleStringBChange }
    };
};