import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Typography,
  Select,
  Badge,
  List,
  Modal,
  Tabs,
  Tag,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  BellOutlined,
  SwapOutlined,
  LaptopOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserInfo, transfer, getTransferRecords, getNotifications, verifyAccountPermission } from "../mock";
import "./User.css";
import TransferSection from "../components/user/TransferSection";
import OnlineBankingFeatures from "../components/user/OnlineBankingFeatures";
import BankCardManagement from "../components/user/BankCardManagement";
import CreditServices from "../components/user/CreditServices";
import RiskManagementInfo from "../components/user/RiskManagementInfo";
import OtherServices from "../components/user/OtherServices";

const { Title } = Typography;
const { TabPane } = Tabs;

const User = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [transferRecords, setTransferRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [activeTabKey, setActiveTabKey] = useState('transfer');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("请先登录");
      navigate("/login");
      return;
    }
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo(token);
        if (response.success) {
          setUserInfo(response.data);
          if (response.data.accounts && response.data.accounts.length > 0) {
            const initialAccount = response.data.accounts[0].accountNumber;
            setActiveAccount(initialAccount); 
            fetchTransferRecords(initialAccount);
          }
          const notificationsResponse = await getNotifications(response.data.id);
          if (notificationsResponse.success) {
            setNotifications(notificationsResponse.data);
          }
        } else {
          message.error(response.message);
          navigate("/login");
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        message.error("获取用户信息失败");
        navigate("/login");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const fetchTransferRecords = async (accountNumber) => {
     if (!accountNumber) return;
     try {
        const recordsResponse = await getTransferRecords(accountNumber);
        if (recordsResponse.success) {
          setTransferRecords(recordsResponse.data.records);
        } else {
            setTransferRecords([]);
            console.error("获取转账记录失败:", recordsResponse.message);
        }
     } catch (error) {
        setTransferRecords([]);
        console.error("获取转账记录异常:", error);
     }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const onFinish = async (values) => {
    if (!activeAccount) {
      message.error("请选择转出账户");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await transfer(
        token,
        activeAccount,
        values.targetAccount,
        values.targetName,
        values.amount,
        values.remark
      );
      
      if (response.success) {
        message.success("转账成功！");
        const userResponse = await getUserInfo(token);
        if (userResponse.success) {
          setUserInfo(userResponse.data);
        }
        fetchTransferRecords(activeAccount);
        form.resetFields();
      } else {
        message.error(response.message || '转账失败，请稍后再试');
      }
    } catch (error) {
      message.error("转账失败：" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountChange = (accountNumber) => {
    setActiveAccount(accountNumber);
    fetchTransferRecords(accountNumber);
    form.setFieldsValue({ fromAccount: accountNumber });
  };

  return (
    <div className="user-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>用户信息</span>
                <Badge count={notifications.filter(n => !n.isRead).length}>
                  <Button 
                    type="text" 
                    icon={<BellOutlined />} 
                    onClick={() => setIsNotificationVisible(true)}
                  />
                </Badge>
              </div>
            } 
            className="user-info-card"
          >
            <div className="user-info">
              <p>
                <UserOutlined /> 用户名：{userInfo.name || "-"}
              </p>
              <p>
                <Tag color="blue">账户等级：{userInfo.highestLevel?.replace('LEVEL_', '') || '-'}</Tag>
              </p>
              <Tabs defaultActiveKey="0" onChange={(key) => handleAccountChange(userInfo.accounts?.[key]?.accountNumber)}>
                {userInfo.accounts?.map((account, index) => (
                  <TabPane 
                    tab={
                      <span>
                        <CreditCardOutlined /> {account.type}
                      </span>
                    } 
                    key={index}
                  >
                    <p>
                      <BankOutlined /> 账户：{account.accountNumber}
                    </p>
                    <p>
                      <MoneyCollectOutlined /> 余额：¥{
                        (typeof account.balance === 'number' || !isNaN(Number(account.balance))) 
                          ? Number(account.balance).toFixed(2) 
                          : '-'
                      }
                    </p>
                    <p>
                      <Tag color="green">等级：{account.level?.replace('LEVEL_', '') ?? '-'}</Tag>
                      <Tag color={account.status === 'ACTIVE' ? 'success' : 'default'}>状态：{account.status ?? '-'}</Tag>
                    </p>
                  </TabPane>
                ))}
                {(!userInfo.accounts || userInfo.accounts.length === 0) && (
                    <TabPane tab="暂无账户" key="no-account" disabled />
                )}
              </Tabs>
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              style={{ marginTop: 16 }}
            >
              退出登录
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} type="card">
            <TabPane 
              tab={<span><SwapOutlined /> 转账汇款</span>} 
              key="transfer"
            >
              <TransferSection 
                form={form} 
                loading={loading} 
                userInfo={userInfo}
                activeAccount={activeAccount}
                transferRecords={transferRecords}
                onFinish={onFinish}
                handleAccountChange={handleAccountChange}
              />
            </TabPane>
            <TabPane 
              tab={<span><LaptopOutlined /> 网银功能</span>} 
              key="online-banking"
            >
              <OnlineBankingFeatures />
            </TabPane>
            <TabPane 
              tab={<span><CreditCardOutlined /> 银行卡管理</span>} 
              key="card-management"
            >
              <BankCardManagement />
            </TabPane>
             <TabPane 
              tab={<span><DollarCircleOutlined /> 信贷服务</span>} 
              key="credit-service"
            >
              <CreditServices />
            </TabPane>
            <TabPane 
              tab={<span><SafetyCertificateOutlined /> 风险管理</span>} 
              key="risk-management"
            >
              <RiskManagementInfo />
            </TabPane>
            <TabPane 
              tab={<span><AppstoreOutlined /> 其他服务</span>} 
              key="other-services"
            >
              <OtherServices />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
      
      <Modal
        title="通知中心"
        open={isNotificationVisible}
        onCancel={() => setIsNotificationVisible(false)}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.content}
              />
              <Tag color={item.isRead ? 'default' : 'blue'}>{item.isRead ? '已读' : '未读'}</Tag>
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </List.Item>
          )}
          locale={{ emptyText: '暂无通知' }}
        />
      </Modal>
    </div>
  );
};

export default User;
