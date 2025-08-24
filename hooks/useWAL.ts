
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WALAlgorithmStep, WALRecord, BTreeNodeData } from '../types';

const ANIMATION_SPEED = 800;
const T_DEGREE = 2; // Fixed degree for simplicity
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
        if (subtreeWidths[nodeId]) return subtreeWidths[nodeId];
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
        node.x = xMin + (xMax - xMin) / 2;
        if (node.isLeaf) return;
        const totalChildrenWidth = node.childrenIds.reduce((sum, cid) => sum + subtreeWidths[cid], 0) + Math.max(0, node.childrenIds.length - 1) * minSpacing;
        let currentX = node.x - totalChildrenWidth / 2;
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


export const useWAL = () => {
    const [wal, setWal] = useState<WALRecord[]>([]);
    const [btreeState, setBtreeState] = useState<{ nodes: { [id: string]: BTreeNodeData }, rootId: string | null }>({ nodes: {}, rootId: null });
    const [lsn, setLsn] = useState(0);

    const [steps, setSteps] = useState<WALAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const runSteps = (newSteps: WALAlgorithmStep[]) => {
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
    };

    const insert = useCallback((key: number) => {
        if (isPlaying) return;
        const newSteps: WALAlgorithmStep[] = [];
        const t = T_DEGREE;
        
        const newLsn = lsn + 1;
        const newRecord: WALRecord = { lsn: newLsn, op: 'insert', key };
        const updatedWal = [...wal, newRecord];

        newSteps.push({ wal, btreeNodes: btreeState.nodes, btreeRootId: btreeState.rootId, message: `Preparando para registrar a operação insert(${key})...`, highlights: {}, phase: 'logging' });
        newSteps.push({ wal: updatedWal, btreeNodes: btreeState.nodes, btreeRootId: btreeState.rootId, message: `Registro LSN ${newLsn} gravado no WAL.`, highlights: { walIndex: wal.length }, phase: 'logging' });

        // Apply to B-Tree (simplified, non-animated logic)
        let newNodes = cloneNodes(btreeState.nodes);
        let newRootId = btreeState.rootId;

        const splitChild = (parentId: string, childIndex: number) => {
            const parent = newNodes[parentId];
            const childToSplitId = parent.childrenIds[childIndex];
            const childToSplit = newNodes[childToSplitId];
            const newSiblingId = getUniqueId();
            const medianKey = childToSplit.keys[t - 1];
            const newSibling: BTreeNodeData = { id: newSiblingId, keys: childToSplit.keys.slice(t), childrenIds: [], isLeaf: childToSplit.isLeaf, x:0, y:0 };
            childToSplit.keys = childToSplit.keys.slice(0, t - 1);
            if (!childToSplit.isLeaf) {
                newSibling.childrenIds = childToSplit.childrenIds.slice(t);
                childToSplit.childrenIds = childToSplit.childrenIds.slice(0, t);
            }
            parent.keys.splice(childIndex, 0, medianKey);
            parent.childrenIds.splice(childIndex + 1, 0, newSiblingId);
            newNodes[newSiblingId] = newSibling;
        };

        const insertNonFull = (nodeId: string, keyToInsert: number) => {
            const node = newNodes[nodeId];
            let i = node.keys.length - 1;
            if (node.isLeaf) {
                while (i >= 0 && keyToInsert < node.keys[i]) i--;
                node.keys.splice(i + 1, 0, keyToInsert);
            } else {
                while (i >= 0 && keyToInsert < node.keys[i]) i--;
                i++;
                const childId = node.childrenIds[i];
                if (newNodes[childId].keys.length === 2 * t - 1) {
                    splitChild(nodeId, i);
                    if (keyToInsert > newNodes[nodeId].keys[i]) i++;
                }
                insertNonFull(node.childrenIds[i], keyToInsert);
            }
        };

        if (newRootId === null) {
            newRootId = getUniqueId();
            newNodes[newRootId] = { id: newRootId, keys: [key], childrenIds: [], isLeaf: true, x: 0, y: 0 };
        } else {
            if (newNodes[newRootId].keys.length === 2 * t - 1) {
                const oldRootId = newRootId;
                const newRootId_ = getUniqueId();
                newRootId = newRootId_;
                newNodes[newRootId] = { id: newRootId, keys: [], childrenIds: [oldRootId], isLeaf: false, x: 0, y: 0 };
                splitChild(newRootId, 0);
                insertNonFull(newRootId, key);
            } else {
                insertNonFull(newRootId, key);
            }
        }
        
        setLsn(newLsn);
        setWal(updatedWal);
        setBtreeState({ nodes: newNodes, rootId: newRootId });

        newSteps.push({ wal: updatedWal, btreeNodes: layoutTree(newNodes, newRootId), btreeRootId: newRootId, message: `Operação insert(${key}) aplicada na B-Tree.`, highlights: {}, phase: 'applying' });
        runSteps(newSteps);

    }, [isPlaying, lsn, wal, btreeState]);
    
    const recover = useCallback(() => {
        if(isPlaying || wal.length === 0) return;
        const newSteps: WALAlgorithmStep[] = [];
        const t = T_DEGREE;

        newSteps.push({ wal, btreeNodes: {}, btreeRootId: null, message: "Simulando falha. Limpando B-Tree em memória.", highlights: {}, phase: 'recovery_read' });

        let recoveredNodes: { [id: string]: BTreeNodeData } = {};
        let recoveredRootId: string | null = null;
        
        for(let i=0; i<wal.length; i++) {
            const record = wal[i];
            newSteps.push({ wal, btreeNodes: layoutTree(recoveredNodes, recoveredRootId), btreeRootId: recoveredRootId, message: `Recuperação: Lendo LSN ${record.lsn} do WAL.`, highlights: { walIndex: i }, phase: 'recovery_read' });
            
            // Re-apply logic (same as insert logic)
            insertNonFull(record.key);

            newSteps.push({ wal, btreeNodes: layoutTree(recoveredNodes, recoveredRootId), btreeRootId: recoveredRootId, message: `Recuperação: Reaplicando insert(${record.key}).`, highlights: { walIndex: i }, phase: 'recovery_apply' });
        }

        function insertNonFull(key: number) {
            if (recoveredRootId === null) {
                recoveredRootId = getUniqueId();
                recoveredNodes[recoveredRootId] = { id: recoveredRootId, keys: [key], childrenIds: [], isLeaf: true, x: 0, y: 0 };
                return;
            }
             if (recoveredNodes[recoveredRootId].keys.length === 2 * t - 1) {
                const oldRootId = recoveredRootId;
                const newRootId_ = getUniqueId();
                recoveredRootId = newRootId_;
                recoveredNodes[recoveredRootId] = { id: recoveredRootId, keys: [], childrenIds: [oldRootId], isLeaf: false, x: 0, y: 0 };
                splitChild(recoveredRootId, 0);
                _insert(recoveredRootId, key);
            } else {
                _insert(recoveredRootId, key);
            }
        }
        function _insert(nodeId: string, keyToInsert: number) {
            const node = recoveredNodes[nodeId];
            let i = node.keys.length - 1;
            if (node.isLeaf) {
                while (i >= 0 && keyToInsert < node.keys[i]) i--;
                node.keys.splice(i + 1, 0, keyToInsert);
            } else {
                while (i >= 0 && keyToInsert < node.keys[i]) i--;
                i++;
                const childId = node.childrenIds[i];
                if (recoveredNodes[childId].keys.length === 2 * t - 1) {
                    splitChild(nodeId, i);
                    if (keyToInsert > recoveredNodes[nodeId].keys[i]) i++;
                }
                _insert(node.childrenIds[i], keyToInsert);
            }
        }
         function splitChild(parentId: string, childIndex: number) {
            const parent = recoveredNodes[parentId];
            const childToSplitId = parent.childrenIds[childIndex];
            const childToSplit = recoveredNodes[childToSplitId];
            const newSiblingId = getUniqueId();
            const medianKey = childToSplit.keys[t - 1];
            const newSibling: BTreeNodeData = { id: newSiblingId, keys: childToSplit.keys.slice(t), childrenIds: [], isLeaf: childToSplit.isLeaf, x:0, y:0 };
            childToSplit.keys = childToSplit.keys.slice(0, t - 1);
            if (!childToSplit.isLeaf) {
                newSibling.childrenIds = childToSplit.childrenIds.slice(t);
                childToSplit.childrenIds = childToSplit.childrenIds.slice(0, t);
            }
            parent.keys.splice(childIndex, 0, medianKey);
            parent.childrenIds.splice(childIndex + 1, 0, newSiblingId);
            recoveredNodes[newSiblingId] = newSibling;
        };

        newSteps.push({ wal, btreeNodes: layoutTree(recoveredNodes, recoveredRootId), btreeRootId: recoveredRootId, message: "Recuperação concluída.", highlights: {}, phase: 'idle' });
        
        setBtreeState({ nodes: recoveredNodes, rootId: recoveredRootId });
        runSteps(newSteps);

    }, [isPlaying, wal]);

    const reset = useCallback(() => {
        setIsPlaying(false);
        nodeIdCounter = 0;
        setLsn(0);
        setWal([]);
        setBtreeState({ nodes: {}, rootId: null });
        setSteps([{ wal: [], btreeNodes: {}, btreeRootId: null, message: "Sistema resetado. WAL e B-Tree estão vazios.", highlights: {}, phase: 'idle' }]);
        setCurrentStepIndex(0);
    }, []);

    useEffect(() => {
        if (!isPlaying || currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }
        const timer = setTimeout(() => setCurrentStepIndex(prev => prev + 1), ANIMATION_SPEED);
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length]);

    const currentStepData: WALAlgorithmStep = useMemo(() => steps[currentStepIndex] || {
        wal, btreeNodes: btreeState.nodes, btreeRootId: btreeState.rootId,
        message: 'Bem-vindo ao Write-Ahead Log!', highlights: {}, phase: 'idle'
    }, [steps, currentStepIndex, wal, btreeState]);
    
    return {
        step: currentStepData,
        isPlaying,
        actions: { insert, recover, reset }
    };
};
