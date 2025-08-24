import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const BTreeExplanation = () => {
    const pythonNodeImpl = `from __future__ import annotations
from typing import List, Optional

class BTreeNode:
    def __init__(self, t: int, leaf: bool = False) -> None:
        self.t = t
        self.leaf = leaf
        self.keys: List[int] = []
        self.children: List[BTreeNode] = []

    @property
    def is_full(self) -> bool:
        return len(self.keys) == 2 * self.t - 1

    # ... (insert_non_full and split_child methods) ...
    
    def search(self, key: int) -> Optional[BTreeNode]:
        i = 0
        while i < len(self.keys) and key > self.keys[i]:
            i += 1
        
        if i < len(self.keys) and key == self.keys[i]:
            return self
        
        if self.leaf:
            return None
        
        return self.children[i].search(key)`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌳 Estrutura de Nó de B-Tree Paginada</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                B-Trees otimizam I/O em disco agrupando muitas chaves em cada nó (página). Cada nó contém chaves ordenadas e ponteiros para filhos. O grau mínimo `t` simula o limite de página: um nó tem entre `t-1` e `2t-1` chaves (exceto a raiz) e entre `t` e `2t` filhos quando interno.
            </p>
            
            <SectionTitle>Estrutura do nó</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><code>keys</code>: lista ordenada de chaves</ListItem>
                <ListItem><code>children</code>: lista de ponteiros para nós filhos</ListItem>
                <ListItem><code>leaf</code>: booleano indicando se é folha</ListItem>
                <ListItem><code>t</code>: grau mínimo (define capacidade máxima)</ListItem>
            </ul>

            <SectionTitle>🔍 Busca (Search)</SectionTitle>
            <p className="text-slate-300">A busca em uma B-Tree é uma generalização da busca em uma árvore de busca binária. A complexidade é O(t logₜ n), onde `t` é o grau mínimo e `n` é o número de chaves, o que é muito eficiente para I/O de disco.</p>
            <ol className="list-decimal list-inside space-y-2 mt-2 text-slate-300">
                <li>Comece na raiz.</li>
                <li>Em cada nó, encontre a primeira chave maior ou igual à chave de busca.</li>
                <li>Se a chave for encontrada, a busca termina com sucesso.</li>
                <li>Se não for encontrada, siga o ponteiro do filho que precede a chave maior ou igual.</li>
                <li>Se chegar a um nó folha e a chave não estiver lá, a chave não existe na árvore.</li>
            </ol>
            
            <SectionTitle>➕ Inserção (Insert)</SectionTitle>
             <p className="text-slate-300">A inserção sempre ocorre em um nó folha. O processo é:</p>
             <ol className="list-decimal list-inside space-y-2 mt-2 text-slate-300">
                <li>Busque o nó folha apropriado para a nova chave.</li>
                <li>Se o nó não estiver cheio, insira a chave na ordem correta.</li>
                <li>Se o nó estiver cheio, divida-o em dois nós, promova a chave do meio para o pai e, em seguida, insira a nova chave no filho apropriado. Essa divisão pode se propagar para cima na árvore.</li>
            </ol>

            <SectionTitle>🔧 Implementação Conceitual (Python)</SectionTitle>
            <CodeBlock>{pythonNodeImpl}</CodeBlock>

            <SectionTitle>📚 Leituras</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem>Paper seminal: Bayer & McCreight (1972), "Organization and Maintenance of Large Ordered Indices"</ListItem>
                <ListItem>CLRS, "Introduction to Algorithms", Capítulo 18: B-Trees</ListItem>
            </ul>
        </div>
    );
};

export default BTreeExplanation;