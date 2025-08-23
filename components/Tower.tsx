
import React from 'react';
import Disk from './Disk';
import type { PegID } from '../types';

interface TowerProps {
  id: PegID;
  disks: number[];
  totalDisks: number;
}

const Tower = ({ id, disks, totalDisks }: TowerProps) => {
  return (
    <div className="flex flex-col items-center w-1/3 h-full">
      {/* Disks and Peg */}
      <div className="flex flex-col-reverse items-center justify-end h-72 w-full relative">
        {/* Peg Pole */}
        <div className="absolute bottom-0 w-2 h-full bg-slate-700/50 rounded-t-lg"></div>

        {/* Disks stack */}
        <div className="flex flex-col-reverse items-center justify-end w-full gap-1 h-full z-10">
            {disks.map((diskSize) => (
                <Disk key={diskSize} size={diskSize} totalDisks={totalDisks} />
            ))}
        </div>
      </div>
      {/* Base and Label */}
      <div className="h-2 w-full bg-slate-600 rounded-sm"></div>
      <div className="w-10 h-10 flex items-center justify-center mt-2 rounded-full bg-slate-700 text-cyan-400 font-bold text-lg shadow-md">
        {id}
      </div>
    </div>
  );
};

export default Tower;
