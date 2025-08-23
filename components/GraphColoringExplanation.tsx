import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const GraphColoringExplanation = () => {
    const pythonAlgorithm = `def graph_coloring_backtracking(graph, m):
    V = len(graph)
    colors = [0] * V
    
    def is_safe(vertex, color):
        # Verifica se é seguro atribuir a cor ao vértice
        for i in range(V):
            if graph[vertex][i] == 1 and colors[i] == color:
                return False
        return True
    
    def graph_coloring_util(vertex):
        # Caso base: todos os vértices foram coloridos
        if vertex == V:
            return True
        
        # Tenta cada cor disponível para o vértice atual
        for color in range(1, m + 1):
            if is_safe(vertex, color):
                colors[vertex] = color
                
                # Recursão para o próximo vértice
                if graph_coloring_util(vertex + 1):
                    return True
                
                # Backtrack: remove a cor se não levou à solução
                colors[vertex] = 0
        
        # Nenhuma cor funcionou para este vértice
        return False
    
    return colors if graph_coloring_util(0) else None`;

    const pythonDegreeSort = `degrees = [sum(graph[i]) for i in range(V)]
vertex_order = sorted(range(V), key=lambda x: degrees[x], reverse=True)`;

    const pythonIsSafe = `def is_safe(vertex, color):
    for i in range(V):
        if graph[vertex][i] == 1 and colors[i] == color:
            return False
    return True`;
    
    const pythonMemo = `def get_state_key(vertex):
    return f"{vertex}:{tuple(colors[:vertex])}"

memo = {}
def graph_coloring_memoized(vertex):
    state_key = get_state_key(vertex)
    if state_key in memo:
        return memo[state_key]
    # ... resto do algoritmo`;
    
    const welshPowell = `def welsh_powell_coloring(graph):
    # Ordena vértices por grau decrescente
    vertices = sorted(range(V), key=lambda x: degrees[x], reverse=True)
    colors = [0] * V
    
    for vertex in vertices:
        # Encontra a menor cor disponível
        used_colors = set(colors[adj] for adj in range(V) 
                         if graph[vertex][adj] == 1 and colors[adj] > 0)
        color = 1
        while color in used_colors:
            color += 1
        colors[vertex] = color
    
    return colors`;

    const countSolutions = `def graph_coloring_count_solutions(graph, m):
    V = len(graph)
    colors = [0] * V
    solution_count = [0]
    
    def count_solutions_util(vertex):
        if vertex == V:
            solution_count[0] += 1
            return
        
        for color in range(1, m + 1):
            if is_safe(vertex, color):
                colors[vertex] = color
                count_solutions_util(vertex + 1)
                colors[vertex] = 0
    
    count_solutions_util(0)
    return solution_count[0]`;

    const allSolutions = `def graph_coloring_all_solutions(graph, m):
    V = len(graph)
    colors = [0] * V
    solutions = []
    
    def find_all_solutions_util(vertex):
        if vertex == V:
            solutions.append(colors.copy())
            return
        
        for color in range(1, m + 1):
            if is_safe(vertex, color):
                colors[vertex] = color
                find_all_solutions_util(vertex + 1)
                colors[vertex] = 0
    
    find_all_solutions_util(0)
    return solutions`;

    const analyzeComplexity = `def analyze_graph_coloring_complexity(graph, m):
    V = len(graph)
    E = sum(sum(row) for row in graph) // 2
    degrees = [sum(graph[i]) for i in range(V)]
    max_degree = max(degrees) if degrees else 0
    avg_degree = sum(degrees) / V if V > 0 else 0
    
    return {
        "vertices": V,
        "edges": E,
        "colors": m,
        "max_degree": max_degree,
        "avg_degree": avg_degree,
        "worst_case_time": m ** V,
        "best_case_time": V * m,
        "chromatic_number_upper_bound": max_degree + 1,
        "chromatic_number_lower_bound": max(1, V // (V - max_degree)) if max_degree < V else 1
    }`;
    
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎨 Coloração de Grafos</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O problema de <strong>Coloração de Grafos</strong> é um problema NP-completo clássico que envolve atribuir cores aos vértices de um grafo de forma que vértices adjacentes tenham cores diferentes. É uma aplicação direta do backtracking para resolver problemas de satisfação de restrições em grafos.
            </p>
            <SubTitle>Definição Formal</SubTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Entrada:</strong> Um grafo <code>G = (V, E)</code> representado por matriz de adjacência e um inteiro <code>m</code> (número máximo de cores disponíveis).</ListItem>
                <ListItem><strong>Saída:</strong> Uma coloração válida <code>c: V → {`{1, 2, ..., m}`}</code> tal que <code>c(u) ≠ c(v)</code> para toda aresta <code>(u, v) ∈ E</code>, ou <code>None</code> se não for possível colorir com <code>m</code> cores.</ListItem>
            </ul>
            
            <SectionTitle>Estratégia do Algoritmo de Backtracking</SectionTitle>
            <SubTitle>Árvore de Decisão por Vértice</SubTitle>
            <p className="text-slate-300">Para cada vértice <code>vᵢ</code>, a recursão tenta atribuir uma cor de 1 a m:</p>
            <CodeBlock>{`                    v₀?
                   / | \\
                  /  |  \\
                 /   |   \\
               Cor1 Cor2 Cor3
               /     |     \\
            v₁?    v₁?    v₁?
           / | \\  / | \\  / | \\
          /  |  \\/  |  \\/  |  \\
       Cor1 Cor2 Cor3 Cor1 Cor2 Cor3
       / | \\ / | \\ / | \\ / | \\ / | \\ / | \\
      ... ... ... ... ... ... ... ... ... ...`}</CodeBlock>

            <SubTitle>Algoritmo Recursivo</SubTitle>
            <CodeBlock>{pythonAlgorithm}</CodeBlock>

            <SectionTitle>Análise de Complexidade</SectionTitle>
            <SubTitle>Complexidade de Tempo</SubTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Pior caso:</strong> O(m^V) - tenta m cores para cada vértice</ListItem>
                <ListItem><strong>Melhor caso:</strong> O(V × m) - quando cada vértice pode ser colorido na primeira tentativa</ListItem>
                <ListItem><strong>Caso médio:</strong> Depende da estrutura do grafo e do número de cores</ListItem>
            </ul>
            <SubTitle>Complexidade de Espaço</SubTitle>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Recursão:</strong> O(V) - profundidade da pilha de recursão</ListItem>
                <ListItem><strong>Memoização:</strong> O(V × m^V) - tabela de memoização</ListItem>
            </ul>
            <SubTitle>Relação de Recorrência</SubTitle>
            <CodeBlock>{`T(V) = m × T(V-1) + O(V)

A solução é:

T(V) = O(m^V)`}</CodeBlock>

            <SectionTitle>Otimizações Implementadas</SectionTitle>
            <SubTitle>1. Ordenação por Grau</SubTitle>
            <CodeBlock>{pythonDegreeSort}</CodeBlock>
            <p className="text-slate-300"><strong>Vantagens:</strong> Colore vértices de maior grau primeiro, reduz o número de backtrackings necessários, e aproveita restrições mais restritivas cedo.</p>
            <SubTitle>2. Verificação Eficiente</SubTitle>
            <CodeBlock>{pythonIsSafe}</CodeBlock>
            <p className="text-slate-300"><strong>Características:</strong> Verifica apenas vértices adjacentes, terminação antecipada quando possível, O(V) no pior caso, mas O(1) em média.</p>
            <SubTitle>3. Memoização</SubTitle>
            <CodeBlock>{pythonMemo}</CodeBlock>
            <p className="text-slate-300"><strong>Benefícios:</strong> Evita recálculos de estados já visitados, melhora performance para grafos com padrões repetitivos, trade-off entre tempo e espaço.</p>

            <SectionTitle>Aplicações Práticas</SectionTitle>
            <SubTitle>1. Coloração de Mapas</SubTitle>
            <p className="text-slate-300">Colorir países/estados vizinhos com cores diferentes. O Teorema das Quatro Cores afirma que qualquer mapa planar pode ser colorido com 4 cores.</p>
            <SubTitle>2. Agendamento de Exames</SubTitle>
            <p className="text-slate-300">Cada exame é um vértice; estudantes em comum criam arestas. Cores representam horários diferentes.</p>
            <SubTitle>3. Alocação de Registradores</SubTitle>
            <p className="text-slate-300">Variáveis são vértices; uso simultâneo cria arestas. Cores representam registradores diferentes.</p>
            <SubTitle>4. Problema do Sudoku</SubTitle>
            <p className="text-slate-300">Cada célula é um vértice; células na mesma linha/coluna/bloco são adjacentes. Cores representam números de 1 a 9.</p>
            <SubTitle>5. Design de Redes</SubTitle>
            <p className="text-slate-300">Canais são vértices; interferência cria arestas. Cores representam frequências diferentes.</p>

            <SectionTitle>Insights Teóricos</SectionTitle>
            <SubTitle>Número Cromático</SubTitle>
            <p className="text-slate-300">O <strong>número cromático</strong> χ(G) de um grafo G é o menor número de cores necessárias para colorir G.</p>

            <SubTitle>Heurísticas de Coloração</SubTitle>
            <p className="text-slate-300"><strong>1. Welsh-Powell</strong></p>
            <CodeBlock>{welshPowell}</CodeBlock>
            <p className="text-slate-300"><strong>2. DSatur (Degree of Saturation)</strong></p>
            <p className="text-slate-300">Considera o número de cores diferentes usadas pelos vizinhos e escolhe vértices com maior saturação.</p>

            <SectionTitle>Variações do Problema</SectionTitle>
            <SubTitle>1. Coloração de Arestas</SubTitle>
            <SubTitle>2. Coloração Lista</SubTitle>
            <SubTitle>3. Coloração Total</SubTitle>
            
            <SectionTitle>Implementações Específicas</SectionTitle>
            <SubTitle>Contagem de Soluções</SubTitle>
            <CodeBlock>{countSolutions}</CodeBlock>
            <SubTitle>Todas as Soluções</SubTitle>
            <CodeBlock>{allSolutions}</CodeBlock>
            <SubTitle>Análise de Complexidade</SubTitle>
            <CodeBlock>{analyzeComplexity}</CodeBlock>

            <SectionTitle>Conexão com CSP</SectionTitle>
            <p className="text-slate-300">O problema de coloração de grafos é um <strong>Problema de Satisfação de Restrições (CSP)</strong>:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Variáveis:</strong> <code>c(v)</code> para cada vértice v ∈ V</ListItem>
                <ListItem><strong>Domínios:</strong> D(v) = {`{1, 2, ..., m}`} para cada vértice v</ListItem>
                <ListItem><strong>Restrições:</strong> <code>c(u) ≠ c(v)</code> para toda aresta (u, v) ∈ E</ListItem>
            </ul>
        </div>
    );
};
export default GraphColoringExplanation;
