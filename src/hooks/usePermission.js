import { useMemo } from 'react';
import { checkPermission, getUserLevel } from '../utils/auth';

export const usePermission = () => {
  const hasPermission = (feature) => {
    return checkPermission(feature);
  };

  const userLevel = useMemo(() => {
    return getUserLevel();
  }, []);

  const canAccess = (requiredLevel) => {
    const currentLevel = userLevel;
    const levels = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5'];
    return levels.indexOf(currentLevel) >= levels.indexOf(requiredLevel);
  };

  return {
    hasPermission,
    userLevel,
    canAccess
  };
}; 