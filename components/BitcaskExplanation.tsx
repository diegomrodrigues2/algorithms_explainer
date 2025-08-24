import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const BitcaskExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Optional, Dict, Tuple
from pathlib import Path
import os

class BitcaskLikeStore:
    def __init__(self, file_path: str | Path) -> None:
        self.file_path = Path(file_path)
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        self.file_path.touch(exist_ok=True)
        # key -> (offset, size)
        self.keydir: Dict[str, Tuple[int, int]] = {}
        self._rebuild_keydir()

    def _rebuild_keydir(self) -> None:
        # varre o arquivo para construir o índice (última ocorrência vence)
        offset = 0
        with self.file_path.open('rb') as f:
            for raw in f:
                size = len(raw)
                line = raw.rstrip(b'\\n')
                if not line:
                    offset += size
                    continue
                try:
                    k_bytes, _ = line.split(b',', 1)
                except ValueError:
                    # linha parcial/corrompida; ignore
                    offset += size
                    continue
                key = k_bytes.decode('utf-8', errors='ignore')
                self.keydir[key] = (offset, size)
                offset += size

    def db_set(self, key: str, value: str) -> None:
        record = f"{key},{value}\\n".encode('utf-8')
        with self.file_path.open('ab') as f:
            offset = f.tell()
            f.write(record)
            f.flush()
            os.fsync(f.fileno())  # opcional: garantir durabilidade
            self.keydir[key] = (offset, len(record))

    def db_get(self, key: str) -> Optional[str]:
        meta = self.keydir.get(key)
        if meta is None:
            return None
        offset, size = meta
        with self.file_path.open('rb') as f:
            f.seek(offset)
            raw = f.read(size)
        try:
            k_bytes, v_bytes = raw.rstrip(b'\\n').split(b',', 1)
        except ValueError:
            return None
        return v_bytes.decode('utf-8', errors='ignore')`;
    
    const pythonUsage = `store = BitcaskLikeStore('kv_bitcask.log')
store.db_set('a', '1')
store.db_set('a', '2')
print(store.db_get('a'))  # '2'`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔑 Índice de Hash em Memória (Estilo Bitcask)</h2>
            <SectionTitle>🎯 Contexto</SectionTitle>
            <p className="text-slate-300">
                Para superar a leitura O(n) do log append-only, introduzimos um índice em memória (keydir) que mapeia `key -> (file_id, offset, size)` do valor mais recente no disco. Essa é a ideia central do Bitcask: escritas são append, leituras são O(1) via hash + um único seek.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Bitcask (Basho)</strong>: log imutável por arquivo ativo, keydir em RAM, merge periódico de segmentos.</ListItem>
                <ListItem><strong>Trade-off</strong>: consome RAM proporcional ao número de chaves; não há ordenação por chave (range scans exigem varredura).</ListItem>
            </ul>

            <SectionTitle>🛠️ Passo a passo da implementação</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Formato de linha simples</strong>: `key,value\\n` (didático). Em Bitcask real, há cabeçalho com tamanhos e timestamp.</li>
                <li><strong>Inicialização</strong>: escanear o arquivo uma vez e preencher `keydir[key] = (offset_da_linha, size_em_bytes)`.</li>
                <li><strong>Escrita (`db_set`)</strong>: abrir em append, escrever linha, capturar `offset` antes de escrever (via `f.tell()`), atualizar `keydir` com `(offset, len(linha))`.</li>
                <li><strong>Leitura (`db_get`)</strong>: consultar `keydir` para obter `offset` e `size`; `seek(offset)` e ler apenas aquele trecho para extrair o valor atual.</li>
            </ol>

            <SectionTitle>🔧 Implementação de Referência (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧩 Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>📑 Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem>Formato binário com cabeçalho (timestamp, key_sz, val_sz) para detecção robusta de linhas e suporte a deletes (tombstones).</ListItem>
                <ListItem>Múltiplos segmentos: rotação de arquivo ativo por tamanho/tempo e processo de "merge" para compactação.</ListItem>
                <ListItem>Keydir persistente: snapshot do índice para reconstrução rápida na inicialização.</ListItem>
                <ListItem>Concurrency: locks por arquivo/registro; buffers e I/O assíncrono.</ListItem>
            </ul>
        </div>
    );
};

export default BitcaskExplanation;