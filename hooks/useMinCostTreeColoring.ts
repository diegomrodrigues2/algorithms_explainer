import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MinCostTreeColoringAlgorithmStep, MinCostTreeColoringNode, MinCostTreeColoringEdge, MinCostTreeColoringHighlightType } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const WIDTH = 500;
const HEIGHT = 400;

const generateRandomTree = (numVertices: number): { nodes: MinCostTreeColoringNode[], edges: MinCostTreeColoringEdge[], adj: number[][] } => {
    const nodes: MinCostTreeColoringNode[] = Array.from({ length: numVertices }, (_, id) => ({ id, x: 0, y: 0 }));
    const edges: MinCostTreeColoringEdge[] = [];
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

const layoutTree = (nodes: MinCostTreeColoringNode[], adj: number[][], rootId: number): MinCostTreeColoringNode[] => {
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

const generateRandomCosts = (numNodes: number, numColors: number): number[][] => {
    return Array.from({ length: numNodes }, () => 
        Array.from({ length: numColors }, () => Math.floor(Math.random() * 10) + 1)
    );
};

export const useMinCostTreeColoring = (initialNodes: number, initialColors: number) => {
    const [numNodes, setNumNodes] = useState(initialNodes);
    const [numColors, setNumColors] = useState(initialColors);
    const [graph, setGraph] = useState<{ nodes: MinCostTreeColoringNode[], edges: MinCostTreeColoringEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<MinCostTreeColoringAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numVertices: number, k: number) => {
        const { nodes: initialNodes, edges, adj } = generateRandomTree(numVertices);
        const rootId = 0;
        const graphData = { nodes: layoutTree(initialNodes, adj, rootId), edges };
        const costs = generateRandomCosts(numVertices, k);

        const newSteps: MinCostTreeColoringAlgorithmStep[] = [];
        const dp: { [nodeId: number]: (number | null)[] } = {};
        
        const addStep = (message: string, highlights: any = {}, result: number | null = null, finalColors: any = {}) => {
            newSteps.push({ graph: graphData, costs, dp: JSON.parse(JSON.stringify(dp)), highlights, message, result, finalColors });
        };

        function dfs(u: number, p: number) {
            addStep(`DFS visitando o nó ${u}.`, { [u]: 'visiting', ...(p !== -1 && { [p]: 'parent' }) });
            
            for (const v of adj[u]) {
                if (v === p) continue;
                dfs(v, u);
                addStep(`Retornou da subárvore do filho ${v}.`, { [u]: 'visiting', [v]: 'processed' });
            }

            dp[u] = Array(k).fill(null);
            for (let c = 0; c < k; c++) {
                let totalCost = costs[u][c];
                addStep(`Calculando custo para nó ${u} com cor ${c + 1}. Custo inicial: ${costs[u][c]}`, { [u]: 'visiting' });

                for (const v of adj[u]) {
                    if (v === p) continue;
                    let minChildCost = Infinity;
                    for (let c2 = 0; c2 < k; c2++) {
                        if (c2 !== c) {
                            minChildCost = Math.min(minChildCost, dp[v][c2]!);
                        }
                    }
                     totalCost += minChildCost;
                     addStep(`Nó ${u}, cor ${c + 1}: adicionando custo mín. do filho ${v} (cor != ${c + 1}) = ${minChildCost}. Custo total: ${totalCost}`, { [u]: 'visiting', [v]: 'processed' });
                }
                dp[u][c] = totalCost;
                addStep(`Custo final para nó ${u} com cor ${c + 1} é ${totalCost}.`, { [u]: 'visiting' });
            }
             addStep(`Cálculos para subárvore do nó ${u} completos.`, { [u]: 'processed' });
        }
        
        addStep("Iniciando o cálculo.", {});
        if (numVertices > 0) {
            dfs(rootId, -1);
            
            const finalMinCost = Math.min(...(dp[rootId] as number[]));
            addStep(`Cálculo completo. Custo mínimo total: ${finalMinCost}. Reconstruindo cores...`, {}, finalMinCost);

            const finalColors: { [nodeId: number]: number | null } = {};
            const q: [number, number, number][] = [[rootId, -1, -1]]; // [u, p, parentColor]
            const highlights: { [nodeId: number]: MinCostTreeColoringHighlightType } = {};

            while(q.length > 0) {
                const [u, p, pColor] = q.shift()!;
                let bestColor = -1;
                let minCost = Infinity;

                for (let c = 0; c < k; c++) {
                    if (c !== pColor && dp[u][c]! < minCost) {
                        minCost = dp[u][c]!;
                        bestColor = c;
                    }
                }
                finalColors[u] = bestColor;
                highlights[u] = 'solution';

                for (const v of adj[u]) {
                    if (v !== p) q.push([v, u, bestColor]);
                }
            }
            addStep(`Coloração ótima encontrada. Custo total: ${finalMinCost}.`, highlights, finalMinCost, finalColors);

        } else {
             addStep(`Árvore vazia. Custo é 0.`, {}, 0, {});
        }
        
        setGraph(graphData);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numNodes, numColors);
    }, [numNodes, numColors, generateSteps]);
    
    useEffect(() => {
        reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numNodes, numColors]);

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
    const handleNumColorsChange = (newCount: number) => { if(!isPlaying) setNumColors(newCount); };

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        graph, costs: [], dp: {}, highlights: {}, message: 'Pronto para começar.', result: null, finalColors: {}
    }, [steps, currentStepIndex, graph]);
    
    return {
        step: currentStepData,
        numNodes,
        numColors,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleNumNodesChange, handleNumColorsChange }
    };
};
