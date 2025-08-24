
export type PegID = 'A' | 'B' | 'C';

export interface Move {
  disk: number;
  from: PegID;
  to: PegID;
}

export type Towers = {
  [key in PegID]: number[];
};

// Types for Count Inversions
export type HighlightType = 'compare' | 'inversion' | 'sorted' | 'pivot';

export interface AlgorithmStep {
    array: number[];
    highlights: { [index: number]: HighlightType };
    inversionsCount: number;
    message: string;
}

// Types for Quickselect
export type QuickselectHighlightType =
  | 'search'          // The current subarray being searched
  | 'pivot'           // The chosen pivot element
  | 'compare'         // The element currently being compared to the pivot
  | 'less'            // Elements confirmed to be smaller than the pivot
  | 'greater'         // Elements confirmed to be greater than or equal to the pivot
  | 'storeIndex'      // The special pointer marking the boundary of the 'less' partition
  | 'final-pivot'     // The pivot in its final sorted position for the partition
  | 'found';          // The k-th element when it's found

export interface QuickselectAlgorithmStep {
    array: number[];
    highlights: { [index: number]: QuickselectHighlightType };
    k: number;
    foundValue: number | null;
    message: string;
    left: number;
    right: number;
}

// Types for BFPRT (Median of Medians)
export type BFPRTHighlightType =
  | 'search'          // The current subarray being processed
  | 'group'           // A group of 5 elements being considered
  | 'group-median'    // The median found within a group of 5
  | 'pivot-candidate' // All the group medians, forming the next array for recursion
  | 'pivot'           // The chosen pivot (median of medians)
  | 'compare'         // Element being compared to the pivot
  | 'less'            // Elements smaller than the pivot during partitioning
  | 'found';          // The k-th element when found

export interface BFPRTAlgorithmStep {
    array: number[];
    highlights: { [index: number]: BFPRTHighlightType };
    k: number;
    foundValue: number | null;
    message: string;
    left: number;
    right: number;
}

// Types for Min-Max Finder
export type MinMaxHighlightType =
  | 'compare-pair'    // Comparing two elements in a pair
  | 'compare-global'  // Comparing a value with the current global min or max
  | 'current-min'     // The current minimum value found
  | 'current-max'     // The current maximum value found
  | 'final-min'       // The final minimum value
  | 'final-max';      // The final maximum value

export interface MinMaxAlgorithmStep {
  array: number[];
  highlights: { [index: number]: MinMaxHighlightType };
  comparisonCount: number;
  minValue: number | null;
  maxValue: number | null;
  message: string;
}

// Types for N-Queens
export type NQueensHighlightType =
  | 'trying'      // Cell being considered for placement
  | 'queen'       // Cell with a queen placed
  | 'attack';     // Cell under attack by a queen, or attempted placement is invalid

export interface NQueensAlgorithmStep {
  board: (number | null)[]; // board[row] = col of queen
  highlights: { [row: number]: { [col: number]: NQueensHighlightType } };
  solutionsCount: number;
  message: string;
}

// Types for Subset Sum
export type SubsetSumHighlightType =
  | 'considering' // The number currently being decided upon
  | 'included'    // The number is in the current potential solution subset
  | 'excluded'    // The number is not part of the current path (default state for passed items)
  | 'solution'    // The number is part of a final, found solution
  | 'pruned';     // The current path is being pruned from this point

export interface SubsetSumAlgorithmStep {
  numbers: number[];
  highlights: { [index: number]: SubsetSumHighlightType };
  currentSubset: number[];
  currentSum: number;
  target: number;
  foundSolution: number[] | null;
  message: string;
}

// Types for Text Segmentation
export type TextSegmentationHighlightType =
  | 'default'       // The part of the string not yet processed
  | 'considering'   // The prefix currently being checked against the dictionary
  | 'valid-prefix'  // A prefix that is a valid word and is part of the current path
  | 'backtracked'   // A valid prefix that led to a dead end and was backtracked from
  | 'solution';     // A word that is part of the final, found solution

export interface TextSegmentationAlgorithmStep {
  segments: { word: string; type: TextSegmentationHighlightType }[];
  message: string;
  foundSolution: string[] | null;
}

// Types for Longest Increasing Subsequence (LIS)
export type LISHiglightType =
  | 'considering' // Element being decided on
  | 'included'    // Element in the current path
  | 'skipped'     // Element processed but not in the current path
  | 'solution';   // Element in the final best solution found

export interface LISAlgorithmStep {
  sequence: number[];
  highlights: { [index: number]: LISHiglightType };
  currentSubsequence: number[];
  bestSubsequence: number[];
  message: string;
}

// Types for Optimal Binary Search Tree (OBST)
export interface OBSTNodeData {
    key: string;
    freq: number;
    level: number;
    id: number; // index in original array
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
}

export interface OBSTTree {
    [key: number]: OBSTNodeData;
}

export interface OBSTAlgorithmStep {
    keys: string[];
    freqs: number[];
    costTable: (number | null)[][]; // Memoization table for costs
    rootTable: (number | null)[][]; // Table to reconstruct the tree
    tree: OBSTTree; // The tree structure being built/displayed
    highlights: {
        subproblem?: [number, number]; // [i, j]
        testingRoot?: number; // index r
        tableCell?: [number, number];
    };
    totalCost: number | null;
    message: string;
}

// Types for Subset Generation
export type SubsetGenerationHighlightType =
  | 'considering' // Element being decided on
  | 'included'    // Element in the current path being built
  | 'excluded';   // Element being skipped in the current recursive path

export interface SubsetGenerationAlgorithmStep {
  elements: string[];
  highlights: { [index: number]: SubsetGenerationHighlightType };
  currentSubset: string[];
  foundSubsets: string[][];
  message: string;
}

// Types for Permutation Generation
export type PermutationGenerationHighlightType =
  | 'fixed'         // Element is fixed for the current recursive path
  | 'swap-candidate'// Element at the start index, about to be swapped
  | 'swap-target'   // Element being swapped with the start candidate
  | 'backtrack-swap'// Elements being swapped back during backtracking
  | 'solution';     // Highlighting a full permutation when found

export interface PermutationGenerationAlgorithmStep {
  elements: string[];
  highlights: { [index: number]: PermutationGenerationHighlightType };
  foundPermutations: string[][];
  message: string;
}

// Types for Graph Coloring
export type GraphColoringHighlightType =
  | 'considering' // The vertex currently being processed
  | 'safe'        // A color choice that is valid for the current vertex
  | 'unsafe'      // A color choice that conflicts with a neighbor
  | 'final';      // The final color of a vertex in a found solution

export interface GraphColoringNode {
    id: number;
    x: number;
    y: number;
}

export interface GraphColoringEdge {
    source: number;
    target: number;
}
  
export interface GraphColoringAlgorithmStep {
    graph: { nodes: GraphColoringNode[], edges: GraphColoringEdge[] };
    colors: (number | null)[]; // color index for each vertex (1-based)
    highlights: { [vertexId: number]: GraphColoringHighlightType };
    message: string;
    currentVertex: number | null;
    foundSolution: number[] | null;
}

// Types for Hamiltonian Path
export type HamiltonianPathHighlightType =
  | 'visiting'    // The vertex currently being processed
  | 'path'        // A vertex that is part of the current path
  | 'backtrack'   // A vertex that is being backtracked from
  | 'solution';   // A vertex in the final found path

export interface HamiltonianPathNode {
    id: number;
    x: number;
    y: number;
}

export interface HamiltonianPathEdge {
    source: number;
    target: number;
}
  
export interface HamiltonianPathAlgorithmStep {
    graph: { nodes: HamiltonianPathNode[], edges: HamiltonianPathEdge[] };
    path: number[];
    visited: { [key: number]: boolean };
    highlights: { [vertexId: number]: HamiltonianPathHighlightType };
    message: string;
    foundSolution: number[] | null;
}

// Types for Subset Sum with Memoization
export interface SubsetSumMemoizedAlgorithmStep {
  numbers: number[];
  target: number;
  memo: { [key: string]: boolean }; // Key is "i,t"
  callStack: { i: number, t: number }[];
  currentComputation: { i: number, t: number } | null;
  message: string;
  result: boolean | null; // Final result
  highlights: {
    memoKey?: string; // "i,t" of the cell being accessed/updated
    numberIndex?: number; // index i of the number being considered
  };
}

// Types for Text Segmentation with Memoization
export interface TextSegmentationMemoizedAlgorithmStep {
  text: string;
  memo: { [key: number]: string[] | null | 'computing' }; // key is the start index
  callStack: number[]; // Array of start indices
  currentComputation: {
    start: number;
    end: number;
    prefix: string;
  } | null;
  message: string;
  result: string[] | null;
  path: string[]; // current successful path segments on the stack
  highlights: {
    memoIndex?: number;
    textRange?: [number, number];
  };
}

// Types for Longest Increasing Subsequence with Memoization
export interface LISMemoizedAlgorithmStep {
  sequence: number[];
  memo: { [key: string]: number }; // Key is "i,prev_idx", value is LIS length from this state
  callStack: { i: number; prev_idx: number }[];
  message: string;
  result: number | null; // final result
  currentMax: number; // max LIS length found so far
  highlights: {
    memoKey?: string;
    sequenceIndex?: number;
    prevIndex?: number;
  };
}

// Types for Edit Distance (Levenshtein) with Memoization
export interface EditDistanceAlgorithmStep {
  stringA: string;
  stringB: string;
  memo: { [key: string]: number }; // Key is "i,j", value is the distance
  callStack: { i: number; j: number }[];
  message: string;
  result: number | null; // final result
  highlights: {
    memoKey?: string; // "i,j" of the cell being accessed/updated
    stringAIndex?: number; // index i-1 of stringA
    stringBIndex?: number; // index j-1 of stringB
  };
}

// Types for Fibonacci with Memoization
export interface FibonacciMemoizedAlgorithmStep {
    n: number;
    memo: { [key: number]: number | 'computing' };
    callStack: number[];
    message: string;
    result: number | null;
    highlights: {
        memoIndex?: number;
    };
}

// Types for Fibonacci with Tabulation
export interface FibonacciTabulatedAlgorithmStep {
    n: number;
    dp: (number | null)[];
    optimized: {
        prev: number;
        curr: number;
    };
    message: string;
    result: number | null;
    highlights: {
        dpIndex?: number;
        prev1?: number;
        prev2?: number;
    };
}

// Types for Subset Sum with Tabulation
export interface SubsetSumTabulatedAlgorithmStep {
    numbers: number[];
    target: number;
    dpTable: (boolean | null)[][];
    dp1D: (boolean | null)[];
    message: string;
    result: boolean | null;
    highlights: {
        cell?: [number, number]; // [i, t]
        fromCell?: [number, number];
        fromCellWithValue?: [number, number];
        numberIndex?: number;
        dp1DIndex?: number;
        dp1DFromIndex?: number;
    };
}

// Types for LIS with Tabulation
export interface LISTabulatedAlgorithmStep {
    sequence: number[];
    dp: (number | null)[];
    parent: (number | null)[];
    message: string;
    result: { length: number; subsequence: number[] } | null;
    highlights: {
        currentIndex_i?: number;
        compareIndex_j?: number;
        pathIndices?: number[];
    };
}

// Types for Edit Distance (Levenshtein) with Tabulation
export interface EditDistanceTabulatedAlgorithmStep {
  stringA: string;
  stringB: string;
  dpTable: (number | null)[][];
  message: string;
  result: number | null;
  highlights: {
    cell?: [number, number]; // [i, j] of the cell being computed
    deleteCell?: [number, number]; // [i-1, j]
    insertCell?: [number, number]; // [i, j-1]
    substituteCell?: [number, number]; // [i-1, j-1]
    stringAIndex?: number;
    stringBIndex?: number;
  };
}

// Types for Optimal Binary Search Tree (OBST) with Tabulation
export interface OBSTTabulatedAlgorithmStep {
    keys: string[];
    freqs: number[];
    costTable: (number | null)[][];
    rootTable: (number | null)[][];
    tree: OBSTTree; // Re-use from memoized version
    highlights: {
        currentCell?: [number, number]; // [i, j] being calculated
        testingRoot?: number; // index r
        sourceCell1?: [number, number]; // [i, r-1]
        sourceCell2?: [number, number]; // [r+1, j]
    };
    totalCost: number | null;
    message: string;
}

// Types for Longest Common Subsequence (LCS) with Tabulation
export interface LCSTabulatedAlgorithmStep {
  stringA: string;
  stringB: string;
  dpTable: (number | null)[][];
  message: string;
  result: { length: number; subsequence: string } | null;
  highlights: {
    cell?: [number, number]; // [i, j] of the cell being computed
    matchCell?: [number, number]; // [i-1, j-1]
    upCell?: [number, number]; // [i-1, j]
    leftCell?: [number, number]; // [i, j-1]
    stringAIndex?: number;
    stringBIndex?: number;
    path?: [number, number][]; // cells in the final path
  };
}

// Types for Shortest Common Supersequence (SCS) with Tabulation
export interface SCSTabulatedAlgorithmStep {
  stringA: string;
  stringB: string;
  dpTable: (number | null)[][];
  message: string;
  result: { length: number; supersequence: string } | null;
  highlights: {
    cell?: [number, number]; // [i, j] of the cell being computed
    matchCell?: [number, number]; // [i-1, j-1]
    upCell?: [number, number]; // [i-1, j]
    leftCell?: [number, number]; // [i, j-1]
    stringAIndex?: number;
    stringBIndex?: number;
    path?: [number, number][]; // cells in the final path
  };
}

// Types for 0/1 Knapsack with Tabulation
export interface KnapsackTabulatedAlgorithmStep {
    values: number[];
    weights: number[];
    capacity: number;
    dpTable: (number | null)[][];
    dp1D: (number | null)[];
    message: string;
    result: { value: number; items: { value: number, weight: number, index: number }[] } | null;
    highlights: {
        cell?: [number, number]; // [i, w]
        fromCell?: [number, number];
        fromCellWithValue?: [number, number];
        itemIndex?: number;
        dp1DIndex?: number;
        dp1DFromIndex?: number;
        path?: { i: number, w: number }[];
    };
}

// Types for Coin Change (Minimum Coins) with Tabulation
export interface CoinChangeAlgorithmStep {
    coins: number[];
    amount: number;
    dp: (number | null)[];
    parent: (number | null)[];
    message: string;
    result: { count: number; combination: number[] } | null;
    highlights: {
        currentCoinIndex?: number;
        currentSum?: number;
        sourceSum?: number;
        pathIndices?: number[];
    };
}

// Types for Palindrome Partitioning
export interface PalindromePartitioningAlgorithmStep {
    s: string;
    pal: (boolean | null)[][];
    cuts: (number | null)[];
    message: string;
    result: number | null;
    highlights: {
        pal_i?: number;
        pal_j?: number;
        cuts_i?: number;
        cuts_j?: number;
    };
}

// Types for Maximum Independent Set on a Tree
export type MISTreeHighlightType =
  | 'visiting'    // The current node being processed by DFS
  | 'parent'      // The parent of the current node
  | 'processed'   // A node whose subtree has been fully computed
  | 'solution-in' // A node included in the final MIS
  | 'solution-ex';// A node excluded from the final MIS (default state for non-included)

export interface MISTreeNode {
    id: number;
    x: number;
    y: number;
}

export interface MISTreeEdge {
    source: number;
    target: number;
}
  
export interface MISTreeAlgorithmStep {
    graph: { nodes: MISTreeNode[], edges: MISTreeEdge[] };
    take: { [nodeId: number]: number | null }; // MIS including this node
    skip: { [nodeId: number]: number | null }; // MIS excluding this node
    highlights: { [nodeId: number]: MISTreeHighlightType };
    message: string;
    result: number | null;
}

// Types for Minimum Vertex Cover on a Tree
export type MVCTreeHighlightType =
  | 'visiting'    // The current node being processed by DFS
  | 'parent'      // The parent of the current node
  | 'processed'   // A node whose subtree has been fully computed
  | 'solution-in' // A node included in the final MVC
  | 'solution-ex';// A node excluded from the final MVC

export interface MVCTreeNode {
    id: number;
    x: number;
    y: number;
}

export interface MVCTreeEdge {
    source: number;
    target: number;
}
  
export interface MVCTreeAlgorithmStep {
    graph: { nodes: MVCTreeNode[], edges: MVCTreeEdge[] };
    take: { [nodeId: number]: number | null }; // MVC including this node
    skip: { [nodeId: number]: number | null }; // MVC excluding this node
    highlights: { [nodeId: number]: MVCTreeHighlightType };
    message: string;
    result: number | null;
}

// Types for Tree Diameter
export type DiameterTreeHighlightType =
  | 'visiting'      // The current node being processed by DFS
  | 'parent'        // The parent of the current node
  | 'processed'     // A node whose subtree has been fully computed
  | 'diameter-path';// A node on the final diameter path

export interface DiameterTreeNode {
    id: number;
    x: number;
    y: number;
}

export interface DiameterTreeEdge {
    source: number;
    target: number;
}
  
export interface DiameterTreeAlgorithmStep {
    graph: { nodes: DiameterTreeNode[], edges: DiameterTreeEdge[] };
    height: { [nodeId: number]: number | null }; // height of the subtree rooted at this node
    diameter: { [nodeId: number]: number | null }; // diameter of the subtree rooted at this node
    highlights: { [nodeId: number]: DiameterTreeHighlightType };
    message: string;
    result: number | null; // final diameter of the whole tree
}

// Types for Min Cost Tree Coloring
export type MinCostTreeColoringHighlightType =
  | 'visiting'    // The current node being processed by DFS
  | 'parent'      // The parent of the current node
  | 'processed'   // A node whose subtree has been fully computed
  | 'solution';   // A node in the final colored solution (used for highlighting the final colored node)

export interface MinCostTreeColoringNode {
    id: number;
    x: number;
    y: number;
}

export interface MinCostTreeColoringEdge {
    source: number;
    target: number;
}
  
export interface MinCostTreeColoringAlgorithmStep {
    graph: { nodes: MinCostTreeColoringNode[], edges: MinCostTreeColoringEdge[] };
    costs: number[][]; // costs[nodeId][colorIndex]
    dp: { [nodeId: number]: (number | null)[] }; // dp[nodeId][colorIndex]
    finalColors: { [nodeId: number]: number | null }; // color index (0-based) for each node in the solution
    highlights: { [nodeId: number]: MinCostTreeColoringHighlightType };
    message: string;
    result: number | null; // final minimum cost
}

// Types for Largest BST Subtree
export type LargestBSTSubtreeHighlightType =
  | 'visiting'      // The current node being processed by DFS
  | 'parent'        // The parent of the current node
  | 'processed'     // A node whose subtree has been fully computed
  | 'solution-bst'  // A node that is part of the final largest BST
  | 'not-bst';      // A node that breaks the BST property for its parent

export interface LargestBSTSubtreeNode {
    id: number;
    value: number; // The actual value of the node for BST checks
    x: number;
    y: number;
}

export interface LargestBSTSubtreeEdge {
    source: number;
    target: number;
}

export interface NodeDPInfo {
    isBST: boolean | null;
    size: number | null;
    min: number | null;
    max: number | null;
}
  
export interface LargestBSTSubtreeAlgorithmStep {
    graph: { nodes: LargestBSTSubtreeNode[], edges: LargestBSTSubtreeEdge[] };
    nodeData: { [nodeId: number]: NodeDPInfo }; // Stores DP info for each node
    highlights: { [nodeId: number]: LargestBSTSubtreeHighlightType };
    message: string;
    result: number | null; // final largest BST size
}

// Types for Activity Selection
export interface Activity {
  id: number;
  start: number;
  end: number;
  originalIndex: number;
}

export type ActivityHighlightType = 'considering' | 'selected' | 'rejected';

export interface ActivitySelectionAlgorithmStep {
  activities: Activity[];
  highlights: { [id: number]: ActivityHighlightType };
  selectedActivities: Activity[];
  lastEndTime: number;
  message: string;
  isSorted: boolean;
}

// Types for Huffman Codes
export interface HuffmanNodeData {
    id: string;
    freq: number;
    symbol: string | null;
    level: number;
    x: number;
    y: number;
    leftId?: string | null;
    rightId?: string | null;
    parentX?: number;
    parentY?: number;
}

export interface HuffmanTree {
    [key: string]: HuffmanNodeData;
}

export interface HeapNode {
    id: string;
    freq: number;
    symbol: string | null;
}

export interface HuffmanCodeAlgorithmStep {
    heap: HeapNode[];
    tree: HuffmanTree;
    codes: { [symbol: string]: string };
    message: string;
    highlights: {
        heapIds?: string[];
        treeId?: string;
        path?: string;
    };
    codeGenerationPath: { symbol: string, code: string }[];
}

// Types for Stable Matching (Gale-Shapley)
export type ProposerId = string;
export type ReceiverId = string;

export interface Engagements {
  [receiverId: string]: ProposerId | null; // receiverId -> proposerId
}

export type StableMatchingHighlightType = 'proposing' | 'considering' | 'engaged' | 'rejected' | 'free';

export interface StableMatchingStep {
  proposers: { id: ProposerId; preferences: ReceiverId[] }[];
  receivers: { id: ReceiverId; rankings: { [proposerId: ProposerId]: number } }[];
  engagements: Engagements;
  freeProposers: ProposerId[];
  highlights: {
    proposers: { [id: ProposerId]: StableMatchingHighlightType };
    receivers: { [id: ReceiverId]: StableMatchingHighlightType };
    proposalLine?: { from: ProposerId; to: ReceiverId; rejected?: boolean; success?: boolean };
  };
  message: string;
}

// Types for Append-Only Log
export interface AppendOnlyLogAlgorithmStep {
    log: string[];
    currentState: { [key: string]: string };
    message: string;
    highlights: {
        logIndex?: number;
        foundKey?: string;
        writtenKey?: string;
    };
    operation: 'set' | 'get' | 'idle' | 'scan' | 'result';
    getResult: string | null;
}

// Types for Bitcask-like Hash Index
export interface KeydirEntry {
    offset: number;
    size: number;
}

export interface LogEntry {
    line: string;
    offset: number;
    size: number;
}

export interface BitcaskAlgorithmStep {
    log: LogEntry[];
    keydir: { [key: string]: KeydirEntry };
    message: string;
    highlights: {
        logIndex?: number;
        keydirKey?: string;
    };
    operation: 'set' | 'get' | 'rebuild' | 'idle' | 'result';
    getResult: string | null;
}

// Types for Log Compaction
export interface LogCompactionAlgorithmStep {
    log: LogEntry[];
    compactedLog: LogEntry[];
    keydir: { [key: string]: KeydirEntry }; 
    message: string;
    highlights: {
        logIndex?: number;
        compactedLogIndex?: number;
        keydirKey?: string;
    };
    phase: 'scanning' | 'writing' | 'swapping' | 'done' | 'idle';
}

// Types for Memtable
export type MemtableHighlightType = 'low' | 'high' | 'mid' | 'found' | 'insert' | 'update';

export interface MemtableAlgorithmStep {
    keys: string[];
    values: (string | null)[]; // null can represent a tombstone for deletion
    message: string;
    highlights: {
        [index: number]: MemtableHighlightType;
    };
    operation: 'put' | 'get' | 'delete' | 'idle' | 'result';
    getResult: string | null | undefined; // undefined means not found
    searchState?: { low: number | null, high: number | null, mid: number | null };
}

// Types for SSTable Flush
export interface SSTableFlushAlgorithmStep {
    memtableKeys: string[];
    memtableValues: (string | null)[];
    sstableContent: { line: string; offset: number }[];
    indexContent: { line: string }[];
    message: string;
    highlights: {
        memtableIndex?: number;
        sstableIndex?: number;
        indexIndex?: number;
    };
    phase: 'idle' | 'writing' | 'done';
}

// Types for LSM-Tree
export interface MemtableEntry {
    key: string;
    value: string | null; // null represents a tombstone
}

export interface SSTableSegment {
    id: number;
    entries: MemtableEntry[];
}

export interface LSMTreeAlgorithmStep {
    memtable: MemtableEntry[];
    segments: SSTableSegment[];
    message: string;
    highlights: {
        memtableKey?: string;
        segmentId?: number;
        segmentKey?: string;
        compactSourceIds?: number[];
        compactTargetId?: number;
    };
    operation: 'put' | 'get' | 'flush' | 'compact' | 'idle' | 'result';
    getResult: string | null | undefined; // undefined for not found
}

// Types for Bloom Filter
export interface BloomFilterAlgorithmStep {
    bitArray: (boolean | null)[];
    m: number;
    k: number;
    n: number;
    p: number;
    message: string;
    highlights: {
        bits?: number[];
    };
    operation: 'add' | 'check' | 'idle' | 'result';
    currentItem: string | null;
    checkResult: boolean | null; // true for maybe, false for definitely not
    hashCalculations: { func: string, index: number }[];
}

// Types for B-Tree
export interface BTreeNodeData {
    id: string;
    keys: number[];
    childrenIds: string[];
    isLeaf: boolean;
    // visual props
    x: number;
    y: number;
    // highlight props
    keyHighlights?: { [index: number]: 'split-median' | 'new' | 'search-compare' | 'found' };
    nodeHighlight?: 'full' | 'split-target' | 'new-node' | 'search-path' | 'current';
}

export interface BTreeAlgorithmStep {
    nodes: { [id: string]: BTreeNodeData };
    rootId: string | null;
    message: string;
    t: number;
}

// Types for B+ Tree Range Query
export interface BPlusTreeNodeData {
    id: string;
    keys: number[];
    isLeaf: boolean;
    // visual props
    x: number;
    y: number;
    // pointers
    childrenIds?: string[]; // For internal nodes
    values?: string[];    // For leaf nodes
    nextId?: string | null; // For leaf nodes
    // highlight props
    keyHighlights?: { [index: number]: 'compare' | 'in-range' | 'out-of-range' };
    nodeHighlight?: 'search-path' | 'current-scan' | 'found-start' | 'next-link';
}

export interface BPlusTreeAlgorithmStep {
    nodes: { [id: string]: BPlusTreeNodeData };
    rootId: string | null;
    message: string;
    startKey: number | null;
    endKey: number | null;
    result: { key: number, value: string }[];
}


// Types for Write-Ahead Log (WAL)
export interface WALRecord {
    lsn: number;
    op: 'insert';
    key: number;
}

export interface WALAlgorithmStep {
    wal: WALRecord[];
    btreeNodes: { [id: string]: BTreeNodeData };
    btreeRootId: string | null;
    message: string;
    highlights: {
        walIndex?: number;
    };
    phase: 'idle' | 'logging' | 'applying' | 'recovery_read' | 'recovery_apply';
}

// Types for Row to Column Conversion
export interface RowToColumnAlgorithmStep {
    rows: { [key: string]: any }[];
    columns: { [key: string]: any[] };
    schema: string[];
    message: string;
    highlights: {
        rowIndex?: number;
        colKey?: string;
        cellKey?: string; // for a specific cell: (row_index, col_key)
        phase: 'discover' | 'populate' | 'done' | 'idle';
    };
}
