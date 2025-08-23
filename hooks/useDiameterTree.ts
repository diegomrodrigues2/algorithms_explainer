import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DiameterTreeAlgorithmStep, DiameterTreeNode, DiameterTreeEdge, DiameterTreeHighlightType } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const WIDTH = 500;
const HEIGHT = 400;

const generateRandomTree = (numVertices: number): { nodes: DiameterTreeNode[], edges: DiameterTreeEdge[], adj: number[][] } => {
    const nodes: DiameterTreeNode[] = Array.from({ length: numVertices }, (_, id) => ({ id, x: 0, y: 0 }));
    const edges: DiameterTreeEdge[] = [];
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

const layoutTree = (nodes: DiameterTreeNode[], adj: number[][], rootId: number): DiameterTreeNode[] => {
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


export const useDiameterTree = (initialNodes: number) => {
    const [numNodes, setNumNodes] = useState(initialNodes);
    const [graph, setGraph] = useState<{ nodes: DiameterTreeNode[], edges: DiameterTreeEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<DiameterTreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numVertices: number) => {
        const { nodes: initialNodes, edges, adj } = generateRandomTree(numVertices);
        const rootId = 0;
        const graphData = { nodes: layoutTree(initialNodes, adj, rootId), edges };

        const newSteps: DiameterTreeAlgorithmStep[] = [];
        const height: { [nodeId: number]: number | null } = {};
        const diameter: { [nodeId: number]: number | null } = {};
        let maxDiameter = 0;
        
        const addStep = (message: string, highlights: { [nodeId: number]: DiameterTreeHighlightType } = {}, result: number | null = null) => {
            newSteps.push({ graph: graphData, height: {...height}, diameter: {...diameter}, highlights, message, result });
        };

        function dfs(u: number, p: number): [number, number] { // returns [height, diameter]
            addStep(`DFS visitando o nó ${u}.`, { [u]: 'visiting', ...(p !== -1 && { [p]: 'parent' }) });
            
            const childData = adj[u]
                .filter(v => v !== p)
                .map(v => {
                    const [h, d] = dfs(v, u);
                    addStep(`Retornou do filho ${v}. h=${h}, d=${d}`, { [u]: 'visiting', [v]: 'processed' });
                    return {h, d};
                });
            
            const heights = childData.map(c => c.h);
            const diameters = childData.map(c => c.d);

            const h = 1 + Math.max(0, ...heights);
            
            const twoLargestHeights = heights.sort((a,b) => b-a).slice(0, 2);
            const diameterThroughU = twoLargestHeights.reduce((a, b) => a + b, 0);

            const d = Math.max(diameterThroughU, ...diameters, 0);

            height[u] = h;
            diameter[u] = d;
            
            if (d > maxDiameter) {
                maxDiameter = d;
            }

            addStep(`Nó ${u}: altura=${h}, diâmetro da subárvore=${d}`, { [u]: 'processed' });
            return [h, d];
        }

        addStep("Iniciando o cálculo do Diâmetro da Árvore.", {});
        if (numVertices > 0) {
            dfs(rootId, -1);
            addStep(`Cálculo completo. Diâmetro da árvore é ${maxDiameter}.`, {}, maxDiameter);

            // Path highlighting is complex, so we will skip it for now and just show the final result.
            // A simple approximation is to highlight nodes where diameter calculation was updated
            const finalHighlights: { [nodeId: number]: DiameterTreeHighlightType } = {};
            // This is a placeholder, a real implementation would backtrack to find the actual path
            Object.keys(diameter).forEach(key => {
                if(diameter[key] === maxDiameter) {
                    finalHighlights[key] = 'diameter-path';
                }
            })
            addStep(`Diâmetro final: ${maxDiameter}.`, finalHighlights, maxDiameter);

        } else {
             addStep(`Árvore vazia. Diâmetro é 0.`, {}, 0);
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
        graph, height: {}, diameter: {}, highlights: {}, message: 'Pronto para começar.', result: null
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