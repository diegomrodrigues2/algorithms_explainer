import React from 'react';
import { CodeBlock, SectionTitle, SubTitle, ListItem } from './ExplanationUI';

const LSMTreeExplanation = () => {
    const pythonImplementation = `
# ... (simplified for brevity)
class LSMTree:
    def __init__(self, data_dir, memtable_limit=4):
        self.memtable = Memtable()
        self.segments = [] # List of SSTable paths
        # ...
    
    def put(self, key, value):
        self.memtable.put(key, value)
        if len(self.memtable) >= self.memtable_limit:
            self._flush_memtable()

    def get(self, key):
        # 1. Check memtable
        val = self.memtable.get(key)
        if val is not None:
            return val
        
        # 2. Check segments from newest to oldest
        for segment_path in reversed(self.segments):
            val = sstable_scan_for_key(segment_path, key)
            if val is not None:
                return val # Found in this segment
        return None

    def _flush_memtable(self):
        # Writes memtable to a new SSTable segment
        # ...
    
    def compact(self):
        # Merges multiple segments into a new one
        # ...
`;
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700 max-h-[85vh] overflow-y-auto">
            <h2 className="text-3xl font-bold text-center mb-6 text-slate-100">🌳 LSM-Tree Básica</h2>

            <SectionTitle>Contexto</SectionTitle>
            <p className="text-slate-300">
                A Log-Structured Merge-Tree (LSM-Tree) combina uma Memtable em memória (ordenada por chave) com SSTables imutáveis em disco. Leituras consultam primeiro a Memtable e, depois, as SSTables do mais novo para o mais antigo.
            </p>

            <SectionTitle>Componentes Mínimos</SectionTitle>
             <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li><strong>Memtable</strong>: Estrutura ordenada em memória (ex: árvore Red-Black, skip list) que absorve escritas.</li>
                <li><strong>Flush</strong>: Processo de gravar o conteúdo da Memtable para uma nova SSTable em disco quando ela atinge um limite.</li>
                <li><strong>SSTable (Sorted String Table)</strong>: Um arquivo imutável contendo pares chave-valor, ordenados por chave.</li>
                <li><strong>Compactação</strong>: Processo de mesclar várias SSTables em uma nova, descartando dados obsoletos e deletados (tombstones).</li>
            </ol>
            
            <SectionTitle>Fluxo de Operações</SectionTitle>
            <SubTitle>Escrita (Put)</SubTitle>
            <p className="text-slate-300">
                Uma nova escrita vai sempre para a Memtable, que é uma operação rápida em memória. Se a Memtable ficar cheia, um flush é acionado.
            </p>
            <SubTitle>Leitura (Get)</SubTitle>
            <p className="text-slate-300">
                A busca por uma chave segue uma hierarquia:
            </p>
             <ol className="list-decimal list-inside space-y-2 text-slate-300 mt-2">
                <li>Verificar a Memtable. Se a chave for encontrada (incluindo um marcador de deleção), retorna o valor.</li>
                <li>Se não, verificar as SSTables em disco, da mais nova para a mais antiga.</li>
                <li>A primeira ocorrência da chave encontrada determina seu valor.</li>
            </ol>
            
            <SectionTitle>Implementação Conceitual (Python)</SectionTitle>
            <CodeBlock>{pythonImplementation}</CodeBlock>

             <SectionTitle>Vantagens e Desvantagens</SectionTitle>
             <ul className="list-disc list-inside space-y-2 text-slate-300">
                <ListItem><strong>Vantagem de Escrita</strong>: LSM-Trees otimizam para escritas rápidas, convertendo escritas aleatórias em escritas sequenciais no disco durante o flush e a compactação.</li>
                <ListItem><strong>Desvantagem de Leitura</strong>: Uma leitura pode precisar consultar múltiplos arquivos em disco no pior caso, o que é mais lento que um B-Tree (que normalmente requer um único lookup). Filtros de Bloom ajudam a mitigar isso.</ListItem>
                <ListItem><strong>Amplificação de Escrita</strong>: A compactação reescreve dados múltiplas vezes, o que pode ser um problema para mídias com ciclos de escrita limitados (SSDs).</li>
            </ul>

        </div>
    );
};
export default LSMTreeExplanation;
