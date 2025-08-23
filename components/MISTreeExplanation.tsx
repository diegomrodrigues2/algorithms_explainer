import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const MISTreeExplanation = () => {
    const pythonGeneral = `def mis_tree(n: int, adj: List[List[int]], root: int = 0) -> int:
    take = [0] * n
    skip = [0] * n

    def dfs(u: int, parent: int) -> None:
        take_u = 1
        skip_u = 0
        for v in adj[u]:
            if v == parent:
                continue
            dfs(v, u)
            take_u += skip[v]
            skip_u += max(take[v], skip[v])
        take[u] = take_u
        skip[u] = skip_u

    dfs(root, -1)
    return max(take[root], skip[root])`;

    const pythonBinary = `class Node:
    def __init__(self, val: int, left: 'Node' = None, right: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right

def mis_binary_tree(root: Node) -> int:
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(node: Node, take_parent: bool) -> int:
        if node is None:
            return 0
        # se tomamos o pai, não podemos tomar o node
        if take_parent:
            return dp(node.left, False) + dp(node.right, False)
        # caso contrário, escolhemos o melhor entre tomar ou pular
        take_here = 1 + dp(node.left, True) + dp(node.right, True)
        skip_here = dp(node.left, False) + dp(node.right, False)
        return max(take_here, skip_here)

    return dp(root, False)`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧩 Conjunto Independente Máximo (MIS) em Árvores</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Em uma árvore, um <strong>conjunto independente</strong> é um conjunto de vértices onde não há arestas entre quaisquer dois vértices do conjunto. O objetivo é encontrar o conjunto independente de maior tamanho possível (MIS).
            </p>
            <p className="text-slate-300 mt-2">
                Em árvores, este problema pode ser resolvido eficientemente usando Programação Dinâmica com uma travessia em pós-ordem (DFS). Para cada nó `u`, computamos dois valores: `take[u]` (o MIS da subárvore incluindo `u`) e `skip[u]` (o MIS da subárvore excluindo `u`).
            </p>

            <SectionTitle>🧠 Formulação de PD em Árvores</SectionTitle>
            <SubTitle>Estado por Nó `u`</SubTitle>
            <ul className="list-disc list-inside space-y-3 text-slate-300">
                <ListItem>
                    <strong>`take[u]` (Incluir `u`)</strong>: Se incluirmos o nó `u` no conjunto, não podemos incluir nenhum de seus filhos. Portanto, o valor é 1 (para o próprio `u`) somado aos MIS das subárvores de seus filhos, <span className="font-bold text-amber-400">excluindo</span> os filhos.
                    <CodeBlock>take[u] = 1 + Σ skip[v] para cada filho v de u</CodeBlock>
                </ListItem>
                 <ListItem>
                    <strong>`skip[u]` (Excluir `u`)</strong>: Se excluirmos o nó `u`, temos a liberdade de escolher a melhor opção para cada subárvore de seus filhos: ou incluímos o filho (`take[v]`) ou não (`skip[v]`).
                    <CodeBlock>skip[u] = Σ max(take[v], skip[v]) para cada filho v de u</CodeBlock>
                </ListItem>
                <ListItem>
                    <strong>Resposta Final</strong>: Para a árvore inteira, a resposta é o melhor resultado para a raiz, seja incluindo-a ou não.
                     <CodeBlock>max(take[root], skip[root])</CodeBlock>
                </ListItem>
            </ul>
            <p className="text-slate-300 mt-2"><strong>Complexidade:</strong> O(n) em tempo e espaço, pois visitamos cada nó e aresta uma vez.</p>

            <SectionTitle>🔧 Implementação Essencial (Árvore Geral)</SectionTitle>
            <CodeBlock>{pythonGeneral}</CodeBlock>

            <SectionTitle>🌿 Implementação para Árvore Binária</SectionTitle>
            <CodeBlock>{pythonBinary}</CodeBlock>
            
        </div>
    );
};

export default MISTreeExplanation;
