import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const PermutationGenerationExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔄 Geração de Permutações</h2>

            <SectionTitle>Visão Geral do Problema</SectionTitle>
            <p className="text-slate-300">O problema de Geração de Permutações é um desafio clássico de backtracking que consiste em enumerar todas as possíveis ordenações (arranjos) de elementos em um conjunto. É um problema fundamental de enumeração combinatória onde a cada passo recursivo, um elemento ainda não utilizado é escolhido para a posição atual.</p>
            <SubTitle>Exemplo</SubTitle>
             <p className="text-slate-300">Para a entrada `[A, B, C]`, existem `3! = 6` permutações:</p>
            <CodeBlock>{`[A,B,C], [A,C,B], [B,A,C], [B,C,A], [C,A,B], [C,B,A]`}</CodeBlock>
            
            <SectionTitle>🔄 Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">A abordagem de backtracking visualizada aqui usa trocas no próprio local (in-place swap) para gerar permutações. É uma técnica eficiente em termos de memória.</p>
             <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Fixar uma Posição:</strong> O algoritmo tenta preencher a permutação da esquerda para a direita (índice `start`).</li>
                <li><strong>Explorar Escolhas:</strong> Para a posição `start`, ele itera por todos os elementos de `start` até o final do array.</li>
                <li><strong>Trocar (Swap):</strong> Ele troca o elemento em `start` com o elemento atual da iteração (`i`).</li>
                <li><strong>Recursão:</strong> Faz uma chamada recursiva para a próxima posição (`start + 1`).</li>
                <li><strong>Retroceder (Backtrack):</strong> Após o retorno da chamada recursiva, ele desfaz a troca para explorar outras possibilidades.</li>
            </ol>
            <SubTitle>Pseudocódigo (In-place Swap)</SubTitle>
            <CodeBlock>{`def generate_permutations(elements, start):
    if start == len(elements):
        add_solution(elements)
        return
        
    for i in range(start, len(elements)):
        # Escolha: trocar elemento 'start' com 'i'
        swap(elements[start], elements[i])
        
        # Explorar
        generate_permutations(elements, start + 1)
        
        # Desfazer/Retroceder: trocar de volta
        swap(elements[start], elements[i])
`}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
            <p className="text-slate-300">A complexidade é dominada pelo número de permutações, que é n! (fatorial de n).</p>
            <Table
                headers={["Aspecto", "Complexidade", "Justificativa"]}
                rows={[
                    [<strong>Tempo</strong>, "O(n × n!)", "Existem `n!` permutações. Para cada uma, é necessário um tempo de O(n) para copiar a solução. A geração em si é O(n!)."],
                    [<strong>Espaço</strong>, "O(n × n!)", "O(n) para a profundidade da pilha de recursão. O armazenamento de todas as `n!` permutações, cada uma com `n` elementos, domina o espaço."],
                ]}
            />
            <p className="text-slate-400 mt-2">Devido à complexidade fatorial, a geração de permutações é impraticável para valores de `n` maiores que 10-12.</p>
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Problema do Caixeiro Viajante:</strong> Uma abordagem de força bruta envolve testar todas as permutações de cidades.</ListItem>
                <ListItem><strong>Criptografia:</strong> Análise de cifras de transposição e outros algoritmos baseados em permutações.</ListItem>
                <ListItem><strong>Agendamento:</strong> Encontrar todas as possíveis ordens de tarefas ou eventos para análise.</ListItem>
                <ListItem><strong>Testes de Software:</strong> Gerar diferentes ordens de execução de eventos para encontrar bugs.</ListItem>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">A Geração de Permutações é um pilar do backtracking. A técnica de "escolher, explorar, desfazer" é um padrão poderoso que pode ser aplicado a uma vasta gama de problemas de busca e enumeração. A abordagem de troca no local (in-place swap) é particularmente elegante, pois minimiza o uso de memória auxiliar durante a exploração da árvore de busca.</p>
        </div>
    );
};

export default PermutationGenerationExplanation;