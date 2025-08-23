import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const PalindromePartitioningExplanation = () => {
    const essentialImpl = `from typing import List

def min_cuts_palindrome_partition(s: str) -> int:
    n = len(s)
    if n <= 1:
        return 0
    pal = [[False] * n for _ in range(n)]
    cuts = [0] * n

    for i in range(n):
        min_cuts = i  # no pior caso, cortar antes de cada char
        for j in range(i + 1):
            if s[j] == s[i] and (i - j <= 1 or pal[j + 1][i - 1]):
                pal[j][i] = True
                # se j == 0, todo s[0..i] é palíndromo → 0 cortes
                min_cuts = 0 if j == 0 else min(min_cuts, cuts[j - 1] + 1)
        cuts[i] = min_cuts
    return cuts[-1]`;

    const variation = `def _compute_pal_table(s: str) -> List[List[bool]]:
    n = len(s)
    pal = [[False] * n for _ in range(n)]
    for i in range(n):
        pal[i][i] = True
    for i in range(n - 1):
        pal[i][i + 1] = (s[i] == s[i + 1])
    for length in range(3, n + 1):
        for i in range(0, n - length + 1):
            j = i + length - 1
            pal[i][j] = (s[i] == s[j]) and pal[i + 1][j - 1]
    return pal

def min_cuts_with_explicit_pal(s: str) -> int:
    n = len(s)
    if n <= 1:
        return 0
    pal = _compute_pal_table(s)
    cuts = [0] * n
    for i in range(n):
        if pal[0][i]:
            cuts[i] = 0
            continue
        best = i
        for j in range(1, i + 1):
            if pal[j][i]:
                best = min(best, cuts[j - 1] + 1)
        cuts[i] = best
    return cuts[-1]`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🪞 Partição de Palíndromos (Minimum Cuts)</h2>
            
            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">Dada uma string `s`, queremos particioná-la no menor número de substrings palindrômicas. A solução clássica usa duas estruturas de DP:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <li><code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">pal[i][j]</code>: indica se `s[i..j]` é palíndromo</li>
                <li><code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">cuts[i]</code>: mínimo de cortes para `s[0..i]`</li>
            </ul>
            <p className="text-slate-300 mt-2">Precomputamos `pal` em O(n²) e então preenchemos `cuts` em O(n²).</p>

            <SectionTitle>🧩 Desafio 35 · Partição de Palíndromos</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Vínculo Conceitual</strong>: Erickson, Cap. 3, Exercício 9(c)</ListItem>
                <ListItem><strong>Tabelas</strong>: `pal[i][j]` booleana e `cuts[i]` (1D)</ListItem>
                <ListItem><strong>Transições</strong>:
                    <ul className="list-disc list-inside ml-4 mt-2">
                        <li>Palíndromo: <code className="text-amber-400 bg-slate-700/50 px-1 py-0.5 rounded">pal[i][j] = (s[i] == s[j]) and (j - i {'<='} 1 or pal[i+1][j-1])</code></li>
                        <li>Cortes: se `s[0..i]` é pal, <code className="text-amber-400 bg-slate-700/50 px-1 py-0.5 rounded">cuts[i] = 0</code>; senão <code className="text-amber-400 bg-slate-700/50 px-1 py-0.5 rounded">cuts[i] = min(cuts[i], cuts[j-1] + 1)</code> para todo `j ≤ i` com `pal[j][i]` verdadeiro</li>
                    </ul>
                </ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(n²), Espaço O(n²)</ListItem>
            </ul>

            <SectionTitle>🔧 Implementação Essencial (pré-cálculo pal + cortes)</SectionTitle>
            <CodeBlock>{essentialImpl}</CodeBlock>

            <SectionTitle>♻️ Variação: Geração de `pal` por comprimentos</SectionTitle>
            <CodeBlock>{variation}</CodeBlock>

            <SectionTitle>🧠 Análise de Especialista</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Pré-computação Crucial</strong>: `pal[i][j]` torna cada consulta de palíndromo O(1), viabilizando `cuts` em O(n²).</ListItem>
                <ListItem><strong>Casos Limite</strong>: Strings vazias ou já palindrômicas têm 0 cortes.</ListItem>
                <ListItem><strong>Otimizações</strong>: Checagens de palíndromo por expansão de centros também levam a O(n²) e reduzem memória, mantendo a DP de cortes.</ListItem>
            </ul>
        </div>
    );
};

export default PalindromePartitioningExplanation;
