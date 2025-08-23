import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const LCSTabulatedExplanation = () => {
    const pythonImplementation = `def lcs_table(x: str, y: str):
    m, n = len(x), len(y)
    C = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i-1] == y[j-1]:
                C[i][j] = C[i-1][j-1] + 1
            else:
                C[i][j] = max(C[i-1][j], C[i][j-1])
    return C`;

    const pythonReconstruction = `def lcs_reconstruct(x: str, y: str, C):
    i, j = len(x), len(y)
    lcs = []
    while i > 0 and j > 0:
        if x[i-1] == y[j-1]:
            lcs.append(x[i-1])
            i -= 1
            j -= 1
        elif C[i-1][j] >= C[i][j-1]:
            i -= 1
        else:
            j -= 1
    return "".join(reversed(lcs))`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📚 LCS (Tabulação)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                A LCS entre duas sequências é a subsequência de maior comprimento que aparece em ambas mantendo a ordem relativa (não precisa ser contígua). A solução tabular preenche uma matriz 2D `C[i][j]` que armazena o comprimento da LCS dos prefixos `X[:i]` e `Y[:j]`. É um DP 2D canônico, intimamente relacionado à Distância de Edição.
            </p>

            <SubTitle>Detalhes da Abordagem</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: par `(i, j)` — prefixos de `X` e `Y`.</ListItem>
                <ListItem><strong>Tabela</strong>: `C[i][j]` = comprimento da LCS de `X[:i]` e `Y[:j]`.</ListItem>
                <ListItem><strong>Transições</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Se `X[i-1] == Y[j-1]`: `C[i][j] = C[i-1][j-1] + 1`</li>
                        <li>Senão: `C[i][j] = max(C[i-1][j], C[i][j-1])`</li>
                    </ul>
                </ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(m·n), Espaço O(m·n).</ListItem>
            </ul>

            <SectionTitle>Implementação Essencial</SectionTitle>
            <SubTitle>Cálculo da Tabela</SubTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>
            <SubTitle>Reconstrução do Caminho</SubTitle>
            <CodeBlock>{pythonReconstruction}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Relação com Edit Distance</strong>: Ambos usam DP 2D por prefixos e dependem de vizinhos imediatos.</ListItem>
                <ListItem><strong>Reconstrução</strong>: Retrocesso a partir de `C[m][n]` seguindo empates de forma consistente produz uma LCS válida.</ListItem>
                <ListItem><strong>Espaço</strong>: Duas linhas bastam para o comprimento; reconstrução exige tabela completa ou trilha de decisões.</ListItem>
            </ul>
        </div>
    );
};

export default LCSTabulatedExplanation;
