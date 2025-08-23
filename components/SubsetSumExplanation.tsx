import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const SubsetSumExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">💰 Soma de Subconjuntos</h2>

            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O problema <strong>Subset Sum</strong> é um problema NP-completo clássico que consiste em determinar se existe um subconjunto de um conjunto de inteiros positivos cuja soma seja igual a um valor alvo específico.</p>
            <SubTitle>Definição Formal</SubTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Entrada:</strong> Um conjunto de inteiros `X` e um alvo `T`.</li>
                <li><strong>Saída:</strong> `True` se existe um subconjunto `S ⊆ X` cuja soma é `T`, e `False` caso contrário.</li>
            </ul>

            <SectionTitle>🔄 Estratégia de Backtracking</SectionTitle>
            <p className="text-slate-300">Para cada elemento, o algoritmo decide recursivamente se deve incluí-lo ou não no subconjunto, construindo uma árvore de decisão binária. Se um caminho excede a soma alvo ou esgota os números, ele retrocede (backtracks) para tentar uma decisão diferente.</p>
            <CodeBlock>{`def subset_sum_backtracking(numbers, target):
    def backtrack(index, current_sum, subset):
        if current_sum == target:
            return subset # Solução encontrada
        
        if current_sum > target or index >= len(numbers):
            return None # Caminho inválido
        
        # Tenta incluir o elemento atual
        result = backtrack(index + 1, current_sum + numbers[index], subset + [numbers[index]])
        if result:
            return result
        
        # Backtrack: tenta sem o elemento atual
        return backtrack(index + 1, current_sum, subset)
    
    return backtrack(0, 0, [])`}</CodeBlock>

            <SectionTitle>⚡ Otimizações (Podas)</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Ordenação Decrescente:</strong> Ajuda a encontrar soluções mais rapidamente e torna as podas mais eficazes.</ListItem>
                <ListItem><strong>Poda por Soma Restante:</strong> Se `soma_atual + soma_restante {'<'} alvo`, é impossível atingir o alvo. Este ramo da árvore é "podado".</ListItem>
                 <ListItem><strong>Terminação Antecipada:</strong> Se uma solução é encontrada, a busca pode parar (a menos que todas as soluções sejam necessárias).</ListItem>
            </ul>
            
            <SectionTitle>📈 Análise de Complexidade</SectionTitle>
            <p className="text-slate-300">A relação de recorrência é <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">T(n) = 2T(n-1) + O(1)</code>, que resolve para uma complexidade de tempo de <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(2ⁿ)</code>, pois no pior caso explora todos os 2ⁿ subconjuntos. A complexidade de espaço é <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n)</code> devido à profundidade da pilha de recursão.</p>

            <SectionTitle>⚔️ Backtracking vs. Programação Dinâmica</SectionTitle>
            <Table
                headers={["Aspecto", "Backtracking", "Programação Dinâmica"]}
                rows={[
                    ["Complexidade", "O(2ⁿ)", "O(n × alvo)"],
                    ["Espaço", "O(n)", "O(n × alvo)"],
                    ["Uso", "Bom para alvos grandes e/ou n pequeno", "Bom para alvos pequenos"],
                    ["Soluções", "Encontra o subconjunto real", "Normalmente responde sim/não"],
                ]}
            />
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Problema da Mochila:</strong> Uma variação famosa onde itens têm valores e pesos.</li>
                <li><strong>Alocação de Recursos:</strong> Distribuir um orçamento entre projetos para atingir um gasto exato.</li>
                <li><strong>Criptografia:</strong> Usado em alguns sistemas criptográficos baseados no problema da mochila.</li>
            </ul>

            <SectionTitle>💡 Conclusão</SectionTitle>
            <p className="text-slate-300">Subset Sum é um problema fundamental que ilustra perfeitamente a troca entre a simplicidade do backtracking e a eficiência da programação dinâmica. As técnicas de poda são cruciais para tornar a abordagem de backtracking viável na prática para instâncias de tamanho moderado.</p>
        </div>
    );
};

export default SubsetSumExplanation;