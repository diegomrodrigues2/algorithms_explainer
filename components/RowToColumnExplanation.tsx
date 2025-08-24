
import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const RowToColumnExplanation = () => {
    const pythonImplementation = `from __future__ import annotations
from typing import Dict, List, Any, Iterable

def rows_to_columns(rows: Iterable[Dict[str, Any]]) -> Dict[str, List[Any]]:
    rows = list(rows)
    # 1) descobrir colunas
    cols_set = set()
    for r in rows:
        cols_set.update(r.keys())
    cols = {c: [] for c in sorted(cols_set)}
    # 2) preencher vetores
    for r in rows:
        for c in cols:
            cols[c].append(r.get(c, None))
    return cols`;

    const pythonExample = `rows = [
    {"id": 1, "country": "BR", "amount": 10.0},
    {"id": 2, "country": "US", "amount": 20.5},
    {"id": 3, "country": "BR"},  # amount ausente
]
cols = rows_to_columns(rows)
# cols["id"] == [1, 2, 3]
# cols["country"] == ["BR", "US", "BR"]
# cols["amount"] == [10.0, 20.5, None]`;

    const pandasExample = `import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

rows = [
    {"id": 1, "country": "BR", "amount": 10.0},
    {"id": 2, "country": "US", "amount": 20.5},
]
# linha → coluna em memória
df = pd.DataFrame(rows)  # cada coluna vira um vetor (Series)
# escrever como Parquet (colunar)
table = pa.Table.from_pandas(df)
pq.write_table(table, 'data/example.parquet')
# ler de volta
read_back = pq.read_table('data/example.parquet').to_pandas()`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">↔️ Conversão de Linha para Coluna</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                Armazenamento colunar otimiza OLAP: ler apenas colunas necessárias, melhorando I/O e compressão. A conversão de linha→coluna reorganiza uma lista de registros (linha) em vetores por coluna.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Seminal</strong>: C-Store (Stonebraker et al., 2005) — projeções por coluna, alta compressão, WS/RS.</ListItem>
                <ListItem><strong>Prática</strong>: DataFrames (Pandas) e formatos colunares (Parquet/Arrow/ORC).</ListItem>
            </ul>

            <SectionTitle>Passo a passo (linha → coluna)</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Dado `rows: List[Dict[str, Any]]`, derive o conjunto de colunas.</li>
                <li>Para cada coluna, colecione os valores correspondentes na ordem das linhas (preencher ausentes como `None`).</li>
                <li>Retorne `cols: Dict[str, List[Any]]`.</li>
            </ol>

            <SectionTitle>Implementação (Python puro)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Exemplo</SubTitle>
            <CodeBlock>{pythonExample}</CodeBlock>

            <SectionTitle>Com Pandas e PyArrow (para Parquet)</SectionTitle>
            <CodeBlock>{pandasExample}</CodeBlock>

            <SubTitle>Variações e melhorias</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Tipagem/validação de schema</strong>: inferir tipos ou usar schema fixo (Arrow).</ListItem>
                <ListItem><strong>Compressão</strong>: RLE/dicionário para colunas categóricas; codecs (snappy, zstd).</ListItem>
                <ListItem><strong>Projeções/ordenação</strong>: armazenar subconjuntos ordenados para acelerar filtros/join.</ListItem>
            </ul>
        </div>
    );
};

export default RowToColumnExplanation;
