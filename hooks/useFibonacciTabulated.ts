import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FibonacciTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useFibonacciTabulated = (initialN: number) => {
    const [n, setN] = useState(initialN);
    const [steps, setSteps] = useState<FibonacciTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((num: number) => {
        const newSteps: FibonacciTabulatedAlgorithmStep[] = [];
        const dp: (number | null)[] = Array(num + 1).fill(null);
        let optimized = { prev: 0, curr: 1 };

        const addStep = (message: string, highlights: any = {}, result: number | null = null) => {
            newSteps.push({
                n: num,
                dp: [...dp],
                optimized: { ...optimized },
                message,
                result,
                highlights
            });
        };

        if (num === 0) {
            dp[0] = 0;
            addStep("Caso base: n=0. Resultado é 0.", { dpIndex: 0 }, 0);
            setSteps(newSteps);
            return;
        }

        dp[0] = 0;
        dp[1] = 1;
        addStep("Inicializando dp[0]=0 e dp[1]=1.", { dpIndex: 0 });
        addStep("Inicializando dp[0]=0 e dp[1]=1.", { dpIndex: 1 });

        for (let i = 2; i <= num; i++) {
            const prev1 = dp[i-1] as number;
            const prev2 = dp[i-2] as number;
            
            addStep(`Calculando dp[${i}] = dp[${i-1}] + dp[${i-2}]`, { prev1: i - 1, prev2: i - 2 });
            dp[i] = prev1 + prev2;
            
            // Otimizado
            const newCurr = optimized.prev + optimized.curr;
            optimized.prev = optimized.curr;
            optimized.curr = newCurr;

            addStep(`dp[${i}] = ${prev1} + ${prev2} = ${dp[i]}`, { dpIndex: i });
        }

        const finalResult = dp[num];
        addStep(`Finalizado. fib(${num}) = ${finalResult}.`, { dpIndex: num }, finalResult);
        
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
        n, dp: [], optimized: { prev: 0, curr: 1}, message: 'Configure e inicie.', result: null, highlights: {}
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