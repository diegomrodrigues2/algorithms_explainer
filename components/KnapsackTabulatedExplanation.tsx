import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const KnapsackTabulatedExplanation = () => {
    const python2D = `def knapsack_tabulation(values, weights, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        vi, wi = values[i - 1], weights[i - 1]
        for w in range(capacity + 1):
            if wi > w:
                dp[i][w] = dp[i - 1][w]
            else:
                dp[i][w] = max(
                    dp[i - 1][w],              # Não incluir o item
                    vi + dp[i - 1][w - wi]   # Incluir o item
                )
    return dp[n][capacity]`;

    const python1D = `def knapsack_tabulation_1d(values, weights, capacity):
    dp = [0] * (capacity + 1)
    for i in range(len(values)):
        vi, wi = values[i], weights[i]
        # Varredura reversa para respeitar 0/1
        for w in range(capacity, wi - 1, -1):
            dp[w] = max(dp[w], vi + dp[w - wi])
    return dp[capacity]`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎒 Mochila 0/1 (Tabulação)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                No problema da mochila 0/1, cada item pode ser escolhido no máximo uma vez. A formulação tabular preenche uma matriz `dp[i][w]` onde cada célula representa o valor máximo usando os primeiros `i` itens com capacidade `w`. É um exemplo clássico de PD com complexidade pseudo-polinomial O(n·W).
            </p>

            <SubTitle>Detalhes da Abordagem</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: `dp[i][w]` = valor máximo com os `i` primeiros itens e capacidade `w`.</ListItem>
                <ListItem><strong>Transição</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Se `weights[i-1] > w`: `dp[i][w] = dp[i-1][w]`</li>
                        <li>Caso contrário: `dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])`</li>
                    </ul>
                </ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(n·W), Espaço O(n·W) ou O(W).</ListItem>
            </ul>

            <SectionTitle>Implementação 2D</SectionTitle>
            <CodeBlock>{python2D}</CodeBlock>

            <SectionTitle>Otimização de Espaço (1D)</SectionTitle>
             <p className="text-slate-300">Como `dp[i]` só depende da linha anterior, podemos otimizar o espaço. A varredura de `w` deve ser decrescente para garantir que cada item seja usado no máximo uma vez.</p>
            <CodeBlock>{python1D}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Pseudo-Polinomial</strong>: O custo depende de `W`, que pode ser grande em termos de bits da entrada.</ListItem>
                <ListItem><strong>1D Correto</strong>: A varredura de `w` deve ser decrescente; usar crescente transformaria o problema em “unbounded knapsack”.</ListItem>
                <ListItem><strong>Reconstrução</strong>: Guardar decisões (ou fazer retrocesso em `dp`) permite listar itens escolhidos.</ListItem>
            </ul>
        </div>
    );
};

export default KnapsackTabulatedExplanation;