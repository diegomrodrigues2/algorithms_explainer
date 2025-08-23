import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MISTreeAlgorithmStep, MISTreeNode, MISTreeEdge, MISTreeHighlightType } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const WIDTH = 500;
const HEIGHT = 400;

const generateRandomTree = (numVertices: number): { nodes: MISTreeNode[], edges: MISTreeEdge[], adj: number[][] } => {
    const nodes: MISTreeNode[] = Array.from({ length: numVertices }, (_, id) => ({ id, x: 0, y: 0 }));
    const edges: MISTreeEdge[] = [];
    const adj: number[][] = Array.from({ length: numVertices }, () => []);

    if (numVertices > 1) {
        for (let i = 1; i < numVertices; i++) {
            const parent = Math.floor(Math.random() * i);
            edges.push({ source: parent, target: i });
            adj[parent].push(i);
            adj[i].push(parent);
        }
    }
    return { nodes, edges, adj };
};

const layoutTree = (nodes: MISTreeNode[], adj: number[][], rootId: number): MISTreeNode[] => {
    const levels: number[][] = [];
    const visited = new Set<number>();
    let queue = [rootId];
    visited.add(rootId);

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel: number[] = [];
        for (let i = 0; i < levelSize; i++) {
            const u = queue.shift()!;
            currentLevel.push(u);
            for (const v of adj[u]) {
                if (!visited.has(v)) {
                    visited.add(v);
                    queue.push(v);
                }
            }
        }
        levels.push(currentLevel);
    }
    
    const positionedNodes = [...nodes];
    const levelHeight = (HEIGHT - 80) / Math.max(1, levels.length - 1);

    levels.forEach((level, levelIndex) => {
        const levelWidth = WIDTH - 60;
        level.forEach((nodeId, nodeIndex) => {
            const node = positionedNodes[nodeId];
            node.y = 40 + levelIndex * levelHeight;
            node.x = 30 + (nodeIndex + 1) * (levelWidth / (level.length + 1));
        });
    });

    return positionedNodes;
};


export const useMISTree = (initialNodes: number) => {
    const [numNodes, setNumNodes] = useState(initialNodes);
    const [graph, setGraph] = useState<{ nodes: MISTreeNode[], edges: MISTreeEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<MISTreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numVertices: number) => {
        const { nodes: initialNodes, edges, adj } = generateRandomTree(numVertices);
        const rootId = 0;
        const graphData = { nodes: layoutTree(initialNodes, adj, rootId), edges };

        const newSteps: MISTreeAlgorithmStep[] = [];
        const take: { [nodeId: number]: number | null } = {};
        const skip: { [nodeId: number]: number | null } = {};
        
        const addStep = (message: string, highlights: { [nodeId: number]: MISTreeHighlightType } = {}, result: number | null = null) => {
            newSteps.push({ graph: graphData, take: {...take}, skip: {...skip}, highlights, message, result });
        };

        function dfs(u: number, p: number) {
            addStep(`DFS visitando o nó ${u}.`, { [u]: 'visiting', ...(p !== -1 && { [p]: 'parent' }) });
            
            take[u] = 1;
            skip[u] = 0;

            for (const v of adj[u]) {
                if (v === p) continue;
                dfs(v, u);
                addStep(`Retornou da subárvore do filho ${v}. Atualizando os valores para o nó ${u}.`, { [u]: 'visiting', [v]: 'processed' });
                
                const take_v = take[v]!;
                const skip_v = skip[v]!;
                
                take[u]! += skip_v;
                skip[u]! += Math.max(take_v, skip_v);

                 addStep(`take[${u}] = ${take[u]}, skip[${u}] = ${skip[u]}`, { [u]: 'visiting', [v]: 'processed' });
            }
             addStep(`Cálculos para a subárvore do nó ${u} completos. take[${u}] = ${take[u]}, skip[${u}] = ${skip[u]}.`, { [u]: 'processed' });
        }

        addStep("Iniciando o cálculo do Conjunto Independente Máximo (MIS).", {});
        if (numVertices > 0) {
            dfs(rootId, -1);
            
            const misSize = Math.max(take[rootId]!, skip[rootId]!);
            addStep(`Cálculo completo. Tamanho do MIS é ${misSize}. Reconstruindo o conjunto...`, {}, misSize);

            // Reconstruct the set for final highlighting
            const misSet = new Set<number>();
            const q: [number, number, boolean][] = [[rootId, -1, take[rootId]! > skip[rootId]!]];
            const highlights: { [nodeId: number]: MISTreeHighlightType } = {};

            while(q.length > 0) {
                const [u, p, shouldTake] = q.shift()!;
                if(shouldTake) {
                    misSet.add(u);
                    highlights[u] = 'solution-in';
                    for(const v of adj[u]) {
                        if (v !== p) q.push([v, u, false]); // Must skip children
                    }
                } else {
                    highlights[u] = 'solution-ex';
                    for(const v of adj[u]) {
                        if (v !== p) q.push([v, u, take[v]! > skip[v]!]); // Choose best for children
                    }
                }
            }
            addStep(`Conjunto Independente Máximo reconstruído. Tamanho: ${misSize}.`, highlights, misSize);
        } else {
             addStep(`Árvore vazia. Tamanho do MIS é 0.`, {}, 0);
        }

        setGraph(graphData);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numNodes);
    }, [numNodes, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [numNodes]);

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

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);
    const handleNumNodesChange = (newSize: number) => { if(!isPlaying) setNumNodes(newSize); };

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        graph, take: {}, skip: {}, highlights: {}, message: 'Pronto para começar.', result: null
    }, [steps, currentStepIndex, graph]);
    
    return {
        step: currentStepData,
        numNodes,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNumNodesChange }
    };
};