import React from 'react';
import { useCoinChange } from '../hooks/useCoinChange';
import CoinChangeControls from './CoinChangeControls';

const DataBox = ({ label, value, highlightClass }: { label: string, value: React.ReactNode, highlightClass: string }) => (
    <div className={`p-1.5 rounded-lg transition-all duration-300 border-b-4 text-center ${highlightClass}`}>
        <span className="text-xs text-slate-400">{label}</span>
        <div className="text-center text-lg font-bold text-white h-7 flex items-center justify-center">{value}</div>
    </div>
);

const CoinChangeVisualizer = () => {
    const {
        step,
        coinsInput,
        amountInput,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useCoinChange('1,2,5', 11);

    const { coins, amount, dp, parent, highlights, message, result } = step;
    const INF = amount + 1;

    const getHighlightClass = (index: number) => {
        if (highlights.pathIndices?.includes(index)) return 'bg-emerald-600 border-emerald-400';
        if (highlights.currentSum === index) return 'bg-cyan-600 border-cyan-400 scale-110';
        if (highlights.sourceSum === index) return 'bg-yellow-600 border-yellow-400';
        return 'bg-slate-700 border-slate-600';
    };

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
             <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Moedas Disponíveis</h3>
                <div className="flex flex-wrap gap-2 p-2 bg-slate-900/70 rounded-lg border border-slate-700">
                    {coins.map((coin, i) => (
                        <div key={i} className={`px-3 py-1 rounded-md font-bold text-white text-lg border-b-2 ${highlights.currentCoinIndex === i ? 'bg-cyan-600 border-cyan-400 scale-110' : 'bg-slate-700 border-slate-600'}`}>
                            {coin}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 mb-6">
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela DP (mínimo de moedas)</h3>
                     <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {dp.map((val, i) => <DataBox key={i} label={`dp[${i}]`} value={val === INF ? '∞' : val} highlightClass={getHighlightClass(i)} />)}
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">Tabela Parent (moeda usada)</h3>
                     <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {parent.map((val, i) => <DataBox key={i} label={`p[${i}]`} value={val === null || val === -1 ? '-' : val} highlightClass={getHighlightClass(i)} />)}
                    </div>
                </div>
            </div>

            <div className="h-12 text-center mb-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <CoinChangeControls
                coins={coinsInput}
                onCoinsChange={actions.handleCoinsChange}
                amount={amountInput}
                onAmountChange={actions.handleAmountChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                result={result}
            />
        </div>
    );
};

export default CoinChangeVisualizer;