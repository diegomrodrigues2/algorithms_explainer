import React from 'react';

const DISK_COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-400', 
    'bg-lime-400', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500'
];

interface DiskProps {
  size: number;
  totalDisks: number;
}

const Disk: React.FC<DiskProps> = ({ size, totalDisks }) => {
  // Calculate width percentage: smallest disk is 25%, largest is 100%
  const minWidth = 25;
  const maxWidth = 100;
  // Handle case where totalDisks is 1 to avoid division by zero
  const widthPercentage = totalDisks > 1 
    ? minWidth + ((size - 1) / (totalDisks - 1)) * (maxWidth - minWidth)
    : maxWidth;

  const colorClass = DISK_COLORS[(size - 1) % DISK_COLORS.length];

  return (
    <div
      className={`h-6 sm:h-7 rounded-md flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-300 ${colorClass} border-b-4 border-black/20`}
      style={{ width: `${widthPercentage}%` }}
    >
      {size}
    </div>
  );
};

export default Disk;