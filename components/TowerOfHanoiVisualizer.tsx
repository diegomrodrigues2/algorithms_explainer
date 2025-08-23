
import React from 'react';
import Tower from './Tower';
import Controls from './Controls';
import { useTowerOfHanoi } from '../hooks/useTowerOfHanoi';

const TowerOfHanoiVisualizer = () => {
  const {
    towers,
    numDisks,
    speed,
    isPlaying,
    currentMoveIndex,
    totalMoves,
    actions
  } = useTowerOfHanoi(3);

  return (
    <div className="p-4 sm:p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
      {/* Visual Area */}
      <div className="flex justify-around items-end min-h-[350px] mb-6 px-4">
        <Tower id="A" disks={towers.A} totalDisks={numDisks} />
        <Tower id="B" disks={towers.B} totalDisks={numDisks} />
        <Tower id="C" disks={towers.C} totalDisks={numDisks} />
      </div>

      {/* Controls Area */}
      <Controls
        numDisks={numDisks}
        onNumDisksChange={actions.handleNumDisksChange}
        speed={speed}
        onSpeedChange={actions.handleSpeedChange}
        isPlaying={isPlaying}
        onPlayPause={actions.togglePlayPause}
        onReset={actions.reset}
        currentMove={currentMoveIndex}
        totalMoves={totalMoves}
      />
    </div>
  );
};

export default TowerOfHanoiVisualizer;
