import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const FibonacciTabulatedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧮 Fibonacci com Tabulação</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                A <strong>tabulação (ou bottom-up)</strong> constrói soluções para subproblemas do menor para o maior, eliminando a recursão. Para Fibonacci, isso significa preencher um array `dp` onde `dp[i] = dp[i-1] + dp[i-2]`, começando com os casos base `dp[0]=0` e `dp[1]=1`. Esta é a forma mais comum e eficiente de resolver o problema.
            </p>
             <SubTitle>Vínculo Conceitual</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: Um único índice `i` iterando de 0 a `n`.</ListItem>
                <ListItem><strong>Tabela</strong>: Um array `dp[0..n]` para armazenar os resultados intermediários.</ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(n); Espaço O(n), que pode ser otimizado para O(1).</ListItem>
            </ul>

            <SectionTitle>Implementações Essenciais</SectionTitle>
            <SubTitle>Usando uma Tabela Completa (Espaço O(n))</SubTitle>
            <CodeBlock>{`def fib_tabulation(n):
    if n < 2: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]`}</CodeBlock>

            <SubTitle>Otimizado para Espaço O(1)</SubTitle>
            <CodeBlock>{`def fib_iter_optimized(n):
    if n < 2: return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Sem Pilha Recursiva</strong>: A abordagem iterativa evita o overhead de chamadas de função e elimina o risco de estouro de pilha para valores grandes de `n`.</ListItem>
                <ListItem><strong>Equivalência de Resultados</strong>: Produz exatamente os mesmos valores que a memoização, mas geralmente com melhor performance devido à sua natureza iterativa.</ListItem>
                <ListItem><strong>Otimização de Espaço</strong>: Como o cálculo de `dp[i]` só depende dos dois valores anteriores, podemos descartar o restante da tabela, reduzindo o espaço de O(n) para O(1).</ListItem>
            </ul>
        </div>
    );
};

export default FibonacciTabulatedExplanation;