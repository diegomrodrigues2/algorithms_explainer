import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const MemtableExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import List, Optional, Iterator, Tuple
import bisect

class Memtable:
    def __init__(self) -> None:
        self._keys: List[str] = []
        self._values: List[Optional[str]] = []  # Optional para suportar tombstone

    def put(self, key: str, value: Optional[str]) -> None:
        idx = bisect.bisect_left(self._keys, key)
        if idx < len(self._keys) and self._keys[idx] == key:
            self._values[idx] = value
        else:
            self._keys.insert(idx, key)
            self._values.insert(idx, value)

    def get(self, key: str) -> Optional[str]:
        idx = bisect.bisect_left(self._keys, key)
        if idx < len(self._keys) and self._keys[idx] == key:
            return self._values[idx]
        return None

    def __len__(self) -> int:
        return len(self._keys)

    def items(self) -> Iterator[Tuple[str, Optional[str]]]:
        # Iteração ordenada por chave (para flush)
        for k, v in zip(self._keys, self._values):
            yield k, v`;

    const pythonUsage = `mt = Memtable()
mt.put('b', '2')
mt.put('a', '1')
mt.put('a', '3')
print(mt.get('a'))  # '3'
print(list(mt.items()))  # [('a', '3'), ('b', '2')]`;

    const bisectLeftImpl = `def bisect_left(a, x, lo=0, hi=None):
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">💾 Memtable (Estrutura Ordenada em Memória)</h2>

            <SectionTitle>🎯 Contexto</SectionTitle>
            <p className="text-slate-300">
                LSM-Trees usam uma estrutura de dados em memória, ordenada por chave, chamada Memtable, para absorver escritas recentes. Opções comuns: árvore balanceada (ex.: Red-Black) ou skip list. Para fins didáticos, uma lista ordenada com busca binária (`bisect`) funciona muito bem.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Papel:</strong> cache de escrita ordenado; quando cheia, é despejada (flush) como uma SSTable ordenada em disco.</ListItem>
                <ListItem><strong>Benefício:</strong> transforma escritas aleatórias em sequenciais; base da eficiência de LSM-Trees.</ListItem>
            </ul>

            <SectionTitle>🛠️ Passo a passo da implementação</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Representação:</strong> manter dois vetores paralelos `keys` (ordenado) e `values`.</li>
                <li><strong>`put(key, value)`:</strong> localizar posição via busca binária (`bisect_left`); inserir/atualizar mantendo a ordem.</li>
                <li><strong>`get(key)`:</strong> buscar via busca binária; se encontrar, retorna o valor.</li>
                <li><strong>Extensões:</strong> suportar tombstones (deletes) e iteração ordenada para flush.</li>
            </ol>

            <SectionTitle>🔧 Implementação (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧩 Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>📑 Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Árvore Red-Black:</strong> uso clássico para O(log N) garantido.</ListItem>
                <ListItem><strong>Skip List:</strong> alternativa probabilística, simples e eficiente.</ListItem>
                <ListItem><strong>Tombstones:</strong> use `null` para deletar e propagar o marcador no flush.</ListItem>
                <ListItem><strong>Limite de tamanho:</strong> ao atingir um limite, executar flush para SSTable.</ListItem>
            </ul>

            <SectionTitle>ℹ️ Como funciona a Busca Binária (`bisect_left`)</SectionTitle>
            <p className="text-slate-300">
                `bisect_left(a, x)` retorna a posição de inserção mais à esquerda de `x` em uma lista já ordenada `a`, usando busca binária. Se `x` existir, retorna o índice da primeira ocorrência. Complexidade: O(log n).
            </p>
            <CodeBlock>{bisectLeftImpl}</CodeBlock>
        </div>
    );
};

export default MemtableExplanation;
