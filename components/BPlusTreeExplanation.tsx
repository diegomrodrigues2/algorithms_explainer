
import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const BPlusTreeExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import List, Optional, Tuple

class BPlusLeaf:
    def __init__(self) -> None:
        self.keys: List[int] = []
        self.values: List[str] = []
        self.next: Optional[BPlusLeaf] = None  # encadeamento de folhas

class BPlusInternal:
    def __init__(self) -> None:
        self.keys: List[int] = []     # separadores (k0, k1, ...)
        self.children: List[object] = []  # lista de filhos (nós internos ou folhas)

class BPlusTree:
    def __init__(self) -> None:
        self.root: object = BPlusLeaf()  # árvore mínima começa com uma folha

    def _search_leaf(self, key: int) -> BPlusLeaf:
        node = self.root
        while isinstance(node, BPlusInternal):
            # encontra o menor i com key < keys[i]; segue children[i]
            i = 0
            while i < len(node.keys) and key >= node.keys[i]:
                i += 1
            node = node.children[i]
        return node  # folha

    def range_query(self, start_key: int, end_key: int) -> List[Tuple[int, str]]:
        if start_key > end_key:
            return []
        leaf = self._search_leaf(start_key)
        result: List[Tuple[int, str]] = []
        node = leaf
        while node is not None:
            for k, v in zip(node.keys, node.values):
                if k < start_key:
                    continue
                if k > end_key:
                    return result
                result.append((k, v))
            node = node.next
        return result`;

    const pythonUsage = `# Construção manual de duas folhas encadeadas, apenas para demonstração
leaf1 = BPlusLeaf(); leaf1.keys = [1, 3, 5]; leaf1.values = ['A','B','C']
leaf2 = BPlusLeaf(); leaf2.keys = [6, 8, 10]; leaf2.values = ['D','E','F']
leaf1.next = leaf2

root = BPlusInternal()
root.keys = [6]              # separa: (<6) vai para leaf1; (>=6) vai para leaf2
root.children = [leaf1, leaf2]

bpt = BPlusTree(); bpt.root = root
print(bpt.range_query(3, 8))  # [(3,'B'), (5,'C'), (6,'D'), (8,'E')]`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎯 Consulta de Intervalo em B+ Tree</h2>
            
            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                B-Trees são eficientes para consultas de intervalo por manter dados ordenados. A variante B+ Tree otimiza ainda mais varreduras: todos os dados residem nas folhas, e as folhas são ligadas por ponteiros `next`, permitindo percorrer sequencialmente chaves em um intervalo após um único O(log N) para achar o ponto de início.
            </p>

            <SectionTitle>Passo a passo (B+ range query)</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Descer a árvore até a folha onde `start_key` residiria (ou a primeira chave ≥ `start_key`).</li>
                <li>A partir dessa folha, percorrer sequencialmente as chaves e valores em ordem, seguindo `leaf.next` enquanto `key {'<='} end_key`.</li>
                <li>Parar quando a chave ultrapassar `end_key` ou quando não houver próxima folha.</li>
            </ol>

            <SectionTitle>Implementação (Python, didática)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Como usar (exemplo didático)</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>
            
            <SectionTitle>Variações e melhorias</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>B+ completa:</strong> implementar inserção com split e manutenção dos ponteiros `next` nas folhas.</ListItem>
                <ListItem><strong>Nó folha duplamente encadeado (`prev` e `next`)</strong> para varreduras reversas.</ListItem>
                <ListItem><strong>Paginado:</strong> cada nó mapeado a uma página; range torna-se I/O sequencial eficiente.</ListItem>
            </ul>
        </div>
    );
};

export default BPlusTreeExplanation;
