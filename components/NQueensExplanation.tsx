import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, Table } from './ExplanationUI';

const NQueensExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">👑 N-Rainhas</h2>
            
            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">O problema das N-Rainhas é o <strong>exemplo prototípico</strong> para ensinar backtracking. Consiste em posicionar N rainhas de xadrez em um tabuleiro N×N de forma que nenhuma rainha ameace outra. Uma rainha pode atacar na horizontal, vertical e diagonal.</p>
            <p className="text-slate-300 mt-2">Este problema ilustra perfeitamente os conceitos fundamentais de backtracking: <strong>exploração sistemática</strong>, <strong>poda inteligente</strong> e <strong>construção incremental</strong> de soluções.</p>

            <SectionTitle>📊 Análise do Problema</SectionTitle>
            <SubTitle>Regras do Xadrez</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Rainha</strong>: Pode mover qualquer número de casas na horizontal, vertical ou diagonal.</li>
                <li><strong>Ameaça</strong>: Duas rainhas se ameaçam se estão na mesma linha, coluna ou diagonal.</li>
                <li><strong>Objetivo</strong>: Posicionar N rainhas sem conflitos.</li>
            </ul>

            <SectionTitle>🔄 Algoritmo de Backtracking</SectionTitle>
            <SubTitle>Estratégia Fundamental</SubTitle>
            <p className="text-slate-300">O algoritmo funciona <strong>linha por linha</strong>, tentando colocar uma rainha em uma coluna válida. Se não houver colunas válidas, ele "retrocede" (backtracks) para a linha anterior e tenta uma coluna diferente.</p>
            <CodeBlock>{`def solve_n_queens_backtracking(n):
    def backtrack(row):
        # Caso base: todas as rainhas foram colocadas
        if row == n:
            solutions.append(board[:])
            return
        
        # Tentar colocar rainha em cada coluna da linha atual
        for col in range(n):
            if is_safe(board, row, col):
                board[row] = col  # Colocar rainha
                backtrack(row + 1)  # Recursão para próxima linha
                # Backtrack é implícito ao sair do loop e voltar
    
    board = [-1] * n
    solutions = []
    backtrack(0)
    return solutions`}</CodeBlock>
            
            <SubTitle>Função de Verificação de Segurança</SubTitle>
            <p className="text-slate-300">Para cada nova posição, verificamos se ela está sob ataque das rainhas já colocadas nas linhas anteriores.</p>
            <CodeBlock>{`def is_safe(board, row, col):
    # Verificar colunas anteriores
    for i in range(row):
        if board[i] == col:
            return False
    
    # Verificar diagonal principal (esquerda superior)
    for i, j in zip(range(row, -1, -1), range(col, -1, -1)):
        if board[i] == j:
            return False
    
    # Verificar diagonal secundária (direita superior)
    for i, j in zip(range(row, -1, -1), range(col, n)):
        if board[i] == j:
            return False
    
    return True`}</CodeBlock>

            <SectionTitle>⚡ Otimizações</SectionTitle>
            <p className="text-slate-300">A verificação `is_safe` pode ser otimizada de O(n) para O(1) usando arrays auxiliares para rastrear colunas e diagonais ocupadas, melhorando drasticamente a performance.</p>

            <SectionTitle>📈 Análise de Complexidade</SectionTitle>
            <p className="text-slate-300">A complexidade do problema é aproximadamente <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(N!)</code>. Embora seja um crescimento fatorial, o backtracking (poda) é muito mais eficiente do que uma busca de força bruta, que seria <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(N^N)</code>.</p>

            <SubTitle>Número de Soluções</SubTitle>
             <Table
                headers={["N", "Soluções Únicas", "Todas as Soluções"]}
                rows={[
                    ["4", "1", "2"],
                    ["5", "2", "10"],
                    ["6", "1", "4"],
                    ["7", "6", "40"],
                    ["8", "12", "92"],
                    ["9", "46", "352"],
                    ["10", "92", "724"],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <p className="text-slate-300">O backtracking é uma técnica poderosa usada em:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Solucionadores de Puzzles</strong>: Sudoku, palavras-cruzadas.</li>
                <li><strong>Planejamento e Agendamento</strong>: Alocação de recursos sem conflitos.</li>
                <li><strong>Design de Circuitos</strong>: Posicionamento de componentes em VLSI.</li>
                <li><strong>Inteligência Artificial</strong>: Problemas de satisfação de restrições (CSP).</li>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">O problema das N-Rainhas é uma excelente introdução ao poder do backtracking. Ele ensina a construir soluções passo a passo e a abandonar caminhos que não levarão a uma solução, podando a árvore de busca de forma eficiente. É um pilar fundamental para a resolução de problemas combinatórios complexos.</p>
        </div>
    );
};

export default NQueensExplanation;