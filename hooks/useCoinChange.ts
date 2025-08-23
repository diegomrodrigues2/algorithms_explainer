import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CoinChangeAlgorithmStep } from '../types';

const INITIAL_SPEED = 300;
const MIN_SPEED = 10;
const MAX_SPEED = 1000;

export const useCoinChange = (initialCoins: string, initialAmount: number) => {
    const [coinsInput, setCoinsInput] = useState(initialCoins);
    const [amountInput, setAmountInput] = useState(initialAmount);
    const [steps, setSteps] = useState<CoinChangeAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const generateSteps = useCallback((coinsStr: string, amount: number) => {
        const coins = [...new Set(coinsStr.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c) && c > 0))].sort((a, b) => a - b);
        if (coins.length === 0 || amount < 0) {
            setSteps([]);
            return;
        }

        const newSteps: CoinChangeAlgorithmStep[] = [];
        const INF = amount + 1;
        const dp: (number|null)[] = Array(amount + 1).fill(null);
        const parent: (number|null)[] = Array(amount + 1).fill(null);
        
        dp.fill(INF);
        dp[0] = 0;

        const addStep = (message: string, highlights: any = {}, result: any = null) => {
            newSteps.push({
                coins, amount, dp: [...dp], parent: [...parent],
                message, result, highlights
            });
        };
        
        addStep("Inicializando dp[0]=0 e o resto como ∞.", { currentSum: 0 });

        for (let i = 0; i < coins.length; i++) {
            const coin = coins[i];
            addStep(`Processando a moeda: ${coin}`, { currentCoinIndex: i });
            for (let s = coin; s <= amount; s++) {
                addStep(`Verificando a soma ${s} com a moeda ${coin}.`, { currentCoinIndex: i, currentSum: s, sourceSum: s - coin });
                
                const prevSumVal = dp[s-coin];
                if (prevSumVal !== null && prevSumVal !== INF) {
                    if (prevSumVal + 1 < (dp[s] ?? INF)) {
                         const oldVal = dp[s];
                         addStep(
                            `Encontrado um caminho melhor para a soma ${s}: 1 + dp[${s - coin}] (${1 + prevSumVal}) < ${oldVal === INF ? '∞' : oldVal}`,
                            { currentCoinIndex: i, currentSum: s, sourceSum: s - coin }
                        );
                        dp[s] = 1 + prevSumVal;
                        parent[s] = coin;
                        addStep(
                            `dp[${s}] atualizado para ${dp[s]}.`,
                            { currentCoinIndex: i, currentSum: s }
                        );
                    } else {
                         addStep(
                            `Nenhuma melhoria para a soma ${s}. Mantendo ${dp[s] === INF ? '∞' : dp[s]}.`,
                            { currentCoinIndex: i, currentSum: s, sourceSum: s - coin }
                        );
                    }
                }
            }
        }
        
        const finalCount = dp[amount];
        if (finalCount === INF || finalCount === null) {
            addStep(`Finalizado. Não é possível formar a soma ${amount}.`, {}, { count: -1, combination: [] });
        } else {
            addStep(`Finalizado. Mínimo de moedas é ${finalCount}. Reconstruindo a combinação...`, {}, null);
            
            const combination: number[] = [];
            const pathIndices: number[] = [];
            let s = amount;
            while (s > 0) {
                pathIndices.push(s);
                const coinUsed = parent[s];
                if (coinUsed === null) break;
                combination.push(coinUsed);
                addStep(
                    `Reconstruindo: Para a soma ${s}, a moeda usada foi ${coinUsed}.`,
                    { pathIndices: [...pathIndices], currentSum: s, sourceSum: s - coinUsed }
                );
                s -= coinUsed;
            }
             pathIndices.push(0);
             addStep(
                `Combinação final: [${combination.join(', ')}]`,
                { pathIndices },
                { count: finalCount, combination }
            );
        }
        
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);
    }, []);
    
    const reset = useCallback(() => {
        setIsPlaying(false);
        generateSteps(coinsInput, amountInput);
    }, [coinsInput, amountInput, generateSteps]);
    
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
    const handleCoinsChange = (newCoins: string) => { if(!isPlaying) setCoinsInput(newCoins); }
    const handleAmountChange = (newAmount: number) => { if(!isPlaying) setAmountInput(Math.max(0, newAmount)); }

    const currentStepData = useMemo(() => {
        const coins = [...new Set(coinsInput.split(',').map(c => parseInt(c.trim())).filter(c => !isNaN(c) && c > 0))].sort((a, b) => a - b);
        return steps[currentStepIndex] || {
            coins, amount: amountInput, dp: [], parent: [],
            message: 'Configure e inicie.', result: null, highlights: {}
        }
    }, [steps, currentStepIndex, coinsInput, amountInput]);
    
    return {
        step: currentStepData,
        coinsInput,
        amountInput,
        speed,
        isPlaying,
        currentStep: currentStepIndex,
        totalSteps: steps.length > 0 ? steps.length - 1 : 0,
        actions: { reset, togglePlayPause, handleSpeedChange, handleCoinsChange, handleAmountChange }
    };
};