import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// 创建mock实例
const mock = new MockAdapter(instance, { delayResponse: 1000 });

// 模拟数据
const users = [
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    name: '普通用户',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
    email: 'user@example.com',
    role: 'user'
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