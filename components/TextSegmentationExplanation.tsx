import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const TextSegmentationExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📝 Segmentação de Texto</h2>

            <SectionTitle>Visão Geral do Problema</SectionTitle>
            <p className="text-slate-300">O problema de Segmentação de Texto (ou "Word Break") é um problema clássico de processamento de linguagem que se encaixa perfeitamente no paradigma de backtracking. O objetivo é determinar se uma string sem espaços pode ser dividida em uma sequência de palavras válidas de um dicionário.</p>
            <SubTitle>Definição Formal</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Entrada:</strong> Uma string `S` e um dicionário de palavras válidas.</li>
                <li><strong>Saída:</strong> Uma segmentação válida de `S` (ex: `["hello", "world"]`) ou `None` se for impossível.</li>
            </ul>

            <SectionTitle>🔄 Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">O algoritmo explora a string da esquerda para a direita, tentando encontrar prefixos que correspondam a palavras no dicionário. Para cada prefixo válido encontrado, ele faz uma chamada recursiva para tentar segmentar o restante da string.</p>
            <CodeBlock>{`def segment(text, dictionary):
    # Caso base: string vazia é uma segmentação válida
    if not text:
        return []
    
    # Tenta todos os prefixos
    for i in range(1, len(text) + 1):
        prefix = text[:i]
        
        if prefix in dictionary:
            # Encontrou um prefixo válido, tenta segmentar o resto
            suffix_segmentation = segment(text[i:], dictionary)
            
            # Se o resto pôde ser segmentado, a solução está completa
            if suffix_segmentation is not None:
                return [prefix] + suffix_segmentation
    
    # Nenhum prefixo levou a uma solução, retorna falha
    return None`}</CodeBlock>

            <SectionTitle>⚡ Otimização com Memoização</SectionTitle>
            <p className="text-slate-300">A abordagem de backtracking pura tem uma complexidade de O(2ⁿ) devido à recomputação massiva de subproblemas sobrepostos. A memoização (ou programação dinâmica) é crucial aqui, armazenando os resultados para subproblemas já resolvidos. Isso reduz a complexidade para O(n²).</p>
            <CodeBlock>{`memo = {}
def segment_memo(text, dictionary):
    if text in memo: return memo[text]
    # ... mesma lógica de antes ...
    memo[text] = result
    return result`}</CodeBlock>

            <SectionTitle>📈 Análise de Complexidade (Com Memoização)</SectionTitle>
             <Table
                headers={["Aspecto", "Complexidade", "Justificativa"]}
                rows={[
                    ["Tempo", "O(n²)", "Existem `n` subproblemas (sufixos). Para cada um, o loop pode iterar `n` vezes, e o fatiamento da string leva O(n)."],
                    ["Espaço", "O(n²)", "O(n) para a pilha de recursão e O(n²) para armazenar os resultados na memoização no pior caso."],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Processamento de Linguagem Natural:</strong> Essencial para linguagens sem espaços como Chinês, Japonês e Tailandês.</li>
                <li><strong>Correção Automática:</strong> Sugerir correções para palavras concatenadas (ex: "showdebola" -> "show de bola").</li>
                <li><strong>Análise de URL:</strong> Extrair palavras-chave de slugs de URL (ex: `/artigo/como-usar-backtracking`).</li>
                <li><strong>Bioinformática:</strong> Identificar genes ou padrões em sequências de DNA.</li>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A Segmentação de Texto é um exemplo fantástico que demonstra a necessidade de otimização em algoritmos recursivos. Enquanto o backtracking fornece uma estrutura lógica e elegante, é a adição da memoização que o torna uma ferramenta prática e eficiente para resolver este problema do mundo real.</p>
        </div>
    );
};

export default TextSegmentationExplanation;