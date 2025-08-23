import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const FibonacciMemoizedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧠 Fibonacci com Memoização</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O problema de Fibonacci clássico, definido por F(n) = F(n-1) + F(n-2) com F(0)=0 e F(1)=1, tem uma solução recursiva ingênua que é exponencial devido à recomputação de subproblemas. A <strong>memoização</strong> armazena F(k) após a primeira computação, reduzindo drasticamente o tempo para <strong>O(n)</strong>.
            </p>
            <SubTitle>Vínculo Conceitual</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado</strong>: Um único índice `n`, pois existem apenas `n+1` subproblemas (de 0 a n).</ListItem>
                <ListItem><strong>Cache</strong>: Um mapa (dicionário) ou array para armazenar os resultados de `n → F(n)`.</ListItem>
                <ListItem><strong>Complexidade</strong>: Tempo O(n), Espaço O(n) para o cache e a pilha de recursão.</ListItem>
            </ul>

            <SectionTitle>Implementações Essenciais</SectionTitle>
            <SubTitle>Usando um Dicionário como Cache</SubTitle>
            <CodeBlock>{`cache = {0: 0, 1: 1}
def fib_memo(n):
    if n in cache:
        return cache[n]
    
    cache[n] = fib_memo(n-1) + fib_memo(n-2)
    return cache[n]`}</CodeBlock>

            <SubTitle>Usando Decorador (Python)</SubTitle>
            <CodeBlock>{`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n-1) + fib(n-2)`}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Por que O(2ⁿ) vira O(n)?</strong> Cada valor F(k) é calculado no máximo uma vez. Todas as chamadas subsequentes para F(k) são respondidas em tempo O(1) a partir do cache.</ListItem>
                <ListItem><strong>Árvore de Recorrência</strong>: A árvore de recursão binária e cheia da solução ingênua "colapsa" em um Grafo Acíclico Dirigido (DAG) quase linear, pois os nós duplicados são fundidos.</ListItem>
                <ListItem><strong>Validação</strong>: A memoização produz resultados idênticos aos da abordagem iterativa (tabulação), mas com o custo adicional da pilha de chamadas recursivas.</ListItem>
            </ul>
        </div>
    );
};

export default FibonacciMemoizedExplanation;