import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SubsetSumMemoizedAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useSubsetSumMemoized = (initialNumbers: string, initialTarget: number) => {
    const [numbersInput, setNumbersInput] = useState(initialNumbers);
    const [targetInput, setTargetInput] = useState(initialTarget);
    const [steps, setSteps] = useState<SubsetSumMemoizedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numbersStr: string, target: number) => {
        const numbers = numbersStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (numbers.length === 0 || target < 0) {
            setSteps([]);
            return;
        }

        const newSteps: SubsetSumMemoizedAlgorithmStep[] = [];
        const memo: { [key: string]: boolean } = {};
        const callStack: { i: number, t: number }[] = [];

        const addStep = (message: string, currentComputation: { i: number, t: number } | null, highlights: any = {}) => {
            newSteps.push({
                numbers,
                target,
                memo: { ...memo },
                callStack: [...callStack],
                currentComputation,
                message,
                result: null,
                highlights
            });
        };

        function dp(i: number, t: number): boolean {
            callStack.push({ i, t });
            const memoKey = `${i},${t}`;
            addStep(`Chamando dp(i=${i}, t=${t}).`, { i, t }, { numberIndex: i });

            if (memoKey in memo) {
                addStep(`Cache hit para dp(i=${i}, t=${t}). Resultado: ${memo[memoKey]}`, { i, t }, { memoKey });
                callStack.pop();
                return memo[memoKey];
            }
             addStep(`Cache miss para dp(i=${i}, t=${t}). Computando...`, { i, t }, { memoKey });

            if (t === 0) {
                addStep(`Caso base: t=0. Retornando True.`, { i, t });
                memo[memoKey] = true;
                addStep(`Armazenando resultado True para dp(i=${i}, t=${t}) no cache.`, { i, t }, { memoKey });
                callStack.pop();
                return true;
            }
            if (i >= numbers.length || t < 0) {
                 addStep(`Caso base: i >= n ou t < 0. Retornando False.`, { i, t });
                memo[memoKey] = false;
                addStep(`Armazenando resultado False para dp(i=${i}, t=${t}) no cache.`, { i, t }, { memoKey });
                callStack.pop();
                return false;
            }

            const num = numbers[i];
            addStep(`Explorando COM o número ${num} (índice ${i}).`, { i, t }, { numberIndex: i, memoKey });
            if (dp(i + 1, t - num)) {
                addStep(`Solução encontrada incluindo ${num}. Retornando True.`, { i, t }, { memoKey });
                memo[memoKey] = true;
                addStep(`Armazenando resultado True para dp(i=${i}, t=${t}) no cache.`, { i, t }, { memoKey });
                callStack.pop();
                return true;
            }
            addStep(`Caminho COM ${num} não levou à solução.`, { i, t }, { numberIndex: i, memoKey });

            
            addStep(`Explorando SEM o número ${num} (índice ${i}).`, { i, t }, { numberIndex: i, memoKey });
            const result = dp(i + 1, t);
            
            addStep(`Resultado do caminho SEM ${num}: ${result}.`, { i, t }, { numberIndex: i, memoKey });

            memo[memoKey] = result;
            addStep(`Armazenando resultado ${result} para dp(i=${i}, t=${t}) no cache.`, { i, t }, { memoKey });
            callStack.pop();
            return result;
        }

        const finalResult = dp(0, target);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) {
            newSteps.push({ ...lastStep, result: finalResult, message: `Finalizado. Existe um subconjunto que soma ${target}? ${finalResult}.` });
        }
        
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
        memo: {},
        callStack: [],
        currentComputation: null,
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
