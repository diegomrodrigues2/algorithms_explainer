import { useState, useEffect, useCallback, useMemo } from 'react';
import type { OBSTAlgorithmStep, OBSTTree, OBSTNodeData } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useOBST = (initialKeys: string, initialFreqs: string) => {
    const [keysInput, setKeysInput] = useState(initialKeys);
    const [freqsInput, setFreqsInput] = useState(initialFreqs);
    const [steps, setSteps] = useState<OBSTAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((keysStr: string, freqsStr: string) => {
        const keys = keysStr.split(',').map(k => k.trim()).filter(Boolean);
        const freqs = freqsStr.split(',').map(f => parseInt(f.trim())).filter(n => !isNaN(n));

        if (keys.length === 0 || keys.length !== freqs.length) {
            setSteps([]);
            return;
        }

        const n = keys.length;
        const newSteps: OBSTAlgorithmStep[] = [];
        let costTable = Array(n).fill(null).map(() => Array(n).fill(null));
        let rootTable = Array(n).fill(null).map(() => Array(n).fill(null));
        const prefixSum = [0];
        freqs.forEach(f => prefixSum.push(prefixSum[prefixSum.length - 1] + f));

        const addStep = (tree: OBSTTree, highlights: any, message: string, totalCost: number | null = null) => {
            newSteps.push({
                keys,
                freqs,
                costTable: JSON.parse(JSON.stringify(costTable)),
                rootTable: JSON.parse(JSON.stringify(rootTable)),
                tree,
                highlights,
                totalCost,
                message,
            });
        };
        
        const sumFreq = (i: number, j: number): number => i > j ? 0 : prefixSum[j + 1] - prefixSum[i];

        function optCost(i: number, j: number): number {
            if (i > j) return 0;
            if (costTable[i][j] !== null) return costTable[i][j];

            addStep({}, { subproblem: [i, j] }, `Resolvendo subproblema para chaves [${keys.slice(i, j+1).join(', ')}]`);

            let minCost = Infinity;
            let bestRoot = -1;
            
            for (let r = i; r <= j; r++) {
                 addStep({}, { subproblem: [i, j], testingRoot: r }, `Testando '${keys[r]}' como raiz para o intervalo [${i},${j}]`);
                 
                const costLeft = optCost(i, r - 1);
                const costRight = optCost(r + 1, j);
                const currentCost = costLeft + costRight;

                if (currentCost < minCost) {
                    minCost = currentCost;
                    bestRoot = r;
                }
            }

            const totalCost = minCost + sumFreq(i, j);
            costTable[i][j] = totalCost;
            rootTable[i][j] = bestRoot;

            addStep({}, { tableCell: [i, j] }, `Custo ótimo para [${i},${j}] é ${totalCost} com raiz '${keys[bestRoot]}' (índice ${bestRoot})`);
            return totalCost;
        }

        addStep({}, {}, "Iniciando cálculo da Árvore de Busca Binária Ótima.");
        const finalCost = optCost(0, n - 1);
        addStep({}, { }, `Cálculo de custo completo. Custo total ótimo: ${finalCost}`);

        // Build tree for visualization
        let finalTree: OBSTTree = {};
        function buildTree(i: number, j: number, level: number): void {
            if (i > j) return;
            const rootIndex = rootTable[i][j];
            if (rootIndex === null) return;
            
            finalTree[rootIndex] = {
                key: keys[rootIndex],
                freq: freqs[rootIndex],
                level,
                id: rootIndex,
                x: 0, y: 0 // Placeholder
            };
            addStep(JSON.parse(JSON.stringify(finalTree)), {}, `Construindo árvore: adicionando nó '${keys[rootIndex]}'`);
            
            buildTree(i, rootIndex - 1, level + 1);
            buildTree(rootIndex + 1, j, level + 1);
        }
        
        buildTree(0, n - 1, 0);

        // Final step with tree and positions
        const positionedTree = positionTree(finalTree, rootTable, n);
        addStep(positionedTree, {}, `Árvore ótima construída. Custo total: ${finalCost}`, finalCost);

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(keysInput, freqsInput);
    }, [keysInput, freqsInput, generateSteps]);
    
    useEffect(() => {
        reset();
    }, [reset]);

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
    const handleKeysChange = (newKeys: string) => { if(!isPlaying) setKeysInput(newKeys); }
    const handleFreqsChange = (newFreqs: string) => { if(!isPlaying) setFreqsInput(newFreqs); }

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        keys: keysInput.split(',').map(k => k.trim()).filter(Boolean),
        freqs: freqsInput.split(',').map(f => parseInt(f.trim())).filter(n => !isNaN(n)),
        costTable: [], rootTable: [], tree: {}, highlights: {}, totalCost: null,
        message: 'Configure as chaves e frequências e inicie.'
    }, [steps, currentStepIndex, keysInput, freqsInput]);
    
    return {
        step: currentStepData,
        keysInput,
        freqsInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleKeysChange, handleFreqsChange }
    };
};

function positionTree(tree: OBSTTree, rootTable: (number | null)[][], totalNodes: number): OBSTTree {
    const positionedTree: OBSTTree = JSON.parse(JSON.stringify(tree));
    const PADDING_Y = 80;
    const CANVAS_WIDTH = 1000;
    const xPositions: { [key: number]: number } = {};
    let xCounter = 0;

    // First, do an inorder traversal to assign an x-order to each node
    function assignXOrder(i: number, j: number) {
        if (i > j) return;
        const rootIndex = rootTable[i]?.[j];
        if (rootIndex === null || rootIndex === undefined) return;
        
        assignXOrder(i, rootIndex - 1);
        xPositions[rootIndex] = xCounter++;
        assignXOrder(rootIndex + 1, j);
    }
    
    assignXOrder(0, totalNodes - 1);

    // Now, assign the actual coordinates
    Object.values(positionedTree).forEach(node => {
        const order = xPositions[node.id];
        node.x = (order + 0.5) * (CANVAS_WIDTH / totalNodes);
        node.y = node.level * PADDING_Y + 50;
    });

    // Finally, connect parents to children
    function connectParents(i: number, j: number) {
        if (i > j) return;
        const rootIndex = rootTable[i]?.[j];
        if (rootIndex === null || rootIndex === undefined) return;

        const parentNode = positionedTree[rootIndex];

        // Connect to left child
        const leftChildRootIndex = rootTable[i]?.[rootIndex - 1];
        if (leftChildRootIndex !== null && leftChildRootIndex !== undefined) {
            const leftChild = positionedTree[leftChildRootIndex];
            if (leftChild) {
                leftChild.parentX = parentNode.x;
                leftChild.parentY = parentNode.y;
            }
            connectParents(i, rootIndex - 1);
        }
        
        // Connect to right child
        const rightChildRootIndex = rootTable[rootIndex + 1]?.[j];
        if (rightChildRootIndex !== null && rightChildRootIndex !== undefined) {
             const rightChild = positionedTree[rightChildRootIndex];
            if (rightChild) {
                rightChild.parentX = parentNode.x;
                rightChild.parentY = parentNode.y;
            }
            connectParents(rootIndex + 1, j);
        }
    }
    
    connectParents(0, totalNodes - 1);

    return positionedTree;
}