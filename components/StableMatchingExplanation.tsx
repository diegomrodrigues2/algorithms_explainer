import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const StableMatchingExplanation = () => {
    const pythonImplementation = `from typing import Dict, List

# preferences_m[m]: lista de preferências de cada m
# preferences_w[w]: ranking (m -> prioridade), para O(1)
def gale_shapley(
    preferences_m: Dict[str, List[str]], 
    preferences_w: Dict[str, Dict[str, int]]
) -> Dict[str, str]:
    free_men = list(preferences_m.keys())
    next_proposal_idx = {m: 0 for m in preferences_m}
    engaged_w: Dict[str, str] = {}  # w -> m
    partner_m: Dict[str, str] = {}  # m -> w

    while free_men:
        m = free_men.pop(0) # FIFO para visualização
        prefs = preferences_m[m]
        w = prefs[next_proposal_idx[m]]
        next_proposal_idx[m] += 1

        if w not in engaged_w:
            engaged_w[w] = m
            partner_m[m] = w
        else:
            m_current = engaged_w[w]
            # menor valor = melhor
            if preferences_w[w][m] < preferences_w[w][m_current]:
                engaged_w[w] = m
                partner_m[m] = w
                del partner_m[m_current]
                free_men.append(m_current)
            else:
                free_men.append(m)

    return partner_m`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">💍 Emparelhamento Estável (Gale–Shapley)</h2>
            
            <SectionTitle>Visão Geral</SectionTitle>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Objetivo:</strong> dado dois conjuntos do mesmo tamanho (ex.: proponentes e respondentes), e preferências estritas de cada elemento sobre o conjunto oposto, encontrar um emparelhamento estável (sem "pares bloqueadores").</ListItem>
                <ListItem><strong>Vínculo conceitual:</strong> Erickson, "Algorithms", Capítulo 4, Seção 4.5, "Stable Matching".</ListItem>
                <ListItem><strong>Complexidade:</strong> O(n²) para n proponentes e n respondentes.</ListItem>
            </ul>


            <SectionTitle>Ideia do Algoritmo (Proponentes → Respondentes)</SectionTitle>
             <p className="text-slate-300">Enquanto existir algum proponente não emparelhado:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li>Ele propõe para a pessoa mais bem classificada em sua lista que ainda não o rejeitou.</li>
                <li>Cada respondente mantém no máximo uma proposta (a melhor até agora) e rejeita as demais.</li>
            </ol>
            <SubTitle>Propriedades</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <li>O algoritmo sempre termina.</li>
                <li>O resultado é estável (não há incentivo para dois indivíduos formarem um novo par).</li>
                <li>É ótimo para o lado que propõe e "pessimamente ótimo" para o lado que responde.</li>
            </ul>

            <SectionTitle>Implementação Essencial (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SubTitle>Desafios</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <li><strong>Verificação de estabilidade:</strong> implemente um verificador que detecte pares bloqueadores.</li>
                <li><strong>Variantes:</strong> listas de preferências incompletas, empates nas preferências, quotas (problema hospital-residentes).</li>
                <li><strong>Estratégia:</strong> mostre empiricamente o viés proponente-ótimo alterando o lado que propõe.</li>
            </ul>
        </div>
    );
};

export default StableMatchingExplanation;
