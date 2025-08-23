import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const CoinChangeExplanation = () => {
    const pythonImplementation = `from typing import List

def coin_change_minimum_coins(coins: List[int], amount: int) -> int:
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for s in range(coin, amount + 1):
            dp[s] = min(dp[s], 1 + dp[s - coin])
    return dp[amount] if dp[amount] != INF else -1`;

    const pythonReconstruction = `from typing import List, Dict

def coin_change_reconstruct(coins: List[int], amount: int) -> List[int]:
    INF = amount + 1
    dp = [INF] * (amount + 1)
    parent = [-1] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for s in range(coin, amount + 1):
            if dp[s - coin] + 1 < dp[s]:
                dp[s] = dp[s - coin] + 1
                parent[s] = coin
    if dp[amount] >= INF:
        return []
    res: List[int] = []
    s = amount
    while s > 0:
        c = parent[s]
        res.append(c)
        s -= c
    return res  # multiconjunto de moedas`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🪙 Troco de Moedas (Tabulação)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Dado um conjunto de valores de moedas e um alvo `W`, queremos o menor número de moedas para somar `W`. É análogo à “Mochila Ilimitada”: cada moeda pode ser usada várias vezes. A abordagem tabular 1D mantém `dp[s]` como o mínimo de moedas para somar `s`.
            </p>

            <SubTitle>Desafio 34 · Problema de Troco de Moedas (Coin Change)</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Vínculo Conceitual</strong>: Erickson, Cap. 3, Exercício 1</ListItem>
                <ListItem><strong>Estado</strong>: `dp[s]` = mínimo de moedas para a soma `s`</ListItem>
                <ListItem><strong>Transição</strong>: para cada moeda `c` e soma `s ≥ c`: `dp[s] = min(dp[s], 1 + dp[s - c])`</ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(n·W), Espaço O(W) — `n` tipos de moedas, alvo `W`</ListItem>
            </ul>

            <SectionTitle>Implementação Essencial (1D)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Reconstrução de Solução (opcional)</SubTitle>
            <CodeBlock>{pythonReconstruction}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Ordem de Laços</strong>: Iterar moedas por fora e somas crescentes por dentro permite “reuso ilimitado” (unbounded) corretamente.</ListItem>
                <ListItem><strong>Impossibilidade</strong>: Usar um sentinela `INF` e checar `dp[amount]` evita falsos positivos.</ListItem>
                <ListItem><strong>Variações</strong>: Contagem de formas (ordem irrelevante), número de combinações, custos diferentes por moeda.</ListItem>
            </ul>
        </div>
    );
};

export default CoinChangeExplanation;