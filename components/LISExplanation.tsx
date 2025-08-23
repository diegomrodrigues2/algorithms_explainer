import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const LISExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📈 LIS (Backtracking)</h2>

            <SectionTitle>Visão Geral do Problema</SectionTitle>
            <p className="text-slate-300">O problema da Subsequência Crescente Mais Longa (LIS) é um problema clássico de algoritmos que consiste em encontrar a subsequência mais longa de uma sequência de números onde cada elemento é maior que o anterior.</p>
            <SubTitle>Definição Formal</SubTitle>
             <p className="text-slate-300">Dada uma sequência A, encontrar a subsequência A[i₁], A[i₂], ..., A[iₖ] tal que:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><code>i₁ {'<'} i₂ {'<'} ... {'<'} iₖ</code> (índices em ordem crescente)</li>
                <li><code>A[i₁] {'<'} A[i₂] {'<'} ... {'<'} A[iₖ]</code> (valores em ordem crescente)</li>
                <li>`k` é o maior possível</li>
            </ul>

            <SectionTitle>🔄 Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">Para cada elemento da sequência, o algoritmo toma uma decisão binária: <strong>incluí-lo</strong> na subsequência atual (se for maior que o último elemento incluído) ou <strong>ignorá-lo</strong>. Essa abordagem explora todas as subsequências crescentes possíveis.</p>
            <SubTitle>Pseudocódigo</SubTitle>
            <CodeBlock>{`def LIS_backtrack(A, index, prev):
    if index >= len(A):
        return 0
    
    # 1. Ignorar o elemento atual
    skip = LIS_backtrack(A, index + 1, prev)
    
    # 2. Incluir o elemento atual (se possível)
    include = 0
    if A[index] > prev:
        include = 1 + LIS_backtrack(A, index + 1, A[index])
    
    return max(skip, include)`}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
             <Table
                headers={["Abordagem", "Tempo", "Espaço", "Justificativa"]}
                rows={[
                    [<strong>Backtracking Puro</strong>, "O(2ⁿ)", "O(n)", "Para cada elemento, há duas ramificações (incluir/ignorar), levando a uma árvore de recursão exponencial."],
                    [<strong>Com Memoização (DP)</strong>, "O(n²)", "O(n²)", "Armazenar resultados para cada estado (índice, valor_anterior) evita recálculos, resultando em complexidade quadrática."],
                     [<strong>DP Otimizado</strong>, "O(n log n)", "O(n)", "Uma solução de programação dinâmica mais avançada usa busca binária para alcançar uma performance ainda melhor."],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Bioinformática:</strong> Análise de sequências de DNA e alinhamento de genes.</li>
                <li><strong>Análise de Dados:</strong> Identificação de tendências em séries temporais (ex: preços de ações).</li>
                <li><strong>Processamento de Sinais:</strong> Filtragem de ruído e reconhecimento de padrões.</li>
                <li><strong>Algoritmos de Grafos:</strong> Relacionado ao problema do caminho mais longo em grafos acíclicos dirigidos (DAGs).</li>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A versão de backtracking do LIS é uma excelente ferramenta educacional para entender a natureza das árvores de decisão e a complexidade exponencial inerente. Ela serve como uma ponte perfeita para introduzir otimizações cruciais como a memoização, que transforma o problema de intratável para computável, abrindo a porta para as soluções mais eficientes de programação dinâmica.</p>
        </div>
    );
};

export default LISExplanation;