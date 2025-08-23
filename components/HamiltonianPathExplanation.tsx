import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const HamiltonianPathExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">➡️ Caminho Hamiltoniano</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O problema do <strong>Caminho Hamiltoniano</strong> é um problema NP-completo clássico que envolve encontrar um caminho em um grafo que visite todos os vértices exatamente uma vez. É uma aplicação direta do backtracking para resolver problemas de busca em grafos.
            </p>
            <SubTitle>Definição Formal</SubTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Entrada:</strong> Um grafo `G = (V, E)` representado por matriz de adjacência.</ListItem>
                <ListItem><strong>Saída:</strong> Uma sequência de vértices `(v₁, v₂, ..., vₙ)` tal que todos os vértices são visitados exatamente uma vez e vértices consecutivos são adjacentes, ou `None` se não existir.</ListItem>
            </ul>
            
            <SectionTitle>Estratégia do Algoritmo de Backtracking</SectionTitle>
            <SubTitle>Algoritmo Recursivo</SubTitle>
            <CodeBlock>{`def hamiltonian_path_backtracking(graph):
    V = len(graph)
    path = [-1] * V

    def is_safe(v, pos, path):
        # Verifica se o vértice v pode ser adicionado na posição pos
        if graph[path[pos - 1]][v] == 0:
            return False
        # Verifica se o vértice já foi incluído
        if v in path:
            return False
        return True

    def solve_util(pos):
        # Caso base: todos os vértices foram incluídos
        if pos == V:
            return True

        # Tenta diferentes vértices para a próxima posição
        for v in range(1, V):
            if is_safe(v, pos, path):
                path[pos] = v
                if solve_util(pos + 1):
                    return True
                # Backtrack
                path[pos] = -1
        return False

    path[0] = 0 # Começa pelo vértice 0
    if not solve_util(1):
        return None # Nenhuma solução encontrada
    return path`}</CodeBlock>

            <SectionTitle>Análise de Complexidade</SectionTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Tempo (Pior Caso):</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(V!)</code> - No pior caso, o algoritmo explora todas as permutações possíveis de vértices.</ListItem>
                <ListItem><strong>Espaço:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(V)</code> - Para a pilha de recursão e para armazenar o caminho.</ListItem>
            </ul>

            <SectionTitle>Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Problema do Caixeiro Viajante (TSP):</strong> Encontrar a rota mais curta que visita um conjunto de cidades é uma generalização do problema do ciclo Hamiltoniano.</ListItem>
                <ListItem><strong>Sequenciamento de DNA:</strong> Montar fragmentos de DNA em uma sequência genômica completa.</ListItem>
                <ListItem><strong>Design de Circuitos:</strong> Planejar rotas para fiação em placas de circuito impresso.</ListItem>
                <ListItem><strong>Agendamento e Roteamento:</strong> Otimização de rotas de entrega ou sequenciamento de tarefas com dependências.</ListItem>
            </ul>

            <SectionTitle>Condições & Teoremas</SectionTitle>
            <SubTitle>Teorema de Dirac (1952)</SubTitle>
            <p className="text-slate-300">Se um grafo `G` com `V ≥ 3` vértices tem um grau mínimo `δ(G) ≥ V/2`, então `G` contém um ciclo Hamiltoniano.</p>
            <SubTitle>Teorema de Ore (1960)</SubTitle>
            <p className="text-slate-300">Se para cada par de vértices não adjacentes `u` e `v` em `G`, a soma de seus graus `deg(u) + deg(v) ≥ V`, então `G` contém um ciclo Hamiltoniano.</p>
            
            <SectionTitle>Conexão com o Ciclo Hamiltoniano</SectionTitle>
            <p className="text-slate-300">Um **Ciclo Hamiltoniano** é um caminho Hamiltoniano que é um ciclo, ou seja, existe uma aresta entre o último e o primeiro vértice do caminho. Encontrar um ciclo é geralmente mais restrito e difícil do que encontrar apenas um caminho.</p>
        </div>
    );
};

export default HamiltonianPathExplanation;
