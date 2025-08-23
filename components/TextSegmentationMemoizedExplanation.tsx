import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const TextSegmentationMemoizedExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🧠 Segmentação de Texto com Memoização</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">O problema de <strong>Segmentação de Texto (Word Break)</strong> consiste em determinar se uma string sem espaços pode ser segmentada em uma sequência de palavras válidas usando um dicionário. A transição de backtracking exponencial O(2ⁿ) para programação dinâmica O(n²) demonstra a essência da PD.</p>

            <SectionTitle>🔄 Estratégias de Implementação</SectionTitle>
            <SubTitle>Memoização (Recursivo Top-Down)</SubTitle>
            <CodeBlock>{`memo = {}
def can_break(s):
    if s in memo: return memo[s]
    if s == "": return []
    
    for i in range(1, len(s) + 1):
        prefix = s[:i]
        if prefix in dictionary:
            suffix_result = can_break(s[i:])
            if suffix_result is not None:
                memo[s] = [prefix] + suffix_result
                return memo[s]
    
    memo[s] = None
    return None`}</CodeBlock>

            <SubTitle>Tabelação (Iterativo Bottom-Up)</SubTitle>
            <CodeBlock>{`dp = [False] * (n + 1)
dp[0] = True

for i in range(1, n + 1):
    for j in range(i):
        if dp[j] and text[j:i] in dictionary:
            dp[i] = True
            break`}</CodeBlock>

            <SectionTitle>🧠 Análise de Subproblemas</SectionTitle>
            <SubTitle>Estado do Subproblema</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Definição</strong>: `dp[i]` = "O sufixo `text[i..n]` pode ser segmentado?"</ListItem>
                <ListItem><strong>Estados possíveis</strong>: `n` (um para cada posição inicial)</ListItem>
                <ListItem><strong>Sobreposição</strong>: Múltiplos caminhos chegam ao mesmo estado, justificando o cache.</ListItem>
            </ul>

            <SubTitle>Estrutura Ótima</SubTitle>
            <p className="text-slate-300">Se `text[i..j]` é uma palavra válida e `text[j..n]` pode ser segmentado, então `text[i..n]` também pode. A fórmula é:</p>
            <CodeBlock>dp[i] = OR(dp[j] AND is_word(text[i..j])) para j > i</CodeBlock>

            <SectionTitle>⚡ Melhoria de Performance</SectionTitle>
            <Table
                headers={["Abordagem", "Complexidade", "Vantagem"]}
                rows={[
                    ["Backtracking", "O(2ⁿ)", "Simples de conceber"],
                    ["Memoização (DP)", "O(n²)", "Evita recálculos exponenciais"],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Processamento de Linguagem</strong>: Essencial para idiomas sem espaços como chinês, japonês e tailandês.</ListItem>
                <ListItem><strong>Correção Automática</strong>: Sugerir correções para palavras concatenadas (ex: "showdebola" → "show de bola").</ListItem>
                <ListItem><strong>Análise de URL</strong>: Extrair palavras-chave de slugs (ex: `/artigo/como-usar-backtracking`).</ListItem>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A Segmentação de Texto é um exemplo fantástico que demonstra a necessidade de otimização em algoritmos recursivos. Enquanto o backtracking fornece uma estrutura lógica, a adição da memoização o transforma em uma ferramenta prática e eficiente.</p>
        </div>
    );
};

export default TextSegmentationMemoizedExplanation;