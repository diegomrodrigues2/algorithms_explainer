import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PalindromePartitioningAlgorithmStep } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const usePalindromePartitioning = (initialString: string) => {
    const [s, setS] = useState(initialString);
    const [steps, setSteps] = useState<PalindromePartitioningAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((str: string) => {
        const n = str.length;
        if (n === 0) {
            setSteps([]);
            return;
        }

        const newSteps: PalindromePartitioningAlgorithmStep[] = [];
        const pal: (boolean | null)[][] = Array(n).fill(null).map(() => Array(n).fill(null));
        const cuts: (number | null)[] = Array(n).fill(null);

        const addStep = (message: string, highlights: any = {}, result: number | null = null) => {
            newSteps.push({
                s: str,
                pal: JSON.parse(JSON.stringify(pal)),
                cuts: [...cuts],
                message,
                result,
                highlights
            });
        };

        addStep("Inicializando tabelas `pal` e `cuts`.");
        
        for (let i = 0; i < n; i++) {
            let minCuts = i;
            addStep(`Calculando cuts[${i}]. Pior caso: ${i} cortes.`, { cuts_i: i });

            for (let j = 0; j <= i; j++) {
                addStep(`Verificando se s[${j}..${i}] ("${str.substring(j, i + 1)}") é um palíndromo.`, { pal_i: i, pal_j: j });
                
                if (str[j] === str[i] && (i - j <= 1 || pal[j + 1][i - 1])) {
                    pal[j][i] = true;
                    addStep(`s[${j}] == s[${i}] e s[${j+1}..${i-1}] é palíndromo. s[${j}..${i}] é palíndromo.`, { pal_i: i, pal_j: j });
                    
                    if (j === 0) {
                        minCuts = 0;
                        addStep(`Substring s[0..${i}] é palíndromo. 0 cortes necessários.`, { cuts_i: i, pal_i: i, pal_j: j });
                    } else {
                        const prevCuts = cuts[j - 1] as number;
                         addStep(`Testando corte após s[${j-1}]. Cortes = 1 + cuts[${j-1}] = 1 + ${prevCuts} = ${1 + prevCuts}.`, { cuts_i: i, cuts_j: j - 1 });
                        minCuts = Math.min(minCuts, 1 + prevCuts);
                    }

                } else {
                    pal[j][i] = false;
                    addStep(`s[${j}..${i}] não é um palíndromo.`, { pal_i: i, pal_j: j });
                }
            }
            cuts[i] = minCuts;
            addStep(`Valor final para cuts[${i}] = ${cuts[i]}.`, { cuts_i: i });
        }

        const finalResult = cuts[n - 1] as number;
        addStep(`Finalizado. Mínimo de cortes necessários: ${finalResult}.`, {}, finalResult);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(s);
    }, [s, generateSteps]);

    useEffect(() => {
        reset();
    }, [s]);

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
    const handleStringChange = (newString: string) => { if (!isPlaying) setS(newString.toLowerCase().replace(/[^a-z]/g, '')); };
    
    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        s,
        pal: [],
        cuts: [],
        message: 'Configure a string e inicie.',
        result: null,
        highlights: {}
    }, [steps, currentStepIndex, s]);

    return {
        step: currentStepData,
        s: s,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleStringChange }
    };
};
