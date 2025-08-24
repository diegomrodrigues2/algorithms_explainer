import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const LogCompactionExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Dict, Tuple
from pathlib import Path
import os

class BitcaskLikeStore:
    # ... (mesma classe do desafio 2, com keydir e db_set/db_get)

    def compact(self) -> None:
        old_path = self.file_path
        tmp_path = self.file_path.with_suffix('.compact.tmp')

        # 1) mapeia última ocorrência por chave (offset, size)
        last: Dict[str, Tuple[int, int]] = {}
        offset = 0
        with old_path.open('rb') as f:
            for raw in f:
                size = len(raw)
                line = raw.rstrip(b'\\n')
                if not line:
                    offset += size
                    continue
                try:
                    k_bytes, _ = line.split(b',', 1)
                except ValueError:
                    offset += size
                    continue
                key = k_bytes.decode('utf-8', errors='ignore')
                last[key] = (offset, size)
                offset += size

        # 2) escreve apenas as últimas versões em novo arquivo
        with tmp_path.open('wb') as out:
            with old_path.open('rb') as f:
                for key, (off, size) in last.items():
                    f.seek(off)
                    raw = f.read(size)
                    # opcional: validar novamente se formato está ok
                    out.write(raw)
            out.flush()
            os.fsync(out.fileno())

        # 3) troca arquivos de forma atômica e reconstrói índice
        backup_path = old_path.with_suffix('.bak')
        try:
            if backup_path.exists():
                backup_path.unlink()
            os.replace(str(old_path), str(backup_path))
            os.replace(str(tmp_path), str(old_path))
            if backup_path.exists():
                backup_path.unlink()
        finally:
            if tmp_path.exists():
                tmp_path.unlink(missing_ok=True)

        # 4) reconstrói keydir do arquivo compacto
        self.keydir.clear()
        self._rebuild_keydir()`;
    
    const pythonUsage = `store.compact()`;
    
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📦 Compactação de Log</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                Em um log append-only, atualizações de chaves deixam registros antigos obsoletos. A compactação cria um novo log contendo apenas a versão mais recente de cada chave, recuperando espaço e acelerando reconstruções futuras do índice (keydir).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Analogia (Kafka)</strong>: log compaction retém apenas a última mensagem por chave, mantendo um changelog consistente do estado.</ListItem>
                <ListItem><strong>Bitcask</strong>: o processo de "merge" em arquivos imutáveis gera novos segmentos com apenas os valores atuais.</ListItem>
            </ul>

            <SectionTitle>Passo a passo da implementação</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Varra o log atual e construa um mapa `last[key] = (offset, size)` apontando para a última ocorrência de cada chave.</li>
                <li>Leia novamente apenas essas ocorrências finais (ou reabra e leia todas filtrando por `(offset,size)`), extraia `key,value` e escreva em um novo arquivo temporário.</li>
                <li>Faça `fsync` no novo arquivo, substitua o antigo pelo novo (rename atômico) e reconstrua `keydir` a partir do arquivo compacto.</li>
                <li>Em implementações com múltiplos segmentos, aplique o mesmo raciocínio por segmento e escreva segmentos novos consolidados.</li>
            </ol>

            <SectionTitle>Implementação de Referência (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem>Múltiplos segmentos: compacte somente segmentos imutáveis, mantendo um arquivo ativo para novas escritas.</ListItem>
                <ListItem>Tombstones (deletes): ao compactar, remova chaves marcadas como deletadas.</ListItem>
                <ListItem>Copy-on-write: técnicas com fork()/COW permitem compactar sem bloquear escritas (ver repositórios de consenso/sincronização).</ListItem>
                <ListItem>Heurísticas: gatilhos por taxa de obsolescência, tamanho de arquivo, janela de tempo ou pressão de disco.</ListItem>
            </ul>
        </div>
    );
};

export default LogCompactionExplanation;
