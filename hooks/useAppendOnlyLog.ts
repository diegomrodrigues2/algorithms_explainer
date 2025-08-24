import { useState, useEffect, useCallback, useMemo } from 'react';
import type { AppendOnlyLogAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1000;

export const useAppendOnlyLog = () => {
    const [log, setLog] = useState<string[]>(['a,1', 'b,10', 'a,2']);
    const [currentState, setCurrentState] = useState<{ [key: string]: string }>({ 'a': '2', 'b': '10' });
    
    const [steps, setSteps] = useState<AppendOnlyLogAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED); // Not used for this visualizer, but kept for consistency

    const generateGetSteps = useCallback((key: string) => {
        const newSteps: AppendOnlyLogAlgorithmStep[] = [];
        let localCurrentState = { ...currentState };
        let lastFoundValue: string | null = null;

        const addStep = (message: string, highlights: any = {}, op: AppendOnlyLogAlgorithmStep['operation'] = 'scan', getResult: string | null = lastFoundValue) => {
            newSteps.push({ log, currentState: localCurrentState, message, highlights, operation: op, getResult });
        };
        
        addStep(`Iniciando busca pela chave "${key}"...`, {}, 'get');

        for (let i = 0; i < log.length; i++) {
            addStep(`Escaneando linha ${i + 1}...`, { logIndex: i });
            try {
                const [k, v] = log[i].split(',', 2);
                if (k === key) {
                    lastFoundValue = v;
                    addStep(`Chave "${key}" encontrada. Valor atualizado para "${v}".`, { logIndex: i, foundKey: key });
                }
            } catch (e) {
                // Ignore corrupted lines
            }
        }
        
        addStep(`Escaneamento concluído. Valor final para "${key}" é ${lastFoundValue ? `"${lastFoundValue}"` : 'não encontrado'}.`, { foundKey: key }, 'result', lastFoundValue);
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);

    }, [log, currentState]);

    const generateSetSteps = useCallback((key: string, value: string) => {
        const newEntry = `${key},${value}`;
        const newLog = [...log, newEntry];
        const newCurrentState = { ...currentState, [key]: value };

        const steps: AppendOnlyLogAlgorithmStep[] = [
            {
                log: log,
                currentState: currentState,
                message: `Preparando para anexar {${key}: "${value}"} ao log.`,
                highlights: { writtenKey: key },
                operation: 'set',
                getResult: null
            },
            {
                log: newLog,
                currentState: newCurrentState,
                message: `Entrada {${key}: "${value}"} anexada. Estado atualizado.`,
                highlights: { logIndex: newLog.length - 1, writtenKey: key },
                operation: 'idle',
                getResult: null
            }
        ];

        setLog(newLog);
        setCurrentState(newCurrentState);
        setSteps(steps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, [log, currentState]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1) {
                // Keep the final state visible
                const lastStep = steps[currentStepIndex];
                if(lastStep) {
                    const finalStep = {...lastStep, highlights: {}}; // clear highlights
                    setSteps([finalStep]);
                    setCurrentStepIndex(0);
                }
            }
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, 700); // Fixed speed for clarity

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps]);

    const db_set = (key: string, value: string) => {
        if (isPlaying) return;
        generateSetSteps(key, value);
    };

    const db_get = (key: string) => {
        if (isPlaying) return;
        generateGetSteps(key);
    };

    const reset = () => {
        setIsPlaying(false);
        setLog([]);
        setCurrentState({});
        const initialStep: AppendOnlyLogAlgorithmStep = {
            log: [],
            currentState: {},
            message: "Log limpo. Pronto para começar.",
            highlights: {},
            operation: 'idle',
            getResult: null,
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    const currentStepData: AppendOnlyLogAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        log: log,
        currentState: currentState,
        message: 'Bem-vindo ao Log Append-Only!',
        highlights: {},
        operation: 'idle',
        getResult: null,
    }, [steps, currentStepIndex, log, currentState]);

    return {
        step: currentStepData,
        isPlaying,
        actions: { db_set, db_get, reset }
    };
};
