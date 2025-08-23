import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EditDistanceTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useEditDistanceTabulated = (initialStringA: string, initialStringB: string) => {
    const [stringAInput, setStringAInput] = useState(initialStringA);
    const [stringBInput, setStringBInput] = useState(initialStringB);
    const [steps, setSteps] = useState<EditDistanceTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((stringA: string, stringB: string) => {
        const m = stringA.length;
        const n = stringB.length;
        const newSteps: EditDistanceTabulatedAlgorithmStep[] = [];
        const dpTable: (number | null)[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(null));

        const addStep = (message: string, highlights: any = {}, result: number | null = null) => {
            newSteps.push({
                stringA,
                stringB,
                dpTable: JSON.parse(JSON.stringify(dpTable)),
                message,
                result,
                highlights,
            });
        };

        addStep("Inicializando a tabela DP.", {});

        // Fill base cases
        for (let i = 0; i <= m; i++) {
            dpTable[i][0] = i;
            addStep(`Caso base: dp[${i}][0] = ${i} (deletar ${i} caracteres).`, { cell: [i, 0] });
        }
        for (let j = 1; j <= n; j++) {
            dpTable[0][j] = j;
            addStep(`Caso base: dp[0][${j}] = ${j} (inserir ${j} caracteres).`, { cell: [0, j] });
        }

        // Fill the rest of the table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const highlights = { cell: [i, j] as [number,number], stringAIndex: i - 1, stringBIndex: j - 1 };
                addStep(`Calculando dp[${i}][${j}] para A[${i-1}]='${stringA[i-1]}' e B[${j-1}]='${stringB[j-1]}'.`, highlights);

                const cost = stringA[i - 1] === stringB[j - 1] ? 0 : 1;
                if (cost === 0) {
                     addStep(`Caracteres são iguais. Custo de substituição é 0.`, highlights);
                } else {
                     addStep(`Caracteres diferentes. Custo de substituição é 1.`, highlights);
                }

                const delCost = dpTable[i - 1][j] as number + 1;
                const insCost = dpTable[i][j - 1] as number + 1;
                const subCost = dpTable[i - 1][j - 1] as number + cost;
                
                const sourceHighlights = {
                    ...highlights,
                    deleteCell: [i - 1, j] as [number,number],
                    insertCell: [i, j - 1] as [number,number],
                    substituteCell: [i - 1, j - 1] as [number,number],
                }
                addStep(`min(del=${delCost}, ins=${insCost}, sub=${subCost})`, sourceHighlights);

                dpTable[i][j] = Math.min(delCost, insCost, subCost);
                addStep(`dp[${i}][${j}] = ${dpTable[i][j]}.`, highlights);
            }
        }
        
        const finalResult = dpTable[m][n] as number;
        addStep(`Finalizado. Distância de Edição é ${finalResult}.`, { cell: [m, n] }, finalResult);

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