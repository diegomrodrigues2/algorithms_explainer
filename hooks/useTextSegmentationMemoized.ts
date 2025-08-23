import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TextSegmentationMemoizedAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useTextSegmentationMemoized = (initialText: string, initialDict: string) => {
    const [textInput, setTextInput] = useState(initialText);
    const [dictionaryInput, setDictionaryInput] = useState(initialDict);
    const [steps, setSteps] = useState<TextSegmentationMemoizedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((text: string, dictionaryStr: string) => {
        const dictionary = new Set(dictionaryStr.split(',').map(w => w.trim()).filter(Boolean));
        if (!text) {
            setSteps([]);
            return;
        }

        const newSteps: TextSegmentationMemoizedAlgorithmStep[] = [];
        const memo: { [key: number]: string[] | null | 'computing' } = {};
        const callStack: number[] = [];

        const addStep = (
            message: string, 
            currentComputation: { start: number; end: number; prefix: string; } | null, 
            highlights: any, 
            path: string[]
        ) => {
            newSteps.push({
                text,
                memo: { ...memo },
                callStack: [...callStack],
                currentComputation,
                message,
                result: null,
                path: [...path],
                highlights: { ...highlights }
            });
        };
        
        function canBreak(start: number, currentPath: string[]): string[] | null {
            if (start in memo) {
                const memoVal = memo[start];
                if (memoVal !== 'computing') {
                    addStep(`Cache hit para start=${start}. Resultado: ${memoVal ? `[${memoVal.join(',')}]` : 'null'}`, null, { memoIndex: start }, currentPath);
                    return memoVal;
                }
            }

            callStack.push(start);
            memo[start] = 'computing';
            addStep(`Chamando canBreak(start=${start})`, null, { memoIndex: start }, currentPath);

            if (start === text.length) {
                addStep(`Caso base: start=${text.length}. Fim da string, sucesso.`, null, {}, currentPath);
                memo[start] = [];
                callStack.pop();
                return [];
            }

            for (let end = start + 1; end <= text.length; end++) {
                const prefix = text.substring(start, end);
                addStep(`Verificando prefixo: "${prefix}"`, { start, end, prefix }, { textRange: [start, end] }, currentPath);
                
                if (dictionary.has(prefix)) {
                     addStep(`"${prefix}" é uma palavra válida. Chamada recursiva para o resto.`, { start, end, prefix }, { textRange: [start, end] }, currentPath);
                    
                    const suffixResult = canBreak(end, [...currentPath, prefix]);
                    
                    if (suffixResult !== null) {
                        const result = [prefix, ...suffixResult];
                        memo[start] = result;
                        addStep(`Sucesso para sufixo de "${prefix}". Armazenando resultado para start=${start}.`, null, { memoIndex: start }, currentPath);
                        callStack.pop();
                        return result;
                    }
                    addStep(`Caminho a partir de "${prefix}" falhou. Continuando busca.`, { start, end, prefix }, { textRange: [start, end] }, currentPath);
                }
            }

            memo[start] = null;
            addStep(`Nenhum prefixo a partir de start=${start} funcionou. Armazenando 'null'.`, null, { memoIndex: start }, currentPath);
            callStack.pop();
            return null;
        }

        addStep("Iniciando a segmentação.", null, {}, []);
        const finalResult = canBreak(0, []);
        
        const lastStep = newSteps[newSteps.length - 1];
        if (lastStep) {
            newSteps.push({ ...lastStep, result: finalResult, message: `Finalizado. Resultado: ${finalResult ? `[${finalResult.join(', ')}]` : "Nenhuma segmentação encontrada."}`});
        }
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(textInput, dictionaryInput);
    }, [textInput, dictionaryInput, generateSteps]);
    
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
    const handleTextInputChange = (newText: string) => {
        if(isPlaying) return;
        setTextInput(newText.toLowerCase().replace(/[^a-z]/g, ''));
    }
    const handleDictionaryChange = (newDict: string) => {
        if(isPlaying) return;
        setDictionaryInput(newDict);
    }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        text: textInput,
        memo: {},
        callStack: [],
        currentComputation: null,
        message: 'Configure e inicie.',
        result: null,
        path: [],
        highlights: {}
    }, [steps, currentStepIndex, textInput]);
    
    return {
        step: currentStepData,
        textInput,
        dictionaryInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: {
            reset,
            togglePlayPause,
            handleSpeedChange,
            handleTextInputChange,
            handleDictionaryChange,
        }
    };
};