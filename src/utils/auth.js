import { message } from 'antd';
import { verifyAccountPermission } from '../mock';

// 权限拦截器
export const authInterceptor = async (config) => {
  const token = localStorage.getItem('token');
  if (!token) {
    message.error('请先登录');
    return Promise.reject(new Error('未登录'));
  }

  // 如果是需要验证账户权限的请求
  if (config.needAccountAuth) {
    const accountNumber = config.accountNumber;
    if (!accountNumber) {
      return Promise.reject(new Error('缺少账户信息'));
    }

    try {
      const response = await verifyAccountPermission(token, accountNumber);
      if (!response.success) {
        message.error(response.message);
        return Promise.reject(new Error(response.message));
      }

      // 检查是否有权限执行该操作
      const { features } = response.data;
      if (config.requiredFeature && !features.includes(config.requiredFeature)) {
        message.error('您没有权限执行此操作');
        return Promise.reject(new Error('权限不足'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return config;
};

// 获取用户权限等级
export const getUserLevel = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  return userInfo.level || 'LEVEL_1';
};

// 检查特定功能权限
export const checkPermission = (feature) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const permissions = userInfo.permissions || [];
  return permissions.includes(feature);
};

// 权限等级映射
export const LEVEL_MAP = {
  LEVEL_1: '普通用户',
  LEVEL_2: '银卡用户',
  LEVEL_3: '金卡用户',
  LEVEL_4: '白金卡用户',
  LEVEL_5: '钻石卡用户'
};

// 功能权限映射
export const FEATURE_MAP = {
  QUICK_TRANSFER: '快速转账',
  BILL_PAYMENT: '账单支付',
  INVESTMENT: '投资理财',
  WEALTH_MANAGEMENT: '财富管理',
  PRIVATE_BANKING: '私人银行'
};

// 权限等级对应的功能
export const LEVEL_FEATURES = {
  LEVEL_1: {
    name: '普通用户',
    features: ['basic_transfer', 'view_balance'],
    dailyLimit: 5000,
    pages: ['/user', '/transfer']
  },
  LEVEL_2: {
    name: '银卡用户',
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment'],
    dailyLimit: 20000,
    pages: ['/user', '/transfer', '/quick-transfer', '/bill']
  },
  LEVEL_3: {
    name: '金卡用户',
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment'],
    dailyLimit: 50000,
    pages: ['/user', '/transfer', '/quick-transfer', '/bill', '/investment']
  },
  LEVEL_4: {
    name: '白金用户',
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment', 'wealth_management'],
    dailyLimit: 100000,
    pages: ['/user', '/transfer', '/quick-transfer', '/bill', '/investment', '/wealth']
  },
  LEVEL_5: {
    name: '钻石用户',
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment', 'wealth_management', 'private_banking'],
    dailyLimit: 500000,
    pages: ['/user', '/transfer', '/quick-transfer', '/bill', '/investment', '/wealth', '/private']
  }
};

// 路由权限检查
export const checkRoutePermission = (path) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userLevel = userInfo.level || 'LEVEL_1';
  const levelFeatures = LEVEL_FEATURES[userLevel];

  console.log('当前路径:', path);
  console.log('用户等级:', userLevel);
  console.log('用户权限:', userInfo.permissions);
  console.log('可用页面:', levelFeatures?.pages);

  if (!levelFeatures) {
    console.log('未找到对应的权限配置');
    return false;
  }

  const hasPermission = levelFeatures.pages.includes(path);
  console.log('是否有权限:', hasPermission);

  return hasPermission;
}; 