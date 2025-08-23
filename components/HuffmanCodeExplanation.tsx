import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const HuffmanCodeExplanation = () => {
    const pythonImplementation = `from dataclasses import dataclass
from typing import Dict, Optional, Tuple, List
import heapq

@dataclass
class Node:
    freq: int
    symbol: Optional[str] = None
    left: Optional['Node'] = None
    right: Optional['Node'] = None

    def is_leaf(self) -> bool:
        return self.symbol is not None


def build_huffman_tree(freqs: Dict[str, int]) -> Optional[Node]:
    # heap de tuplas (freq, tie_breaker, node) para evitar comparação de objetos
    heap: List[Tuple[int, int, Node]] = []
    tie = 0
    for sym, f in freqs.items():
        heap.append((f, tie, Node(freq=f, symbol=sym)))
        tie += 1
    if not heap:
        return None
    heapq.heapify(heap)
    while len(heap) > 1:
        f1, _, n1 = heapq.heappop(heap)
        f2, _, n2 = heapq.heappop(heap)
        parent = Node(freq=f1 + f2, left=n1, right=n2)
        heapq.heappush(heap, (parent.freq, tie, parent))
        tie += 1
    return heap[0][2]


def generate_codes(root: Optional[Node]) -> Dict[str, str]:
    codes: Dict[str, str] = {}
    if root is None:
        return codes
    def dfs(node: Node, path: str) -> None:
        if node.is_leaf():
            codes[node.symbol] = path or "0"  # trata caso de 1 símbolo
            return
        if node.left:
            dfs(node.left, path + "0")
        if node.right:
            dfs(node.right, path + "1")
    dfs(root, "")
    return codes`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🗜️ Códigos de Huffman</h2>
            
            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Objetivo</strong>: dado um alfabeto com frequências, construir um código de prefixo ótimo que minimize o custo esperado de codificação (soma de `freq[símbolo] * comprimento[código]`).</ListItem>
                <ListItem><strong>Vínculo conceitual</strong>: Erickson, "Algorithms", Capítulo 4, Seção 4.4, "Huffman Codes".</ListItem>
                <ListItem><strong>Complexidade</strong>: O(n log n) usando uma fila de prioridade (min-heap).</ListItem>
            </ul>

            <SectionTitle>🧠 Estratégia Gulosa e Correção</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Regra gulosa</strong>: iterativamente mesclar os dois nós (símbolos/subárvores) de menor frequência; o novo nó pai tem frequência igual à soma e é reinserido no heap.</ListItem>
                <ListItem><strong>Corretude (resumo)</strong>: em uma árvore ótima, os dois símbolos menos frequentes podem ser tomados como irmãos nas folhas mais profundas. Isso permite um argumento de troca para mostrar que a escolha gulosa é segura.</ListItem>
            </ul>

            <SectionTitle>🔧 Implementação Essencial (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧪 Desafios</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Básico</strong>: dado um texto, compute frequências, construa a árvore e gere códigos.</li>
                <li><strong>Serialização</strong>: serialize e desserialize a árvore para persistir dicionários de códigos.</li>
                <li><strong>Streaming</strong>: adapte para processar arquivos grandes em blocos.</li>
            </ul>
        </div>
    );
};

export default HuffmanCodeExplanation;