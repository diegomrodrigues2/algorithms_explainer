import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, Table } from './ExplanationUI';

const BFPRTExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🏅 Mediana das Medianas (BFPRT)</h2>
            
            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O algoritmo Mediana das Medianas (Blum-Floyd-Pratt-Rivest-Tarjan) é um marco teórico que garante tempo linear no pior caso para o problema de seleção. Na prática, a constante oculta na notação O(n) é alta, tornando o Quickselect com pivô aleatório mais rápido para a maioria das entradas, mas a sua compreensão é crucial.</p>

            <SectionTitle>Estratégia de Divisão e Conquista Avançada</SectionTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Dividir:</strong> Dividir o array em grupos de 5 elementos.</li>
                <li><strong>Conquistar:</strong> Encontrar a mediana de cada grupo.</li>
                <li><strong>Combinar:</strong> Encontrar a mediana das medianas (este será o pivô).</li>
                <li><strong>Particionar:</strong> Particionar o array original ao redor do pivô.</li>
                <li><strong>Recursão:</strong> Continuar a busca apenas no lado relevante.</li>
            </ol>
            
            <SectionTitle>Análise de Complexidade</SectionTitle>
            <SubTitle>Garantia de Qualidade do Pivô</SubTitle>
            <p className="text-slate-300">O algoritmo garante que o pivô escolhido está entre o 30º e 70º percentil, o que assegura que cada passo recursivo descarta uma fração constante dos elementos.</p>
            <ul className="list-disc list-inside space-y-2 mt-2 text-slate-400">
                <li>Pelo menos <strong>30%</strong> dos elementos são menores que o pivô.</li>
                <li>Pelo menos <strong>30%</strong> dos elementos são maiores que o pivô.</li>
                <li>No máximo <strong>70%</strong> dos elementos permanecem para a próxima iteração.</li>
            </ul>

            <SubTitle>Relação de Recorrência</SubTitle>
            <p className="text-slate-300">A relação de recorrência, que captura o custo de encontrar a mediana dos medians (T(n/5)) e o custo da recursão no pior caso (T(7n/10)), é:</p>
            <CodeBlock>{`T(n) ≤ T(n/5) + T(7n/10) + O(n)`}</CodeBlock>
            <p className="text-slate-300">Esta recorrência resolve para <strong className="text-amber-400">O(n)</strong>, provando a complexidade de tempo linear no pior caso.</p>


            <SectionTitle>Comparação com Quickselect</SectionTitle>
            <Table
                headers={["Algoritmo", "Tempo Médio", "Tempo Pior Caso", "Constante", "Garantia"]}
                rows={[
                    ["Quickselect", <code>O(n)</code>, <code>O(n²)</code>, "Baixa", "Probabilística"],
                    [<strong>BFPRT</strong>, <code>O(n)</code>, <code>O(n)</code>, "Alta", "Determinística"],
                ]}
            />

            <SectionTitle>Considerações Práticas</SectionTitle>
            <SubTitle>Quando Usar BFPRT?</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Sistemas de Tempo Real:</strong> Onde garantias de pior caso são críticas.</li>
                <li><strong>Análise Teórica:</strong> Para entender os limites dos algoritmos de seleção.</li>
                <li><strong>Implementações Críticas:</strong> Quando um comportamento totalmente previsível é necessário.</li>
            </ul>
             <SubTitle>Quando Usar Quickselect?</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Aplicações Gerais:</strong> É mais rápido na prática para a maioria dos casos.</li>
                <li><strong>Simplicidade:</strong> A implementação é consideravelmente mais simples.</li>
                <li><strong>Performance Média:</strong> Quando a performance média é o mais importante.</li>
            </ul>

            <SectionTitle>Conclusão</SectionTitle>
            <p className="text-slate-300">O BFPRT é uma conquista teórica que prova que a seleção pode ser feita em tempo linear determinístico. Embora o Quickselect seja muitas vezes o cavalo de batalha na prática, o BFPRT oferece uma garantia de performance que é indispensável para aplicações de missão crítica.</p>
        </div>
    );
};

export default BFPRTExplanation;