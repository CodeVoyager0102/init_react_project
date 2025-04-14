import React from 'react';
import { Card, Avatar, Button, Table } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less';

const Admin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 模拟用户数据
  const userData = [
    {
      key: '1',
      username: 'user1',
      email: 'user1@example.com',
      role: '普通用户',
      status: '正常'
    },
    {
      key: '2',
      username: 'user2',
      email: 'user2@example.com',
      role: '普通用户',
      status: '正常'
    }
  ];

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div className="admin-container">
      <Card className="admin-card">
        <div className="admin-header">
          <div className="admin-info">
            <Avatar size={64} icon={<UserOutlined />} />
            <h2>{user.username || '管理员'}</h2>
            <p>管理员控制台</p>
          </div>
          <Button 
            type="primary" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="logout-btn"
          >
            退出登录
          </Button>
        </div>
        
        <div className="admin-content">
          <h3>用户管理</h3>
          <Table 
            dataSource={userData} 
            columns={columns} 
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default Admin; 