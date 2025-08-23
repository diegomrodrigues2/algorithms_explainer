import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const OBSTTabulatedExplanation = () => {
    const pythonImplementation = `def obst_tabulation(freq):
    n = len(freq)
    cost = [[0.0] * n for _ in range(n)]
    root = [[-1] * n for _ in range(n)]

    # prefixos para somas rápidas
    prefix = [0.0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + freq[i]

    def interval_sum(i, j):
        return prefix[j + 1] - prefix[i]

    # intervalos de comprimento 0 (uma chave)
    for i in range(n):
        cost[i][i] = freq[i]
        root[i][i] = i

    # comprimentos crescentes
    for length in range(2, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            cost[i][j] = float("inf")
            total = interval_sum(i, j)
            # testar todas as raízes
            for r in range(i, j + 1):
                left = cost[i][r - 1] if r > i else 0.0
                right = cost[r + 1][j] if r < j else 0.0
                candidate = left + right + total
                if candidate < cost[i][j]:
                    cost[i][j] = candidate
                    root[i][j] = r

    return cost[0][n - 1], root`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌳 Árvores de Busca Ótimas (Tabulação)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O problema da OBST: dado um conjunto ordenado de chaves `keys[i..j]` com frequências de acesso `freq[i..j]`, construir uma BST que minimize o custo esperado de busca. A solução tabular preenche `OptCost[i][j]` (custo mínimo) e `Root[i][j]` (raiz ótima) em ordem crescente do comprimento `L = j - i`.
            </p>

            <SubTitle>Detalhes da Abordagem</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: intervalo `[i, j]` de chaves ordenadas</ListItem>
                <ListItem><strong>Tabela</strong>: `cost[i][j]` = custo mínimo do intervalo; `root[i][j]` opcional para reconstrução</ListItem>
                <ListItem><strong>Preenchimento</strong>: por comprimento do intervalo `L = 0..n-1`</ListItem>
                <ListItem><strong>Transições</strong>: `cost[i][j] = min_r( cost[i][r-1] + cost[r+1][j] ) + sum(freq[i..j])` para `r ∈ [i..j]`</ListItem>
                <ListItem><strong>Complexidade</strong>: O(n³) tempo e O(n²) espaço; otimização de Knuth-Yao reduz para O(n²)</ListItem>
            </ul>

            <SectionTitle>Implementação Essencial (Tabulação O(n³))</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Observação sobre Otimização (Knuth-Yao)</SubTitle>
            <p className="text-slate-300">
                Quando as condições de quadrângulo e monotonicidade são satisfeitas, o argmin de `root[i][j]` é monotônico: `root[i][j-1] ≤ root[i][j] ≤ root[i+1][j]`, permitindo restringir o loop de `r` e obter O(n²).
            </p>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Somas Prefixadas</strong>: Essenciais para manter a recorrência O(1) por raiz candidata.</ListItem>
                <ListItem><strong>Preenchimento por Comprimento</strong>: Garante que subintervalos menores já estejam resolvidos.</ListItem>
                <ListItem><strong>Armazenamento de Root</strong>: Permite reconstruir a árvore ótima sem backtracking caro.</ListItem>
            </ul>
        </div>
    );
};

export default OBSTTabulatedExplanation;
