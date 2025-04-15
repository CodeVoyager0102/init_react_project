import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkRoutePermission, getUserLevel, LEVEL_MAP } from '../utils/auth';

const PrivateRoute = ({ children, requiredLevel }) => {
  const location = useLocation();
  const userLevel = getUserLevel();
  
  // 检查路由权限
  if (!checkRoutePermission(location.pathname)) {
    console.log(`用户等级 ${LEVEL_MAP[userLevel]} 没有访问 ${location.pathname} 的权限`);
    return <Navigate to="/user" replace />;
  }
  
  // 检查用户等级
  const userLevelNum = parseInt(userLevel.split('_')[1]);
  const requiredLevelNum = parseInt(requiredLevel?.split('_')[1] || '1');
  
  if (userLevelNum < requiredLevelNum) {
    console.log(`用户等级 ${LEVEL_MAP[userLevel]} 低于要求的等级 ${LEVEL_MAP[requiredLevel]}`);
    return <Navigate to="/user" replace />;
  }
  
  return children;
};

export default PrivateRoute; 