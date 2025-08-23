import { useState, useEffect, useCallback, useMemo } from 'react';
import type { EditDistanceAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useEditDistance = (initialStringA: string, initialStringB: string) => {
    const [stringAInput, setStringAInput] = useState(initialStringA);
    const [stringBInput, setStringBInput] = useState(initialStringB);
    const [steps, setSteps] = useState<EditDistanceAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((stringA: string, stringB: string) => {
        const m = stringA.length;
        const n = stringB.length;

        const newSteps: EditDistanceAlgorithmStep[] = [];
        const memo: { [key: string]: number } = {};
        const callStack: { i: number, j: number }[] = [];

        const addStep = (message: string, highlights: any = {}) => {
            newSteps.push({
                stringA,
                stringB,
                memo: { ...memo },
                callStack: [...callStack],
                message,
                result: null,
                highlights,
            });
        };

        function dp(i: number, j: number): number {
            callStack.push({ i, j });
            addStep(`Chamando dp(i=${i}, j=${j})`, { memoKey: `${i},${j}` });

            const memoKey = `${i},${j}`;
            if (memoKey in memo) {
                addStep(`Cache hit para (i=${i}, j=${j}). Resultado: ${memo[memoKey]}`, { memoKey });
                callStack.pop();
                return memo[memoKey];
            }
            addStep(`Cache miss para (i=${i}, j=${j}). Computando...`, { memoKey });

            if (i === 0) {
                addStep(`Caso base: i=0 (string A vazia). Custo é j=${j}.`, { memoKey });
                memo[memoKey] = j;
                callStack.pop();
                return j;
            }
            if (j === 0) {
                addStep(`Caso base: j=0 (string B vazia). Custo é i=${i}.`, { memoKey });
                memo[memoKey] = i;
                callStack.pop();
                return i;
            }
            
            const highlights = { stringAIndex: i - 1, stringBIndex: j - 1, memoKey };
            addStep(`Comparando A[${i-1}]='${stringA[i-1]}' e B[${j-1}]='${stringB[j-1]}'`, highlights);

            let result;
            if (stringA[i - 1] === stringB[j - 1]) {
                addStep(`Caracteres são iguais. Custo é o de dp(i-1, j-1).`, highlights);
                result = dp(i - 1, j - 1);
            } else {
                addStep(`Caracteres diferentes. Calculando min(inserção, exclusão, substituição).`, highlights);
                const costInsert = dp(i, j - 1);
                addStep(`Custo Inserção (dp(i,j-1)) = ${costInsert}`, highlights);
                
                const costDelete = dp(i - 1, j);
                addStep(`Custo Exclusão (dp(i-1,j)) = ${costDelete}`, highlights);
                
                const costSubstitute = dp(i - 1, j - 1);
                addStep(`Custo Substituição (dp(i-1,j-1)) = ${costSubstitute}`, highlights);
                
                result = 1 + Math.min(costInsert, costDelete, costSubstitute);
                addStep(`Resultado para (i=${i},j=${j}) = 1 + min(${costInsert}, ${costDelete}, ${costSubstitute}) = ${result}`, highlights);
            }

            memo[memoKey] = result;
            addStep(`Armazenando resultado ${result} no cache para (i=${i}, j=${j}).`, { memoKey });
            callStack.pop();
            return result;
        }

        addStep("Iniciando cálculo da Distância de Edição.", {});
        const finalResult = dp(m, n);
        
        const finalHighlights = { stringAIndex: -1, stringBIndex: -1, memoKey: `${m},${n}`};
        addStep(`Finalizado. Distância de Edição é ${finalResult}.`, finalHighlights);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) {
            newSteps.push({ ...lastStep, result: finalResult });
        }
        
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
        memo: {},
        callStack: [],
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
