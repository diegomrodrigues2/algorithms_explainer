import { useState, useEffect, useCallback, useMemo } from 'react';
import type { GraphColoringAlgorithmStep, GraphColoringNode, GraphColoringEdge, GraphColoringHighlightType } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const COLORS_PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#6366f1', '#d946ef', '#ec4899'];

// Generate a random graph with no isolated nodes
const generateRandomGraph = (numVertices: number, edgeProbability: number): { nodes: GraphColoringNode[], edges: GraphColoringEdge[] } => {
    const nodes: GraphColoringNode[] = [];
    const edges: GraphColoringEdge[] = [];
    const angleStep = (2 * Math.PI) / numVertices;
    const radius = 150;

    for (let i = 0; i < numVertices; i++) {
        nodes.push({
            id: i,
            x: 200 + radius * Math.cos(i * angleStep - Math.PI / 2),
            y: 200 + radius * Math.sin(i * angleStep - Math.PI / 2),
        });
    }

    const adjMatrix = Array.from({ length: numVertices }, () => Array(numVertices).fill(0));
    for (let i = 0; i < numVertices; i++) {
        for (let j = i + 1; j < numVertices; j++) {
            if (Math.random() < edgeProbability) {
                edges.push({ source: i, target: j });
                adjMatrix[i][j] = 1;
                adjMatrix[j][i] = 1;
            }
        }
    }
    
    // Ensure no isolated nodes
    for (let i = 0; i < numVertices; i++) {
        if (adjMatrix[i].every(val => val === 0)) {
            let j = Math.floor(Math.random() * numVertices);
            while (j === i) {
                j = Math.floor(Math.random() * numVertices);
            }
            if (!adjMatrix[i][j]) {
                edges.push({ source: i, target: j });
                adjMatrix[i][j] = 1;
                adjMatrix[j][i] = 1;
            }
        }
    }

    return { nodes, edges };
};

export const useGraphColoring = (initialVertices: number, initialColors: number) => {
    const [numVertices, setNumVertices] = useState(initialVertices);
    const [numColors, setNumColors] = useState(initialColors);
    const [graph, setGraph] = useState<{ nodes: GraphColoringNode[], edges: GraphColoringEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<GraphColoringAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((graphData: { nodes: GraphColoringNode[], edges: GraphColoringEdge[] }, m: number) => {
        const { nodes, edges } = graphData;
        const V = nodes.length;
        if (V === 0) return;

        const adjMatrix = Array.from({ length: V }, () => Array(V).fill(0));
        edges.forEach(edge => {
            adjMatrix[edge.source][edge.target] = 1;
            adjMatrix[edge.target][edge.source] = 1;
        });

        const newSteps: GraphColoringAlgorithmStep[] = [];
        let foundSolution: number[] | null = null;
        
        const addStep = (colors: (number|null)[], highlights: any, message: string, currentVertex: number | null) => {
            newSteps.push({ graph: graphData, colors: [...colors], highlights, message, currentVertex, foundSolution });
        };

        function isSafe(vertex: number, color: number, currentColors: (number|null)[]): boolean {
            for (let i = 0; i < V; i++) {
                if (adjMatrix[vertex][i] === 1 && currentColors[i] === color) {
                    return false;
                }
            }
            return true;
        }

        function backtrack(vertex: number, currentColors: (number|null)[]): boolean {
            if (vertex === V) {
                foundSolution = [...currentColors] as number[];
                const highlights = {};
                foundSolution.forEach((_, i) => highlights[i] = 'final');
                addStep(currentColors, highlights, "Solução encontrada!", null);
                return true;
            }

            addStep(currentColors, { [vertex]: 'considering' }, `Considerando o Vértice ${vertex}`, vertex);

            for (let c = 1; c <= m; c++) {
                 addStep(currentColors, { [vertex]: 'considering' }, `Vértice ${vertex}: tentando a Cor ${c}`, vertex);

                if (isSafe(vertex, c, currentColors)) {
                    currentColors[vertex] = c;
                    addStep(currentColors, { [vertex]: 'safe' }, `Vértice ${vertex}: Cor ${c} é segura.`, vertex);
                    
                    if (backtrack(vertex + 1, currentColors)) {
                        return true;
                    }
                    
                    // Backtrack
                    addStep(currentColors, { [vertex]: 'considering' }, `Caminho falhou. Retrocedendo do Vértice ${vertex+1}.`, vertex+1);
                    currentColors[vertex] = null;
                    addStep(currentColors, { [vertex]: 'considering' }, `Vértice ${vertex}: Removendo a Cor ${c}.`, vertex);

                } else {
                    const tempColors = [...currentColors];
                    tempColors[vertex] = c;
                     addStep(tempColors, { [vertex]: 'unsafe' }, `Vértice ${vertex}: Cor ${c} está em conflito.`, vertex);
                }
            }
             addStep(currentColors, { [vertex]: 'considering' }, `Nenhuma cor funcionou para o Vértice ${vertex}. Retrocedendo.`, vertex);
            return false;
        }

        const initialColors = Array(V).fill(null);
        addStep(initialColors, {}, `Iniciando com ${V} vértices e ${m} cores.`, null);
        
        if (!backtrack(0, initialColors)) {
            addStep(initialColors, {}, `Não foi possível encontrar uma solução com ${m} cores.`, null);
        }

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        const newGraph = generateRandomGraph(numVertices, 0.4);
        setGraph(newGraph);
        generateSteps(newGraph, numColors);
    }, [numVertices, numColors, generateSteps]);
    
    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numVertices, numColors]);

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
    const handleNumVerticesChange = (newSize: number) => { if(!isPlaying) setNumVertices(newSize); };
    const handleNumColorsChange = (newCount: number) => { if(!isPlaying) setNumColors(newCount); };

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        graph, colors: Array(numVertices).fill(null), highlights: {}, message: 'Pronto para começar.', currentVertex: null, foundSolution: null
    }, [steps, currentStepIndex, graph, numVertices]);
    
    return {
        step: currentStepData,
        numVertices,
        numColors,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        colorPalette: COLORS_PALETTE,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNumVerticesChange, handleNumColorsChange }
    };
};
