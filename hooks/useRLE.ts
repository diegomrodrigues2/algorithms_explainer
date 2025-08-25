
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RLEAlgorithmStep } from '../types';

const MAX_SPEED = 1000;
const MIN_SPEED = 50;

export const useRLE = (initialInput: string) => {
    const [textInput, setTextInput] = useState(initialInput);
    const [steps, setSteps] = useState<RLEAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    const generateSteps = useCallback((text: string) => {
        const sequence = text.split('');
        const newSteps: RLEAlgorithmStep[] = [];
        
        const addStep = (
            message: string,
            highlights: RLEAlgorithmStep['highlights'],
            currentRun: RLEAlgorithmStep['currentRun'],
            compressed: [string, number][] = []
        ) => {
            newSteps.push({
                sequence,
                compressed: JSON.parse(JSON.stringify(compressed)),
                message,
                highlights,
                currentRun: {...currentRun}
            });
        };

        if (sequence.length === 0) {
            addStep("Sequência de entrada vazia.", {}, { value: null, count: 0 });
            setSteps(newSteps);
            return;
        }

        addStep("Iniciando a compressão...", {}, { value: null, count: 0 });

        let compressed: [string, number][] = [];
        let runValue = sequence[0];
        let runCount = 1;
        let runStartIndex = 0;

        addStep(`Iniciando nova run com '${runValue}'.`, { readIndex: 0, runStartIndex: 0 }, { value: runValue, count: runCount }, compressed);

        for (let i = 1; i < sequence.length; i++) {
            const char = sequence[i];
            addStep(`Lendo caractere '${char}' no índice ${i}.`, { readIndex: i, runStartIndex }, { value: runValue, count: runCount }, compressed);

            if (char === runValue) {
                runCount++;
                addStep(`'${char}' corresponde à run atual. Contagem incrementada para ${runCount}.`, { readIndex: i, runStartIndex }, { value: runValue, count: runCount }, compressed);
            } else {
                compressed.push([runValue, runCount]);
                addStep(`Fim da run. Adicionando ('${runValue}', ${runCount}) à saída.`, { readIndex: i - 1, outputIndex: compressed.length - 1 }, { value: runValue, count: runCount }, compressed);
                
                runValue = char;
                runCount = 1;
                runStartIndex = i;
                addStep(`Iniciando nova run com '${char}'.`, { readIndex: i, runStartIndex: i }, { value: runValue, count: runCount }, compressed);
            }
        }
        
        compressed.push([runValue, runCount]);
        addStep(`Fim da sequência. Adicionando a última run ('${runValue}', ${runCount}).`, { readIndex: sequence.length - 1, outputIndex: compressed.length - 1 }, { value: runValue, count: runCount }, compressed);
        
        addStep("Compressão concluída.", {}, { value: null, count: 0 }, compressed);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(textInput);
    }, [textInput, generateSteps]);

    useEffect(() => {
        reset();
    }, [textInput]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, MAX_SPEED - speed + MIN_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);
    
    const togglePlayPause = () => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
                setCurrentStepIndex(0);
            }
            setIsPlaying(true);
        }
    };

    const handleTextInputChange = (text: string) => {
        if(!isPlaying) setTextInput(text);
    }
    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    }
    
    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        sequence: textInput.split(''),
        compressed: [],
        message: 'Insira uma sequência e inicie a compressão.',
        highlights: {},
        currentRun: { value: null, count: 0 }
    }, [steps, currentStepIndex, textInput]);
    
    return {
        step: currentStepData,
        textInput,
        isPlaying,
        speed,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { togglePlayPause, reset, handleTextInputChange, handleSpeedChange }
    };
};
