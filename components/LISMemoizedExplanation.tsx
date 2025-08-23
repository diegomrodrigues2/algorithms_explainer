import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const LISMemoizedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧠 LIS com Memoização</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O problema da <strong>Subsequência Crescente Mais Longa (LIS)</strong> consiste em encontrar o comprimento da maior subsequência estritamente crescente em um array. A transição de backtracking exponencial O(2ⁿ) para programação dinâmica O(n²) usando a formulação LISbigger(i, j) demonstra a elegância da memoização.</p>
            <SubTitle>Desafio 23 · First Recurrence: Is This Next?</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Vínculo Conceitual</strong>: Erickson, Cap. 3, Sec. 3.6</ListItem>
                <ListItem><strong>Estado</strong>: par `(current_index, previous_index)` que captura a dependência do elemento anterior.</ListItem>
                <ListItem><strong>Cache</strong>: tabela/dicionário 2D mapeando `(i, j)` para o valor de LIS restante.</ListItem>
                <ListItem><strong>Complexidade</strong>: O(n²) em tempo e espaço na abordagem memoizada clássica.</ListItem>
            </ul>

            <SectionTitle>Estratégias de Implementação</SectionTitle>
            <SubTitle>Backtracking Puro (O(2ⁿ))</SubTitle>
            <CodeBlock>{`def lis_backtracking(arr):
    def dfs(index, previous_value):
        if index == len(arr):
            return 0
        # Opção 1: pular arr[index]
        best = dfs(index + 1, previous_value)
        # Opção 2: incluir arr[index]
        if arr[index] > previous_value:
            best = max(best, 1 + dfs(index + 1, arr[index]))
        return best
    return dfs(0, float("-inf"))`}</CodeBlock>

            <SubTitle>Memoização (O(n²)) - Visualizada</SubTitle>
            <CodeBlock>{`memo = {}
def lis_memoization(arr):
    def dfs(i, prev_idx):
        if (i, prev_idx) in memo: return memo[(i, prev_idx)]
        if i == len(arr): return 0
        # Pular arr[i]
        best = dfs(i + 1, prev_idx)
        # Incluir arr[i]
        if prev_idx == -1 or arr[i] > arr[prev_idx]:
            best = max(best, 1 + dfs(i + 1, i))
        memo[(i, prev_idx)] = best
        return best
    return dfs(0, -1)`}</CodeBlock>
            
            <SectionTitle>Análise de Subproblemas (Formulação LISbigger)</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Definição</strong>: `LISbigger(i, j)` = "Comprimento da LIS começando em `i` com elemento anterior em `j`".</ListItem>
                <ListItem><strong>Estados possíveis</strong>: n² (para cada par de índices).</ListItem>
                <ListItem><strong>Sobreposição</strong>: Múltiplos caminhos chegam ao mesmo estado, justificando o cache.</ListItem>
            </ul>

            <SectionTitle>Melhoria de Performance</SectionTitle>
            <Table
                headers={["Abordagem", "Complexidade", "Vantagem", "Desvantagem"]}
                rows={[
                    ["Backtracking", "O(2ⁿ)", "Simples", "Exponencial"],
                    ["Memoização", "O(n²)", "Eficiente", "Cache 2D"],
                    ["Tabulação", "O(n²)", "Sem recursão", "Tabela"],
                    ["Busca Binária", "O(n log n)", "Ótimo", "Complexo"],
                ]}
            />
        </div>
    );
};

export default LISMemoizedExplanation;
