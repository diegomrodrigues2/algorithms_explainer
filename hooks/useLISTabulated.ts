import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LISTabulatedAlgorithmStep } from '../types';

const INITIAL_SPEED = 250;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useLISTabulated = (initialSequence: string) => {
    const [sequenceInput, setSequenceInput] = useState(initialSequence);
    const [steps, setSteps] = useState<LISTabulatedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((sequenceStr: string) => {
        const sequence = sequenceStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const n = sequence.length;
        if (n === 0) {
            setSteps([]);
            return;
        }

        const newSteps: LISTabulatedAlgorithmStep[] = [];
        const dp = Array(n).fill(1);
        const parent = Array(n).fill(-1);

        const addStep = (message: string, highlights: any = {}, result: any = null) => {
            newSteps.push({
                sequence,
                dp: [...dp],
                parent: [...parent],
                message,
                result,
                highlights,
            });
        };
        
        addStep("Inicializando dp com 1s e parent com -1s.");

        for (let i = 0; i < n; i++) {
            addStep(`Processando elemento ${sequence[i]} no índice i=${i}.`, { currentIndex_i: i });
            for (let j = 0; j < i; j++) {
                addStep(`Comparando com elemento ${sequence[j]} no índice j=${j}.`, { currentIndex_i: i, compareIndex_j: j });
                if (sequence[j] < sequence[i] && dp[j] + 1 > dp[i]) {
                    addStep(`${sequence[j]} < ${sequence[i]} e dp[${j}]+1 > dp[${i}]. Atualizando.`, { currentIndex_i: i, compareIndex_j: j });
                    dp[i] = dp[j] + 1;
                    parent[i] = j;
                    addStep(`dp[${i}] = ${dp[i]}, parent[${i}] = ${parent[i]}.`, { currentIndex_i: i, compareIndex_j: j });
                }
            }
        }

        addStep("Cálculo da tabela DP concluído.");
        
        let maxLength = 0;
        let maxIndex = -1;
        for(let i=0; i < n; i++) {
            if(dp[i] > maxLength) {
                maxLength = dp[i];
                maxIndex = i;
            }
        }

        const subsequence: number[] = [];
        const pathIndices: number[] = [];
        if (maxIndex !== -1) {
             addStep(`LIS mais longa tem comprimento ${maxLength}. Reconstruindo o caminho...`, {pathIndices: [maxIndex]});
             let k = maxIndex;
             while(k !== -1) {
                 subsequence.unshift(sequence[k]);
                 pathIndices.unshift(k);
                 addStep(`Reconstruindo: Adicionando ${sequence[k]} ao caminho.`, {pathIndices: [...pathIndices]});
                 k = parent[k];
             }
        }
        
        const finalResult = { length: maxLength, subsequence };
        addStep(`Finalizado. LIS: [${subsequence.join(', ')}], Comprimento: ${maxLength}.`, { pathIndices }, finalResult);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);

    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(sequenceInput);
    }, [sequenceInput, generateSteps]);
    
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
    const handleSequenceChange = (newSequence: string) => {
        if(isPlaying) return;
        setSequenceInput(newSequence);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        sequence: sequenceInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        dp: [],
        parent: [],
        message: 'Configure a sequência e inicie.',
        result: null,
        highlights: {}
    }, [steps, currentStepIndex, sequenceInput]);
    
    return {
        step: currentStepData,
        sequenceInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleSequenceChange,
        }
    };
};
