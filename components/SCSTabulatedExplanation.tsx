import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const SCSTabulatedExplanation = () => {
    const pythonLCSBased = `def scs_via_lcs(x: str, y: str) -> str:
    L = _lcs_table(x, y) # Tabela da LCS
    i, j = len(x), len(y)
    scs: List[str] = []

    while i > 0 and j > 0:
        if x[i - 1] == y[j - 1]:
            scs.append(x[i - 1])
            i -= 1; j -= 1
        elif L[i - 1][j] >= L[i][j - 1]:
            scs.append(x[i - 1])
            i -= 1
        else:
            scs.append(y[j - 1])
            j -= 1
            
    # Adiciona o resto das strings
    while i > 0: scs.append(x[i-1]); i -= 1
    while j > 0: scs.append(y[j-1]); j -= 1
        
    return "".join(reversed(scs))`;

    const pythonDirectDP = `def scs_direct_dp(x: str, y: str):
    m, n = len(x), len(y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = 1 + dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1])
                
    return dp[m][n] # Retorna o comprimento`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔗 SCS (Tabulação)</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                A Supersequência Comum Mais Curta (SCS) de duas sequências é a sequência mais curta que contém ambas como subsequências. A identidade fundamental liga SCS e LCS: `|SCS(X,Y)| = |X| + |Y| - |LCS(X,Y)|`.
            </p>

            <SectionTitle>Abordagem DP Direta</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: `dp[i][j]` = comprimento da SCS de `X[:i]` e `Y[:j]`.</ListItem>
                <ListItem><strong>Transições</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Se `X[i-1] == Y[j-1]`: `dp[i][j] = 1 + dp[i-1][j-1]`</li>
                        <li>Senão: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])`</li>
                    </ul>
                </ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(m·n); Espaço O(m·n).</ListItem>
            </ul>
            <CodeBlock>{pythonDirectDP}</CodeBlock>

            <SectionTitle>Implementação Baseada em LCS</SectionTitle>
            <p className="text-slate-300">
                Uma forma alternativa é primeiro construir a tabela da LCS e depois, durante a reconstrução, incluir todos os caracteres de ambas as strings, mas apenas uma vez para os caracteres que fazem parte da LCS.
            </p>
            <CodeBlock>{pythonLCSBased}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Identidade com LCS</strong>: A fórmula `len(SCS) = len(X) + len(Y) - len(LCS)` fornece rapidamente o comprimento ótimo e guia a reconstrução.</ListItem>
                <ListItem><strong>Dois Caminhos, Mesmo Resultado</strong>: Reconstruir via LCS ou construir diretamente via DP tabular produzem SCSs válidas (não necessariamente únicas).</ListItem>
                <ListItem><strong>Trade-off de Espaço</strong>: A versão direta que armazena strings tem custo de memória maior; use tabela de comprimentos + retrocesso para grandes entradas.</ListItem>
            </ul>
        </div>
    );
};

export default SCSTabulatedExplanation;