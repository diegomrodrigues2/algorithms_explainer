import React from 'react';
import { useActivitySelection } from '../hooks/useActivitySelection';
import ActivitySelectionControls from './ActivitySelectionControls';
import type { ActivityHighlightType } from '../types';

const getHighlightClasses = (type: ActivityHighlightType | undefined) => {
    switch (type) {
        case 'considering':
            return 'bg-yellow-500/80 border-yellow-400 ring-2 ring-yellow-300';
        case 'selected':
            return 'bg-emerald-500/90 border-emerald-400';
        case 'rejected':
            return 'bg-red-600/70 border-red-500 opacity-60';
        default:
            return 'bg-cyan-600/80 border-cyan-500';
    }
};

const ActivitySelectionVisualizer = () => {
    const {
        step,
        numActivities,
        maxTime,
        speed,
        isPlaying,
        currentStep,
        totalSteps,
        actions
    } = useActivitySelection(10);

    const { activities, highlights, selectedActivities, message } = step;

    return (
        <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            {/* Visual Area */}
            <div className="relative w-full h-[400px] bg-slate-900/50 rounded-lg p-4 overflow-y-auto">
                {/* Timeline Axis */}
                <div className="relative h-full">
                    {Array.from({ length: maxTime + 1 }).map((_, time) => (
                        time % 2 === 0 &&
                        <div key={time} className="absolute h-full" style={{ left: `${(time / maxTime) * 100}%`}}>
                            <div className="w-px h-full bg-slate-700"></div>
                            <span className="absolute -top-1 -translate-x-1/2 text-xs text-slate-400">{time}</span>
                        </div>
                    ))}
                </div>

                {/* Activities */}
                <div className="absolute inset-0 top-6">
                    {activities.map((activity, index) => {
                        const left = (activity.start / maxTime) * 100;
                        const width = ((activity.end - activity.start) / maxTime) * 100;
                        const top = (index * (100 / activities.length));
                        const height = (100 / (activities.length + 1));

                        return (
                             <div
                                key={activity.id}
                                className={`absolute rounded-md flex items-center justify-between px-2 text-white font-semibold text-sm border transition-all duration-300 ${getHighlightClasses(highlights[activity.id])}`}
                                style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    top: `${top}%`,
                                    height: `${Math.max(20, height)}px`,
                                }}
                                title={`Atividade ${activity.originalIndex}: [${activity.start}, ${activity.end})`}
                            >
                               <span>#{activity.originalIndex}</span>
                               <span>[{activity.start}, {activity.end})</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Status Bar */}
            <div className="h-12 text-center my-4 flex flex-col justify-center items-center">
                <p className="text-cyan-400 font-mono text-sm sm:text-base">{message}</p>
                <p className="text-xs text-slate-400">
                    Passo: <span className="font-mono">{currentStep}</span> / <span className="font-mono">{totalSteps}</span>
                </p>
            </div>

            {/* Controls Area */}
            <ActivitySelectionControls
                numActivities={numActivities}
                onNumActivitiesChange={actions.handleNumActivitiesChange}
                speed={speed}
                onSpeedChange={actions.handleSpeedChange}
                isPlaying={isPlaying}
                onPlayPause={actions.togglePlayPause}
                onReset={actions.reset}
                selectedCount={selectedActivities.length}
            />
        </div>
    );
};

export default ActivitySelectionVisualizer;
