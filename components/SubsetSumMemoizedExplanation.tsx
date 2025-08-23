import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const SubsetSumMemoizedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧠 Soma de Subconjuntos com Memoização</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Implementação do problema da <strong>Soma de Subconjuntos</strong> usando <strong>memoização</strong>, demonstrando a transição fundamental de algoritmos de backtracking exponenciais para soluções de programação dinâmica eficientes. Esta é a quintessência da filosofia "PD é recursão inteligente".
            </p>

            <SectionTitle>🧠 Análise de Especialista</SectionTitle>
            <SubTitle>Filosofia Central</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>"PD é Recursão Inteligente"</strong>: Não é uma técnica nova, mas otimização de algoritmos recursivos.</ListItem>
                <ListItem><strong>Transição Suave</strong>: Mantém estrutura lógica da recursão original.</ListItem>
                <ListItem><strong>Cache Inteligente</strong>: Adiciona cache para evitar recálculos exponenciais.</ListItem>
            </ul>

            <SubTitle>Análise de Complexidade</SubTitle>
            <Table
                headers={["Abordagem", "Complexidade", "Descrição"]}
                rows={[
                    ["Backtracking", "O(2^n)", "Exploração exponencial de todos os subconjuntos"],
                    ["Memoização", "O(n·T)", "Pseudo-polinomial, onde T é o valor alvo"],
                    ["Melhoria", "Exponencial → Pseudo-polinomial", "Redução drástica de complexidade"],
                ]}
            />
            
            <SectionTitle>⚙️ Estrutura da Implementação</SectionTitle>
            <SubTitle>Função Principal: `subset_sum_memoization`</SubTitle>
            <CodeBlock>{`def subset_sum_memoization(nums, target):
    memo = {}
    
    def dp(i, t):
        if (i, t) in memo:
            return memo[(i, t)]
        
        if t == 0: return True
        if i >= len(nums) or t < 0: return False
        
        # Recursão com memoização
        result = dp(i + 1, t - nums[i]) or dp(i + 1, t)
        memo[(i, t)] = result
        return result
    
    return dp(0, target)`}</CodeBlock>

            <SubTitle>Identificação do Estado</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Estado (i, t)</strong>: "Existe um subconjunto de `nums[i..n-1]` que soma `t`?"</ListItem>
                <ListItem><strong>Chave do Cache</strong>: Par `(i, t)` como identificador único do subproblema.</ListItem>
                <ListItem><strong>Independência</strong>: Cada subproblema pode ser resolvido independentemente.</ListItem>
            </ul>

            <SectionTitle>📊 Complexidade e Limitações</SectionTitle>
            <SubTitle>Análise Detalhada</SubTitle>
             <Table
                headers={["Aspecto", "Complexidade", "Descrição"]}
                rows={[
                    ["Tempo", "O(n·T)", "Pseudo-polinomial, onde T é o valor alvo"],
                    ["Espaço", "O(n·T)", "Cache de memoização para todos os subproblemas"],
                    ["Vantagem", "Reduz O(2ⁿ) para O(n·T)", "Melhoria exponencial"],
                    ["Limitação", "Ainda pode ser lento para T muito grande", "Pseudo-polinomial"],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Problemas de Otimização</strong>: Alocação de recursos, balanceamento de carga, problemas de partição.</ListItem>
                <ListItem><strong>Teoria da Computação</strong>: Exemplo clássico de problema NP-completo.</ListItem>
                <ListItem><strong>Problemas Relacionados</strong>: Problema da Mochila (Knapsack), Troco de Moedas (Coin Change).</ListItem>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A implementação da Soma de Subconjuntos com memoização demonstra a essência da programação dinâmica:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Transição Fundamental</strong>: De O(2ⁿ) para O(n·T) pseudo-polinomial.</li>
                <li><strong>Recursão Inteligente</strong>: PD como otimização de algoritmos recursivos.</li>
                <li><strong>Identificação de Estado</strong>: Par `(i, t)` como representação única de subproblemas.</li>
                <li><strong>Cache Eficiente</strong>: Memoização que elimina recálculos exponenciais.</li>
            </ol>
            <p className="mt-2 text-slate-300">Esta implementação serve como base fundamental para entender a transição de algoritmos de força bruta para soluções eficientes.</p>
        </div>
    );
};

export default SubsetSumMemoizedExplanation;
