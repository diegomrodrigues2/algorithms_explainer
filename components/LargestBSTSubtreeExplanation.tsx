import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const LargestBSTSubtreeExplanation = () => {
    const pythonImplementation = `from typing import Optional, Tuple

class Node:
    def __init__(self, val: int, left: 'Node' = None, right: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right

def largest_bst_subtree(root: Optional[Node]) -> int:
    def dfs(node: Optional[Node]) -> Tuple[bool, int, int, int]:
        # retorna (is_bst, size, min_val, max_val)
        if node is None:
            return True, 0, float('inf'), float('-inf')
        
        lb, ls, lmin, lmax = dfs(node.left)
        rb, rs, rmin, rmax = dfs(node.right)
        
        if lb and rb and lmax < node.val < rmin:
            size = ls + rs + 1
            return True, size, min(lmin, node.val), max(rmax, node.val)
        
        return False, max(ls, rs), 0, 0

    return dfs(root)[1]`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌿 Maior Subárvore BST</h2>

            <SectionTitle>🎯 Visão Geral</SectionTitle>
            <p className="text-slate-300">
                Queremos o tamanho da maior subárvore que é uma BST dentro de uma árvore binária arbitrária. A solução ótima usa uma travessia pós-ordem (DP bottom-up) que retorna, para cada nó, informações suficientes para decidir se a subárvore é BST e qual seu tamanho.
            </p>

            <SectionTitle>🧠 Estado por Nó (pós-ordem)</SectionTitle>
            <p className="text-slate-300">Para cada nó `u`, retornamos uma tupla com:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <ListItem><code>is_bst</code>: a subárvore de `u` é uma BST?</ListItem>
                <ListItem><code>size</code>: tamanho da maior BST na subárvore de `u`</ListItem>
                <ListItem><code>min_val</code> e <code>max_val</code>: mínimo e máximo na subárvore de `u` (para checar propriedade BST)</ListItem>
            </ul>
             <SubTitle>Regras de combinação em `u`:</SubTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300 mt-2">
                <li>Se esquerda e direita são BSTs e <code>left.max_val {'<'} u.val {'<'} right.min_val</code>, então `u` forma uma BST com `size = left.size + right.size + 1` e `min/max` atualizados.</li>
                <li>Caso contrário, `size = max(left.size, right.size)` e `is_bst = False`.</li>
            </ul>

            <SectionTitle>🔧 Implementação Essencial</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>
        </div>
    );
};

export default LargestBSTSubtreeExplanation;
