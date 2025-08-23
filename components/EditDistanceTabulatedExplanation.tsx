import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const EditDistanceTabulatedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">✏️ Distância de Edição (Tabulação)</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">A abordagem bottom-up preenche uma matriz 2D `Edit[i, j]` onde cada célula representa o custo mínimo para transformar o prefixo `A[:i]` no prefixo `B[:j]`, usando inserção, exclusão e substituição (custo 1 por operação).</p>

            <SectionTitle>🧩 Recorrência</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: Par `(i, j)` — prefixos de `A` e `B`.</ListItem>
                <ListItem><strong>Tabela</strong>: `dp[i][j]` é o custo mínimo para `A[:i] → B[:j]`.</ListItem>
                <ListItem><strong>Casos Base</strong>: `dp[i][0] = i` e `dp[0][j] = j`.</ListItem>
                <ListItem><strong>Transição</strong>: `dp[i][j] = min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1] + custo_substituição)`.</ListItem>
                 <ListItem><strong>Complexidade</strong>: Tempo O(n·m); Espaço O(n·m) ou O(min(n,m)) com otimização.</ListItem>
            </ul>

            <SectionTitle>🔧 Implementação Essencial (2D)</SectionTitle>
            <CodeBlock>{`def edit_distance_tab(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1): dp[i][0] = i
    for j in range(m + 1): dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if a[i-1] == b[j-1] else 1
            dp[i][j] = min(
                dp[i-1][j] + 1,       # deleção
                dp[i][j-1] + 1,       # inserção
                dp[i-1][j-1] + cost   # substituição
            )
    return dp[n][m]`}</CodeBlock>

            <SectionTitle>♻️ Otimização de Espaço (1D)</SectionTitle>
             <p className="text-slate-300">Como o cálculo de `dp[i]` só depende da linha anterior `dp[i-1]`, o espaço pode ser otimizado para O(min(n, m)).</p>
            <CodeBlock>{`def edit_distance_tab_1d(a, b):
    # ... (código de otimização) ...
    return prev[m]`}</CodeBlock>

            <SectionTitle>🧠 Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estrutura Retangular</strong>: Dependências locais (\`(i-1,j)\`, \`(i,j-1)\`, \`(i-1,j-1)\`) permitem uma varredura simples por linhas/colunas.</ListItem>
                <ListItem><strong>Otimização de Espaço</strong>: Apenas duas linhas (ou colunas) são necessárias a qualquer momento, permitindo a otimização de espaço.</ListItem>
                <ListItem><strong>Forma Canônica</strong>: Esta é a forma canônica de PD tabular para problemas de alinhamento de sequências.</ListItem>
            </ul>
        </div>
    );
};

export default EditDistanceTabulatedExplanation;
