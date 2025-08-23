import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const ActivitySelectionExplanation = () => {
    const pythonImplementation = `def activity_selection(activities):
    # 1. Ordenar atividades pelo tempo de término
    sorted_activities = sorted(activities, key=lambda x: x[1])
    
    selected = []
    
    # A primeira atividade que termina mais cedo é sempre escolhida
    # Inicia com um tempo de término que não conflita com nenhuma atividade
    last_finish_time = -float('inf') 
    
    # 2. Iterar sobre as atividades ordenadas
    for start, finish in sorted_activities:
        # Se a atividade atual começa após ou no mesmo instante do término da última selecionada
        if start >= last_finish_time:
            selected.append((start, finish))
            last_finish_time = finish
            
    return selected`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">⏱️ Escalonamento de Atividades</h2>
            
            <SectionTitle>🎯 O Problema</SectionTitle>
            <p className="text-slate-300">Dado um conjunto de atividades, cada uma com um horário de início e término, o objetivo é selecionar o maior número possível de atividades que não se sobreponham. É um problema clássico de otimização.</p>

            <SectionTitle>🧠 Estratégia Gulosa</SectionTitle>
            <SubTitle>A Escolha Gulosa</SubTitle>
            <p className="text-slate-300">A estratégia vencedora é surpreendentemente simples: <strong className="text-cyan-400">sempre escolher a próxima atividade compatível que termina mais cedo</strong>. Por que isso funciona?</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <li>Ao escolher a atividade que termina o mais rápido possível, liberamos o recurso (ex: sala de aula, projetor) mais cedo.</li>
                <li>Isso maximiza o tempo restante disponível para outras atividades, aumentando as chances de encaixar mais eventos.</li>
            </ul>

            <SubTitle>Prova de Correção (Intuição)</SubTitle>
             <p className="text-slate-300">A correção pode ser provada pelo método "greedy stays ahead". A ideia é que, a cada passo, a escolha gulosa é tão boa ou melhor que qualquer outra escolha possível em uma solução ótima. Se uma solução ótima não escolhe a atividade que termina mais cedo, podemos sempre trocá-la por essa atividade sem piorar a solução, mostrando que a escolha gulosa é sempre segura.</p>

            <SectionTitle>🔧 Algoritmo</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SectionTitle>📊 Análise de Complexidade</SectionTitle>
            <ul className="text-slate-300 space-y-3">
                <ListItem><strong>Tempo:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n log n)</code> - Dominado pela etapa de ordenação das atividades por tempo de término.</ListItem>
                <ListItem><strong>Espaço:</strong> <code className="text-amber-400 bg-slate-700/50 px-2 py-1 rounded">O(n)</code> - Para armazenar as atividades ordenadas e a solução.</ListItem>
            </ul>
            
            <SectionTitle>🎯 Aplicações Práticas</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <li>Agendamento de salas de reunião ou aulas.</li>
                <li>Alocação de recursos em sistemas operacionais.</li>
                <li>Otimização de rotas em redes de comunicação.</li>
            </ul>
        </div>
    );
};

export default ActivitySelectionExplanation;
