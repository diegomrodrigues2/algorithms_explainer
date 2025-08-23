import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HuffmanCodeAlgorithmStep, HuffmanNodeData, HuffmanTree, HeapNode } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

const CANVAS_WIDTH = 800;
const PADDING_Y = 70;

let nodeIdCounter = 0;
const getUniqueId = (symbol: string | null) => `node-${symbol === null ? 'internal' : symbol.charCodeAt(0)}-${nodeIdCounter++}`;


function positionTree(tree: HuffmanTree, rootId: string | null): HuffmanTree {
    if (!rootId) return {};

    const positionedTree: HuffmanTree = JSON.parse(JSON.stringify(tree));

    function layout(nodeId: string | null | undefined, depth: number, xStart: number, xEnd: number, parentX?: number, parentY?: number) {
        if (!nodeId) return;

        const node = positionedTree[nodeId];
        node.x = xStart + (xEnd - xStart) / 2;
        node.y = depth * PADDING_Y + 50;
        node.level = depth;
        if(parentX !== undefined && parentY !== undefined) {
            node.parentX = parentX;
            node.parentY = parentY;
        }

        const midPoint = node.x;
        if (node.leftId) {
            layout(node.leftId, depth + 1, xStart, midPoint, node.x, node.y);
        }
        if (node.rightId) {
            layout(node.rightId, depth + 1, midPoint, xEnd, node.x, node.y);
        }
    }

    layout(rootId, 0, 0, CANVAS_WIDTH);
    return positionedTree;
}

export const useHuffmanCode = (initialText: string) => {
    const [textInput, setTextInput] = useState(initialText);
    const [steps, setSteps] = useState<HuffmanCodeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((text: string) => {
        nodeIdCounter = 0;
        const freqs: { [key: string]: number } = {};
        for (const char of text) {
            freqs[char] = (freqs[char] || 0) + 1;
        }

        if (Object.keys(freqs).length === 0) {
            setSteps([]);
            return;
        }
        
        const newSteps: HuffmanCodeAlgorithmStep[] = [];
        
        const addStep = (heap: HeapNode[], tree: HuffmanTree, codes: {[s:string]:string}, message: string, highlights: any, codeGenPath: any[] = []) => {
            newSteps.push({ heap: [...heap].sort((a,b) => a.freq - b.freq), tree: JSON.parse(JSON.stringify(tree)), codes, message, highlights, codeGenerationPath: codeGenPath });
        };
        
        const initialTree: HuffmanTree = {};
        const heap: HeapNode[] = Object.entries(freqs).map(([symbol, freq]) => {
            const id = getUniqueId(symbol);
            const node: HeapNode = { id, freq, symbol };
            initialTree[id] = { id, freq, symbol, level: 0, x:0, y:0 };
            return node;
        });

        heap.sort((a, b) => a.freq - b.freq);
        addStep(heap, {}, {}, "Frequências calculadas e heap inicializado.", {});
        
        const tree = initialTree;
        let currentRootForLayout: string | null = null;

        while (heap.length > 1) {
            heap.sort((a, b) => a.freq - b.freq);
            const node1 = heap.shift()!;
            const node2 = heap.shift()!;
            
            addStep(heap, positionTree(tree, currentRootForLayout), {}, `Extraindo os 2 nós de menor frequência: '${node1.symbol || `(${node1.freq})`}' e '${node2.symbol || `(${node2.freq})`}'`, { heapIds: [node1.id, node2.id] });

            const parentFreq = node1.freq + node2.freq;
            const parentId = getUniqueId(null);
            const parentNode: HeapNode = { id: parentId, freq: parentFreq, symbol: null };
            
            tree[parentId] = { id: parentId, freq: parentFreq, symbol: null, level: 0, x: 0, y: 0, leftId: node1.id, rightId: node2.id };
            currentRootForLayout = parentId;

            heap.push(parentNode);
            heap.sort((a, b) => a.freq - b.freq);

            const positionedTree = positionTree(tree, parentId);
            addStep(heap, positionedTree, {}, `Mesclando para criar o nó pai com frequência ${parentFreq} e inserindo no heap.`, { treeId: parentId });
        }

        const rootId = heap.length > 0 ? heap[0].id : null;
        let finalTree = positionTree(tree, rootId);
        addStep([], finalTree, {}, `Árvore de Huffman construída. Gerando códigos...`, {});

        // Generate Codes
        const codes: { [symbol: string]: string } = {};
        const codeGenerationPath: { symbol: string, code: string }[] = [];

        function generate(nodeId: string | null | undefined, path: string) {
            if (!nodeId) return;

            const node = finalTree[nodeId];
            addStep([], finalTree, codes, `Percorrendo a árvore. Nó atual: ${node.symbol || `(${node.freq})`}`, { treeId: nodeId, path: path }, codeGenerationPath);

            if (node.symbol) {
                codes[node.symbol] = path || (Object.keys(freqs).length > 1 ? path : '0');
                codeGenerationPath.push({ symbol: node.symbol, code: codes[node.symbol] });
                addStep([], finalTree, codes, `Encontrada folha '${node.symbol}'. Código: ${codes[node.symbol]}`, { treeId: nodeId }, codeGenerationPath);
                return;
            }

            if (node.leftId) generate(node.leftId, path + '0');
            if (node.rightId) generate(node.rightId, path + '1');
            addStep([], finalTree, codes, `Retornando do nó (${node.freq})`, { treeId: nodeId, path: path }, codeGenerationPath);
        }
        
        generate(rootId, "");
        addStep([], finalTree, codes, `Geração de códigos completa.`, {}, codeGenerationPath);
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(textInput);
    }, [textInput, generateSteps]);
    
    useEffect(() => { reset(); }, [reset]);

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
    const handleTextChange = (newText: string) => { if (!isPlaying) setTextInput(newText); };

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        heap: [], tree: {}, codes: {}, message: 'Configure o texto e inicie.', highlights: {}, codeGenerationPath: []
    }, [steps, currentStepIndex]);
    
    return {
        step: currentStepData,
        textInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleTextChange }
    };
};