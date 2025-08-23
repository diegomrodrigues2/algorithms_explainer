import { useState, useEffect, useCallback, useMemo } from 'react';
import type { LargestBSTSubtreeAlgorithmStep, LargestBSTSubtreeNode, LargestBSTSubtreeEdge, LargestBSTSubtreeHighlightType, NodeDPInfo } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;
const WIDTH = 500;
const HEIGHT = 400;

const generateRandomBinaryTree = (numVertices: number): { nodes: LargestBSTSubtreeNode[], edges: LargestBSTSubtreeEdge[], adj: number[][], children: {[key: number]: (number | null)[]} } => {
    const values = Array.from({ length: numVertices }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }

    const nodes: LargestBSTSubtreeNode[] = Array.from({ length: numVertices }, (_, id) => ({ id, value: values[id], x: 0, y: 0 }));
    const edges: LargestBSTSubtreeEdge[] = [];
    const adj: number[][] = Array.from({ length: numVertices }, () => []);
    const children: {[key: number]: (number | null)[]} = {};

    if (numVertices > 0) {
        for (let i = 1; i < numVertices; i++) {
            const parentId = Math.floor((i - 1) / 2);
            edges.push({ source: parentId, target: i });
            adj[parentId].push(i);
            adj[i].push(parentId);
            
            if (!children[parentId]) children[parentId] = [null, null];
            if (children[parentId][0] === null) children[parentId][0] = i;
            else children[parentId][1] = i;
        }
    }
    return { nodes, edges, adj, children };
};


const layoutTree = (nodes: LargestBSTSubtreeNode[], adj: number[][], rootId: number): LargestBSTSubtreeNode[] => {
    const levels: number[][] = [];
    const visited = new Set<number>();
    const parentMap: {[key:number]: number} = {};
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
                    parentMap[v] = u;
                    queue.push(v);
                }
            }
        }
        levels.push(currentLevel);
    }
    
    const positionedNodes = [...nodes];
    const levelHeight = (HEIGHT - 80) / Math.max(1, levels.length - 1);

    levels.forEach((level, levelIndex) => {
        const levelWidth = WIDTH - 80;
        level.forEach((nodeId, nodeIndex) => {
            const node = positionedNodes[nodeId];
            node.y = 40 + levelIndex * levelHeight;
            node.x = 40 + (nodeIndex + 0.5) * (levelWidth / level.length);
        });
    });

    return positionedNodes;
};


export const useLargestBSTSubtree = (initialNodes: number) => {
    const [numNodes, setNumNodes] = useState(initialNodes);
    const [graph, setGraph] = useState<{ nodes: LargestBSTSubtreeNode[], edges: LargestBSTSubtreeEdge[] }>({ nodes: [], edges: [] });
    const [steps, setSteps] = useState<LargestBSTSubtreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((numVertices: number) => {
        const { nodes: initialNodes, edges, adj, children } = generateRandomBinaryTree(numVertices);
        const rootId = 0;
        const graphData = { nodes: layoutTree(initialNodes, adj, rootId), edges };

        const newSteps: LargestBSTSubtreeAlgorithmStep[] = [];
        const nodeData: { [nodeId: number]: NodeDPInfo } = {};
        
        const addStep = (message: string, highlights: { [nodeId: number]: LargestBSTSubtreeHighlightType } = {}, result: number | null = null) => {
            newSteps.push({ graph: graphData, nodeData: JSON.parse(JSON.stringify(nodeData)), highlights, message, result });
        };

        let largestBSTSize = 0;
        let largestBSTRoot: number | null = null;

        function dfs(u: number | null, p: number | null): [boolean, number, number, number] {
            if (u === null) {
                return [true, 0, Infinity, -Infinity];
            }
            
            const nodeValue = graphData.nodes[u].value;
            addStep(`DFS visitando o nó ${u} (valor ${nodeValue}).`, { [u]: 'visiting', ...(p !== null && { [p]: 'parent' }) });
            
            const [leftChild, rightChild] = children[u] || [null, null];

            const [isLeftBST, leftSize, leftMin, leftMax] = dfs(leftChild, u);
            if (leftChild !== null) addStep(`Retornou do filho esquerdo ${leftChild}.`, { [u]: 'visiting', [leftChild]: 'processed' });

            const [isRightBST, rightSize, rightMin, rightMax] = dfs(rightChild, u);
            if (rightChild !== null) addStep(`Retornou do filho direito ${rightChild}.`, { [u]: 'visiting', [rightChild]: 'processed' });

            let currentIsBST = false;
            let currentSize = 0;
            let currentMin = nodeValue;
            let currentMax = nodeValue;

            addStep(`Verificando a propriedade BST para o nó ${u} (valor ${nodeValue}).`, { [u]: 'visiting' });

            if (isLeftBST && isRightBST && leftMax < nodeValue && nodeValue < rightMin) {
                currentIsBST = true;
                currentSize = 1 + leftSize + rightSize;
                currentMin = Math.min(leftMin, nodeValue);
                currentMax = Math.max(rightMax, nodeValue);
                addStep(`Nó ${u} forma uma BST válida. Tamanho: ${currentSize}.`, { [u]: 'visiting' });
                if (currentSize > largestBSTSize) {
                    largestBSTSize = currentSize;
                    largestBSTRoot = u;
                }
            } else {
                currentIsBST = false;
                currentSize = Math.max(leftSize, rightSize);
                addStep(`Nó ${u} NÃO forma uma BST. Maior BST interna: ${currentSize}.`, { [u]: 'not-bst' });
            }

            nodeData[u] = { isBST: currentIsBST, size: currentSize, min: currentMin, max: currentMax };
            addStep(`Valores para o nó ${u} computados.`, { [u]: 'processed' });
            return [currentIsBST, currentSize, currentMin, currentMax];
        }

        addStep("Iniciando o cálculo da Maior Subárvore BST.", {});
        if (numVertices > 0) {
            dfs(rootId, null);
            
            addStep(`Cálculo completo. Maior BST tem tamanho ${largestBSTSize}. Reconstruindo...`, {}, largestBSTSize);

            if (largestBSTRoot !== null) {
                const finalHighlights: { [nodeId: number]: LargestBSTSubtreeHighlightType } = {};
                const q = [largestBSTRoot];
                const visited = new Set<number>();
                
                while(q.length > 0) {
                    const u = q.shift()!;
                    if (visited.has(u)) continue;
                    visited.add(u);
                    finalHighlights[u] = 'solution-bst';
                    const [l, r] = children[u] || [null, null];
                    if (l !== null) q.push(l);
                    if (r !== null) q.push(r);
                }
                addStep(`Maior subárvore BST encontrada. Tamanho: ${largestBSTSize}.`, finalHighlights, largestBSTSize);
            }
        } else {
             addStep(`Árvore vazia. Tamanho é 0.`, {}, 0);
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
        graph, nodeData: {}, highlights: {}, message: 'Pronto para começar.', result: null
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
