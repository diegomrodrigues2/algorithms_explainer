
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BPlusTreeAlgorithmStep, BPlusTreeNodeData } from '../types';

const INITIAL_SPEED = 500;
const ANIMATION_SPEED = 700;

const getInitialState = () => {
    const nodes: { [id: string]: BPlusTreeNodeData } = {
        'root': { id: 'root', keys: [6], isLeaf: false, childrenIds: ['leaf1', 'leaf2'], x: 600, y: 50 },
        'leaf1': { id: 'leaf1', keys: [1, 3, 5], values: ['A', 'B', 'C'], isLeaf: true, nextId: 'leaf2', x: 400, y: 150 },
        'leaf2': { id: 'leaf2', keys: [6, 8, 10], values: ['D', 'E', 'F'], isLeaf: true, nextId: 'leaf3', x: 700, y: 150 },
        'leaf3': { id: 'leaf3', keys: [12, 15], values: ['G', 'H'], isLeaf: true, nextId: null, x: 950, y: 150}
    };
    const rootId = 'root';
    return { nodes, rootId };
};


export const useBPlusTree = () => {
    const [startKey, setStartKey] = useState(3);
    const [endKey, setEndKey] = useState(8);

    const [steps, setSteps] = useState<BPlusTreeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        const { nodes, rootId } = getInitialState();
        const initialStep: BPlusTreeAlgorithmStep = {
            nodes,
            rootId,
            message: "Árvore B+ pronta. Insira um intervalo e clique em 'Buscar'.",
            startKey,
            endKey,
            result: [],
        };
        setSteps([initialStep]);
        setCurrentStepIndex(0);
    }, [startKey, endKey]);

    useEffect(() => {
        reset();
    }, []);

    const generateSteps = useCallback(() => {
        const newSteps: BPlusTreeAlgorithmStep[] = [];
        const { nodes, rootId } = getInitialState();
        const result: { key: number, value: string }[] = [];

        const addStep = (
            currentNodes: { [id: string]: BPlusTreeNodeData },
            message: string,
        ) => {
            newSteps.push({ nodes: JSON.parse(JSON.stringify(currentNodes)), rootId, message, startKey, endKey, result: [...result] });
        };

        if (rootId === null) {
            addStep(nodes, "Árvore está vazia.");
            return newSteps;
        }

        addStep(nodes, `Iniciando busca pelo intervalo [${startKey}, ${endKey}].`);

        // Phase 1: Search for the starting leaf
        let currentId: string | null = rootId;
        const path: string[] = [];
        
        while (currentId && !nodes[currentId].isLeaf) {
            path.push(currentId);
            const node = nodes[currentId];
            
            const tempNodes = JSON.parse(JSON.stringify(nodes));
            path.forEach(id => tempNodes[id].nodeHighlight = 'search-path');
            addStep(tempNodes, `Buscando no nó interno ${currentId}.`);
            
            let i = 0;
            while (i < node.keys.length && startKey >= node.keys[i]) {
                tempNodes[currentId].keyHighlights = { [i]: 'compare' };
                addStep(tempNodes, `Comparando ${startKey} >= ${node.keys[i]}.`);
                i++;
            }
            if (i < node.keys.length) {
                tempNodes[currentId].keyHighlights = { [i]: 'compare' };
                addStep(tempNodes, `Comparando ${startKey} < ${node.keys[i]}.`);
            }
            
            currentId = node.childrenIds![i];
        }

        if (!currentId) return newSteps; // Should not happen in a valid tree

        // Phase 2: Scan leaves
        const startLeafId = currentId;
        const tempNodes = JSON.parse(JSON.stringify(nodes));
        path.forEach(id => tempNodes[id].nodeHighlight = 'search-path');
        tempNodes[startLeafId].nodeHighlight = 'found-start';
        addStep(tempNodes, `Folha inicial encontrada (${startLeafId}). Iniciando varredura.`);

        let currentLeafId: string | null = startLeafId;
        while (currentLeafId) {
            const leaf = nodes[currentLeafId];
            
            const tempScanNodes = JSON.parse(JSON.stringify(nodes));
            tempScanNodes[currentLeafId].nodeHighlight = 'current-scan';
            addStep(tempScanNodes, `Escaneando a folha ${currentLeafId}.`);

            for (let i = 0; i < leaf.keys.length; i++) {
                const key = leaf.keys[i];
                const value = leaf.values![i];
                
                tempScanNodes[currentLeafId].keyHighlights = { [i]: 'compare' };
                addStep(tempScanNodes, `Verificando chave ${key}.`);
                
                if (key > endKey) {
                    tempScanNodes[currentLeafId].keyHighlights = { [i]: 'out-of-range' };
                    addStep(tempScanNodes, `Chave ${key} > ${endKey}. Fim da consulta.`);
                    currentLeafId = null; // End outer loop
                    break;
                }

                if (key >= startKey) {
                    result.push({ key, value });
                    tempScanNodes[currentLeafId].keyHighlights = { [i]: 'in-range' };
                    addStep(tempScanNodes, `Chave ${key} está no intervalo. Adicionada ao resultado.`);
                }
            }

            if (currentLeafId) {
                 const nextId = leaf.nextId;
                 if (nextId) {
                    const tempNextNodes = JSON.parse(JSON.stringify(nodes));
                    tempNextNodes[currentLeafId].nodeHighlight = 'next-link';
                    addStep(tempNextNodes, `Seguindo para a próxima folha (${nextId}).`);
                 } else {
                    addStep(nodes, `Fim da lista de folhas. Consulta concluída.`);
                 }
                currentLeafId = nextId;
            }
        }
        
        addStep(nodes, `Consulta finalizada. ${result.length} itens encontrados.`);
        return newSteps;
    }, [startKey, endKey]);


    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), ANIMATION_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length]);

    const search = () => {
        if(isPlaying) return;
        const newSteps = generateSteps();
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    };

    const step = useMemo(() => steps[currentStepIndex] || {
        nodes: getInitialState().nodes,
        rootId: getInitialState().rootId,
        message: 'Árvore B+ pronta.',
        startKey: startKey,
        endKey: endKey,
        result: []
    }, [steps, currentStepIndex, startKey, endKey]);

    return {
        step,
        isPlaying,
        actions: { 
            search, 
            reset,
            handleStartKeyChange: setStartKey,
            handleEndKeyChange: setEndKey,
        }
    };
};
