
import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const WALExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Iterator, Dict, Any
from pathlib import Path
import json, os

class WAL:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.touch(exist_ok=True)
        self._lsn = self._scan_last_lsn()

    def _scan_last_lsn(self) -> int:
        last = 0
        with self.path.open('r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                rec = json.loads(line)
                last = max(last, int(rec.get('lsn', 0)))
        return last

    def append(self, rec: Dict[str, Any]) -> int:
        self._lsn += 1
        rec = dict(rec)
        rec['lsn'] = self._lsn
        data = (json.dumps(rec, separators=(',', ':')) + '\\n').encode('utf-8')
        with self.path.open('ab') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())  # garante durabilidade
        return self._lsn

    def records(self) -> Iterator[Dict[str, Any]]:
        with self.path.open('r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                yield json.loads(line)

# Exemplo de integração mínima com B-Tree didática (apenas REDO):
class LoggedBTree:
    def __init__(self, t: int, wal_path: str | Path) -> None:
        self.bt = BTree(t)  # reuse classe do desafio 11
        self.wal = WAL(wal_path)

    def insert(self, key: int) -> None:
        # 1) log-before-write
        self.wal.append({'op': 'insert', 'key': key})
        # 2) aplica
        self.bt.insert(key)

    def recover(self) -> None:
        # Versão simplificada: reexecuta histórico (REDO) do início
        self.bt = BTree(self.bt.t)
        for rec in self.wal.records():
            if rec.get('op') == 'insert':
                self.bt.insert(int(rec['key']))`;

    const pythonUsage = `logged = LoggedBTree(t=3, wal_path='data/wal.log')
for x in [10, 20, 5, 6]:
    logged.insert(x)
# simula falha: recria a estrutura a partir do WAL
logged.recover()
print(logged.bt.search(6) is not None)  # True`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📜 Write-Ahead Log (WAL) Básico</h2>
            
            <SectionTitle>🎯 Contexto</SectionTitle>
            <p className="text-slate-300">Para garantir durabilidade e recuperação após falhas, bancos de dados (incluindo B-Trees) escrevem mudanças primeiro em um log sequencial e persistente (WAL) antes de aplicar a modificação nas páginas de dados. Em caso de falha, o sistema "reexecuta a história" lendo o log e reaplicando alterações.</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Princípio:</strong> Log Before Write — o log deve ser fsync() antes da página.</ListItem>
                <ListItem><strong>ARIES (Mohan et al., 1992):</strong> formaliza WAL com REDO/UNDO, LSNs e CLRs.</ListItem>
            </ul>

            <SectionTitle>🛠️ Passo a passo (didático)</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Cada operação de atualização (ex.: insert em B-Tree) gera um registro de log contendo, no mínimo: tipo, chave (e valor, se aplicável) e um LSN sequencial.</li>
                <li>Append do registro ao arquivo WAL + fsync.</li>
                <li>Aplicar a mudança em memória/disco da estrutura principal.</li>
                <li>Recuperação: ler WAL do início (ou checkpoint) e reaplicar em ordem. (Versão simplificada: apenas REDO.)</li>
            </ol>
            
            <SectionTitle>🔧 Implementação (Python, didática)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>🧩 Como usar</SubTitle>
            <CodeBlock>{pythonUsage}</CodeBlock>

            <SubTitle>📑 Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Checkpoints:</strong> gravar snapshots periódicos para acelerar recuperação.</ListItem>
                <ListItem><strong>UNDO e CLRs:</strong> registrar também reversões para transações não confirmadas (ARIES completo).</ListItem>
                <ListItem><strong>LSN em páginas:</strong> persistir o último LSN aplicado por página para REDO idempotente.</ListItem>
                <ListItem><strong>Batch + group commit:</strong> amortizar fsync.</ListItem>
            </ul>
        </div>
    );
};

export default WALExplanation;
