import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FibonacciMemoizedAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useFibonacciMemoized = (initialN: number) => {
    const [n, setN] = useState(initialN);
    const [steps, setSteps] = useState<FibonacciMemoizedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((num: number) => {
        const newSteps: FibonacciMemoizedAlgorithmStep[] = [];
        const memo: { [key: number]: number | 'computing' } = {};
        const callStack: number[] = [];

        const addStep = (message: string, highlights: any = {}) => {
            newSteps.push({
                n: num,
                memo: { ...memo },
                callStack: [...callStack],
                message,
                result: null,
                highlights
            });
        };

        function fib(k: number): number {
            callStack.push(k);
            memo[k] = 'computing';
            addStep(`Chamando fib(${k})`, { memoIndex: k });

            if (k in memo && memo[k] !== 'computing') {
                const val = memo[k] as number;
                addStep(`Cache hit para fib(${k}). Resultado: ${val}`, { memoIndex: k });
                callStack.pop();
                return val;
            }

            if (k < 2) {
                addStep(`Caso base: fib(${k}) = ${k}.`, { memoIndex: k });
                memo[k] = k;
                addStep(`Armazenando resultado fib(${k}) = ${k} no cache.`, { memoIndex: k });
                callStack.pop();
                return k;
            }

            addStep(`fib(${k}) = fib(${k-1}) + fib(${k-2}). Calculando fib(${k-1})...`, { memoIndex: k });
            const val1 = fib(k - 1);
            addStep(`fib(${k-1}) = ${val1}. Calculando fib(${k-2})...`, { memoIndex: k });
            const val2 = fib(k - 2);

            const result = val1 + val2;
            addStep(`fib(${k}) = ${val1} + ${val2} = ${result}.`, { memoIndex: k });
            memo[k] = result;
            addStep(`Armazenando resultado fib(${k}) = ${result} no cache.`, { memoIndex: k });

            callStack.pop();
            return result;
        }

        addStep("Iniciando cálculo de Fibonacci.", {});
        const finalResult = fib(num);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) {
            newSteps.push({ ...lastStep, result: finalResult, message: `Finalizado. fib(${num}) = ${finalResult}.` });
        }
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(n);
    }, [n, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [n]);

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
    const handleNChange = (newN: number) => { if(!isPlaying) setN(newN); };
    
    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        n, memo: {}, callStack: [], message: 'Configure e inicie.', result: null, highlights: {}
    }, [steps, currentStepIndex, n]);
    
    return {
        step: currentStepData,
        nValue: n,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNChange }
    };
};