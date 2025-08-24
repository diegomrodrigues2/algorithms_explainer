import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LSMTreeAlgorithmStep, MemtableEntry, SSTableSegment } from '../types';

const ANIMATION_SPEED = 600;

let segmentIdCounter = 0;

export const useLSMTree = (initialMemtableLimit: number) => {
    const [memtable, setMemtable] = useState<MemtableEntry[]>([]);
    const [segments, setSegments] = useState<SSTableSegment[]>([]);
    const [memtableLimit, setMemtableLimit] = useState(initialMemtableLimit);
    
    const [steps, setSteps] = useState<LSMTreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const addStep = (
        currentSteps: LSMTreeAlgorithmStep[],
        message: string,
        highlights: any = {},
        op: LSMTreeAlgorithmStep['operation'] = 'idle',
        getResult: string | null | undefined = undefined,
        currentMemtable: MemtableEntry[] = memtable,
        currentSegments: SSTableSegment[] = segments
    ) => {
        currentSteps.push({
            memtable: JSON.parse(JSON.stringify(currentMemtable)),
            segments: JSON.parse(JSON.stringify(currentSegments)),
            message,
            highlights,
            operation: op,
            getResult,
        });
    };

    const runSteps = (newSteps: LSMTreeAlgorithmStep[]) => {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    };

    const put = (key: string, value: string | null) => {
        if (isPlaying) return;
        
        const newSteps: LSMTreeAlgorithmStep[] = [];
        
        let updatedMemtable = [...memtable];
        const existingIndex = updatedMemtable.findIndex(e => e.key === key);

        if (existingIndex !== -1) {
            updatedMemtable[existingIndex] = { key, value };
        } else {
            updatedMemtable.push({ key, value });
            updatedMemtable.sort((a, b) => a.key.localeCompare(b.key));
        }
        
        addStep(newSteps, `Inserindo/Atualizando chave '${key}' na Memtable.`, { memtableKey: key }, 'put', undefined, updatedMemtable, segments);

        if (updatedMemtable.length >= memtableLimit) {
            addStep(newSteps, `Memtable atingiu o limite de ${memtableLimit}. Acionando flush.`, {}, 'flush', undefined, updatedMemtable, segments);
            
            const newSegment: SSTableSegment = { id: segmentIdCounter++, entries: [...updatedMemtable] };
            const updatedSegments = [newSegment, ...segments];
            
            setMemtable([]);
            setSegments(updatedSegments);

            addStep(newSteps, `Memtable esvaziada para o novo Segmento ${newSegment.id}.`, { segmentId: newSegment.id }, 'flush', undefined, [], updatedSegments);
        } else {
            setMemtable(updatedMemtable);
            const finalStep: LSMTreeAlgorithmStep = {
                memtable: updatedMemtable,
                segments: segments,
                message: `Chave '${key}' inserida na Memtable.`,
                highlights: { memtableKey: key },
                operation: 'idle',
                getResult: undefined,
            };
            newSteps.push(finalStep);
        }

        runSteps(newSteps);
    };

    const get = (key: string) => {
        if (isPlaying) return;
        const newSteps: LSMTreeAlgorithmStep[] = [];

        addStep(newSteps, `Buscando chave '${key}'...`, {}, 'get');
        
        addStep(newSteps, `Verificando Memtable...`, { memtableKey: key }, 'get');
        const memtableEntry = memtable.find(e => e.key === key);

        if (memtableEntry !== undefined) {
            const result = memtableEntry.value;
            addStep(newSteps, `Chave '${key}' encontrada na Memtable. Valor: ${result === null ? "TOMBSTONE" : `"${result}"`}.`, { memtableKey: key }, 'result', result);
            runSteps(newSteps);
            return;
        }

        addStep(newSteps, `Chave '${key}' não encontrada na Memtable. Verificando SSTables...`, {}, 'get');

        for (const segment of segments) {
            addStep(newSteps, `Verificando Segmento ${segment.id}...`, { segmentId: segment.id }, 'get');
            const segmentEntry = segment.entries.find(e => e.key === key);
            if (segmentEntry !== undefined) {
                const result = segmentEntry.value;
                 addStep(newSteps, `Chave '${key}' encontrada no Segmento ${segment.id}. Valor: ${result === null ? "TOMBSTONE" : `"${result}"`}.`, { segmentId: segment.id, segmentKey: key }, 'result', result);
                 runSteps(newSteps);
                 return;
            }
        }
        
        addStep(newSteps, `Chave '${key}' não encontrada em nenhum lugar.`, {}, 'result', undefined);
        runSteps(newSteps);
    };
    
    const compact = () => {
        if (isPlaying) return;
        if (segments.length < 2) {
             const newSteps: LSMTreeAlgorithmStep[] = [];
             addStep(newSteps, "Compactação requer pelo menos 2 segmentos.", {}, 'idle');
             runSteps(newSteps);
             return;
        }

        const newSteps: LSMTreeAlgorithmStep[] = [];
        const segmentsToCompact = segments.slice(-2);
        const remainingSegments = segments.slice(0, -2);
        
        addStep(newSteps, `Iniciando compactação dos segmentos ${segmentsToCompact.map(s=>s.id).join(' e ')}.`, { compactSourceIds: segmentsToCompact.map(s => s.id) }, 'compact');

        const mergedMap = new Map<string, string | null>();
        [...segmentsToCompact].reverse().forEach(segment => {
            segment.entries.forEach(entry => {
                if (!mergedMap.has(entry.key)) {
                    mergedMap.set(entry.key, entry.value);
                }
            });
        });
        
        const compactedEntries = Array.from(mergedMap.entries())
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => a.key.localeCompare(b.key));
            
        const newSegment: SSTableSegment = { id: segmentIdCounter++, entries: compactedEntries };
        const updatedSegments = [...remainingSegments, newSegment];
        
        addStep(newSteps, `Entradas mescladas, ordenadas e com valores duplicados removidos.`, { compactSourceIds: segmentsToCompact.map(s => s.id) }, 'compact');
        addStep(newSteps, `Criando novo Segmento ${newSegment.id} a partir da fusão.`, { compactTargetId: newSegment.id }, 'compact', undefined, memtable, updatedSegments);

        setSegments(updatedSegments);
        addStep(newSteps, `Compactação concluída. Segmentos antigos removidos.`, {}, 'idle', undefined, memtable, updatedSegments);
        runSteps(newSteps);
    };

    const reset = () => {
        setIsPlaying(false);
        setMemtable([]);
        setSegments([]);
        segmentIdCounter = 0;
        const initialStep: LSMTreeAlgorithmStep = {
            memtable: [], segments: [],
            message: "LSM-Tree resetada.",
            highlights: {}, operation: 'idle', getResult: undefined,
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            if (currentStepIndex >= steps.length - 1) {
                 const lastStep = steps[currentStepIndex];
                 if(lastStep) {
                     // Persist the final state of the operation
                     setMemtable(lastStep.memtable);
                     setSegments(lastStep.segments);
                     // Clear animation for the next operation
                     setSteps([{...lastStep, highlights: {}, operation: 'idle'}]);
                     setCurrentStepIndex(0);
                 }
            }
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), ANIMATION_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps]);

    const currentStepData: LSMTreeAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        memtable, segments,
        message: 'Bem-vindo à visualização da LSM-Tree!',
        highlights: {}, operation: 'idle', getResult: undefined,
    }, [steps, currentStepIndex, memtable, segments]);

    return {
        step: currentStepData,
        isPlaying,
        memtableLimit,
        setMemtableLimit,
        actions: { put, get, compact, reset }
    };
};
