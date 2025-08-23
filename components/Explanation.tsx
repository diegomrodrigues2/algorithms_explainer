import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const Explanation = () => {
    const pythonAlgorithm = `def tower_of_hanoi(n, origem, destino, auxiliar):
    if n == 1:
        print(f"Mover disco 1 de {origem} para {destino}")
        return
    
    # 1. Mover n-1 discos para a torre auxiliar
    tower_of_hanoi(n-1, origem, auxiliar, destino)
    
    # 2. Mover o disco n (maior) para o destino
    print(f"Mover disco {n} de {origem} para {destino}")
    
    # 3. Mover os n-1 discos da auxiliar para o destino
    tower_of_hanoi(n-1, auxiliar, destino, origem)`;

    const complexityProof = `T(n) = 2T(n-1) + 1
     = 2(2^(n-1) - 1) + 1
     = 2^n - 2 + 1
     = 2^n - 1`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🎯 O Problema e a Solução</h2>
            
            <SectionTitle>🧩 O Problema</SectionTitle>
            <SubTitle>📋 Regras</SubTitle>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>Mover apenas **um disco** por vez.</li>
                <li>**Nenhum disco** pode ser colocado sobre um disco menor.</li>
                <li>Apenas o **disco do topo** de uma torre pode ser movido.</li>
            </ol>
            <SubTitle>🎯 Objetivo</SubTitle>
            <p className="text-slate-300">Mover n discos da torre de origem para a de destino, usando uma torre auxiliar.</p>

            <SectionTitle>🔄 Estratégia Recursiva</SectionTitle>
            <SubTitle>🧠 Fé Recursiva</SubTitle>
            <p className="text-slate-300">A "fé recursiva" é a chave: acreditar que se pode resolver o problema para `n-1` discos e usar essa solução para mover o disco `n`.</p>
            <SubTitle>🔧 Algoritmo</SubTitle>
            <CodeBlock>{pythonAlgorithm}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
            <ul className="text-slate-300 space-y-3">
                <ListItem><strong>Recorrência:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">T(n) = 2T(n-1) + 1</code></ListItem>
                <ListItem><strong>Solução:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">T(n) = 2^n - 1</code></ListItem>
                <ListItem><strong>Tempo:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(2^n)</code> - Exponencial</ListItem>
                <ListItem><strong>Espaço:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n)</code> - Profundidade da pilha de recursão</ListItem>
            </ul>
            <SubTitle>📊 Demonstração</SubTitle>
            <CodeBlock>{complexityProof}</CodeBlock>

            <SectionTitle>🧮 Propriedades</SectionTitle>
            <SubTitle>🔢 Número de Movimentos</SubTitle>
            <p className="text-slate-300">São necessários no mínimo <strong className="text-cyan-400">2<sup>n</sup> - 1</strong> movimentos para `n` discos.</p>
            <SubTitle>🔍 Exemplo: Sequência para n=3</SubTitle>
            <ol className="list-decimal list-inside text-slate-400 font-mono text-sm space-y-1 mt-2">
                <li>Mover disco 1 de A → C</li>
                <li>Mover disco 2 de A → B</li>
                <li>Mover disco 1 de C → B</li>
                <li>Mover disco 3 de A → C</li>
                <li>Mover disco 1 de B → A</li>
                <li>Mover disco 2 de B → C</li>
                <li>Mover disco 1 de A → C</li>
            </ol>

            <SectionTitle>🚀 A Lenda dos 64 Discos</SectionTitle>
            <p className="text-slate-300">A lenda original fala de monges movendo 64 discos de ouro. Isso levaria <strong className="text-cyan-400">2<sup>64</sup> - 1</strong> movimentos.</p>
            <p className="text-slate-400 mt-2">Isso é ~18.4 quintilhões de movimentos. A uma taxa de um movimento por segundo, levaria cerca de <strong className="text-amber-400">585 bilhões de anos</strong> para ser concluído - muito mais que a idade do universo!</p>
        </div>
    );
};

export default Explanation;