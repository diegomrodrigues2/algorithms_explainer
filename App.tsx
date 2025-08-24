import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import TowerOfHanoiVisualizer from './components/TowerOfHanoiVisualizer';
import Explanation from './components/Explanation';
import { GithubIcon } from './components/Icons';
import CountInversionsVisualizer from './components/CountInversionsVisualizer';
import CountInversionsExplanation from './components/CountInversionsExplanation';
import QuickselectVisualizer from './components/QuickselectVisualizer';
import QuickselectExplanation from './components/QuickselectExplanation';
import BFPRTVisualizer from './components/BFPRTVisualizer';
import BFPRTExplanation from './components/BFPRTExplanation';
import MinMaxVisualizer from './components/MinMaxVisualizer';
import MinMaxExplanation from './components/MinMaxExplanation';
import NQueensVisualizer from './components/NQueensVisualizer';
import NQueensExplanation from './components/NQueensExplanation';
import SubsetSumVisualizer from './components/SubsetSumVisualizer';
import SubsetSumExplanation from './components/SubsetSumExplanation';
import TextSegmentationVisualizer from './components/TextSegmentationVisualizer';
import TextSegmentationExplanation from './components/TextSegmentationExplanation';
import LISVisualizer from './components/LISVisualizer';
import LISExplanation from './components/LISExplanation';
import OBSTVisualizer from './components/OBSTVisualizer';
import OBSTExplanation from './components/OBSTExplanation';
import SubsetGenerationVisualizer from './components/SubsetGenerationVisualizer';
import SubsetGenerationExplanation from './components/SubsetGenerationExplanation';
import PermutationGenerationVisualizer from './components/PermutationGenerationVisualizer';
import PermutationGenerationExplanation from './components/PermutationGenerationExplanation';
import GraphColoringVisualizer from './components/GraphColoringVisualizer';
import GraphColoringExplanation from './components/GraphColoringExplanation';
import HamiltonianPathVisualizer from './components/HamiltonianPathVisualizer';
import HamiltonianPathExplanation from './components/HamiltonianPathExplanation';
import SubsetSumMemoizedVisualizer from './components/SubsetSumMemoizedVisualizer';
import SubsetSumMemoizedExplanation from './components/SubsetSumMemoizedExplanation';
import TextSegmentationMemoizedVisualizer from './components/TextSegmentationMemoizedVisualizer';
import TextSegmentationMemoizedExplanation from './components/TextSegmentationMemoizedExplanation';
import LISMemoizedVisualizer from './components/LISMemoizedVisualizer';
import LISMemoizedExplanation from './components/LISMemoizedExplanation';
import EditDistanceVisualizer from './components/EditDistanceVisualizer';
import EditDistanceExplanation from './components/EditDistanceExplanation';
import FibonacciMemoizedVisualizer from './components/FibonacciMemoizedVisualizer';
import FibonacciMemoizedExplanation from './components/FibonacciMemoizedExplanation';
import FibonacciTabulatedVisualizer from './components/FibonacciTabulatedVisualizer';
import FibonacciTabulatedExplanation from './components/FibonacciTabulatedExplanation';
import SubsetSumTabulatedVisualizer from './components/SubsetSumTabulatedVisualizer';
import SubsetSumTabulatedExplanation from './components/SubsetSumTabulatedExplanation';
import LISTabulatedVisualizer from './components/LISTabulatedVisualizer';
import LISTabulatedExplanation from './components/LISTabulatedExplanation';
import EditDistanceTabulatedVisualizer from './components/EditDistanceTabulatedVisualizer';
import EditDistanceTabulatedExplanation from './components/EditDistanceTabulatedExplanation';
import OBSTTabulatedVisualizer from './components/OBSTTabulatedVisualizer';
import OBSTTabulatedExplanation from './components/OBSTTabulatedExplanation';
import LCSTabulatedVisualizer from './components/LCSTabulatedVisualizer';
import LCSTabulatedExplanation from './components/LCSTabulatedExplanation';
import SCSTabulatedVisualizer from './components/SCSTabulatedVisualizer';
import SCSTabulatedExplanation from './components/SCSTabulatedExplanation';
import KnapsackTabulatedVisualizer from './components/KnapsackTabulatedVisualizer';
import KnapsackTabulatedExplanation from './components/KnapsackTabulatedExplanation';
import PalindromePartitioningVisualizer from './components/PalindromePartitioningVisualizer';
import PalindromePartitioningExplanation from './components/PalindromePartitioningExplanation';
import CoinChangeVisualizer from './components/CoinChangeVisualizer';
import CoinChangeExplanation from './components/CoinChangeExplanation';
import MISTreeVisualizer from './components/MISTreeVisualizer';
import MISTreeExplanation from './components/MISTreeExplanation';
import MVCTreeVisualizer from './components/MVCTreeVisualizer';
import MVCTreeExplanation from './components/MVCTreeExplanation';
import DiameterTreeVisualizer from './components/DiameterTreeVisualizer';
import DiameterTreeExplanation from './components/DiameterTreeExplanation';
import MinCostTreeColoringVisualizer from './components/MinCostTreeColoringVisualizer';
import MinCostTreeColoringExplanation from './components/MinCostTreeColoringExplanation';
import LargestBSTSubtreeVisualizer from './components/LargestBSTSubtreeVisualizer';
import LargestBSTSubtreeExplanation from './components/LargestBSTSubtreeExplanation';
import ActivitySelectionVisualizer from './components/ActivitySelectionVisualizer';
import ActivitySelectionExplanation from './components/ActivitySelectionExplanation';
import HuffmanCodeVisualizer from './components/HuffmanCodeVisualizer';
import HuffmanCodeExplanation from './components/HuffmanCodeExplanation';
import StableMatchingVisualizer from './components/StableMatchingVisualizer';
import StableMatchingExplanation from './components/StableMatchingExplanation';
import AppendOnlyLogVisualizer from './components/AppendOnlyLogVisualizer';
import AppendOnlyLogExplanation from './components/AppendOnlyLogExplanation';


type Algorithm = 'hanoi' | 'inversions' | 'quickselect' | 'bfprt' | 'minmax' | 'nqueens' | 'subsetsum' | 'textsegmentation' | 'lis' | 'obst' | 'subsetgen' | 'permutations' | 'graphcoloring' | 'hamiltonianpath' | 'subsetsummemo' | 'textsegmentationmemo' | 'lismemo' | 'editdistance' | 'fibonaccimemo' | 'fibonaccitab' | 'subsetsumtab' | 'listabulated' | 'editdistancetab' | 'obsttab' | 'lcstabulated' | 'scstabulated' | 'knapsacktabulated' | 'coinchange' | 'palindromepartitioning' | 'mistree' | 'mvctree' | 'diametertree' | 'mincosttreecoloring' | 'largestbstsubtree' | 'activityselection' | 'huffmancodes' | 'stablematching' | 'appendonlylog';

interface AlgorithmInfo {
    id: Algorithm;
    name: string;
}

const ALGORITHM_CATEGORIES: { [key: string]: AlgorithmInfo[] } = {
  'Recursão e Divisão e Conquista': [
    { id: 'hanoi', name: '🗼 Torre de Hanoi' },
    { id: 'inversions', name: '🔄 Contagem de Inversões' },
    { id: 'minmax', name: '📊 Encontrar Min-Max' },
    { id: 'quickselect', name: '🔍 Quickselect' },
    { id: 'bfprt', name: '🏅 Mediana das Medianas' },
  ],
  'Backtracking': [
    { id: 'nqueens', name: '👑 N-Rainhas' },
    { id: 'subsetsum', name: '💰 Soma de Subconjuntos' },
    { id: 'textsegmentation', name: '📝 Segmentação de Texto' },
    { id: 'lis', name: '📈 LIS (Backtracking)' },
    { id: 'subsetgen', name: '📚 Geração de Subconjuntos' },
    { id: 'permutations', name: '🔄 Geração de Permutações' },
    { id: 'graphcoloring', name: '🎨 Coloração de Grafos' },
    { id: 'hamiltonianpath', name: '➡️ Caminho Hamiltoniano' },
  ],
  'Programação Dinâmica': [
    { id: 'fibonaccimemo', name: '🧠 Fibonacci (Memo)' },
    { id: 'fibonaccitab', name: '🧮 Fibonacci (Tab)' },
    { id: 'subsetsummemo', name: '🧠 Soma de Subconjuntos (Memo)' },
    { id: 'subsetsumtab', name: '🎛️ Soma de Subconjuntos (Tab)' },
    { id: 'textsegmentationmemo', name: '🧠 Segmentação de Texto (Memo)' },
    { id: 'lismemo', name: '🧠 LIS com Memoização' },
    { id: 'listabulated', name: '📈 LIS (Tabulação)' },
    { id: 'editdistance', name: '🧠 Distância de Edição (Memo)' },
    { id: 'editdistancetab', name: '✏️ Distância de Edição (Tab)' },
    { id: 'lcstabulated', name: '📚 LCS (Tabulação)' },
    { id: 'scstabulated', name: '🔗 SCS (Tabulação)' },
    { id: 'knapsacktabulated', name: '🎒 Mochila 0/1 (Tab)' },
    { id: 'coinchange', name: '🪙 Troco de Moedas (Tab)' },
    { id: 'palindromepartitioning', name: '🪞 Partição de Palíndromos' },
    { id: 'obst', name: '🌳 Árvore de Busca Ótima' },
    { id: 'obsttab', name: '🌳 Árvore de Busca Ótima (Tab)' },
    { id: 'mistree', name: '🌳 MIS em Árvores' },
    { id: 'mvctree', name: '🌳 MVC em Árvores' },
    { id: 'diametertree', name: '🌳 Diâmetro da Árvore' },
    { id: 'mincosttreecoloring', name: '🎨 Coloração de Árvore (Custo Mínimo)' },
    { id: 'largestbstsubtree', name: '🌳 Maior Subárvore BST' },
  ],
  'Algoritmos Gulosos': [
    { id: 'activityselection', name: '⏱️ Escalonamento de Atividades' },
    { id: 'huffmancodes', name: '🗜️ Códigos de Huffman' },
    { id: 'stablematching', name: '💍 Emparelhamento Estável' },
  ],
  'Algoritmos de Sistemas de Dados': [
    { id: 'appendonlylog', name: '📝 Log Append-Only Básico' },
  ],
};


const AlgorithmVisualizer = ({ algorithm }: { algorithm: Algorithm }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        {algorithm === 'hanoi' && <TowerOfHanoiVisualizer />}
        {algorithm === 'inversions' && <CountInversionsVisualizer />}
        {algorithm === 'quickselect' && <QuickselectVisualizer />}
        {algorithm === 'bfprt' && <BFPRTVisualizer />}
        {algorithm === 'minmax' && <MinMaxVisualizer />}
        {algorithm === 'nqueens' && <NQueensVisualizer />}
        {algorithm === 'subsetsum' && <SubsetSumVisualizer />}
        {algorithm === 'textsegmentation' && <TextSegmentationVisualizer />}
        {algorithm === 'lis' && <LISVisualizer />}
        {algorithm === 'obst' && <OBSTVisualizer />}
        {algorithm === 'subsetgen' && <SubsetGenerationVisualizer />}
        {algorithm === 'permutations' && <PermutationGenerationVisualizer />}
        {algorithm === 'graphcoloring' && <GraphColoringVisualizer />}
        {algorithm === 'hamiltonianpath' && <HamiltonianPathVisualizer />}
        {algorithm === 'subsetsummemo' && <SubsetSumMemoizedVisualizer />}
        {algorithm === 'textsegmentationmemo' && <TextSegmentationMemoizedVisualizer />}
        {algorithm === 'lismemo' && <LISMemoizedVisualizer />}
        {algorithm === 'editdistance' && <EditDistanceVisualizer />}
        {algorithm === 'fibonaccimemo' && <FibonacciMemoizedVisualizer />}
        {algorithm === 'fibonaccitab' && <FibonacciTabulatedVisualizer />}
        {algorithm === 'subsetsumtab' && <SubsetSumTabulatedVisualizer />}
        {algorithm === 'listabulated' && <LISTabulatedVisualizer />}
        {algorithm === 'editdistancetab' && <EditDistanceTabulatedVisualizer />}
        {algorithm === 'obsttab' && <OBSTTabulatedVisualizer />}
        {algorithm === 'lcstabulated' && <LCSTabulatedVisualizer />}
        {algorithm === 'scstabulated' && <SCSTabulatedVisualizer />}
        {algorithm === 'knapsacktabulated' && <KnapsackTabulatedVisualizer />}
        {algorithm === 'coinchange' && <CoinChangeVisualizer />}
        {algorithm === 'palindromepartitioning' && <PalindromePartitioningVisualizer />}
        {algorithm === 'mistree' && <MISTreeVisualizer />}
        {algorithm === 'mvctree' && <MVCTreeVisualizer />}
        {algorithm === 'diametertree' && <DiameterTreeVisualizer />}
        {algorithm === 'mincosttreecoloring' && <MinCostTreeColoringVisualizer />}
        {algorithm === 'largestbstsubtree' && <LargestBSTSubtreeVisualizer />}
        {algorithm === 'activityselection' && <ActivitySelectionVisualizer />}
        {algorithm === 'huffmancodes' && <HuffmanCodeVisualizer />}
        {algorithm === 'stablematching' && <StableMatchingVisualizer />}
        {algorithm === 'appendonlylog' && <AppendOnlyLogVisualizer />}
      </div>
      <div className="lg:col-span-2">
        {algorithm === 'hanoi' && <Explanation />}
        {algorithm === 'inversions' && <CountInversionsExplanation />}
        {algorithm === 'quickselect' && <QuickselectExplanation />}
        {algorithm === 'bfprt' && <BFPRTExplanation />}
        {algorithm === 'minmax' && <MinMaxExplanation />}
        {algorithm === 'nqueens' && <NQueensExplanation />}
        {algorithm === 'subsetsum' && <SubsetSumExplanation />}
        {algorithm === 'textsegmentation' && <TextSegmentationExplanation />}
        {algorithm === 'lis' && <LISExplanation />}
        {algorithm === 'obst' && <OBSTExplanation />}
        {algorithm === 'subsetgen' && <SubsetGenerationExplanation />}
        {algorithm === 'permutations' && <PermutationGenerationExplanation />}
        {algorithm === 'graphcoloring' && <GraphColoringExplanation />}
        {algorithm === 'hamiltonianpath' && <HamiltonianPathExplanation />}
        {algorithm === 'subsetsummemo' && <SubsetSumMemoizedExplanation />}
        {algorithm === 'textsegmentationmemo' && <TextSegmentationMemoizedExplanation />}
        {algorithm === 'lismemo' && <LISMemoizedExplanation />}
        {algorithm === 'editdistance' && <EditDistanceExplanation />}
        {algorithm === 'fibonaccimemo' && <FibonacciMemoizedExplanation />}
        {algorithm === 'fibonaccitab' && <FibonacciTabulatedExplanation />}
        {algorithm === 'subsetsumtab' && <SubsetSumTabulatedExplanation />}
        {algorithm === 'listabulated' && <LISTabulatedExplanation />}
        {algorithm === 'editdistancetab' && <EditDistanceTabulatedExplanation />}
        {algorithm === 'obsttab' && <OBSTTabulatedExplanation />}
        {algorithm === 'lcstabulated' && <LCSTabulatedExplanation />}
        {algorithm === 'scstabulated' && <SCSTabulatedExplanation />}
        {algorithm === 'knapsacktabulated' && <KnapsackTabulatedExplanation />}
        {algorithm === 'coinchange' && <CoinChangeExplanation />}
        {algorithm === 'palindromepartitioning' && <PalindromePartitioningExplanation />}
        {algorithm === 'mistree' && <MISTreeExplanation />}
        {algorithm === 'mvctree' && <MVCTreeExplanation />}
        {algorithm === 'diametertree' && <DiameterTreeExplanation />}
        {algorithm === 'mincosttreecoloring' && <MinCostTreeColoringExplanation />}
        {algorithm === 'largestbstsubtree' && <LargestBSTSubtreeExplanation />}
        {algorithm === 'activityselection' && <ActivitySelectionExplanation />}
        {algorithm === 'huffmancodes' && <HuffmanCodeExplanation />}
        {algorithm === 'stablematching' && <StableMatchingExplanation />}
        {algorithm === 'appendonlylog' && <AppendOnlyLogExplanation />}
      </div>
    </div>
  );
};


export default function App(): React.ReactNode {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm>('hanoi');

  const currentAlgorithmInfo = Object.values(ALGORITHM_CATEGORIES)
    .flat()
    .find(algo => algo.id === currentAlgorithm);

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-800 p-4 flex flex-col shrink-0 border-r border-slate-700 overflow-y-auto">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-cyan-400">Laboratório de Algoritmos</h1>
          <p className="mt-1 text-sm text-slate-400">Uma Visualização Interativa</p>
        </header>
        
        <nav className="flex flex-col gap-6">
          {Object.entries(ALGORITHM_CATEGORIES).map(([category, algorithms]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-slate-400 mb-3 px-2 uppercase tracking-wider">{category}</h2>
              <div className="flex flex-col gap-1">
                {algorithms.map(({ id, name }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentAlgorithm(id)}
                    className={`w-full text-left px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 flex items-center gap-3 ${
                      currentAlgorithm === id
                        ? 'bg-cyan-500 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/80'
                    }`}
                  >
                    <span className="text-xl w-6 text-center">{name.split(' ')[0]}</span>
                    <span>{name.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <footer className="text-center mt-auto pt-8 text-slate-500">
          <p className="text-xs mb-2">Desenvolvido com React, TypeScript, e Tailwind CSS.</p>
           <a href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/applications/prompting_gallery/react-tower-of-hanoi" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-cyan-400 transition-colors">
            <GithubIcon />
            Ver no GitHub
          </a>
        </footer>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <header className="mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-100">{currentAlgorithmInfo?.name}</h2>
            <p className="mt-2 text-lg text-slate-400">
                Uma análise visual interativa do algoritmo.
            </p>
          </header>
          <AlgorithmVisualizer algorithm={currentAlgorithm} />
        </main>
      </div>
    </div>
  );
}