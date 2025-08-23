import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const LISTabulatedExplanation = () => {
    const pythonImplementation = `def lis_tabulation(arr):
    n = len(arr)
    if n == 0: return 0
    dp = [1] * n
    for i in range(n):
        for j in range(i):
            if arr[j] < arr[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`;

    const pythonWithPath = `def lis_tabulation_with_path(arr):
    n = len(arr)
    dp = [1] * n
    parent = [-1] * n
    best_len, best_end = 0, -1
    if n > 0:
        best_len, best_end = 1, 0
    
    for i in range(n):
        for j in range(i):
            if arr[j] < arr[i] and dp[j] + 1 > dp[i]:
                dp[i] = dp[j] + 1
                parent[i] = j
        if dp[i] > best_len:
            best_len, best_end = dp[i], i
    
    # Reconstrução
    seq = []
    k = best_end
    while k != -1:
        seq.append(arr[k])
        k = parent[k]
    return seq[::-1]`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📈 LIS com Tabulação (O(n²))</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">A formulação tabular define <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">dp[i]</code> como o comprimento da LIS que **termina** em `i`. Para cada `i`, olhamos todos os `j {'<'} i` com <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">A[j] {'<'} A[i]</code> e fazemos <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">dp[i] = 1 + max(dp[j])</code>. O resultado é <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">max(dp)</code>.</p>

            <SubTitle>🧩 Desafio 29 · LIS com Tabulação (O(n²))</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">dp[i]</code> = tamanho da LIS que termina no índice `i`.</ListItem>
                <ListItem><strong>Transição</strong>: <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">dp[i] = 1 + max({'{'}dp[j] | 0 ≤ j {'<'} i, A[j] {'<'} A[i]{'}'})</code>.</ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n²)</code>, Espaço <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n)</code>.</ListItem>
            </ul>

            <SectionTitle>🔧 Implementação Essencial</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>
            
            <SubTitle>🔁 Reconstrução de Caminho</SubTitle>
            <p className="text-slate-300">Para reconstruir a LIS, um array `parent` é usado para rastrear o predecessor de cada elemento na sua subsequência crescente ótima.</p>
            <CodeBlock>{pythonWithPath}</CodeBlock>

            <SectionTitle>🧠 Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Escolha de Estado</strong>: Definir a LIS como "terminando em `i`" é a chave para a transição O(n) dentro do loop, levando à complexidade total de O(n²).</ListItem>
                <ListItem><strong>Abordagem Bottom-Up</strong>: A tabulação resolve subproblemas menores primeiro (LIS terminando em `i=0, 1, 2,...`), usando esses resultados para construir soluções para subproblemas maiores.</ListItem>
                <ListItem><strong>Comparação</strong>: É geralmente mais performático que a memoização por evitar o overhead de chamadas recursivas, embora a complexidade assintótica seja a mesma.</ListItem>
            </ul>
        </div>
    );
};

export default LISTabulatedExplanation;