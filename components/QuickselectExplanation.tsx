import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem, Table } from './ExplanationUI';

const QuickselectExplanation = () => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🔍 Quickselect</h2>
            
            <SectionTitle>Visão Geral</SectionTitle>
            <p className="text-slate-300">O Quickselect é uma aplicação brilhante da ideia de particionamento do Quicksort. Em vez de recursão em ambos os lados do pivô, ele descarta um lado e continua a busca apenas na partição que deve conter o k-ésimo elemento. Isso reduz a complexidade média de O(n log n) para O(n), tornando-o um dos algoritmos de seleção mais eficientes na prática.</p>

            <SectionTitle>O Passo Chave: Particionamento</SectionTitle>
            <p className="text-slate-300">A mágica do Quickselect acontece na função de particionamento, que reorganiza o sub-array em torno de um pivô:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Escolha do Pivô:</strong> Um elemento é escolhido como pivô (nesta visualização, é sempre o último elemento do sub-array atual).</li>
                <li><strong>Reorganização:</strong> O array é percorrido. Elementos menores que o pivô são movidos para a esquerda. Um ponteiro especial (o "store index", indicado pela seta <strong className="text-orange-400">i</strong>) marca a fronteira onde o próximo elemento menor será colocado.</li>
                <li><strong>Posicionamento Final do Pivô:</strong> Ao final, o pivô é trocado com o elemento no "store index", colocando-o em sua posição final ordenada dentro daquela partição.</li>
            </ol>
            <p className="text-slate-300 mt-2">O índice final do pivô nos diz o seu "rank" (por exemplo, se o pivô termina no índice 5, ele é o 6º menor elemento). Comparando este rank com o `k` que buscamos, o algoritmo pode descartar a partição que não contém o elemento alvo.</p>

            <SectionTitle>Algoritmo Básico</SectionTitle>
            <SubTitle>Pseudocódigo</SubTitle>
            <CodeBlock>{`function quickselect(array, k):
    loop:
      pivot_index = partition(array)
      pivot_rank = pivot_index + 1
      
      if k == pivot_rank:
          return array[pivot_index]
      elif k < pivot_rank:
          // Busca na partição da esquerda
          array = left_partition
      else:
          // Busca na partição da direita
          array = right_partition
          k = k - pivot_rank`}</CodeBlock>

            <SectionTitle>Análise de Complexidade</SectionTitle>
             <Table 
                headers={["Aspecto", "Quicksort", "Quickselect"]}
                rows={[
                    ["Recorrência (Média)", <code>T(n) = 2T(n/2) + O(n)</code>, <code>T(n) = T(n/2) + O(n)</code>],
                    ["Complexidade Média", <code>O(n log n)</code>, <code className="text-emerald-400">O(n)</code>],
                    ["Complexidade Pior Caso", <code>O(n²)</code>, <code>O(n²)</code>],
                    ["Recursão", "Ambos os lados", "Apenas um lado"],
                ]}
            />
            <p className="text-slate-400 text-sm mt-2">O pior caso ocorre com uma péssima escolha de pivô (ex: array já ordenado), mas é raro na prática com entradas aleatórias.</p>
            
            <SectionTitle>Comparação com Outros Algoritmos</SectionTitle>
            <Table
                headers={["Algoritmo", "Tempo Médio", "Tempo Pior Caso", "Espaço"]}
                rows={[
                    [<strong>Quickselect</strong>, <code>O(n)</code>, <code>O(n²)</code>, <code>O(log n)</code>],
                    ["BFPRT (Mediana das Medianas)", <code>O(n)</code>, <code>O(n)</code>, <code>O(n)</code>],
                    ["Heap Select", <code>O(n log k)</code>, <code>O(n log k)</code>, <code>O(k)</code>],
                    ["Sort + Select", <code>O(n log n)</code>, <code>O(n log n)</code>, <code>O(n)</code>],
                ]}
            />
        </div>
    );
};

export default QuickselectExplanation;