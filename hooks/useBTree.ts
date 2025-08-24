import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BTreeAlgorithmStep, BTreeNodeData } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1000;
const WIDTH = 1200;

let nodeIdCounter = 0;
const getUniqueId = () => `node-${nodeIdCounter++}`;

const cloneNodes = (nodes: { [id: string]: BTreeNodeData }): { [id: string]: BTreeNodeData } => JSON.parse(JSON.stringify(nodes));

const layoutTree = (currentNodes: { [id: string]: BTreeNodeData }, currentRootId: string | null): { [id: string]: BTreeNodeData } => {
    if (!currentRootId) return currentNodes;

    const positionedNodes = cloneNodes(currentNodes);
    const getNodeWidth = (node: BTreeNodeData) => node.keys.length * 40 + (node.keys.length + 1) * 8;
    const subtreeWidths: { [id: string]: number } = {};
    const minSpacing = 20;

    function calculateSubtreeWidth(nodeId: string): number {
        if (subtreeWidths[nodeId] !== undefined) return subtreeWidths[nodeId];
        const node = positionedNodes[nodeId];
        if (node.isLeaf) {
            const width = getNodeWidth(node);
            subtreeWidths[nodeId] = width;
            return width;
        }
        const childrenWidth = node.childrenIds.reduce((sum, childId) => sum + calculateSubtreeWidth(childId), 0);
        const totalChildrenWidth = childrenWidth + Math.max(0, node.childrenIds.length - 1) * minSpacing;
        const width = Math.max(getNodeWidth(node), totalChildrenWidth);
        subtreeWidths[nodeId] = width;
        return width;
    }

    calculateSubtreeWidth(currentRootId);

    function positionNodes(nodeId: string, depth: number, xMin: number, xMax: number) {
        const node = positionedNodes[nodeId];
        node.y = depth * 100 + 50;
        node.x = xMin + (xMax - xMin) / 2; // Position parent first.

        if (node.isLeaf) {
            return;
        }

        const totalChildrenWidth = node.childrenIds.reduce((sum, cid) => sum + subtreeWidths[cid], 0) + Math.max(0, node.childrenIds.length - 1) * minSpacing;
        let currentX = node.x - totalChildrenWidth / 2; // Center children block under parent.
        
        node.childrenIds.forEach(childId => {
            const childWidth = subtreeWidths[childId];
            positionNodes(childId, depth + 1, currentX, currentX + childWidth);
            currentX += childWidth + minSpacing;
        });
    }
    
    const rootSubtreeWidth = subtreeWidths[currentRootId];
    const startX = (WIDTH - rootSubtreeWidth) / 2;
    positionNodes(currentRootId, 0, startX, startX + rootSubtreeWidth);

    return positionedNodes;
};


const generateSearchSteps = (key: number, initialNodes: { [id: string]: BTreeNodeData }, rootId: string | null, t: number): BTreeAlgorithmStep[] => {
    const steps: BTreeAlgorithmStep[] = [];
    if (rootId === null) {
        steps.push({ nodes: {}, rootId: null, message: `Árvore vazia. Chave ${key} não encontrada.`, t });
        return steps;
    }

    const addStep = (nodes: { [id: string]: BTreeNodeData }, message: string) => {
        steps.push({ nodes: layoutTree(nodes, rootId), rootId, message, t });
    };
    
    let currentNodes = cloneNodes(initialNodes);

    let currentId: string | null = rootId;
    const path: string[] = [];
    
    while(currentId !== null) {
        // Create a fresh copy for highlighting
        const displayNodes = cloneNodes(currentNodes);
        path.forEach(id => displayNodes[id].nodeHighlight = 'search-path');
        const node = displayNodes[currentId];
        node.nodeHighlight = 'current';
        addStep(displayNodes, `Buscando no nó ${currentId}.`);

        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) {
            node.keyHighlights = {[i]: 'search-compare'};
            addStep(displayNodes, `Comparando ${key} > ${node.keys[i]}.`);
            delete node.keyHighlights;
            i++;
        }

        if (i < node.keys.length && key === node.keys[i]) {
            node.keyHighlights = {[i]: 'found'};
            addStep(displayNodes, `Chave ${key} encontrada no nó ${currentId}!`);
            return steps;
        }

        if (node.isLeaf) {
            addStep(displayNodes, `Nó folha alcançado. Chave ${key} não encontrada.`);
            return steps;
        } else {
             if (i < node.keys.length) {
                node.keyHighlights = {[i]: 'search-compare'};
                addStep(displayNodes, `Comparando ${key} < ${node.keys[i]}. Seguindo o filho ${i}.`);
             } else {
                addStep(displayNodes, `Chave ${key} é maior que todas as chaves. Seguindo o filho ${i}.`);
             }
            path.push(currentId);
            currentId = node.childrenIds[i];
        }
    }
    return steps;
}


const generateInsertSteps = (key: number, initialNodes: { [id: string]: BTreeNodeData }, initialRootId: string | null, t: number): BTreeAlgorithmStep[] => {
    const steps: BTreeAlgorithmStep[] = [];
    let nodes = cloneNodes(initialNodes);
    let rootId = initialRootId;

    const addStep = (message: string, tempNodes = nodes) => {
        steps.push({ nodes: layoutTree(tempNodes, rootId), rootId, message, t });
    };

    const splitChild = (parentId: string, childIndex: number) => {
        const parent = nodes[parentId];
        const childToSplitId = parent.childrenIds[childIndex];
        const childToSplit = nodes[childToSplitId];
        
        let tempNodes = cloneNodes(nodes);
        tempNodes[childToSplitId].nodeHighlight = 'split-target';
        tempNodes[parentId].nodeHighlight = 'current';
        addStep(`Dividindo filho cheio (nó ${childToSplitId})`, tempNodes);
        
        tempNodes[childToSplitId].keyHighlights = {[t - 1]: 'split-median'};
        addStep(`Chave mediana ${childToSplit.keys[t - 1]} será promovida.`, tempNodes);

        const newSiblingId = getUniqueId();
        const medianKey = childToSplit.keys[t - 1];
        const newSibling: BTreeNodeData = { id: newSiblingId, keys: childToSplit.keys.slice(t), childrenIds: [], isLeaf: childToSplit.isLeaf, x:0, y:0, nodeHighlight: 'new-node' };
        childToSplit.keys = childToSplit.keys.slice(0, t - 1);
        
        if (!childToSplit.isLeaf) {
            newSibling.childrenIds = childToSplit.childrenIds.slice(t);
            childToSplit.childrenIds = childToSplit.childrenIds.slice(0, t);
        }
        
        parent.keys.splice(childIndex, 0, medianKey);
        parent.childrenIds.splice(childIndex + 1, 0, newSiblingId);
        nodes[newSiblingId] = newSibling;
        
        addStep(`Chave ${medianKey} promovida. Novo nó ${newSiblingId} criado.`, nodes);
    };

    const insertNonFull = (nodeId: string, keyToInsert: number) => {
        let currentDisplayNodes = cloneNodes(nodes);
        currentDisplayNodes[nodeId].nodeHighlight = 'search-path';
        addStep(`Descendo para inserir ${keyToInsert}. Nó atual: ${nodeId}.`, currentDisplayNodes);

        const node = nodes[nodeId];
        let i = node.keys.length - 1;
        
        if (node.isLeaf) {
            while (i >= 0 && keyToInsert < node.keys[i]) {
                currentDisplayNodes = cloneNodes(nodes);
                currentDisplayNodes[nodeId].nodeHighlight = 'search-path';
                currentDisplayNodes[nodeId].keyHighlights = {[i]: 'search-compare'};
                addStep(`Comparando ${keyToInsert} < ${node.keys[i]}`, currentDisplayNodes);
                i--;
            }
            node.keys.splice(i + 1, 0, keyToInsert);
            
            currentDisplayNodes = cloneNodes(nodes);
            currentDisplayNodes[nodeId].nodeHighlight = 'search-path';
            currentDisplayNodes[nodeId].keyHighlights = {[i + 1]: 'new'};
            addStep(`Inserindo ${keyToInsert} na folha ${nodeId}.`, currentDisplayNodes);

        } else {
            while (i >= 0 && keyToInsert < node.keys[i]) {
                currentDisplayNodes = cloneNodes(nodes);
                currentDisplayNodes[nodeId].nodeHighlight = 'search-path';
                currentDisplayNodes[nodeId].keyHighlights = {[i]: 'search-compare'};
                addStep(`Comparando ${keyToInsert} < ${node.keys[i]}`, currentDisplayNodes);
                i--;
            }
            i++;
            
            const childId = node.childrenIds[i];
            if (nodes[childId].keys.length === 2 * t - 1) {
                splitChild(nodeId, i);
                if (keyToInsert > nodes[nodeId].keys[i]) {
                    i++;
                }
            }
            insertNonFull(node.childrenIds[i], keyToInsert);
        }
    };
    
    if (rootId === null) {
        rootId = getUniqueId();
        nodes[rootId] = { id: rootId, keys: [key], childrenIds: [], isLeaf: true, x: 0, y: 0 };
        addStep(`Árvore vazia. Criando raiz com a chave ${key}.`);
        return steps;
    }

    if (nodes[rootId].keys.length === 2 * t - 1) {
        const oldRootId = rootId;
        const oldRoot = nodes[oldRootId];
        oldRoot.nodeHighlight = 'full';
        addStep(`Raiz está cheia e precisa ser dividida antes da inserção.`, nodes);

        const newRootId = getUniqueId();
        rootId = newRootId;
        nodes[rootId] = { id: newRootId, keys: [], childrenIds: [oldRootId], isLeaf: false, x: 0, y: 0 };
        
        splitChild(newRootId, 0);
        addStep(`Nova raiz ${newRootId} criada. Inserindo ${key} na árvore atualizada.`);
        insertNonFull(newRootId, key);
    } else {
        insertNonFull(rootId, key);
    }
    
    // Clear highlights on final step
    const finalNodes = cloneNodes(nodes);
    Object.values(finalNodes).forEach(n => {
        delete n.nodeHighlight;
        delete n.keyHighlights;
    });
    addStep(`Inserção da chave ${key} concluída.`, finalNodes);
    return steps;
}


export const useBTree = (initialT: number) => {
    const [t, setT] = useState(initialT);
    const [steps, setSteps] = useState<BTreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const reset = useCallback(() => {
        setIsPlaying(false);
        nodeIdCounter = 0; // Reset counter for deterministic ids

        const allSteps: BTreeAlgorithmStep[] = [];
        let lastNodes: { [id: string]: BTreeNodeData } = {};
        let lastRootId: string | null = null;
        
        allSteps.push({ nodes: {}, rootId: null, message: 'Iniciando com uma árvore vazia.', t });
        
        const numKeysToInsert = 2 * t + 1;
        const initialKeys = Array.from({length: numKeysToInsert}, (_, i) => (i + 1) * 10);

        for (const key of initialKeys) {
            const insertSteps = generateInsertSteps(key, lastNodes, lastRootId, t);
            const lastStepOfInsert = insertSteps[insertSteps.length - 1];
            if (lastStepOfInsert) {
                allSteps.push(...insertSteps);
                lastNodes = lastStepOfInsert.nodes;
                lastRootId = lastStepOfInsert.rootId;
            }
        }
        
        if (allSteps.length > 1) {
            const finalState = allSteps[allSteps.length - 1];
            const finalNodes = cloneNodes(finalState.nodes);
            Object.values(finalNodes).forEach(n => {
                delete n.nodeHighlight;
                delete n.keyHighlights;
            });
            const finalMessage = `Árvore de exemplo criada com ${initialKeys.length} chaves.`;
            allSteps.push({ ...finalState, nodes: finalNodes, message: finalMessage });
        }
        
        setSteps(allSteps);
        setCurrentStepIndex(0); // Start animation from the beginning
    }, [t]);

    const startAnimation = (newSteps: BTreeAlgorithmStep[]) => {
        if(!newSteps || newSteps.length === 0) return;
        
        const currentLastStep = steps[currentStepIndex];
        const initialAnimationSteps = currentLastStep ? [{...currentLastStep, message: newSteps[0].message}] : [];

        const animationSequence = [...initialAnimationSteps, ...newSteps];
        setSteps(animationSequence);
        setCurrentStepIndex(0); // Start animation from the beginning
        setIsPlaying(true);
    };

    const insert = (key: number) => {
        if (isPlaying) return;
        const lastStep = steps[currentStepIndex];
        if (!lastStep) {
            startAnimation(generateInsertSteps(key, {}, null, t));
            return;
        }
        
        const keyExists = Object.values(lastStep.nodes).some(n => n.keys.includes(key));
        if (keyExists) {
             const searchSteps = generateSearchSteps(key, lastStep.nodes, lastStep.rootId, t);
             startAnimation(searchSteps);
            return;
        }
        
        const newAnimationSteps = generateInsertSteps(key, lastStep.nodes, lastStep.rootId, t);
        startAnimation(newAnimationSteps);
    };
    
    const search = (key: number) => {
        if (isPlaying) return;
        const lastStep = steps[currentStepIndex];
        if (!lastStep) return;
        
        const newAnimationSteps = generateSearchSteps(key, lastStep.nodes, lastStep.rootId, t);
        startAnimation(newAnimationSteps);
    }
    
    useEffect(() => {
        reset();
    }, [t]);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            if(isPlaying) setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), MAX_SPEED - speed + MIN_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length, speed]);
    
    const togglePlayPause = () => setIsPlaying(!isPlaying);
    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);
    const handleTChange = (newT: number) => { if(!isPlaying) setT(newT); };
    
    const step = useMemo(() => steps[currentStepIndex] || {
        nodes: {}, rootId: null, message: 'Configure e inicie.', t: t
    }, [steps, currentStepIndex, t]);
    
    return {
        step,
        isPlaying,
        speed,
        t,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleTChange, insert, search }
    };
};