import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// 创建mock实例
const mock = new MockAdapter(instance, { delayResponse: 1000 });

// 账户等级定义
const ACCOUNT_LEVELS = {
  LEVEL_1: { // 普通用户
    name: '普通用户',
    maxBalance: 50000,
    dailyTransferLimit: 5000,
    features: ['basic_transfer', 'view_balance']
  },
  LEVEL_2: { // 银卡用户
    name: '银卡用户',
    maxBalance: 200000,
    dailyTransferLimit: 20000,
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment']
  },
  LEVEL_3: { // 金卡用户
    name: '金卡用户',
    maxBalance: 500000,
    dailyTransferLimit: 50000,
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment']
  },
  LEVEL_4: { // 白金用户
    name: '白金用户',
    maxBalance: 1000000,
    dailyTransferLimit: 100000,
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment', 'wealth_management']
  },
  LEVEL_5: { // 钻石用户
    name: '钻石用户',
    maxBalance: 5000000,
    dailyTransferLimit: 500000,
    features: ['basic_transfer', 'view_balance', 'quick_transfer', 'bill_payment', 'investment', 'wealth_management', 'private_banking']
  }
};

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    role: 'admin',
    accounts: [
      {
        accountNumber: '6225888888888888',
        balance: '10000.00',
        level: 'LEVEL_1',
        type: '储蓄卡',
        status: 'active'
      }
    ]
  },
  {
    id: 2,
    username: 'zhangsan',
    password: '123456',
    name: '张三',
    role: 'user',
    accounts: [
      {
        accountNumber: '6217123456789012',
        balance: '500000.00',
        level: 'LEVEL_1',
        type: '储蓄卡',
        status: 'active'
      },
      {
        accountNumber: '6217123456789013',
        balance: '20000.00',
        level: 'LEVEL_2',
        type: '信用卡',
        status: 'active'
      }
    ]
  },
  {
    id: 3,
    username: 'lisi',
    password: '123456',
    name: '李四',
    role: 'user',
    accounts: [
      {
        accountNumber: '6225987654321098',
        balance: '8000.00',
        level: 'LEVEL_3',
        type: '储蓄卡',
        status: 'active'
      }
    ]
  },
  {
    id: 4,
    username: 'wangwu',
    password: '123456',
    name: '王五',
    role: 'user',
    accounts: [
      {
        accountNumber: '6217987654321098',
        balance: '3000.00',
        level: 'LEVEL_1',
        type: '储蓄卡',
        status: 'active'
      }
    ]
  }
];

const articles = [
  {
    id: 1,
    title: '示例文章1',
    content: '这是示例文章1的内容',
    author: 'admin',
    createTime: '2024-04-11 10:00:00',
    tags: ['React', '前端']
  },
  {
    id: 2,
    title: '示例文章2',
    content: '这是示例文章2的内容',
    author: 'user',
    createTime: '2024-04-11 11:00:00',
    tags: ['JavaScript', 'Vue']
  }
];

const comments = [
  {
    id: 1,
    articleId: 1,
    content: '这是一条评论',
    author: 'user',
    createTime: '2024-04-11 12:00:00'
  },
  {
    id: 2,
    articleId: 1,
    content: '这是另一条评论',
    author: 'admin',
    createTime: '2024-04-11 13:00:00'
  }
];

// 模拟转账记录
const transferRecords = [];

// 模拟通知数据
const notifications = [];

// 模拟API响应
const mockResponse = (data, success = true, message = '操作成功') => {
  return {
    success,
    message,
    data
  };
};

// 模拟登录接口
export const login = (username, password) => {
  console.log('尝试登录:', username, password);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password: pwd, ...userInfo } = user;
    // 根据用户名的最后一个数字决定等级（演示用）
    const userNumber = parseInt(username?.slice(-1)) || 1;
    const level = `LEVEL_${Math.min(userNumber, 5)}`;
    
    // 根据等级设置权限
    let permissions = [];
    let availableFeatures = [];
    
    switch(level) {
      case 'LEVEL_1':
        permissions = ['QUICK_TRANSFER'];
        availableFeatures = ['QUICK_TRANSFER'];
        break;
      case 'LEVEL_2':
        permissions = ['QUICK_TRANSFER', 'BILL_PAYMENT'];
        availableFeatures = ['QUICK_TRANSFER', 'BILL_PAYMENT'];
        break;
      case 'LEVEL_3':
        permissions = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT'];
        availableFeatures = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT'];
        break;
      case 'LEVEL_4':
        permissions = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT', 'WEALTH_MANAGEMENT'];
        availableFeatures = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT', 'WEALTH_MANAGEMENT'];
        break;
      case 'LEVEL_5':
        permissions = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT', 'WEALTH_MANAGEMENT', 'PRIVATE_BANKING'];
        availableFeatures = ['QUICK_TRANSFER', 'BILL_PAYMENT', 'INVESTMENT', 'WEALTH_MANAGEMENT', 'PRIVATE_BANKING'];
        break;
      default:
        permissions = ['QUICK_TRANSFER'];
        availableFeatures = ['QUICK_TRANSFER'];
    }
    
    const responseData = {
      token: 'mock-token-' + user.id,
      userInfo: {
        ...userInfo,
        level,
        permissions,
        availableFeatures
      }
    };
    
    console.log('登录成功，返回数据:', responseData);
    return mockResponse(responseData);
  }
  console.log('登录失败：用户名或密码错误');
  return mockResponse(null, false, '用户名或密码错误');
};

// 模拟获取用户信息接口
export const getUserInfo = (token) => {
  const userId = parseInt(token.split('-')[2]);
  const user = users.find(u => u.id === userId);
  if (user) {
    const { password, ...userInfo } = user;
    // 计算用户最高等级和所有可用功能
    const userLevels = user.accounts.map(a => a.level);
    const highestLevel = Math.max(...userLevels.map(l => parseInt(l.split('_')[1])));
    const allFeatures = [...new Set(user.accounts.flatMap(a => ACCOUNT_LEVELS[a.level].features))];
    
    return mockResponse({
      ...userInfo,
      highestLevel: `LEVEL_${highestLevel}`,
      availableFeatures: allFeatures
    });
  }
  return mockResponse(null, false, '用户不存在');
};

// 模拟发送通知接口
export const sendNotification = (userId, type, content) => {
  const notification = {
    id: notifications.length + 1,
    userId,
    type,
    content,
    isRead: false,
    createTime: new Date().toISOString()
  };
  notifications.push(notification);
  return mockResponse(notification);
};

// 模拟获取通知接口
export const getNotifications = (userId) => {
  const userNotifications = notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  return mockResponse(userNotifications);
};

// 模拟权限验证中间件
export const verifyAccountPermission = (token, accountNumber) => {
  const userId = parseInt(token.split('-')[2]);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return mockResponse(null, false, '用户不存在');
  }
  
  const account = user.accounts.find(a => a.accountNumber === accountNumber);
  if (!account) {
    return mockResponse(null, false, '账户不存在或不属于该用户');
  }
  
  return mockResponse({
    hasPermission: true,
    account,
    userLevel: user.accounts.map(a => a.level),
    features: [...new Set(user.accounts.flatMap(a => ACCOUNT_LEVELS[a.level].features))]
  });
};

// 修改转账接口，添加权限验证
export const transfer = (token, fromAccount, toAccount, amount, remark) => {
  // 验证转出账户权限
  const fromPermission = verifyAccountPermission(token, fromAccount);
  if (!fromPermission.success) {
    return fromPermission;
  }
  
  const fromUser = users.find(u => u.accounts.some(a => a.accountNumber === fromAccount));
  const toUser = users.find(u => u.accounts.some(a => a.accountNumber === toAccount));
  
  if (!fromUser || !toUser) {
    return mockResponse(null, false, '账户不存在');
  }
  
  const fromAccountInfo = fromUser.accounts.find(a => a.accountNumber === fromAccount);
  const amountNum = parseFloat(amount);
  const fromBalance = parseFloat(fromAccountInfo.balance);
  
  // 检查账户等级限制
  const accountLevel = ACCOUNT_LEVELS[fromAccountInfo.level];
  if (amountNum > accountLevel.dailyTransferLimit) {
    return mockResponse(null, false, `超过账户等级${accountLevel.name}的每日转账限额`);
  }
  
  if (fromBalance < amountNum) {
    return mockResponse(null, false, '余额不足');
  }
  
  // 更新余额
  fromAccountInfo.balance = (fromBalance - amountNum).toFixed(2);
  const toAccountInfo = toUser.accounts.find(a => a.accountNumber === toAccount);
  toAccountInfo.balance = (parseFloat(toAccountInfo.balance) + amountNum).toFixed(2);
  
  // 记录转账
  const record = {
    id: transferRecords.length + 1,
    fromAccount,
    toAccount,
    amount: amountNum,
    remark,
    createTime: new Date().toISOString()
  };
  transferRecords.push(record);
  
  // 发送通知给收款方
  sendNotification(
    toUser.id,
    'transfer',
    `您收到一笔转账：\n    转账人：${fromUser.name}\n    金额：${amountNum}元\n    备注：${remark || '无'}`.replace(/^\s+/gm, '')
  );
  
  return mockResponse({
    record,
    newBalance: fromAccountInfo.balance
  });
};

// 模拟获取转账记录接口
export const getTransferRecords = (accountNumber, page = 1, pageSize = 10) => {
  const records = transferRecords
    .filter(r => r.fromAccount === accountNumber || r.toAccount === accountNumber)
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return mockResponse({
    records: records.slice(start, end),
    total: records.length,
    page,
    pageSize
  });
};

// 模拟人脸识别登录接口
export const faceLogin = (faceImage) => {
  console.log('人脸识别登录');
  // 模拟人脸识别成功
  const mockUser = {
    id: Math.floor(Math.random() * 1000),
    username: '人脸用户',
    name: '人脸用户',
    role: 'user',
    level: 'LEVEL_2',
    permissions: ['QUICK_TRANSFER', 'BILL_PAYMENT'],
    availableFeatures: ['QUICK_TRANSFER', 'BILL_PAYMENT'],
    accounts: [
      {
        accountNumber: '6225' + Math.floor(Math.random() * 1000000000000),
        balance: (Math.random() * 10000).toFixed(2),
        type: '储蓄卡',
        status: 'active'
      }
    ]
  };
  
  return mockResponse({
    token: 'mock-token-face-' + mockUser.id,
    userInfo: mockUser
  });
};

// 模拟图片上传接口
export const uploadImage = (file) => {
  return mockResponse({
    url: 'https://example.com/images/' + file.name,
    filename: file.name
  });
};

// 设置mock接口
mock.onGet('/users').reply(200, users);
mock.onGet(/\/users\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop());
  const user = users.find(u => u.id === id);
  return [200, user];
});

mock.onGet('/articles').reply(200, articles);
mock.onGet(/\/articles\/\d+/).reply(config => {
  const id = parseInt(config.url.split('/').pop());
  const article = articles.find(a => a.id === id);
  return [200, article];
});

mock.onGet('/comments').reply(200, comments);
mock.onGet(/\/articles\/\d+\/comments/).reply(config => {
  const articleId = parseInt(config.url.split('/')[2]);
  const articleComments = comments.filter(c => c.articleId === articleId);
  return [200, articleComments];
});

mock.onPost('/login').reply(config => {
  const { username, password } = JSON.parse(config.data);
  const user = users.find(u => u.username === username);
  if (user && password === '123456') {
    return [200, { token: 'mock-token', user }];
  }
  return [401, { message: '用户名或密码错误' }];
});

// 导出axios实例
export default instance; 