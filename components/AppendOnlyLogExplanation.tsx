import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const AppendOnlyLogExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Optional
from pathlib import Path

class LogKeyValueStore:
    def __init__(self, file_path: str | Path) -> None:
        self.file_path = Path(file_path)
        # garante existência do arquivo
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        self.file_path.touch(exist_ok=True)

    def db_set(self, key: str, value: str) -> None:
        # formato: key,value\\n (escapes simples de vírgula podem ser adicionados em versões futuras)
        with self.file_path.open('a', encoding='utf-8') as f:
            f.write(f"{key},{value}\\n")

    def db_get(self, key: str) -> Optional[str]:
        last_value: Optional[str] = None
        with self.file_path.open('r', encoding='utf-8') as f:
            for line in f:
                line = line.rstrip('\\n')
                if not line:
                    continue
                try:
                    k, v = line.split(',', 1)
                except ValueError:
                    # linha parcial/ corrompida no fim do log — ignore
                    continue
                if k == key:
                    last_value = v
        return last_value`;

    const pythonUsage = `store = LogKeyValueStore('kv.log')
store.db_set('a', '1')
store.db_set('a', '2')
assert store.db_get('a') == '2'
assert store.db_get('b') is None`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📝 Log Append-Only Básico</h2>

            <SectionTitle>🎯 Contexto</SectionTitle>
            <p className="text-slate-300">
                O motor de armazenamento mais simples é um arquivo de log somente-apêndice: cada escrita é anexada ao final. Ele ilustra o trade-off fundamental entre escritas sequenciais rápidas e leituras O(n).
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Origem histórica</strong>: Rosenblum & Ousterhout (1992) — Log-Structured File System (LFS), propondo tratar o disco como um grande log sequencial, com limpeza de segmentos.</ListItem>
                <ListItem><strong>Conexão com DDIA (Cap. 3)</strong>: base conceitual para LSM-Trees e WAL; imutabilidade facilita recuperação de falhas e concorrência.</ListItem>
            </ul>

            <SectionTitle>🛠️ Passo a passo da implementação</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Estrutura mínima</strong>: um arquivo de texto onde cada linha é um par `key,value`.</li>
                <li><strong>Escrita (`db_set`)</strong>: abrir o arquivo em modo de anexação e acrescentar `key,value\\n`.</li>
                <li><strong>Leitura (`db_get`)</strong>: ler o arquivo sequencialmente do início ao fim, mantendo o último valor visto para a `key` buscada.</li>
                <li><strong>Robustez</strong>: tratar linhas parciais/corrompidas no fim do arquivo (por exemplo, após falha), ignorando-as durante a leitura.</li>
            </ol>

            <SectionTitle>🔧 Implementação de Referência (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧩 Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>📑 Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Delimitadores/encoding</strong>: use `\\t` em vez de vírgula, ou adote JSON Lines (`{"k": ..., "v": ...}`) para evitar escapes.</ListItem>
                <ListItem><strong>I/O binário e buffering</strong>: abra o arquivo em modo binário para maior controle e flush explícito quando necessário.</ListItem>
                <ListItem><strong>Durabilidade</strong>: após `write`, chame `f.flush()` e `os.fsync(f.fileno())` para garantir persistência em disco.</ListItem>
                <ListItem><strong>Integridade</strong>: prefixe linhas com tamanho (len + payload) para detectar/truncar registros parciais de forma mais segura.</ListItem>
            </ul>

            <SubTitle>📝 Notas práticas</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Imutabilidade</strong>: escrever apenas no final simplifica recuperação de falhas; linhas incompletas no final podem ser ignoradas.</ListItem>
                <ListItem><strong>Desempenho</strong>: leitura é O(n). Desafios futuros introduzem índices (hash/B-Tree), compactação e LSM-Tree para acelerar leituras.</ListItem>
            </ul>
        </div>
    );
};

export default AppendOnlyLogExplanation;
