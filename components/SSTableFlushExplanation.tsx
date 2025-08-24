import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const SSTableFlushExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Iterable, Tuple, Optional
from pathlib import Path
import os

class SSTableWriter:
    def __init__(self, base_path: str | Path) -> None:
        self.base_path = Path(base_path)
        self.data_path = self.base_path.with_suffix('.sst')
        self.index_path = self.base_path.with_suffix('.idx')  # opcional

    def write(self, items: Iterable[Tuple[str, Optional[str]]], sparse_step: int = 1024) -> None:
        # items: pares (key, value) em ordem crescente de key
        with self.data_path.open('wb') as data, self.index_path.open('w', encoding='utf-8') as idx:
            offset = 0
            for i, (key, value) in enumerate(items):
                if value is None:
                    # tombstone: dependendo do design, pode-se escrever marcador especial
                    line = f"{key},\\n".encode('utf-8')
                else:
                    line = f"{key},{value}\\n".encode('utf-8')
                data.write(line)
                if i % sparse_step == 0:
                    # registra chave e offset para busca aproximada
                    idx.write(f"{key},{offset}\\n")
                offset += len(line)
            data.flush()
            os.fsync(data.fileno())`;

    const pythonUsage = `# Supondo a Memtable do desafio 4
mt = Memtable()
mt.put('a', '1')
mt.put('b', '2')
mt.put('c', '3')

writer = SSTableWriter('data/segment-000001')
writer.write(mt.items(), sparse_step=2)`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">💾 Flush da Memtable para uma SSTable</h2>

            <SectionTitle>🎯 Contexto</SectionTitle>
            <p className="text-slate-300">
                Quando a Memtable atinge um limite (itens/bytes/tempo), seu conteúdo ordenado é persistido em disco como uma SSTable (Sorted String Table). Por já estar ordenado, o flush é uma escrita sequencial eficiente. A SSTable é imutável.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Papel:</strong> ponte entre memória (volátil) e disco (persistente).</ListItem>
                <ListItem><strong>Estrutura real (LevelDB/RocksDB):</strong> blocos de dados, índice esparso, filtro de Bloom e footer.</ListItem>
            </ul>

            <SectionTitle>🛠️ Passo a passo do flush</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Abrir um arquivo `.sst` de saída para escrita binária/texto.</li>
                <li>Iterar sobre `memtable.items()` (ordenado por chave) e gravar linhas `key,value`.</li>
                <li>(Opcional) Construir um índice esparso: a cada N chaves, registrar `(key, offset)` em um arquivo `.idx`.</li>
                <li>(Opcional) Construir um filtro de Bloom com todas as chaves para um `.bf`.</li>
            </ol>

            <SectionTitle>🔧 Implementação (Python, didática)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧩 Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>📑 Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem>Formato compatível com LevelDB: blocos fixos, checksums, footer com ponteiros para índice/filtro.</ListItem>
                <ListItem>Compressão por bloco: zlib/snappy/lz4 para reduzir espaço.</ListItem>
                <ListItem>Filtro de Bloom: `.bf` para descartar negativas rapidamente.</ListItem>
                <ListItem>Manifest/metadata: um catálogo para listar segmentos, tamanhos, chaves mín/max e estado.</ListItem>
            </ul>
        </div>
    );
};

export default SSTableFlushExplanation;
