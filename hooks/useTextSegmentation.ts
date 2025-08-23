import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TextSegmentationAlgorithmStep, TextSegmentationHighlightType } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useTextSegmentation = (initialText: string, initialDict: string) => {
    const [textInput, setTextInput] = useState(initialText);
    const [dictionaryInput, setDictionaryInput] = useState(initialDict);
    const [steps, setSteps] = useState<TextSegmentationAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((text: string, dictionary: string) => {
        const dictionarySet = new Set(dictionary.split(',').map(w => w.trim()).filter(Boolean));
        const newSteps: TextSegmentationAlgorithmStep[] = [];
        const memo: { [key: number]: string[] | null } = {};
        let finalSolution: string[] | null = null;
        
        const addStep = (segments: { word: string; type: TextSegmentationHighlightType }[], message: string) => {
            newSteps.push({ segments, message, foundSolution: finalSolution });
        };

        function backtrack(start: number, path: { word: string; type: TextSegmentationHighlightType }[]): string[] | null {
            if (start === text.length) {
                finalSolution = path.map(p => p.word);
                return []; // Success
            }
            if (start in memo) {
                return memo[start];
            }

            for (let end = start + 1; end <= text.length; end++) {
                const prefix = text.substring(start, end);
                const remainingText = text.substring(end);
                
                const consideringSegments: { word: string; type: TextSegmentationHighlightType }[] = 
                    [...path, { word: prefix, type: 'considering' }, { word: remainingText, type: 'default' }];
                addStep(
                    consideringSegments.filter(s => s.word),
                    `Verificando prefixo: "${prefix}"`
                );

                if (dictionarySet.has(prefix)) {
                    const newPath: { word: string; type: TextSegmentationHighlightType }[] = [...path, { word: prefix, type: 'valid-prefix' }];
                    
                    const validPrefixSegments: { word: string; type: TextSegmentationHighlightType }[] = 
                        [...newPath, { word: remainingText, type: 'default' }];
                    addStep(
                        validPrefixSegments.filter(s => s.word),
                        `"${prefix}" é uma palavra válida. Explorando o resto...`
                    );

                    const result = backtrack(end, newPath);

                    if (result !== null) {
                        memo[start] = [prefix, ...result];
                        return memo[start];
                    }

                    const backtrackedSegments: { word: string; type: TextSegmentationHighlightType }[] =
                        [...path, { word: prefix, type: 'backtracked' }, { word: remainingText, type: 'default' }];
                    addStep(
                        backtrackedSegments.filter(s => s.word),
                        `Caminho a partir de "${prefix}" falhou. Retrocedendo.`
                    );
                }
            }

            memo[start] = null;
            return null;
        }
        
        addStep([{ word: text, type: 'default' }], `Iniciando a segmentação para "${text}"`);
        backtrack(0, []);
        
        if (finalSolution) {
             addStep(finalSolution.map(word => ({ word, type: 'solution' })), `Solução encontrada: [${finalSolution.join(', ')}]`);
        } else {
            addStep([{ word: text, type: 'default' }], `Nenhuma segmentação encontrada para "${text}"`);
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
        segments: [{ word: textInput, type: 'default' }],
        message: 'Configure o texto e o dicionário e inicie.',
        foundSolution: null,
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