import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const OBSTExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌳 Árvore de Busca Ótima (OBST)</h2>

            <SectionTitle>Visão Geral do Problema</SectionTitle>
            <p className="text-slate-300">O problema da Árvore de Busca Binária Ótima (OBST) consiste em construir uma árvore de busca binária que minimize o custo total de todas as buscas, dado um array ordenado de chaves e suas frequências de busca.</p>
            <SubTitle>Definição Formal</SubTitle>
            <p className="text-slate-300">Dado um array ordenado de chaves `keys[0..n-1]` e um array de frequências `freq[0..n-1]`, onde `freq[i]` é o número de buscas pela chave `keys[i]`, o objetivo é construir uma árvore de busca binária que minimize o custo total de todas as buscas. O custo de um nó é seu nível (profundidade) na árvore multiplicado por sua frequência.</p>

            <SectionTitle>Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">Para cada intervalo de chaves `[i..k]`, a recursão testa todas as chaves possíveis `r` nesse intervalo como a raiz da subárvore. O custo total para essa escolha é a soma das frequências no intervalo, mais o custo ótimo das subárvores esquerda e direita.</p>
            <CodeBlock>{`Custo(i, k) = ( Σ freq[j] de i a k ) + min over r in [i..k] { Custo(i, r-1) + Custo(r+1, k) }`}</CodeBlock>

            <SectionTitle>⚡ Otimização com Memoização</SectionTitle>
            <p className="text-slate-300">A abordagem de backtracking pura é exponencialmente lenta porque resolve os mesmos subproblemas repetidamente. A memoização armazena os resultados dos subproblemas já calculados (o custo ótimo para um intervalo `[i, j]`) em uma tabela, evitando o recálculo e reduzindo drasticamente a complexidade.</p>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
            <Table
                headers={["Abordagem", "Tempo", "Espaço", "Justificativa"]}
                rows={[
                    ["Backtracking Puro", "O(n × 2ⁿ)", "O(n)", "Explora todas as possíveis árvores, resultando em uma complexidade exponencial, similar aos números de Catalan."],
                    [<strong>Com Memoização (DP)</strong>, "O(n³)", "O(n²)", "Existem O(n²) subproblemas. Cada um leva O(n) para ser resolvido (iterando sobre as possíveis raízes). O espaço é para a tabela de memoização."],
                ]}
            />
            <p className="text-slate-400 mt-2">É possível otimizar a solução de programação dinâmica para O(n²) usando a propriedade de monotonicidade de Knuth-Yao, mas a versão O(n³) é mais direta de implementar e entender.</p>
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Compiladores:</strong> Otimização de tabelas de símbolos para análise léxica e sintática.</ListItem>
                <ListItem><strong>Sistemas de Banco de Dados:</strong> Construção de estruturas de índice otimizadas.</ListItem>
                <ListItem><strong>Processamento de Linguagem Natural:</strong> Criação de dicionários eficientes para verificação ortográfica ou autocompletar.</ListItem>
                <ListItem><strong>Compressão de Dados:</strong> Pode ser relacionado a problemas de codificação ótima.</ListItem>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">O problema OBST é um exemplo perfeito de como um problema com uma estrutura recursiva natural pode ser resolvido de forma ineficiente com backtracking puro, mas se torna tratável com a adição de memoização. Ele serve como uma porta de entrada para a programação dinâmica, mostrando o poder de armazenar e reutilizar soluções de subproblemas sobrepostos.</p>
        </div>
    );
};

export default OBSTExplanation;