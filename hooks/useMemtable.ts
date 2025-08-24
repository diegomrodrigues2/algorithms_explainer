import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MemtableAlgorithmStep, MemtableHighlightType } from '../types';

const ANIMATION_SPEED = 700;

export const useMemtable = () => {
    const [keys, setKeys] = useState<string[]>(['b', 'd', 'f']);
    const [values, setValues] = useState<(string | null)[]>(['10', '8', '3']);
    
    const [steps, setSteps] = useState<MemtableAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const addStep = (
        currentSteps: MemtableAlgorithmStep[],
        keysState: string[],
        valuesState: (string|null)[],
        message: string,
        highlights: { [index: number]: MemtableHighlightType } = {},
        op: MemtableAlgorithmStep['operation'] = 'idle',
        getResult: string | null | undefined = undefined,
        searchState?: { low: number | null, high: number | null, mid: number | null }
    ) => {
        currentSteps.push({
            keys: [...keysState],
            values: [...valuesState],
            message,
            highlights,
            operation: op,
            getResult: getResult === undefined ? null : getResult,
            searchState
        });
    };

    const generatePutSteps = useCallback((key: string, value: string | null) => {
        if (isPlaying) return;

        const newSteps: MemtableAlgorithmStep[] = [];
        const op = value === null ? 'delete' : 'put';
        const op_str = value === null ? 'Deletando' : 'Inserindo/Atualizando';

        addStep(newSteps, keys, values, `${op_str} chave "${key}"... Buscando posição.`, {}, op);

        // Binary search (bisect_left)
        let low = 0;
        let high = keys.length;
        
        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            let highlights: {[key:number]: MemtableHighlightType} = {};
            if(low < keys.length) highlights[low] = 'low';
            if(high < keys.length) highlights[high] = 'high';
            if(mid < keys.length) highlights[mid] = 'mid';

            addStep(newSteps, keys, values, `Busca binária: low=${low}, high=${high}, mid=${mid}`, highlights, op);

            if (keys[mid] < key) {
                addStep(newSteps, keys, values, `keys[${mid}] ("${keys[mid]}") < "${key}". Atualizando low para ${mid + 1}.`, highlights, op);
                low = mid + 1;
            } else {
                addStep(newSteps, keys, values, `keys[${mid}] ("${keys[mid]}") >= "${key}". Atualizando high para ${mid}.`, highlights, op);
                high = mid;
            }
        }
        
        const idx = low;
        addStep(newSteps, keys, values, `Busca concluída. Posição de inserção/atualização: ${idx}.`, {[idx]: 'found'}, op);

        const newKeys = [...keys];
        const newValues = [...values];

        if (idx < keys.length && keys[idx] === key) {
            // Update
            newValues[idx] = value;
            addStep(newSteps, keys, values, `Chave "${key}" encontrada no índice ${idx}. Atualizando valor.`, { [idx]: 'update' }, op);
            addStep(newSteps, newKeys, newValues, `Valor para "${key}" atualizado.`, { [idx]: 'update' }, 'idle');
        } else {
            // Insert
            newKeys.splice(idx, 0, key);
            newValues.splice(idx, 0, value);
            addStep(newSteps, keys, values, `Chave "${key}" não encontrada. Inserindo no índice ${idx}.`, { [idx]: 'insert' }, op);
            addStep(newSteps, newKeys, newValues, `Chave e valor inseridos.`, { [idx]: 'insert' }, 'idle');
        }

        setKeys(newKeys);
        setValues(newValues);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, [isPlaying, keys, values]);


    const generateGetSteps = useCallback((key: string) => {
        if (isPlaying) return;
        const newSteps: MemtableAlgorithmStep[] = [];
        let getResult: string | null | undefined = undefined;
        
        addStep(newSteps, keys, values, `Buscando chave "${key}"...`, {}, 'get');
        
        // Binary search
        let low = 0, high = keys.length;
        while (low < high) {
            let mid = Math.floor((low + high) / 2);
            let highlights: {[key:number]: MemtableHighlightType} = {};
            if(low < keys.length) highlights[low] = 'low';
            if(high < keys.length) highlights[high] = 'high';
            if(mid < keys.length) highlights[mid] = 'mid';
            addStep(newSteps, keys, values, `Busca binária: low=${low}, high=${high}, mid=${mid}`, highlights, 'get');
            if (keys[mid] < key) low = mid + 1;
            else high = mid;
        }
        
        const idx = low;
        if (idx < keys.length && keys[idx] === key) {
            getResult = values[idx];
            addStep(newSteps, keys, values, `Chave "${key}" encontrada no índice ${idx}.`, { [idx]: 'found' }, 'get');
            if (getResult === null) {
                addStep(newSteps, keys, values, `Resultado: Chave foi deletada (tombstone).`, { [idx]: 'found' }, 'result', getResult);
            } else {
                addStep(newSteps, keys, values, `Resultado: "${getResult}".`, { [idx]: 'found' }, 'result', getResult);
            }
        } else {
             getResult = undefined; // Not found
            addStep(newSteps, keys, values, `Chave "${key}" não encontrada.`, {}, 'result', getResult);
        }
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, [isPlaying, keys, values]);

    const reset = () => {
        setIsPlaying(false);
        const initialKeys = ['b', 'd', 'f'];
        const initialValues: (string | null)[] = ['10', '8', '3'];
        setKeys(initialKeys);
        setValues(initialValues);
        const initialStep: MemtableAlgorithmStep = {
            keys: initialKeys,
            values: initialValues,
            message: "Memtable resetada para o estado inicial.",
            highlights: {},
            operation: 'idle',
            getResult: null,
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1) {
                const lastStep = steps[currentStepIndex];
                if(lastStep) {
                    const finalStep = {...lastStep, highlights: {}, searchState: undefined }; // clear highlights
                    setSteps([finalStep]);
                    setCurrentStepIndex(0);
                }
            }
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, ANIMATION_SPEED);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps]);

    const currentStepData: MemtableAlgorithmStep = useMemo(() => {
        const step = steps[currentStepIndex];
    
        if (!step) {
            return {
                keys,
                values,
                message: 'Bem-vindo à Memtable!',
                highlights: {},
                operation: 'idle',
                getResult: null,
                searchState: { low: null, high: null, mid: null }
            };
        }
    
        const searchState: { low: number | null; high: number | null; mid: number | null } = { low: null, high: null, mid: null };
        Object.entries(step.highlights).forEach(([index, type]) => {
            const idx = Number(index);
            if (type === 'low') searchState.low = idx;
            if (type === 'high') searchState.high = idx;
            if (type === 'mid') searchState.mid = idx;
            if (type === 'found' || type === 'insert' || type === 'update') searchState.mid = idx;
        });
    
        return { ...step, searchState };
    }, [steps, currentStepIndex, keys, values]);

    return {
        step: currentStepData,
        isPlaying,
        actions: { put: generatePutSteps, get: generateGetSteps, reset }
    };
};
