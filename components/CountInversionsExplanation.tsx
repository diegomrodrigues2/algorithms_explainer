import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const CountInversionsExplanation = () => {
    const mergeAlgo = `def merge_with_inversions(arr, left, mid, right):
    inversions = 0
    temp = []
    i = left
    j = mid + 1
    
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp.append(arr[i])
            i += 1
        else: # Inversão!
            temp.append(arr[j])
            inversions += (mid - i + 1)
            j += 1
    
    # Copia o resto
    ...
    return inversions`;

    const complexity = `T(n) = 2T(n/2) + O(n)
    Pelo Master Theorem => T(n) = O(n log n)`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎯 Contagem de Inversões</h2>
            
            <SectionTitle>🧩 O Problema</SectionTitle>
            <SubTitle>🔍 Definição</SubTitle>
            <p className="text-slate-300">Uma inversão é um par de índices (i, j) em um array tal que `i {'<'} j` e `A[i] > A[j]`. Essencialmente, mede o quão "fora de ordem" um array está.</p>
            <CodeBlock>{`Array: [8, 4, 2, 1]
Inversões: (8,4), (8,2), (8,1), (4,2), (4,1), (2,1)
Total: 6 inversões`}</CodeBlock>

            <SectionTitle>🔄 Estratégia Divide-and-Conquer</SectionTitle>
            <SubTitle>🧠 Observação Chave</SubTitle>
            <p className="text-slate-300">O problema pode ser resolvido eficientemente adaptando o algoritmo Merge Sort. A contagem de inversões é a soma de:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li>Inversões na sub-lista da esquerda.</li>
                <li>Inversões na sub-lista da direita.</li>
                <li>Inversões "cruzadas" (entre as duas sub-listas).</li>
            </ol>
            <p className="mt-2 text-slate-300">A chave está em contar as inversões cruzadas durante a etapa de <strong className="text-cyan-400">mesclagem (merge)</strong>.</p>
            <SubTitle>🔧 Merge Modificado</SubTitle>
             <p className="text-slate-300">Quando um elemento da sub-lista direita é movido para o array mesclado antes de um elemento da esquerda, ele forma inversões com <strong className="text-amber-400">todos os elementos restantes</strong> na sub-lista da esquerda.</p>
            <CodeBlock>{mergeAlgo}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
            <ul className="text-slate-300 space-y-3">
                <ListItem><strong>Recorrência:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">T(n) = 2T(n/2) + O(n)</code></ListItem>
                <ListItem><strong>Tempo:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n log n)</code></ListItem>
                <ListItem><strong>Espaço:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n)</code> para o array auxiliar</ListItem>
            </ul>
            <CodeBlock>{complexity}</CodeBlock>

            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li><strong>Medida de Desordem:</strong> Usado para quantificar o quão longe uma lista está da ordenação.</li>
                <li><strong>Sistemas de Recomendação:</strong> Comparar rankings de usuários.</li>
                <li><strong>Bioinformática:</strong> Análise de sequências genômicas.</li>
            </ul>
        </div>
    );
};

export default CountInversionsExplanation;