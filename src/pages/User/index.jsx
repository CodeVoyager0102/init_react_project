import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Descriptions, Tag, Button, Modal, Form, Input, InputNumber, Select, message, Spin, Avatar, Space, Dropdown } from 'antd';
import { 
  UserOutlined, 
  AccountBookOutlined, 
  DollarCircleOutlined, 
  CrownOutlined, 
  ProfileOutlined, 
  CreditCardOutlined, 
  TransactionOutlined, 
  LineChartOutlined, 
  GoldOutlined, 
  BankOutlined, 
  LogoutOutlined,
  DashboardOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { LEVEL_MAP, FEATURE_MAP } from '../../utils/auth'; // Restored imports
import './index.css';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

// MENU_ITEMS_CONFIG remains the same
const MENU_ITEMS_CONFIG = {
  userInfo: { key: 'userInfo', label: '用户信息', icon: <DashboardOutlined />, componentKey: 'userInfo' },
  QUICK_TRANSFER: { key: 'quickTransfer', label: '快速转账', icon: <TransactionOutlined />, componentKey: 'quickTransfer' },
  BILL_PAYMENT: { key: 'billPayment', label: '生活缴费', icon: <CreditCardOutlined />, componentKey: 'billPayment' },
  INVESTMENT: { key: 'investment', label: '投资理财', icon: <LineChartOutlined />, componentKey: 'investment' },
  WEALTH_MANAGEMENT: { key: 'wealthManagement', label: '财富管理', icon: <GoldOutlined />, componentKey: 'wealthManagement' },
  PRIVATE_BANKING: { key: 'privateBanking', label: '私人银行', icon: <BankOutlined />, componentKey: 'privateBanking' },
};


const User = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedKey, setSelectedKey] = useState('userInfo'); 
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isBillModalVisible, setIsBillModalVisible] = useState(false);
  const [form] = Form.useForm(); // Restored form in state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      // Restored simpler parsing
      const parsedUserInfo = JSON.parse(storedUserInfo);
      console.log('读取到的用户信息:', parsedUserInfo);
      setUserInfo(parsedUserInfo);
    } else {
      navigate('/login');
    }
  }, [navigate]); // Restored dependency array

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  // Menu for the Header dropdown
  const userMenu = (
    <Menu
      items={[
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: '退出登录',
          onClick: handleLogout,
        },
      ]}
    />
  );

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const handleTransfer = async (values) => {
    // Restored original transfer logic
    try {
      // 模拟转账成功
      const updatedUserInfo = {
        ...userInfo,
        balance: (parseFloat(userInfo.balance) - values.amount).toFixed(2)
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      message.success('转账成功');
      setIsTransferModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('转账失败');
    }
  };

  const handleBillPayment = async (values) => {
    // Restored original bill payment logic
    try {
      // 模拟缴费成功
      const updatedUserInfo = {
        ...userInfo,
        balance: (parseFloat(userInfo.balance) - values.amount).toFixed(2)
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      message.success('缴费成功');
      setIsBillModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('缴费失败');
    }
  };


  const renderContent = () => {
    if (!userInfo) return <Spin tip="加载中..." />;

    switch (selectedKey) {
      case 'userInfo':
        return (
          <Card title="用户信息" className="content-card">
            <Descriptions bordered column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
              {/* Restored simpler display */}
              <Descriptions.Item label={<><UserOutlined /> 姓名</>}>{userInfo.name}</Descriptions.Item>
              <Descriptions.Item label={<><AccountBookOutlined /> 账号</>}>{userInfo.accountNumber}</Descriptions.Item>
              <Descriptions.Item label={<><DollarCircleOutlined /> 余额</>}>¥{userInfo.balance}</Descriptions.Item>
              <Descriptions.Item label={<><CrownOutlined /> 用户等级</>}>
                 <Tag color="blue">{LEVEL_MAP[userInfo.level]}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={<><ProfileOutlined /> 可用功能</>}>
                {userInfo.availableFeatures?.map(feature => (
                  <Tag icon={MENU_ITEMS_CONFIG[feature]?.icon} key={feature} color="green" style={{ marginRight: '8px', marginBottom: '4px' }}>
                    {FEATURE_MAP[feature] || feature}
                  </Tag>
                )) || '无'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        );
      case 'quickTransfer':
        return (
          <Card title="快速转账" className="content-card">
            <p>当前余额：¥{userInfo.balance}</p>
            <Button type="primary" onClick={() => setIsTransferModalVisible(true)}>发起转账</Button>
          </Card>
        );
      case 'billPayment':
        return (
          <Card title="生活缴费" className="content-card">
            <p>使用此功能进行水电煤缴费。</p>
            <Button type="primary" onClick={() => setIsBillModalVisible(true)}>去缴费</Button>
          </Card>
        );
      case 'investment':
         return (
           <Card title="投资理财" className="content-card">
             <p>这里将展示投资理财相关产品和操作。</p>
             <Button onClick={() => navigate('/investment')}>查看详情 (跳转)</Button> 
           </Card>
         );
       case 'wealthManagement':
         return (
           <Card title="财富管理" className="content-card">
             <p>专属财富管理服务。</p>
             <Button onClick={() => navigate('/wealth')}>了解更多 (跳转)</Button>
           </Card>
         );
       case 'privateBanking':
         return (
           <Card title="私人银行" className="content-card">
             <p>高端私人银行服务。</p>
             <Button onClick={() => navigate('/private')}>进入专区 (跳转)</Button>
           </Card>
         ); 
      default:
        return <Card title="欢迎" className="content-card">欢迎使用网上银行系统。</Card>;
    }
  };

  // Generate menu items based on available features - restored original logic slightly
  const menuItems = [
    MENU_ITEMS_CONFIG.userInfo, 
    ...(userInfo?.availableFeatures
      ?.map(feature => MENU_ITEMS_CONFIG[feature])
      .filter(item => item) || [])
  ];

  if (!userInfo) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" /> 
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }} className="user-layout">
      <Sider collapsible className="user-sider">
        <div className="logo">
          <h1 style={{ color: 'white', textAlign: 'center', margin: '16px 0' }}>银行系统</h1>
        </div>
        <Menu 
          theme="dark" 
          selectedKeys={[selectedKey]} 
          mode="inline" 
          onClick={handleMenuClick} 
          items={menuItems.map(item => ({ // Ensure structure is correct
            key: item.key,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-header">
          <div style={{ float: 'right' }}>
            <Dropdown overlay={userMenu} trigger={['click']}>
              {/* Restored original link style */}
              <a onClick={e => e.preventDefault()} style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {userInfo.name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>
        <Content className="site-layout-content">
          {renderContent()}
        </Content>
      </Layout>

      {/* Modals */}
       <Modal
        title="快速转账"
        open={isTransferModalVisible}
        onCancel={() => setIsTransferModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleTransfer}>
           {/* Restored original form items */}
           <Form.Item
            name="account"
            label="对方账号"
            rules={[{ required: true, message: '请输入对方账号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="amount"
            label="转账金额"
            rules={[{ required: true, message: '请输入转账金额' }, { type: 'number', min: 0.01, message: '金额必须大于0'}] }
          >
            <InputNumber min={0.01} max={parseFloat(userInfo?.balance || 0)} style={{ width: '100%' }} precision={2} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认转账
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="生活缴费"
        open={isBillModalVisible}
        onCancel={() => setIsBillModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleBillPayment}>
          {/* Restored original form items */}
          <Form.Item
            name="billType"
            label="缴费类型"
            rules={[{ required: true, message: '请选择缴费类型' }]}
          >
            <Select placeholder="请选择">
              <Option value="water">水费</Option>
              <Option value="electricity">电费</Option>
              <Option value="gas">燃气费</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="缴费金额"
            rules={[{ required: true, message: '请输入缴费金额' }, { type: 'number', min: 0.01, message: '金额必须大于0'}] }
          >
            <InputNumber min={0.01} max={parseFloat(userInfo?.balance || 0)} style={{ width: '100%' }} precision={2} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              确认缴费
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default User; 