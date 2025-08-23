import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const MinCostTreeColoringExplanation = () => {
    const pythonDP = `from typing import List

def min_cost_tree_coloring(adj: List[List[int]], cost: List[List[int]], root: int = 0) -> int:
    n = len(adj)
    k = len(cost[0]) if n > 0 else 0
    dp = [[0] * k for _ in range(n)]

    def dfs(u: int, p: int) -> None:
        # Processa filhos primeiro (pós-ordem)
        for v in adj[u]:
            if v == p: continue
            dfs(v, u)
        
        # Calcula o custo para o nó u para cada cor
        for c in range(k):
            total_cost = cost[u][c]
            for v in adj[u]:
                if v == p: continue
                
                # Encontra o custo mínimo para o filho v com uma cor diferente
                min_child_cost = float('inf')
                for c2 in range(k):
                    if c2 != c:
                        min_child_cost = min(min_child_cost, dp[v][c2])
                total_cost += min_child_cost
            dp[u][c] = total_cost

    dfs(root, -1)
    return min(dp[root]) if n > 0 else 0`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎨 Coloração de Árvore com Custo Mínimo</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Dada uma árvore, `k` cores, e uma função de custo `cost[u][c]` para colorir o nó `u` com a cor `c`, o objetivo é colorir todos os nós minimizando o custo total, com a restrição de que vizinhos devem ter cores diferentes. A Programação Dinâmica em árvores resolve isso em tempo O(n·k²) com uma travessia em pós-ordem.
            </p>

            <SectionTitle>🧠 Formulação de DP</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: <code>dp[u][c]</code> = custo mínimo para a subárvore de <code>u</code> se <code>u</code> tem cor <code>c</code>.</ListItem>
                <ListItem><strong>Transição</strong>: <code>{"dp[u][c] = cost[u][c] + Σ_v min_{c'≠c} dp[v][c']"}</code> para cada filho <code>v</code> de <code>u</code>.</ListItem>
                <ListItem><strong>Resposta</strong>: <code>{"min_{c} dp[root][c]"}</code>.</ListItem>
                <ListItem><strong>Complexidade</strong>: O(n·k²) (ingênua). Com otimizações (guardando os dois menores custos por filho), pode-se reduzir para O(n·k).</ListItem>
            </ul>

            <SectionTitle>🔧 Implementação Essencial</SectionTitle>
            <CodeBlock>{pythonDP}</CodeBlock>

            <SectionTitle>♻️ Otimização para O(n·k)</SectionTitle>
            <p className="text-slate-300">
                Para cada filho `v`, pré-compute o menor e o segundo menor valores de `dp[v][*]` e a cor correspondente. Assim, ao agregar em `u` para uma cor `c`, some o menor custo do filho se a cor não conflitar, ou o segundo menor caso contrário. Isso reduz o loop interno de O(k) para O(1) por filho.
            </p>
        </div>
    );
};

export default MinCostTreeColoringExplanation;
