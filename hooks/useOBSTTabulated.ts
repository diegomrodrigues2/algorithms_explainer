import { useState, useEffect, useCallback, useMemo } from 'react';
import type { OBSTTabulatedAlgorithmStep, OBSTTree } from '../types';

const INITIAL_SPEED = 400;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

// Re-use positioning logic from the memoized OBST hook
function positionTree(tree: OBSTTree, rootTable: (number | null)[][], totalNodes: number): OBSTTree {
    const positionedTree: OBSTTree = JSON.parse(JSON.stringify(tree));
    const PADDING_Y = 80;
    const CANVAS_WIDTH = 1000;
    const xPositions: { [key: number]: number } = {};
    let xCounter = 0;

    function assignXOrder(i: number, j: number) {
        if (i > j) return;
        const rootIndex = rootTable[i]?.[j];
        if (rootIndex === null || rootIndex === undefined) return;
        
        assignXOrder(i, rootIndex - 1);
        xPositions[rootIndex] = xCounter++;
        assignXOrder(rootIndex + 1, j);
    }
    
    assignXOrder(0, totalNodes - 1);

    Object.values(positionedTree).forEach(node => {
        const order = xPositions[node.id];
        node.x = (order + 0.5) * (CANVAS_WIDTH / totalNodes);
        node.y = node.level * PADDING_Y + 50;
    });

    function connectParents(i: number, j: number) {
        if (i > j) return;
        const rootIndex = rootTable[i]?.[j];
        if (rootIndex === null || rootIndex === undefined) return;

        const parentNode = positionedTree[rootIndex];
        const leftChildRootIndex = rootTable[i]?.[rootIndex - 1];
        if (leftChildRootIndex !== null && leftChildRootIndex !== undefined) {
            const leftChild = positionedTree[leftChildRootIndex];
            if (leftChild) {
                leftChild.parentX = parentNode.x;
                leftChild.parentY = parentNode.y;
            }
            connectParents(i, rootIndex - 1);
        }
        
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

export const useOBSTTabulated = (initialKeys: string, initialFreqs: string) => {
    const [keysInput, setKeysInput] = useState(initialKeys);
    const [freqsInput, setFreqsInput] = useState(initialFreqs);
    const [steps, setSteps] = useState<OBSTTabulatedAlgorithmStep[]>([]);
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
        const newSteps: OBSTTabulatedAlgorithmStep[] = [];
        const costTable = Array(n).fill(null).map(() => Array(n).fill(null));
        const rootTable = Array(n).fill(null).map(() => Array(n).fill(null));

        const prefixSum = [0];
        freqs.forEach(f => prefixSum.push(prefixSum[prefixSum.length - 1] + f));
        const sumFreq = (i: number, j: number): number => i > j ? 0 : prefixSum[j + 1] - prefixSum[i];

        const addStep = (message: string, highlights: any = {}, tree: OBSTTree = {}, totalCost: number | null = null) => {
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

        addStep("Inicializando tabelas.", {});

        for (let i = 0; i < n; i++) {
            costTable[i][i] = freqs[i];
            rootTable[i][i] = i;
            addStep(`Intervalo de comprimento 1: Custo para ['${keys[i]}'] é ${freqs[i]}.`, { currentCell: [i, i] });
        }

        for (let L = 2; L <= n; L++) {
            addStep(`Calculando custos para intervalos de comprimento ${L}.`, {});
            for (let i = 0; i <= n - L; i++) {
                const j = i + L - 1;
                let minCost = Infinity;
                let bestRoot = -1;
                const currentIntervalSum = sumFreq(i, j);

                addStep(`Calculando custo para [${i}, ${j}] ('${keys.slice(i, j + 1).join(',')}'). Soma Freqs: ${currentIntervalSum}.`, { currentCell: [i, j] });

                for (let r = i; r <= j; r++) {
                    const costLeft = (r > i) ? costTable[i][r - 1] : 0;
                    const costRight = (r < j) ? costTable[r + 1][j] : 0;
                    const currentCost = (costLeft ?? 0) + (costRight ?? 0) + currentIntervalSum;

                    addStep(
                        `Testando '${keys[r]}': ${costLeft?.toFixed(2) ?? 0} + ${costRight?.toFixed(2) ?? 0} + ${currentIntervalSum} = ${currentCost.toFixed(2)}`,
                        { currentCell: [i, j], testingRoot: r, sourceCell1: (r > i ? [i, r - 1] : undefined), sourceCell2: (r < j ? [r + 1, j] : undefined) }
                    );
                    
                    if (currentCost < minCost) {
                        minCost = currentCost;
                        bestRoot = r;
                    }
                }
                costTable[i][j] = minCost;
                rootTable[i][j] = bestRoot;
                addStep(`Custo ótimo para [${i},${j}] é ${minCost.toFixed(2)} com raiz '${keys[bestRoot]}'.`, { currentCell: [i, j] });
            }
        }
        
        const finalCost = costTable[0][n - 1];
        addStep(`Cálculo completo. Custo total ótimo: ${finalCost?.toFixed(2)}.`, {}, {}, finalCost);
        
        let finalTree: OBSTTree = {};
        function buildTree(i: number, j: number, level: number): void {
            if (i > j) return;
            const rootIndex = rootTable[i][j];
            if (rootIndex === null) return;
            
            finalTree[rootIndex] = { key: keys[rootIndex], freq: freqs[rootIndex], level, id: rootIndex, x: 0, y: 0 };
            buildTree(i, rootIndex - 1, level + 1);
            buildTree(rootIndex + 1, j, level + 1);
        }
        
        buildTree(0, n - 1, 0);
        const positionedTree = positionTree(finalTree, rootTable, n);
        addStep(`Árvore ótima construída. Custo total: ${finalCost?.toFixed(2)}`, {}, positionedTree, finalCost);

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