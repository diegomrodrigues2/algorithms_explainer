import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HamiltonianPathAlgorithmStep, HamiltonianPathNode, HamiltonianPathEdge, HamiltonianPathHighlightType } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

const generateRandomGraph = (numVertices: number, edgeProbability: number): { nodes: HamiltonianPathNode[], edges: HamiltonianPathEdge[] } => {
    const nodes: HamiltonianPathNode[] = [];
    const edges: HamiltonianPathEdge[] = [];
    const angleStep = (2 * Math.PI) / numVertices;
    const radius = 150;

    for (let i = 0; i < numVertices; i++) {
        nodes.push({
            id: i,
            x: 200 + radius * Math.cos(i * angleStep - Math.PI / 2),
            y: 175 + radius * Math.sin(i * angleStep - Math.PI / 2),
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

export const useHamiltonianPath = (initialVertices: number) => {
    const [numVertices, setNumVertices] = useState(initialVertices);
    const [graph, setGraph] = useState<{ nodes: HamiltonianPathNode[], edges: HamiltonianPathEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<HamiltonianPathAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((graphData: { nodes: HamiltonianPathNode[], edges: HamiltonianPathEdge[] }) => {
        const { nodes, edges } = graphData;
        const V = nodes.length;
        if (V === 0) return;

        const adjMatrix = Array.from({ length: V }, () => Array(V).fill(0));
        edges.forEach(edge => {
            adjMatrix[edge.source][edge.target] = 1;
            adjMatrix[edge.target][edge.source] = 1;
        });

        const newSteps: HamiltonianPathAlgorithmStep[] = [];
        let foundSolution: number[] | null = null;
        
        const addStep = (path: number[], visited: {[key:number]: boolean}, highlights: any, message: string) => {
            newSteps.push({ graph: graphData, path: [...path], visited: {...visited}, highlights, message, foundSolution });
        };

        function backtrack(path: number[], visited: {[key:number]: boolean}): boolean {
            if (foundSolution) return true;

            const currentV = path[path.length - 1];
            
            let highlights: {[key: number]: HamiltonianPathHighlightType} = {};
            path.forEach(v => highlights[v] = 'path');
            highlights[currentV] = 'visiting';
            addStep(path, visited, highlights, `Visitando vértice ${currentV}. Caminho atual: [${path.join('->')}]`);

            if (path.length === V) {
                foundSolution = [...path];
                 let solutionHighlights: {[key: number]: HamiltonianPathHighlightType} = {};
                 path.forEach(v => solutionHighlights[v] = 'solution');
                addStep(path, visited, solutionHighlights, "Caminho Hamiltoniano encontrado!");
                return true;
            }

            for (let nextV = 0; nextV < V; nextV++) {
                if (adjMatrix[currentV][nextV] === 1 && !visited[nextV]) {
                    visited[nextV] = true;
                    path.push(nextV);

                    if (backtrack(path, visited)) {
                        return true;
                    }
                    
                    // Backtrack
                    path.pop();
                    delete visited[nextV];
                    let backtrackHighlights: {[key: number]: HamiltonianPathHighlightType} = {};
                    path.forEach(v => backtrackHighlights[v] = 'path');
                    backtrackHighlights[nextV] = 'backtrack';
                    addStep(path, visited, backtrackHighlights, `Caminho sem saída a partir de ${nextV}. Retrocedendo.`);
                }
            }
            return false;
        }

        addStep([], {}, {}, `Iniciando busca por Caminho Hamiltoniano.`);
        let hasSolution = false;
        for (let startNode = 0; startNode < V; startNode++) {
             addStep([], {}, {}, `Tentando iniciar pelo vértice ${startNode}.`);
             if (backtrack([startNode], {[startNode]: true})) {
                 hasSolution = true;
                 break;
             }
        }
        
        if (!hasSolution) {
            addStep([], {}, {}, `Busca completa. Nenhum caminho Hamiltoniano encontrado.`);
        }

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        const newGraph = generateRandomGraph(numVertices, 0.45);
        setGraph(newGraph);
        generateSteps(newGraph);
    }, [numVertices, generateSteps]);
    
    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numVertices]);

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

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        graph, path: [], visited: {}, highlights: {}, message: 'Pronto para começar.', foundSolution: null
    }, [steps, currentStepIndex, graph]);
    
    return {
        step: currentStepData,
        numVertices,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNumVerticesChange }
    };
};
