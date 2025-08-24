import { useState, useEffect, useCallback, useMemo } from 'react';
import type { SSTableFlushAlgorithmStep } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

// Helper to create an initial Memtable with random data
const createInitialMemtable = (size: number): { keys: string[], values: (string|null)[] } => {
    const keys: string[] = [];
    const values: (string|null)[] = [];
    const keyChars = 'abcdefghijklmnopqrstuvwxyz';
    const usedKeys = new Set<string>();
    
    for (let i = 0; i < size; i++) {
        let key = '';
        do {
            key = keyChars[Math.floor(Math.random() * keyChars.length)];
        } while (usedKeys.has(key));
        usedKeys.add(key);
        keys.push(key);
        values.push(String(Math.floor(Math.random() * 100)));
    }
    
    // Sort keys and align values
    const combined = keys.map((k, i) => ({ key: k, value: values[i] }));
    combined.sort((a, b) => a.key.localeCompare(b.key));
    
    return {
        keys: combined.map(item => item.key),
        values: combined.map(item => item.value),
    };
};

export const useSSTableFlush = (initialSize: number, initialSparseStep: number) => {
    const [memtableSize, setMemtableSize] = useState(initialSize);
    const [sparseStep, setSparseStep] = useState(initialSparseStep);
    
    const [memtable, setMemtable] = useState(createInitialMemtable(initialSize));
    
    const [steps, setSteps] = useState<SSTableFlushAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateFlushSteps = useCallback(() => {
        if (isPlaying) return;

        const newSteps: SSTableFlushAlgorithmStep[] = [];
        const { keys, values } = memtable;
        let sstableContent: { line: string, offset: number }[] = [];
        let indexContent: { line: string }[] = [];
        let offset = 0;

        const addStep = (
            message: string,
            highlights: any = {},
            phase: SSTableFlushAlgorithmStep['phase'] = 'writing'
        ) => {
            newSteps.push({
                memtableKeys: keys,
                memtableValues: values,
                sstableContent: JSON.parse(JSON.stringify(sstableContent)),
                indexContent: JSON.parse(JSON.stringify(indexContent)),
                message,
                highlights,
                phase,
            });
        };
        
        addStep("Iniciando flush da Memtable para a SSTable.", {});

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = values[i];
            const line = `${key},${value === null ? '' : value}`; // handle tombstones
            
            addStep(`Lendo item ${i} da Memtable: ('${key}', '${value}').`, { memtableIndex: i });
            
            sstableContent.push({ line, offset });
            addStep(`Escrevendo "${line}" no arquivo de dados (.sst) no offset ${offset}.`, { memtableIndex: i, sstableIndex: sstableContent.length - 1 });

            if (i % sparseStep === 0) {
                 addStep(`O índice do item (${i}) é um múltiplo de ${sparseStep}. Criando entrada no índice esparso.`, { memtableIndex: i, sstableIndex: sstableContent.length - 1 });
                 const indexLine = `${key},${offset}`;
                 indexContent.push({ line: indexLine });
                 addStep(`Escrevendo "${indexLine}" no arquivo de índice (.idx).`, { memtableIndex: i, sstableIndex: sstableContent.length - 1, indexIndex: indexContent.length - 1 });
            }
            
            offset += line.length + 1; // +1 for newline
        }

        addStep("Flush concluído. A SSTable e o índice foram escritos no disco.", {}, 'done');
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);

    }, [isPlaying, memtable, sparseStep]);

    const reset = useCallback(() => {
        setIsPlaying(false);
        const newMemtable = createInitialMemtable(memtableSize);
        setMemtable(newMemtable);
        const initialStep: SSTableFlushAlgorithmStep = {
            memtableKeys: newMemtable.keys,
            memtableValues: newMemtable.values,
            sstableContent: [],
            indexContent: [],
            message: "Memtable pronta para o flush. Pressione 'Flush' para iniciar.",
            highlights: {},
            phase: 'idle',
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    }, [memtableSize]);
    
    useEffect(() => {
        reset();
    }, [reset, memtableSize, sparseStep]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1) {
                setIsPlaying(false);
            }
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, MAX_SPEED - speed + MIN_SPEED);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);

    const handleMemtableSizeChange = (size: number) => {
        if (!isPlaying) setMemtableSize(size);
    };
    const handleSparseStepChange = (step: number) => {
        if (!isPlaying) setSparseStep(step);
    }
    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
    }
    
    const currentStepData: SSTableFlushAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        memtableKeys: memtable.keys,
        memtableValues: memtable.values,
        sstableContent: [],
        indexContent: [],
        message: 'Bem-vindo ao Flush da Memtable!',
        highlights: {},
        phase: 'idle',
    }, [steps, currentStepIndex, memtable]);

    return {
        step: currentStepData,
        memtableSize,
        sparseStep,
        speed,
        isPlaying,
        actions: { flush: generateFlushSteps, reset, handleMemtableSizeChange, handleSparseStepChange, handleSpeedChange }
    };
};
