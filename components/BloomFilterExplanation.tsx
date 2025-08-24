import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const BloomFilterExplanation = () => {
    const pythonImplementation = `import math, mmh3
from bitarray import bitarray

class BloomFilter:
    def __init__(self, n: int, p: float):
        self.size = int(-(n * math.log(p)) / (math.log(2) ** 2))
        self.hash_count = max(1, int((self.size / n) * math.log(2)))
        self.bits = bitarray(self.size)
        self.bits.setall(0)

    def add(self, item: str):
        for i in range(self.hash_count):
            digest = mmh3.hash(item, i) % self.size
            self.bits[digest] = 1

    def check(self, item: str) -> bool:
        for i in range(self.hash_count):
            digest = mmh3.hash(item, i) % self.size
            if not self.bits[digest]:
                return False
        return True`;

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌸 Filtro de Bloom</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                Para evitar leituras de disco inúteis em LSM-Trees quando a chave não existe, associamos um Filtro de Bloom a cada SSTable. O filtro é uma estrutura de dados probabilística que responde se um item **pode estar** em um conjunto ou **definitivamente não está**.
            </p>
             <ul className="list-disc list-inside space-y-2 mt-2 text-slate-300">
                <ListItem><strong>Falsos Positivos</strong>: Pode dizer que um item existe quando não existe. A probabilidade é configurável.</ListItem>
                <ListItem><strong>Sem Falsos Negativos</strong>: Nunca dirá que um item não existe se ele realmente existir.</ListItem>
                <ListItem><strong>Eficiência de Espaço</strong>: Usa muito menos espaço do que armazenar todas as chaves em um hash set.</ListItem>
            </ul>

            <SectionTitle>Como Funciona</SectionTitle>
             <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Inicialização</strong>: Crie um array de `m` bits, todos zerados, e escolha `k` funções de hash independentes.</li>
                <li><strong>Adicionar (add)</strong>: Para adicionar um item, aplique as `k` funções de hash para obter `k` índices no array e defina os bits nessas posições para 1.</li>
                <li><strong>Verificar (check)</strong>: Para verificar se um item está no conjunto, aplique as `k` funções de hash para obter `k` índices. Se **todos** os bits nessas posições forem 1, o item *pode* estar no conjunto. Se **qualquer** bit for 0, o item *definitivamente não está* no conjunto.</li>
            </ol>

            <SectionTitle>Cálculos Ótimos</SectionTitle>
            <p className="text-slate-300">Dados `n` (itens esperados) e `p` (probabilidade de falso positivo desejada), os valores ótimos para `m` (tamanho do array) e `k` (número de hashes) são:</p>
            <CodeBlock>{`m = - (n * log(p)) / (log(2)^2)
k = (m / n) * log(2)`}</CodeBlock>

            <SectionTitle>Implementação (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

            <SectionTitle>Uso em LSM-Trees</SectionTitle>
            <p className="text-slate-300">
                No `get(key)`: antes de ler uma SSTable, consulte o filtro de Bloom associado. Se `bloom.check(key)` for falso, pule a leitura de disco e passe para o próximo segmento. Isso acelera drasticamente as buscas por chaves inexistentes.
            </p>

        </div>
    );
};

export default BloomFilterExplanation;