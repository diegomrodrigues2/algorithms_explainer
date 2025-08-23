import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const SubsetGenerationExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">📚 Geração de Subconjuntos</h2>

            <SectionTitle>Visão Geral do Problema</SectionTitle>
            <p className="text-slate-300">O problema de Geração de Subconjuntos (também conhecido como "Power Set") é um problema fundamental de enumeração combinatória. O objetivo é listar todos os subconjuntos possíveis de um conjunto dado. Este problema demonstra a estrutura de decisão binária (incluir/excluir) que é central para muitos algoritmos de backtracking.</p>
            <SubTitle>Definição Formal</SubTitle>
            <p className="text-slate-300">Dado um conjunto S = {'{s₁, s₂, ..., sₙ}'}, o conjunto das partes P(S) é o conjunto de todos os subconjuntos de S, incluindo o conjunto vazio e o próprio conjunto S.</p>
            <SubTitle>Propriedades</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Cardinalidade</strong>: Para um conjunto de `n` elementos, existem `2ⁿ` subconjuntos possíveis.</li>
                <li><strong>Estrutura de Decisão</strong>: Para cada elemento, existem duas escolhas: ou ele está no subconjunto, ou não está.</li>
            </ul>

            <SectionTitle>🔄 Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">O algoritmo constrói uma árvore de decisão binária. Em cada nível da árvore, ele decide se deve incluir ou excluir o elemento correspondente daquele nível no subconjunto que está sendo formado. A exploração completa dessa árvore gera todos os subconjuntos possíveis.</p>
            <CodeBlock>{`def generate_subsets(elements):
    result = []
    
    def backtrack(index, current_subset):
        # Adiciona o estado atual como um subconjunto válido
        result.append(list(current_subset))
        
        # Explora as próximas decisões
        for i in range(index, len(elements)):
            # Incluir o elemento
            current_subset.append(elements[i])
            backtrack(i + 1, current_subset)
            
            # Excluir o elemento (backtrack)
            current_subset.pop()
    
    backtrack(0, [])
    return result`}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
             <Table
                headers={["Aspecto", "Complexidade", "Justificativa"]}
                rows={[
                    [<strong>Tempo</strong>, "O(n × 2ⁿ)", "Existem `2ⁿ` subconjuntos e, para cada um, pode levar até O(n) para criar uma cópia dele. A abordagem bitmask tem a mesma complexidade."],
                    [<strong>Espaço</strong>, "O(n × 2ⁿ)", "O(n) para a pilha de recursão, mas o armazenamento de todos os `2ⁿ` subconjuntos, cada um com tamanho médio de n/2, domina o espaço."],
                ]}
            />
            
            <SectionTitle>⚔️ Backtracking vs. Bitmask</SectionTitle>
            <p className="text-slate-300">Uma abordagem alternativa popular é o uso de "bitmasking". Cada número inteiro de 0 a 2ⁿ-1 pode representar um subconjunto. Se o j-ésimo bit do número `i` está ligado, o j-ésimo elemento do conjunto original é incluído no subconjunto.</p>
            <CodeBlock>{`// Exemplo para n=3, elements=[a,b,c]
// i=0 (000) -> {}
// i=1 (001) -> {c}
// i=2 (010) -> {b}
// i=3 (011) -> {b,c}
// ...
// i=7 (111) -> {a,b,c}`}</CodeBlock>

            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Base para outros problemas</strong>: Serve como base para resolver problemas como Soma de Subconjuntos, Problema da Mochila e outros que envolvem selecionar um subconjunto de itens.</ListItem>
                <ListItem><strong>Modelagem de Características</strong>: Em machine learning, para testar todas as combinações possíveis de um conjunto de características.</ListItem>
                <ListItem><strong>Geração de Casos de Teste</strong>: Para gerar todas as configurações possíveis de um sistema para testes exaustivos.</ListItem>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A Geração de Subconjuntos é o "Hello, World!" dos problemas de enumeração por backtracking. Sua estrutura simples, mas poderosa, de decisões binárias recursivas é um padrão que aparece em inúmeros problemas combinatórios mais complexos. Dominar este conceito é um passo fundamental para resolver uma vasta gama de desafios algorítmicos.</p>
        </div>
    );
};

export default SubsetGenerationExplanation;