import { useState, useEffect, useCallback } from 'react';

interface GameProgress {
  xp: number;
  level: number;
  progress: number;
  completedModules: string[];
}

const XP_PER_LEVEL = 100;

export const useGameProgress = () => {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('oslab-xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    const saved = localStorage.getItem('oslab-completed');
    return saved ? JSON.parse(saved) : [];
  });

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const totalModules = 3;
  const progress = Math.round((completedModules.length / totalModules) * 100);

  useEffect(() => {
    localStorage.setItem('oslab-xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('oslab-completed', JSON.stringify(completedModules));
  }, [completedModules]);

  const addXP = useCallback((amount: number) => {
    setXp(prev => prev + amount);
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setCompletedModules(prev => {
      if (prev.includes(moduleId)) return prev;
      return [...prev, moduleId];
    });
  }, []);

  const resetProgress = useCallback(() => {
    setXp(0);
    setCompletedModules([]);
    localStorage.removeItem('oslab-xp');
    localStorage.removeItem('oslab-completed');
  }, []);

  return {
    xp,
    level,
    progress,
    completedModules,
    addXP,
    completeModule,
    resetProgress,
  };
};
