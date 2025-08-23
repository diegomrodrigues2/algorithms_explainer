import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LISMemoizedAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useLISMemoized = (initialSequence: string) => {
    const [sequenceInput, setSequenceInput] = useState(initialSequence);
    const [steps, setSteps] = useState<LISMemoizedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((sequenceStr: string) => {
        const sequence = sequenceStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        if (sequence.length === 0) {
            setSteps([]);
            return;
        }
        const n = sequence.length;

        const newSteps: LISMemoizedAlgorithmStep[] = [];
        const memo: { [key: string]: number } = {};
        const callStack: { i: number, prev_idx: number }[] = [];
        let currentMax = 0;

        const addStep = (message: string, highlights: any = {}) => {
            newSteps.push({
                sequence,
                memo: { ...memo },
                callStack: [...callStack],
                message,
                result: null,
                currentMax,
                highlights,
            });
        };

        function dfs(i: number, prev_idx: number): number {
            callStack.push({ i, prev_idx });
            addStep(`Chamando dfs(i=${i}, prev_idx=${prev_idx})`, { sequenceIndex: i, prevIndex: prev_idx });
            
            const memoKey = `${i},${prev_idx}`;
            if (memoKey in memo) {
                addStep(`Cache hit para (i=${i}, prev_idx=${prev_idx}). Resultado: ${memo[memoKey]}`, { memoKey });
                callStack.pop();
                return memo[memoKey];
            }
            addStep(`Cache miss para (i=${i}, prev_idx=${prev_idx}). Computando...`, { memoKey });

            if (i === n) {
                addStep(`Caso base: Fim do array (i=${n}). Retornando 0.`, { sequenceIndex: i });
                callStack.pop();
                return 0;
            }

            // Opção 1: Pular sequence[i]
            addStep(`Opção 1: Pular ${sequence[i]}. Chamando dfs(i=${i + 1}, prev_idx=${prev_idx})`, { sequenceIndex: i + 1, prevIndex: prev_idx });
            const len_skip = dfs(i + 1, prev_idx);
            addStep(`Resultado de pular ${sequence[i]}: ${len_skip}`, { sequenceIndex: i });

            // Opção 2: Incluir sequence[i]
            let len_include = -Infinity; // Use -Infinity to ensure it's not chosen if not possible
            const canInclude = prev_idx === -1 || sequence[i] > sequence[prev_idx];
            
            if (canInclude) {
                addStep(`Opção 2: Incluir ${sequence[i]}. Chamando dfs(i=${i + 1}, prev_idx=${i})`, { sequenceIndex: i + 1, prevIndex: i });
                len_include = 1 + dfs(i + 1, i);
                addStep(`Resultado de incluir ${sequence[i]}: ${len_include}`, { sequenceIndex: i });
            } else {
                 addStep(`Não é possível incluir ${sequence[i]} (não é > ${prev_idx === -1 ? '-inf' : sequence[prev_idx]})`, { sequenceIndex: i });
            }

            const result = Math.max(len_skip, len_include);
            if(result > currentMax) {
                currentMax = result;
            }
            memo[memoKey] = result;
            addStep(`Max(pular, incluir) = ${result}. Armazenando no cache para (i=${i}, prev_idx=${prev_idx}).`, { memoKey });
            callStack.pop();
            return result;
        }

        addStep("Iniciando busca pela LIS.", {});
        const finalResult = dfs(0, -1);
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) {
            newSteps.push({ ...lastStep, result: finalResult, message: `Finalizado. Comprimento da LIS: ${finalResult}.` });
        }
        
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
        if(!isPlaying) setSequenceInput(newSequence);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        sequence: sequenceInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        memo: {},
        callStack: [],
        message: 'Configure a sequência e inicie.',
        result: null,
        currentMax: 0,
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
