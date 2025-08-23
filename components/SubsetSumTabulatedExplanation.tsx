import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const SubsetSumTabulatedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎛️ Soma de Subconjuntos com Tabulação</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">
                A solução tabular para a Soma de Subconjuntos constrói uma matriz booleana `S[i, t]`, onde `S[i, t]` indica se a soma `t` é alcançável usando um subconjunto dos primeiros `i` elementos. A abordagem é iterativa (bottom-up), eliminando a recursão.
            </p>
            <SubTitle>Recorrência</SubTitle>
            <p className="text-slate-300">
                Para cada item `i` e cada soma `t`, a decisão é:
            </p>
            <CodeBlock>{`S[i, t] = S[i-1, t] (não incluir item i) 
        OR 
          S[i-1, t - nums[i]] (incluir item i)`}</CodeBlock>

            <SectionTitle>Implementação Essencial (2D)</SectionTitle>
            <CodeBlock>{`def subset_sum_tab(nums, target):
    n = len(nums)
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    
    # Uma soma de 0 é sempre possível com um subconjunto vazio
    for i in range(n + 1):
        dp[i][0] = True
        
    for i in range(1, n + 1):
        val = nums[i - 1]
        for t in range(1, target + 1):
            # Se não incluirmos o item 'i', o resultado é o mesmo de antes
            dp[i][t] = dp[i - 1][t]
            # Se incluirmos o item 'i' (e for possível)
            if t >= val:
                dp[i][t] = dp[i][t] or dp[i - 1][t - val]
                
    return dp[n][target]`}</CodeBlock>

            <SectionTitle>Otimização de Espaço (1D)</SectionTitle>
            <p className="text-slate-300">Como `dp[i]` só depende de `dp[i-1]`, podemos reduzir o espaço de O(n·T) para O(T) usando um único array. É crucial iterar o loop de soma `t` de trás para frente para evitar usar o valor do mesmo item várias vezes na mesma iteração.</p>
            <CodeBlock>{`def subset_sum_tab_1d(nums, target):
    dp = [False] * (target + 1)
    dp[0] = True
    
    for val in nums:
        for t in range(target, val - 1, -1):
            dp[t] = dp[t] or dp[t - val]
            
    return dp[target]`}</CodeBlock>

            <SectionTitle>Análise de Especialista</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Bottom-Up Canônico</strong>: Preenche a tabela em ordem crescente de `i` e `t`.</ListItem>
                <ListItem><strong>Pseudo-Polinomial</strong>: A complexidade O(n·T) depende do valor do alvo `T`, não apenas do tamanho da entrada `n`.</ListItem>
                <ListItem><strong>Tratamento de Negativos</strong>: A abordagem de tabulação clássica não funciona com números negativos. Para isso, a memoização é mais adequada.</ListItem>
            </ul>
        </div>
    );
};

export default SubsetSumTabulatedExplanation;
