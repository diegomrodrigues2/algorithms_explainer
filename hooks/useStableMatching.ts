import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StableMatchingStep, ProposerId, ReceiverId, Engagements } from '../types';

const INITIAL_SPEED = 500;
const MIN_SPEED = 50;
const MAX_SPEED = 1500;

const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const useStableMatching = (initialNumPairs: number) => {
    const [numPairs, setNumPairs] = useState(initialNumPairs);
    const [steps, setSteps] = useState<StableMatchingStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((n: number) => {
        const newSteps: StableMatchingStep[] = [];
        
        // Generate participants and preferences
        const proposersList = Array.from({ length: n }, (_, i) => `M${i + 1}`);
        const receiversList = Array.from({ length: n }, (_, i) => `W${i + 1}`);

        const proposerPreferences: { [id: string]: string[] } = {};
        proposersList.forEach(p => {
            proposerPreferences[p] = shuffle(receiversList);
        });

        const receiverRankings: { [id: string]: { [propId: string]: number } } = {};
        receiversList.forEach(r => {
            const shuffledProposers = shuffle(proposersList);
            receiverRankings[r] = {};
            shuffledProposers.forEach((p, rank) => {
                receiverRankings[r][p] = rank;
            });
        });

        const proposers = proposersList.map(id => ({ id, preferences: proposerPreferences[id] }));
        const receivers = receiversList.map(id => ({ id, rankings: receiverRankings[id] }));

        let freeProposers: ProposerId[] = [...proposersList];
        const engagements: Engagements = {};
        const nextProposalIndex: { [proposerId: string]: number } = {};
        proposersList.forEach(p => nextProposalIndex[p] = 0);

        const addStep = (message: string, highlights: any) => {
            newSteps.push({
                proposers,
                receivers,
                engagements: { ...engagements },
                freeProposers: [...freeProposers],
                highlights,
                message,
            });
        };

        addStep("Início: Todos os proponentes estão livres.", { proposers: {}, receivers: {} });

        while (freeProposers.length > 0) {
            const proposerId = freeProposers.shift()!;
            
            if (nextProposalIndex[proposerId] >= n) {
                // Should not happen in classic Gale-Shapley with complete lists
                continue;
            }

            const receiverId = proposerPreferences[proposerId][nextProposalIndex[proposerId]];
            nextProposalIndex[proposerId]++;

            addStep(`${proposerId} propõe para ${receiverId}.`, {
                proposers: { [proposerId]: 'proposing' },
                receivers: { [receiverId]: 'considering' },
                proposalLine: { from: proposerId, to: receiverId },
            });

            const currentPartner = engagements[receiverId];

            if (!currentPartner) {
                engagements[receiverId] = proposerId;
                addStep(`${receiverId} está livre e aceita ${proposerId}.`, {
                    proposers: { [proposerId]: 'engaged' },
                    receivers: { [receiverId]: 'engaged' },
                    proposalLine: { from: proposerId, to: receiverId, success: true },
                });
            } else {
                const currentPartnerRank = receiverRankings[receiverId][currentPartner];
                const newProposerRank = receiverRankings[receiverId][proposerId];

                if (newProposerRank < currentPartnerRank) {
                    engagements[receiverId] = proposerId;
                    freeProposers.push(currentPartner);
                    addStep(`${receiverId} prefere ${proposerId} a ${currentPartner}. ${currentPartner} está livre agora.`, {
                        proposers: { [proposerId]: 'engaged', [currentPartner]: 'rejected' },
                        receivers: { [receiverId]: 'engaged' },
                        proposalLine: { from: proposerId, to: receiverId, success: true },
                    });
                } else {
                    freeProposers.push(proposerId);
                    addStep(`${receiverId} rejeita ${proposerId}.`, {
                        proposers: { [proposerId]: 'rejected' },
                        receivers: { [receiverId]: 'engaged' },
                        proposalLine: { from: proposerId, to: receiverId, rejected: true },
                    });
                }
            }
        }
        
        addStep("Finalizado: Todos estão emparelhados de forma estável.", { proposers: {}, receivers: {}, proposalLine: undefined });

        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);

    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(numPairs);
    }, [numPairs, generateSteps]);

    useEffect(() => {
        reset();
    }, [numPairs]);

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

    const handleNumPairsChange = (newSize: number) => {
        if (isPlaying) return;
        setNumPairs(newSize);
    };

    const handleSpeedChange = (newSpeed: number) => setSpeed(newSpeed);

    const currentStepData = useMemo(() => steps[currentStepIndex] || {
        proposers: [], receivers: [], engagements: {}, freeProposers: [], highlights: { proposers: {}, receivers: {} }, message: 'Configure e inicie.'
    }, [steps, currentStepIndex]);
    
    return {
        step: currentStepData,
        numPairs,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleNumPairsChange, handleSpeedChange }
    };
};
