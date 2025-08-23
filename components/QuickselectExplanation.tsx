import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const QuickselectExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔍 Quickselect</h2>
            
            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O Quickselect é uma aplicação brilhante da ideia de particionamento do Quicksort. Em vez de recursão em ambos os lados do pivô, ele descarta um lado e continua a busca apenas na partição que deve conter o k-ésimo elemento. Isso reduz a complexidade média de O(n log n) para O(n), tornando-o um dos algoritmos de seleção mais eficientes na prática.</p>

            <SectionTitle>Conceitos Fundamentais</SectionTitle>
            <SubTitle>Problema de Seleção</SubTitle>
            <p className="text-slate-300">O problema de seleção consiste em encontrar o k-ésimo menor elemento em um array não ordenado. Este é um problema fundamental em ciência da computação, com aplicações em:</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-400">
                <li><strong>Estatística:</strong> Cálculo de medianas, quartis, percentis</li>
                <li><strong>Machine Learning:</strong> Seleção de features, outliers</li>
                <li><strong>Sistemas de Banco de Dados:</strong> Otimização de consultas</li>
                <li><strong>Algoritmos de Ordenação:</strong> Como subrotina em outros algoritmos</li>
            </ul>

            <SubTitle>Estratégia de Divisão e Conquista</SubTitle>
            <p className="text-slate-300">O Quickselect segue o paradigma de divisão e conquista, mas com uma otimização crucial:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Dividir:</strong> Particionar o array usando um pivô</li>
                <li><strong>Conquistar:</strong> Recursão apenas no lado relevante</li>
                <li><strong>Combinar:</strong> Não há combinação - o elemento é encontrado diretamente</li>
            </ol>

            <SectionTitle>Algoritmo Básico</SectionTitle>
            <SubTitle>Pseudocódigo</SubTitle>
            <CodeBlock>{`function quickselect(array, k):
    if length(array) == 1:
        return array[0]
    
    pivot = partition(array)
    pivot_rank = pivot + 1
    
    if k == pivot_rank:
        return array[pivot]
    elif k < pivot_rank:
        return quickselect(left_partition, k)
    else:
        return quickselect(right_partition, k - pivot_rank)`}</CodeBlock>

            <SectionTitle>Análise de Complexidade</SectionTitle>
             <Table 
                headers={["Aspecto", "Quicksort", "Quickselect"]}
                rows={[
                    [<strong>Recorrência</strong>, <code>T(n) = 2T(n/2) + O(n)</code>, <code>T(n) = T(n/2) + O(n)</code>],
                    [<strong>Complexidade</strong>, <code>O(n log n)</code>, <code>O(n)</code>],
                    [<strong>Recursão</strong>, "Ambos os lados", "Apenas um lado"],
                    [<strong>Objetivo</strong>, "Ordenar todo o array", "Encontrar um elemento"]
                ]}
            />
            
            <SectionTitle>Análise de Performance</SectionTitle>
            <SubTitle>Casos de Uso</SubTitle>
             <Table 
                headers={["Cenário", "Performance", "Explicação"]}
                rows={[
                    ["Pivô sempre mediano", <code>O(n)</code>, "Redução ideal do problema"],
                    ["Pivô sempre extremo", <code>O(n²)</code>, "Pior caso possível"],
                    ["Pivô aleatório", <code>O(n) esperado</code>, "Probabilisticamente linear"],
                    ["Array já ordenado", <code>O(n²)</code>, "Sem otimização de pivô"]
                ]}
            />
            <SubTitle>Comparação com Outros Algoritmos</SubTitle>
            <Table
                headers={["Algoritmo", "Tempo Médio", "Tempo Pior Caso", "Espaço", "Estável"]}
                rows={[
                    [<strong>Quickselect</strong>, <code>O(n)</code>, <code>O(n²)</code>, <code>O(log n)</code>, "Não"],
                    ["Heap Select", <code>O(n + k log n)</code>, <code>O(n + k log n)</code>, <code>O(1)</code>, "Não"],
                    ["Sort + Select", <code>O(n log n)</code>, <code>O(n log n)</code>, <code>O(n)</code>, "Sim"],
                    ["BFPRT", <code>O(n)</code>, <code>O(n)</code>, <code>O(n)</code>, "Não"]
                ]}
            />
            <SectionTitle>Conclusão</SectionTitle>
            <p className="text-slate-300">O Quickselect representa uma aplicação elegante e eficiente do paradigma de divisão e conquista. Sua capacidade de encontrar o k-ésimo elemento em tempo linear médio o torna indispensável em muitas aplicações práticas, desde cálculos estatísticos até otimizações de sistemas de banco de dados.</p>
            <p className="text-slate-400 mt-2">A chave para sua eficiência está na redução do problema: em vez de processar ambos os lados do pivô, o algoritmo descarta metade do array a cada iteração, resultando em uma complexidade linear média que é difícil de superar com algoritmos baseados em comparação.</p>
        </div>
    );
};

export default QuickselectExplanation;