import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less';

const User = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="user-container">
      <Card className="user-card">
        <div className="user-info">
          <Avatar size={100} icon={<UserOutlined />} />
          <h2>{user.username || '用户'}</h2>
          <p>欢迎来到个人中心</p>
        </div>
        <Button 
          type="primary" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          className="logout-btn"
        >
          退出登录
        </Button>
      </Card>
    </div>
  );
};

export default User; 