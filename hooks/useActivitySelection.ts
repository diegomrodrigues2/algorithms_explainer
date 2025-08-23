import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Activity, ActivitySelectionAlgorithmStep } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const MAX_TIME = 24; // e.g., hours in a day

const generateRandomActivities = (size: number): Activity[] => {
    const activities: Activity[] = [];
    for (let i = 0; i < size; i++) {
        const start = Math.floor(Math.random() * (MAX_TIME - 2));
        const duration = 1 + Math.floor(Math.random() * Math.min(6, MAX_TIME - start - 1));
        const end = start + duration;
        activities.push({ id: i, start, end, originalIndex: i });
    }
    return activities;
};

export const useActivitySelection = (initialSize: number) => {
    const [numActivities, setNumActivities] = useState(initialSize);
    const [steps, setSteps] = useState<ActivitySelectionAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((size: number) => {
        const initialActivities = generateRandomActivities(size);
        const newSteps: ActivitySelectionAlgorithmStep[] = [];

        const addStep = (activities: Activity[], highlights: any, selected: Activity[], lastEnd: number, message: string, isSorted: boolean = false) => {
            newSteps.push({ activities: JSON.parse(JSON.stringify(activities)), highlights: {...highlights}, selectedActivities: [...selected], lastEndTime: lastEnd, message, isSorted });
        };

        addStep(initialActivities, {}, [], -Infinity, "Conjunto inicial de atividades não ordenadas.");

        const sortedActivities = [...initialActivities].sort((a, b) => a.end - b.end);
        addStep(sortedActivities, {}, [], -Infinity, "Atividades ordenadas pelo tempo de término.", true);

        let selected: Activity[] = [];
        let lastEndTime = -Infinity;

        for (const activity of sortedActivities) {
            const currentHighlights = {};
            selected.forEach(act => currentHighlights[act.id] = 'selected');
            currentHighlights[activity.id] = 'considering';

            addStep(sortedActivities, currentHighlights, selected, lastEndTime, `Considerando atividade #${activity.originalIndex} ([${activity.start}, ${activity.end})).`, true);

            if (activity.start >= lastEndTime) {
                selected.push(activity);
                const prevLastEndTime = lastEndTime;
                lastEndTime = activity.end;
                
                const successHighlights = {};
                selected.forEach(act => successHighlights[act.id] = 'selected');
                
                addStep(sortedActivities, successHighlights, selected, lastEndTime, `Selecionada! É compatível (início ${activity.start} >= fim anterior ${prevLastEndTime === -Infinity ? '-∞' : prevLastEndTime}).`, true);
            } else {
                const rejectHighlights = {};
                selected.forEach(act => rejectHighlights[act.id] = 'selected');
                rejectHighlights[activity.id] = 'rejected';
                addStep(sortedActivities, rejectHighlights, selected, lastEndTime, `Rejeitada. Conflita com a anterior (início ${activity.start} < fim anterior ${lastEndTime}).`, true);
            }
        }
        
        const finalHighlights = {};
        sortedActivities.forEach(act => {
             if (!selected.find(s => s.id === act.id)) {
                finalHighlights[act.id] = 'rejected';
             }
        });
        selected.forEach(act => finalHighlights[act.id] = 'selected');
        addStep(sortedActivities, finalHighlights, selected, lastEndTime, `Finalizado. Total de ${selected.length} atividades selecionadas.`, true);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numActivities);
    }, [numActivities, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [numActivities]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if (currentStepIndex >= steps.length - 1 && steps.length > 0) setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), MAX_SPEED - speed + MIN_SPEED);
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
    
    const handleNumActivitiesChange = (newSize: number) => {
        if (isPlaying) return;
        setNumActivities(newSize);
    };

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        activities: [], highlights: {}, selectedActivities: [], lastEndTime: -Infinity, message: 'Configure e inicie.', isSorted: false
    }, [steps, currentStepIndex]);
    
    return {
        step: currentStepData,
        numActivities,
        maxTime: MAX_TIME,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleNumActivitiesChange, handleSpeedChange }
    };
};