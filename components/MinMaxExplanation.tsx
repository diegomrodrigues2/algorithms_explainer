import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, Table } from './ExplanationUI';

const MinMaxExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔍 Encontrar Min-Max</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                O problema de encontrar o elemento mínimo e máximo em um array é um exemplo clássico de otimização de algoritmos. Ele demonstra como a reestruturação inteligente pode reduzir significativamente o número de operações, ilustrando conceitos de análise de complexidade e trade-offs.
            </p>

            <SectionTitle>📊 Análise do Problema</SectionTitle>
            <SubTitle>Abordagem Ingênua (2n-2 comparações)</SubTitle>
            <p className="text-slate-300">A solução mais direta compara cada elemento com o mínimo e máximo atuais. Isso resulta em 2 comparações para cada um dos (n-1) elementos, totalizando 2n-2 comparações.</p>
            
            <SubTitle>Abordagem de Pares (Otimizada - 3n/2 comparações)</SubTitle>
            <p className="text-slate-300">A chave da otimização é processar elementos em pares. Esta visualização demonstra esta abordagem.</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Comparar elementos em pares:</strong> Para cada par, uma comparação determina o menor e o maior local. Custo: n/2 comparações.</li>
                <li><strong>Comparar menor com min global:</strong> O menor do par é comparado com o mínimo global. Custo: n/2 comparações.</li>
                <li><strong>Comparar maior com max global:</strong> O maior do par é comparado com o máximo global. Custo: n/2 comparações.</li>
            </ol>
            <p className="mt-2 text-slate-300 font-semibold">Total: ≈ 3n/2 comparações. Uma melhoria de 25%!</p>
            <CodeBlock>{`def find_min_max_pairs(arr):
    # ... inicialização
    
    # Processar elementos em pares
    for i in range(2, n - 1, 2):
        # 1ª comparação
        if arr[i] < arr[i + 1]:
            # 2ª comparação
            min_val = min(min_val, arr[i])
            # 3ª comparação
            max_val = max(max_val, arr[i + 1])
        else:
            min_val = min(min_val, arr[i + 1])
            max_val = max(max_val, arr[i])
    
    # ... tratar caso ímpar
    return min_val, max_val`}</CodeBlock>

            <SectionTitle>📈 Análise Comparativa</SectionTitle>
            <Table
                headers={["Abordagem", "Comparações", "Vantagens"]}
                rows={[
                    [<strong>Ingênua</strong>, "2n-2", "Simples, fácil de implementar"],
                    [<strong>Pares (Visualizada)</strong>, "≈ 3n/2", "Otimizada, 25% menos comparações"],
                    [<strong>Divisão e Conquista</strong>, "≈ 3n/2", "Elegante, recursiva"],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Estatística Descritiva:</strong> Cálculo de range, detecção de outliers.</li>
                <li><strong>Gráficos de Computador:</strong> Determinar caixas delimitadoras (bounding boxes).</li>
                <li><strong>Otimização de Algoritmos:</strong> Normalização de dados (escalonamento min-max).</li>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">
                O problema de encontrar mínimo e máximo demonstra como uma análise cuidadosa pode levar a otimizações significativas. A redução de 25% nas comparações, simplesmente processando em pares, ilustra o poder da reestruturação inteligente de algoritmos.
            </p>
        </div>
    );
};

export default MinMaxExplanation;