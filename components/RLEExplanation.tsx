
import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const RLEExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import List, Tuple, Iterable, TypeVar

T = TypeVar('T')

def rle_compress(seq: Iterable[T]) -> List[Tuple[T, int]]:
    it = iter(seq)
    try:
        current = next(it)
    except StopIteration:
        return []
    count = 1
    out: List[Tuple[T, int]] = []
    for x in it:
        if x == current:
            count += 1
        else:
            out.append((current, count))
            current = x
            count = 1
    out.append((current, count))
    return out

def rle_decompress(pairs: Iterable[Tuple[T, int]]) -> List[T]:
    out: List[T] = []
    for value, count in pairs:
        out.extend([value] * count)
    return out`;

    const pythonExample = `original = list("AAAAABBBCCDAA")
enc = rle_compress(original)
# enc == [('A',5), ('B',3), ('C',2), ('D',1), ('A',2)]
dec = rle_decompress(enc)
# dec == original`;

    const pythonItertools = `import itertools as it
from typing import Any

def rle_compress_groupby(seq: Iterable[Any]):
    return [(k, sum(1 for _ in g)) for k, g in it.groupby(seq)]

def rle_decompress_repeat(pairs: Iterable[Tuple[Any, int]]):
    return list(it.chain.from_iterable(it.repeat(v, c) for v, c in pairs))`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔄 Compressão Run-Length Encoding (RLE)</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                Em armazenamento colunar (OLAP), colunas frequentemente têm valores repetidos — especialmente quando ordenadas — tornando-as ideais para RLE. RLE substitui runs consecutivos de um valor por um par (valor, contagem).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Definição</strong>: Sequências consecutivas são codificadas como (valor, contagem).</ListItem>
                <ListItem><strong>Uso</strong>: Colunas categóricas, bitmap indexes, páginas com baixa entropia.</ListItem>
            </ul>

            <SectionTitle>Implementação (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Exemplo</SubTitle>
            <CodeBlock>{pythonExample}</CodeBlock>

            <SectionTitle>Variante com itertools (groupby/repeat)</SectionTitle>
            <CodeBlock>{pythonItertools}</CodeBlock>

            <SubTitle>Observações práticas</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Ordenação e RLE</strong>: Ordenar por coluna maximiza runs, elevando a taxa de compressão.</ListItem>
                <ListItem><strong>Tipos</strong>: Para colunas numéricas, combine com codificação delta/fixed-width; para categóricas, dicionário + RLE.</ListItem>
                <ListItem><strong>Armazenamento</strong>: Guardar `values[]` e `counts[]` separadamente pode facilitar vetorização (SIMD) e varreduras.</ListItem>
            </ul>
        </div>
    );
};

export default RLEExplanation;
