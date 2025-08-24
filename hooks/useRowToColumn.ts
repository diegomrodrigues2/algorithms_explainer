
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RowToColumnAlgorithmStep } from '../types';

const MAX_SPEED = 1000;
const MIN_SPEED = 50;

const INITIAL_DATA = `[
  {"id": 1, "country": "BR", "amount": 10.0},
  {"id": 2, "country": "US", "amount": 20.5},
  {"id": 3, "country": "BR", "notes": "Sample"},
  {"id": 4, "amount": 5.0}
]`;

export const useRowToColumn = () => {
    const [textInput, setTextInput] = useState(INITIAL_DATA);
    const [steps, setSteps] = useState<RowToColumnAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    const generateSteps = useCallback((jsonString: string) => {
        let rows: { [key: string]: any }[] = [];
        try {
            rows = JSON.parse(jsonString);
            if (!Array.isArray(rows)) throw new Error("Input is not an array.");
            if (rows.some(r => typeof r !== 'object' || r === null)) throw new Error("Array must contain objects.");
        } catch (e) {
            const errorStep: RowToColumnAlgorithmStep = {
                rows: [], columns: {}, schema: [],
                message: "Erro: JSON de entrada inválido. Deve ser um array de objetos.",
                highlights: { phase: 'idle' }
            };
            setSteps([errorStep]);
            return;
        }

        const newSteps: RowToColumnAlgorithmStep[] = [];
        
        const addStep = (message: string, highlights: RowToColumnAlgorithmStep['highlights'], cols: any = {}, schema: string[] = [], currentRows = rows) => {
            newSteps.push({
                rows: currentRows,
                columns: JSON.parse(JSON.stringify(cols)),
                schema,
                message,
                highlights,
            });
        };

        addStep("Iniciando conversão. Dados de entrada:", { phase: 'idle' });

        // 1. Discover schema
        const schemaSet = new Set<string>();
        for(let i=0; i<rows.length; i++) {
            addStep(`Fase 1: Descobrindo colunas da linha ${i}.`, { phase: 'discover', rowIndex: i });
            Object.keys(rows[i]).forEach(key => schemaSet.add(key));
        }
        const schema = Array.from(schemaSet).sort();
        addStep("Todas as colunas únicas foram descobertas.", { phase: 'discover' }, {}, schema);

        // 2. Initialize columns
        const columns: { [key: string]: any[] } = {};
        schema.forEach(key => {
            columns[key] = [];
        });
        addStep("Fase 2: Estrutura colunar inicializada.", { phase: 'populate' }, columns, schema);

        // 3. Populate columns
        for (let i = 0; i < rows.length; i++) {
            addStep(`Fase 3: Processando linha ${i}.`, { phase: 'populate', rowIndex: i }, columns, schema);
            const row = rows[i];
            for (const key of schema) {
                const value = row.hasOwnProperty(key) ? row[key] : null;
                columns[key].push(value);
                 addStep(
                    `Movendo valor para a coluna '${key}': ${value === null ? 'null' : JSON.stringify(value)}`,
                    { phase: 'populate', rowIndex: i, colKey: key, cellKey: `${i}-${key}` },
                    columns,
                    schema
                );
            }
        }

        addStep("Conversão concluída!", { phase: 'done' }, columns, schema);

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
    
    const currentStepData = useMemo(() => {
        let rows = [];
        try { rows = JSON.parse(textInput) } catch(e) {/* ignore */}
        
        return steps[currentStepIndex] || {
            rows: Array.isArray(rows) ? rows : [], 
            columns: {}, schema: [],
            message: 'Insira dados JSON válidos e inicie.',
            highlights: { phase: 'idle' }
        }
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
