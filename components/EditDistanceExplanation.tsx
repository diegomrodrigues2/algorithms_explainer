import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const EditDistanceExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧠 Distância de Edição (Levenshtein)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O problema de <strong>Distância de Edição (Levenshtein)</strong> calcula o número mínimo de operações para transformar uma string em outra, onde as operações permitidas são: <strong>inserção</strong>, <strong>exclusão</strong> e <strong>substituição</strong> de um caractere. A formulação em PD usa estado bidimensional `(i, j)` que mede a distância entre os prefixos `A[:i]` e `B[:j]`.</p>
            <SubTitle>Vínculo Conceitual</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: par `(i, j)` representando distância entre `A[:i]` e `B[:j]`</ListItem>
                <ListItem><strong>Transições</strong>: inserção, exclusão, substituição</ListItem>
                <ListItem><strong>Complexidade</strong>: O(m·n) tempo e O(m·n) espaço</ListItem>
            </ul>

            <SectionTitle>Estratégias de Implementação</SectionTitle>
            <SubTitle>Memoização (Top-Down)</SubTitle>
            <CodeBlock>{`@lru_cache(maxsize=None)
def dp(i: int, j: int) -> int:
    if i == 0: return j
    if j == 0: return i
    if a[i-1] == b[j-1]:
        return dp(i-1, j-1)
    return 1 + min(
        dp(i, j-1),    # inserção
        dp(i-1, j),    # exclusão
        dp(i-1, j-1),  # substituição
    )`}</CodeBlock>

            <SectionTitle>Análise de Subproblemas</SectionTitle>
            <SubTitle>Estado e Recorrência</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: `Edit[i, j]` = distância entre `A[:i]` e `B[:j]`.</ListItem>
                <ListItem><strong>Recorrência</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Se `A[i-1] == B[j-1]`: `Edit[i, j] = Edit[i-1, j-1]`</li>
                        <li>Caso contrário: `Edit[i, j] = 1 + min(Edit[i, j-1], Edit[i-1, j], Edit[i-1, j-1])`</li>
                    </ul>
                </ListItem>
            </ul>
            
            <SectionTitle>Análise de Complexidade</SectionTitle>
            <Table
                headers={["Abordagem", "Tempo", "Espaço", "Observação"]}
                rows={[
                    ["Backtracking", "Exponencial", "O(m+n)", "Explora todas as possibilidades"],
                    ["Memoização", "O(m·n)", "O(m·n)", "Cache por (i, j)"],
                    ["Tabulação", "O(m·n)", "O(m·n)", "Preenche tabela 2D"],
                ]}
            />
            
            <SectionTitle>Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Correção Ortográfica</strong>: sugerir palavras próximas.</ListItem>
                <ListItem><strong>Bioinformática</strong>: alinhamento de sequências.</ListItem>
                <ListItem><strong>Diff/Controle de Versão</strong>: diferenças entre strings/arquivos.</ListItem>
                 <ListItem><strong>Pesquisa Aproximada</strong>: fuzzy search em bancos de dados.</ListItem>
            </ul>
        </div>
    );
};

export default EditDistanceExplanation;
