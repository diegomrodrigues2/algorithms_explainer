
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PegID, Move, Towers } from '../types';

const INITIAL_SPEED = 500; // ms per move
const MIN_SPEED = 50;
const MAX_SPEED = 1000;

export const useTowerOfHanoi = (initialDisks: number) => {
  const [numDisks, setNumDisks] = useState(initialDisks);
  const [towers, setTowers] = useState<Towers>({ A: [], B: [], C: [] });
  const [moves, setMoves] = useState<Move[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const generateMoves = useCallback((n: number, source: PegID, destination: PegID, auxiliary: PegID, currentMoves: Move[]) => {
    if (n === 0) {
      return;
    }
    generateMoves(n - 1, source, auxiliary, destination, currentMoves);
    currentMoves.push({ disk: n, from: source, to: destination });
    generateMoves(n - 1, auxiliary, destination, source, currentMoves);
  }, []);
  
  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentMoveIndex(0);
    const initialDisksArray = Array.from({ length: numDisks }, (_, i) => numDisks - i);
    setTowers({ A: initialDisksArray, B: [], C: [] });
    
    const newMoves: Move[] = [];
    generateMoves(numDisks, 'A', 'C', 'B', newMoves);
    setMoves(newMoves);
  }, [numDisks, generateMoves]);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDisks]);
  
  useEffect(() => {
    if (!isPlaying || currentMoveIndex >= moves.length) {
      if (currentMoveIndex >= moves.length && moves.length > 0) {
          setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      const move = moves[currentMoveIndex];
      setTowers(prevTowers => {
        const newTowers = { ...prevTowers };
        const fromPeg = [...newTowers[move.from]];
        const toPeg = [...newTowers[move.to]];
        
        const diskToMove = fromPeg.pop();
        if (diskToMove !== undefined) {
          toPeg.push(diskToMove);
        }
        
        return {
          ...newTowers,
          [move.from]: fromPeg,
          [move.to]: toPeg,
        };
      });
      setCurrentMoveIndex(prevIndex => prevIndex + 1);
    }, MAX_SPEED - speed + MIN_SPEED);

    return () => clearTimeout(timer);
  }, [isPlaying, currentMoveIndex, moves, speed]);

  const togglePlayPause = () => {
    if (currentMoveIndex >= moves.length && moves.length > 0) {
      reset();
      setTimeout(() => setIsPlaying(true), 100); 
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNumDisksChange = (newNumDisks: number) => {
    if(isPlaying) return;
    setNumDisks(newNumDisks);
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const totalMoves = useMemo(() => Math.pow(2, numDisks) - 1, [numDisks]);

  return {
    towers,
    numDisks,
    speed,
    isPlaying,
    currentMoveIndex,
    totalMoves,
    actions: {
      handleNumDisksChange,
      handleSpeedChange,
      togglePlayPause,
      reset,
    }
  };
};
