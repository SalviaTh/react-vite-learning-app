import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { GameScore } from '@/contexts/UserContext';

interface GameWrapperProps {
  gameId: string;
  gameName: string;
  children: React.ReactNode;
  onGameComplete?: (score: GameScore) => void;
}

export function GameWrapper({ gameId, gameName, children, onGameComplete }: GameWrapperProps) {
  const { addGameScore } = useUser();
  const [startTime] = useState(Date.now());

  const handleGameComplete = async (score: number, maxScore: number, stars: number, level: number = 1) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    const gameScore: GameScore = {
      gameId,
      gameName,
      score,
      maxScore,
      stars,
      completedAt: new Date().toISOString(),
      level,
      timeSpent,
    };

    await addGameScore(gameScore);
    onGameComplete?.(gameScore);
  };

  // Provide the handleGameComplete function to children through context or props
  return (
    <>
      {React.cloneElement(children as React.ReactElement, { 
        onGameComplete: handleGameComplete 
      })}
    </>
  );
}