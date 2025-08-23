import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const MVCTreeExplanation = () => {
    const pythonGeneral = `from typing import List

def mvc_tree(n: int, adj: List[List[int]], root: int = 0) -> int:
    import sys
    sys.setrecursionlimit(10**6)

    take = [0] * n
    skip = [0] * n

    def dfs(u: int, parent: int) -> None:
        take_u = 1
        skip_u = 0
        for v in adj[u]:
            if v == parent:
                continue
            dfs(v, u)
            take_u += min(take[v], skip[v])
            skip_u += take[v]
        take[u] = take_u
        skip[u] = skip_u

    dfs(root, -1)
    return min(take[root], skip[root])`;
    
    const pythonBinary = `class Node:
    def __init__(self, val: int, left: 'Node' = None, right: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right

def mvc_binary_tree(root: Node) -> int:
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(node: Node, take_here: bool) -> int:
        if node is None:
            return 0
        if take_here:
            return 1 + min(dp(node.left, True), dp(node.left, False)) \\
                     + min(dp(node.right, True), dp(node.right, False))
        else:
            return dp(node.left, True) + dp(node.right, True)

    return min(dp(root, True), dp(root, False))`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧩 Cobertura de Vértices Mínima (MVC) em Árvores</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Uma <strong>cobertura de vértices</strong> é um conjunto de nós que "toca" (é incidente a) todas as arestas de um grafo. O objetivo é encontrar a cobertura de menor tamanho. Em árvores, a solução ótima pode ser obtida em O(n) via PD em pós-ordem, análoga ao MIS.
            </p>

            <SectionTitle>🧠 Formulação de PD em Árvores</SectionTitle>
            <SubTitle>Estado por Nó `u`</SubTitle>
            <ul className="list-disc list-inside space-y-3 text-slate-300">
                <ListItem>
                    <strong>`take[u]` (Incluir `u` na cobertura)</strong>: Se `u` está na cobertura, todas as arestas incidentes a `u` estão cobertas. Para as subárvores de seus filhos `v`, podemos escolher a opção de menor custo (incluir `v` ou não).
                    <CodeBlock>take[u] = 1 + Σ min(take[v], skip[v])</CodeBlock>
                </ListItem>
                 <ListItem>
                    <strong>`skip[u]` (Excluir `u` da cobertura)</strong>: Se `u` não está na cobertura, então, para cobrir a aresta `(u,v)`, cada filho `v` **deve** ser incluído na cobertura.
                    <CodeBlock>skip[u] = Σ take[v]</CodeBlock>
                </ListItem>
                <ListItem>
                    <strong>Resposta Final</strong>: O tamanho da MVC para a árvore é o mínimo entre incluir ou excluir a raiz.
                     <CodeBlock>min(take[root], skip[root])</CodeBlock>
                </ListItem>
            </ul>
            <p className="text-slate-300 mt-2"><strong>Complexidade:</strong> O(n) em tempo e espaço.</p>
            
            <SectionTitle>🔧 Implementação Essencial (Árvore Geral)</SectionTitle>
            <CodeBlock>{pythonGeneral}</CodeBlock>
            
            <SectionTitle>🌿 Implementação para Árvore Binária</SectionTitle>
            <CodeBlock>{pythonBinary}</CodeBlock>

            <SectionTitle>🔗 Relações Teóricas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Teorema de König (bipartidos)</strong>: Em grafos bipartidos (como árvores), o tamanho da MVC é igual ao tamanho do Emparelhamento Máximo (`|MVC| = |Matching Máximo|`).</ListItem>
                <ListItem><strong>Dualidade com MIS</strong>: Para qualquer grafo (e especialmente para árvores), o tamanho da MVC mais o tamanho do MIS é igual ao número total de vértices (`|MVC| + |MIS| = |V|`).</ListItem>
            </ul>
        </div>
    );
};

export default MVCTreeExplanation;
