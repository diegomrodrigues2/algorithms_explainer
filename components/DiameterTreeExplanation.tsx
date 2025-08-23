import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const DiameterTreeExplanation = () => {
    const pythonDP = `from typing import Optional, Tuple

class Node:
    def __init__(self, val: int, left: 'Node' = None, right: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right

def diameter_binary_tree(root: Optional[Node]) -> int:
    # retorna diâmetro em arestas
    def dfs(node: Optional[Node]) -> Tuple[int, int]:
        # retorna (altura, diametro) para a subárvore de node
        if node is None:
            return 0, 0
        hl, dl = dfs(node.left)
        hr, dr = dfs(node.right)
        height = 1 + max(hl, hr)
        through = hl + hr  # arestas no caminho passando pelo node
        diam = max(dl, dr, through)
        return height, diam

    _, d = dfs(root)
    return d`;

    const pythonTwoSearches = `from typing import List, Tuple

def tree_diameter(adj: List[List[int]], start: int = 0) -> int:
    n = len(adj)

    def farthest(src: int) -> Tuple[int, int]:
        dist = [-1] * n
        stack = [src]
        dist[src] = 0
        order = []
        while stack:
            u = stack.pop()
            order.append(u)
            for v in adj[u]:
                if dist[v] == -1:
                    dist[v] = dist[u] + 1
                    stack.append(v)
        u = max(range(n), key=lambda i: dist[i])
        return u, dist[u]

    u, _ = farthest(start)
    v, d = farthest(u)
    return d`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌳 Diâmetro de uma Árvore</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O diâmetro de uma árvore é a maior distância (número de arestas) entre quaisquer dois nós. É o "caminho mais longo" na árvore. Existem duas abordagens principais e elegantes para resolver este problema em tempo linear O(n).
            </p>

            <SectionTitle>🧠 Abordagens</SectionTitle>
            
            <SubTitle>1. Duas Buscas (BFS/DFS)</SubTitle>
            <p className="text-slate-300">Esta abordagem intuitiva funciona em duas passagens:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li>Execute uma busca (BFS ou DFS) a partir de um nó arbitrário (ex: nó 0) para encontrar o nó mais distante, `u`.</li>
                <li>Execute uma segunda busca a partir de `u`. O nó mais distante de `u`, `v`, definirá a outra extremidade do diâmetro.</li>
                <li>A distância entre `u` e `v` é o diâmetro da árvore.</li>
            </ol>
            <CodeBlock>{pythonTwoSearches}</CodeBlock>

            <SubTitle>2. DP Pós-Ordem (Única Travessia)</SubTitle>
            <p className="text-slate-300">
                Uma abordagem mais otimizada resolve o problema em uma única travessia DFS. Para cada nó `x`, a função DFS retorna um par `(altura, diâmetro)` da subárvore enraizada em `x`.
            </p>
            <ul className="list-disc list-inside space-y-3 text-slate-300 mt-2">
                <ListItem><strong>Altura (`altura[x]`)</strong>: A maior distância de `x` até uma folha em sua subárvore.
                    <CodeBlock>altura[x] = 1 + max(altura[filho_esq], altura[filho_dir])</CodeBlock>
                </ListItem>
                <ListItem><strong>Diâmetro (`diam[x]`)</strong>: O maior diâmetro pode estar:
                    <ol className="list-alpha list-inside ml-4">
                        <li>Inteiramente na subárvore esquerda.</li>
                        <li>Inteiramente na subárvore direita.</li>
                        <li>Passando pelo próprio nó `x` (conectando os caminhos mais longos das subárvores esquerda e direita).</li>
                    </ol>
                    <CodeBlock>diam[x] = max(diam[esq], diam[dir], altura[esq] + altura[dir])</CodeBlock>
                </ListItem>
            </ul>
             <p className="text-slate-300 mt-2 font-semibold">Esta é a abordagem visualizada na animação.</p>
            <CodeBlock>{pythonDP}</CodeBlock>
        </div>
    );
};

export default DiameterTreeExplanation;