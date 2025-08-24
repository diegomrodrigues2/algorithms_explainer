import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LogCompactionAlgorithmStep, LogEntry, KeydirEntry } from '../types';

const ANIMATION_SPEED = 500; // ms

// Helper to create an initial log with duplicates
const createInitialLog = (): { log: LogEntry[], keydir: { [key: string]: KeydirEntry } } => {
    const initialRecords = [
        { key: 'a', value: '1' },
        { key: 'b', value: '10' },
        { key: 'c', value: '5' },
        { key: 'a', value: '2' },
        { key: 'd', value: '8' },
        { key: 'b', value: '11' },
    ];
    
    const log: LogEntry[] = [];
    const keydir: { [key: string]: KeydirEntry } = {};
    let offset = 0;

    initialRecords.forEach(({ key, value }) => {
        const line = `${key},${value}`;
        const size = line.length + 1; // +1 for newline
        log.push({ line, offset, size });
        keydir[key] = { offset, size };
        offset += size;
    });

    return { log, keydir };
};

export const useLogCompaction = () => {
    const { log: initialLog, keydir: initialKeydir } = createInitialLog();
    const [log, setLog] = useState<LogEntry[]>(initialLog);
    const [keydir, setKeydir] = useState<{ [key: string]: KeydirEntry }>(initialKeydir);
    
    const [steps, setSteps] = useState<LogCompactionAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const addStep = (
        currentSteps: LogCompactionAlgorithmStep[],
        logState: LogEntry[],
        compactedLogState: LogEntry[],
        keydirState: { [key: string]: KeydirEntry },
        message: string,
        highlights: any = {},
        phase: LogCompactionAlgorithmStep['phase'] = 'idle'
    ) => {
        currentSteps.push({
            log: JSON.parse(JSON.stringify(logState)),
            compactedLog: JSON.parse(JSON.stringify(compactedLogState)),
            keydir: JSON.parse(JSON.stringify(keydirState)),
            message,
            highlights,
            phase,
        });
    };

    const compact = useCallback(() => {
        if (isPlaying || log.length === 0) return;

        const newSteps: LogCompactionAlgorithmStep[] = [];
        
        // Phase 1: Scan and build final keydir
        let finalKeydir: { [key: string]: KeydirEntry } = {};
        addStep(newSteps, log, [], {}, "Iniciando compactação: escaneando o log para encontrar os valores mais recentes.", {}, 'scanning');

        for (let i = 0; i < log.length; i++) {
            const entry = log[i];
            const [key] = entry.line.split(',', 2);
            finalKeydir[key] = { offset: entry.offset, size: entry.size };
            addStep(newSteps, log, [], finalKeydir, `Escaneando linha ${i + 1}. Última posição para a chave "${key}" é offset=${entry.offset}.`, { logIndex: i, keydirKey: key }, 'scanning');
        }
        addStep(newSteps, log, [], finalKeydir, "Escaneamento completo. Índice final de valores únicos foi criado.", {}, 'scanning');

        // Phase 2: Write new log
        let compactedLog: LogEntry[] = [];
        let newOffset = 0;
        addStep(newSteps, log, compactedLog, finalKeydir, "Escrevendo novo log compacto...", {}, 'writing');

        const sortedKeys = Object.keys(finalKeydir).sort();

        for (const key of sortedKeys) {
            const entry = finalKeydir[key];
            const originalLogIndex = log.findIndex(e => e.offset === entry.offset);
            if(originalLogIndex === -1) continue;

            addStep(newSteps, log, compactedLog, finalKeydir, `Copiando o valor mais recente para a chave "${key}"...`, { keydirKey: key, logIndex: originalLogIndex }, 'writing');
            
            const newLogEntry: LogEntry = { line: log[originalLogIndex].line, offset: newOffset, size: log[originalLogIndex].size };
            compactedLog.push(newLogEntry);
            newOffset += newLogEntry.size;

            addStep(newSteps, log, compactedLog, finalKeydir, `"${log[originalLogIndex].line}" adicionado ao novo log.`, { compactedLogIndex: compactedLog.length - 1 }, 'writing');
        }

        // Phase 3: Swap
        const finalCompactedLog = [...compactedLog];
        let finalNewKeydir: { [key: string]: KeydirEntry } = {};
        finalCompactedLog.forEach(entry => {
            const [key] = entry.line.split(',', 2);
            finalNewKeydir[key] = { offset: entry.offset, size: entry.size };
        });

        addStep(newSteps, finalCompactedLog, [], finalNewKeydir, "Compactação concluída. Trocando o log antigo pelo novo e reconstruindo o índice.", {}, 'done');
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, [isPlaying, log]);
    
    const db_set = useCallback((key: string, value: string) => {
        if (isPlaying) return;
        const record = `${key},${value}`;
        const recordSize = record.length + 1;
        const offset = log.reduce((acc, entry) => acc + entry.size, 0);

        const newLogEntry: LogEntry = { line: record, offset, size: recordSize };
        const updatedLog = [...log, newLogEntry];
        const updatedKeydir = { ...keydir, [key]: { offset, size: recordSize } };
        
        setLog(updatedLog);
        setKeydir(updatedKeydir);
        
        const singleStep: LogCompactionAlgorithmStep = {
            log: updatedLog,
            compactedLog: [],
            keydir: updatedKeydir,
            message: `Chave "${key}" definida como "${value}".`,
            highlights: { logIndex: updatedLog.length - 1, keydirKey: key },
            phase: 'idle',
        };
        setSteps([singleStep]);
        setCurrentStepIndex(0);

    }, [isPlaying, log, keydir]);

    const reset = () => {
        setIsPlaying(false);
        const { log: newLog, keydir: newKeydir } = createInitialLog();
        setLog(newLog);
        setKeydir(newKeydir);
        const initialStep: LogCompactionAlgorithmStep = {
            log: newLog,
            compactedLog: [],
            keydir: newKeydir,
            message: "Log e índice redefinidos. Pronto para compactar.",
            highlights: {},
            phase: 'idle',
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
             if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
                 const lastStep = steps[steps.length - 1];
                 if(lastStep.phase === 'done') {
                     setLog(lastStep.log);
                     setKeydir(lastStep.keydir);
                     setSteps([{...lastStep, compactedLog: [], message: "Compactação concluída."}])
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

    const currentStepData: LogCompactionAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        log, keydir, compactedLog: [],
        message: 'Bem-vindo à Compactação de Log!',
        highlights: {}, phase: 'idle'
    }, [steps, currentStepIndex, log, keydir]);

    return {
        step: currentStepData,
        isPlaying,
        actions: { db_set, compact, reset }
    };
};
