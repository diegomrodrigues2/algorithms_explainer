import React, { useRef, useLayoutEffect, useState, createRef, useMemo } from 'react';
import { useStableMatching } from '../hooks/useStableMatching';
import StableMatchingControls from './StableMatchingControls';
import type { StableMatchingHighlightType } from '../types';

const getHighlightClasses = (type: StableMatchingHighlightType | undefined) => {
    switch (type) {
        case 'proposing': return 'ring-2 ring-yellow-400 bg-yellow-500/20';
        case 'considering': return 'ring-2 ring-cyan-400 bg-cyan-500/20';
        case 'engaged': return 'ring-2 ring-emerald-500 bg-emerald-500/20';
        case 'rejected': return 'ring-2 ring-red-500 bg-red-500/20';
        default: return 'ring-1 ring-slate-600 bg-slate-900/50';
    }
};

const PersonCard = React.forwardRef<HTMLDivElement, { id: string, preferences: string[], highlight?: StableMatchingHighlightType }>(({ id, preferences, highlight }, ref) => (
    <div ref={ref} id={`person-${id}`} className={`p-3 rounded-lg transition-all duration-300 ${getHighlightClasses(highlight)}`}>
        <h4 className="font-bold text-lg text-center text-slate-200">{id}</h4>
        <ol className="mt-2 text-sm text-slate-400 list-decimal list-inside">
            {preferences.map(pref => <li key={pref}>{pref}</li>)}
        </ol>
    </div>
));

const StableMatchingVisualizer = () => {
    const { step, numPairs, speed, isPlaying, currentStep, totalSteps, actions } = useStableMatching(4);
    const { proposers, receivers, engagements, highlights, message } = step;

    const containerRef = useRef<HTMLDivElement>(null);
    const [positions, setPositions] = useState<{ [id: string]: { x: number, y: number } }>({});
    
    const personRefs = useMemo(() => 
        (proposers.concat(receivers as any)).reduce((acc, person) => {
            acc[person.id] = createRef<HTMLDivElement>();
            return acc;
        }, {} as {[id: string]: React.RefObject<HTMLDivElement>}),
    [proposers, receivers]);

    useLayoutEffect(() => {
        const newPositions: { [id: string]: { x: number, y: number } } = {};
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        
        Object.keys(personRefs).forEach(id => {
            const el = personRefs[id].current;
            if (el) {
                const rect = el.getBoundingClientRect();
                newPositions[id] = {
                    x: rect.left - containerRect.left + rect.width / 2,
                    y: rect.top - containerRect.top + rect.height / 2,
                };
            }
        });
        setPositions(newPositions);
    }, [step, personRefs]);

    const engagementLines = Object.entries(engagements)
        .filter(([, proposerId]) => proposerId !== null)
        .map(([receiverId, proposerId]) => ({ from: proposerId!, to: receiverId }));

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div ref={containerRef} className="relative grid grid-cols-2 gap-8 mb-4">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-slate-300">Proponentes</h3>
                    {proposers.map(p => (
                        <PersonCard key={p.id} ref={personRefs[p.id]} id={p.id} preferences={p.preferences} highlight={highlights.proposers[p.id]} />
                    ))}
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-slate-300">Respondentes</h3>
                    {receivers.map(r => (
                        <PersonCard key={r.id} ref={personRefs[r.id]} id={r.id} preferences={Object.entries(r.rankings).sort((a,b) => a[1] - b[1]).map(([id]) => id)} highlight={highlights.receivers[r.id]} />
                    ))}
                </div>

                {/* SVG Overlay for lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {engagementLines.map(line => {
                        const p1 = positions[line.from];
                        const p2 = positions[line.to];
                        if (!p1 || !p2) return null;
                        return <line key={`${line.from}-${line.to}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className="stroke-emerald-500/80 stroke-2 transition-all duration-300" />;
                    })}
                    {highlights.proposalLine && positions[highlights.proposalLine.from] && positions[highlights.proposalLine.to] && (
                        <line 
                            x1={positions[highlights.proposalLine.from].x} 
                            y1={positions[highlights.proposalLine.from].y}
                            x2={positions[highlights.proposalLine.to].x}
                            y2={positions[highlights.proposalLine.to].y}
                            className={`stroke-2 transition-all duration-300 ${highlights.proposalLine.rejected ? 'stroke-red-500' : 'stroke-yellow-400'}`}
                            strokeDasharray="5,5"
                        />
                    )}
                </svg>
            </div>
            
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            <StableMatchingControls
                numPairs={numPairs}
                onNumPairsChange={actions.handleNumPairsChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
            />
        </div>
    );
};

export default StableMatchingVisualizer;