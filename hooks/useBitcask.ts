import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BitcaskAlgorithmStep, LogEntry, KeydirEntry } from '../types';

const ANIMATION_SPEED = 700; // ms

export const useBitcask = () => {
    const [log, setLog] = useState<LogEntry[]>([]);
    const [keydir, setKeydir] = useState<{ [key: string]: KeydirEntry }>({});
    
    const [steps, setSteps] = useState<BitcaskAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const addStep = (
        currentSteps: BitcaskAlgorithmStep[],
        logState: LogEntry[],
        keydirState: { [key: string]: KeydirEntry },
        message: string,
        highlights: any = {},
        op: BitcaskAlgorithmStep['operation'] = 'idle',
        getResult: string | null = null
    ) => {
        currentSteps.push({
            log: JSON.parse(JSON.stringify(logState)),
            keydir: JSON.parse(JSON.stringify(keydirState)),
            message,
            highlights,
            operation: op,
            getResult,
        });
    };
    
    const db_set = useCallback((key: string, value: string) => {
        if (isPlaying) return;

        const newSteps: BitcaskAlgorithmStep[] = [];
        const record = `${key},${value}`;
        const recordSize = record.length + 1; // +1 for newline
        const offset = log.reduce((acc, entry) => acc + entry.size, 0);

        const newLogEntry: LogEntry = { line: record, offset, size: recordSize };
        const updatedLog = [...log, newLogEntry];
        const updatedKeydir = { ...keydir, [key]: { offset, size: recordSize } };

        addStep(newSteps, log, keydir, `Preparando para escrever {${key}: "${value}"}.`, { keydirKey: key }, 'set');
        addStep(newSteps, log, keydir, `Nova entrada terá offset=${offset} e size=${recordSize}.`, { keydirKey: key }, 'set');
        addStep(newSteps, updatedLog, keydir, `Anexando "${record}" ao final do log.`, { logIndex: updatedLog.length - 1 }, 'set');
        addStep(newSteps, updatedLog, updatedKeydir, `Atualizando keydir para a chave "${key}".`, { logIndex: updatedLog.length - 1, keydirKey: key }, 'set');
        addStep(newSteps, updatedLog, updatedKeydir, `Operação SET concluída.`, {}, 'idle');
        
        setLog(updatedLog);
        setKeydir(updatedKeydir);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    }, [isPlaying, log, keydir]);
    
    const db_get = useCallback((key: string) => {
        if (isPlaying) return;

        const newSteps: BitcaskAlgorithmStep[] = [];
        
        addStep(newSteps, log, keydir, `Procurando pela chave "${key}" no keydir...`, { keydirKey: key }, 'get');

        const meta = keydir[key];
        if (!meta) {
            addStep(newSteps, log, keydir, `Chave "${key}" não encontrada no índice.`, {}, 'result', null);
            setSteps(newSteps);
            setCurrentStepIndex(0);
            setIsPlaying(true);
            return;
        }

        const { offset, size } = meta;
        addStep(newSteps, log, keydir, `Chave encontrada! Offset: ${offset}, Tamanho: ${size}.`, { keydirKey: key }, 'get');

        const logIndex = log.findIndex(entry => entry.offset === offset);
        if (logIndex === -1) {
            addStep(newSteps, log, keydir, `ERRO: Offset ${offset} não encontrado no log.`, {}, 'result', null);
        } else {
            addStep(newSteps, log, keydir, `Buscando no arquivo de log no offset ${offset}.`, { logIndex }, 'get');
            const [k, v] = log[logIndex].line.split(',', 2);
            addStep(newSteps, log, keydir, `Valor encontrado: "${v}".`, { logIndex }, 'result', v);
        }

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);

    }, [isPlaying, log, keydir]);

    const rebuild_keydir = useCallback(() => {
        if (isPlaying) return;

        const newSteps: BitcaskAlgorithmStep[] = [];
        let newKeydir: { [key: string]: KeydirEntry } = {};

        addStep(newSteps, log, {}, "Iniciando reconstrução do índice a partir do log...", {}, 'rebuild');

        for (let i = 0; i < log.length; i++) {
            const entry = log[i];
            addStep(newSteps, log, newKeydir, `Lendo linha ${i+1} no offset ${entry.offset}.`, { logIndex: i }, 'rebuild');
            const [key] = entry.line.split(',', 2);
            newKeydir[key] = { offset: entry.offset, size: entry.size };
            addStep(newSteps, log, newKeydir, `Atualizando índice para a chave "${key}".`, { logIndex: i, keydirKey: key }, 'rebuild');
        }

        addStep(newSteps, log, newKeydir, "Reconstrução do índice concluída.", {}, 'idle');
        
        setKeydir(newKeydir);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);

    }, [isPlaying, log]);

    const reset = () => {
        setIsPlaying(false);
        setLog([]);
        setKeydir({});
        const initialStep: BitcaskAlgorithmStep = {
            log: [],
            keydir: {},
            message: "Log e índice limpos. Pronto para começar.",
            highlights: {},
            operation: 'idle',
            getResult: null,
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1);
        }, ANIMATION_SPEED);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps]);

    const currentStepData: BitcaskAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        log: log,
        keydir: keydir,
        message: 'Bem-vindo ao Índice de Hash em Memória!',
        highlights: {},
        operation: 'idle',
        getResult: null,
    }, [steps, currentStepIndex, log, keydir]);

    return {
        step: currentStepData,
        isPlaying,
        actions: { db_set, db_get, rebuild_keydir, reset }
    };
};
