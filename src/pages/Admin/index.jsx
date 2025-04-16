import React from 'react';
import { Card, Avatar, Button, Table, Tag } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { users as mockUsers } from '../../mock';
import './index.less';

// 可视化图表组件 (使用 ECharts)
const RoleDistributionChart = ({ data }) => {
  const roleCounts = data.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const totalUsers = data.length;
  const roles = Object.keys(roleCounts);

  const colors = {
    admin: '#ff4d4f', // 红色系
    user: '#1890ff',  // 蓝色系
  };

  // 构建 ECharts 配置项
  const option = {
    title: {
      text: '用户角色分布',
      left: 'center',
      textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)' // a: series name, b: data name, c: value, d: percentage
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      formatter: (name) => {
          const role = name === '管理员' ? 'admin' : 'user';
          return `${name} (${roleCounts[role] || 0})`;
      }
    },
    series: [
      {
        name: '角色',
        type: 'pie',
        radius: ['40%', '70%'], // 饼图半径，可以做成环形图
        center: ['65%', '55%'], // 饼图位置，留出空间给左侧图例
        avoidLabelOverlap: false,
        label: {
          show: false, // 不直接显示标签
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: Object.keys(roleCounts).map(role => ({
          value: roleCounts[role],
          name: role === 'admin' ? '管理员' : '普通用户',
          itemStyle: {
              // 可以根据角色设置不同颜色
              color: role === 'admin' ? '#ff7875' : '#69c0ff' 
          }
        })),
      }
    ]
  };

  return (
    <div className="role-chart">
      <h4>用户角色分布</h4>
      <ReactECharts 
        option={option} 
        style={{ height: '250px', width: '100%' }} // 设置图表容器的尺寸
        notMerge={true} // 每次都用新 option 覆盖
        lazyUpdate={true} // 懒更新
      />
      <p style={{ textAlign: 'right', fontSize: '12px', color: '#888', marginTop: '5px' }}>总用户数: {totalUsers}</p>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const displayUsers = mockUsers;

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '账户数量',
      dataIndex: 'accounts',
      key: 'accounts',
      render: (accounts) => accounts?.length || 0,
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => navigate(`/admin/user/${record.id}`)}>
         查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-container">
      <Card className="admin-card">
        <div className="admin-header">
          <div className="admin-info">
            <Avatar size={64} icon={<UserOutlined />} />
            <h2>{currentUser.username || '管理员'}</h2>
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
          <RoleDistributionChart data={displayUsers} />

          <h3 style={{ marginTop: '20px' }}>用户列表</h3>
          <Table 
            dataSource={displayUsers.map(u => ({ ...u, key: u.id }))}
            columns={columns} 
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Admin; 