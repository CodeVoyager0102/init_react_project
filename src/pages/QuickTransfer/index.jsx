import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../../utils/auth';
import './index.css';

const QuickTransfer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (!checkPermission('QUICK_TRANSFER')) {
      message.error('您没有快速转账权限');
      return;
    }

    setLoading(true);
    try {
      // 模拟转账成功
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUserInfo = {
        ...userInfo,
        balance: (parseFloat(userInfo.balance) - values.amount).toFixed(2)
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      message.success('转账成功');
      navigate('/user');
    } catch (error) {
      message.error('转账失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-transfer-container">
      <Card title="快速转账" className="transfer-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="account"
            label="对方账号"
            rules={[{ required: true, message: '请输入对方账号' }]}
          >
            <Input placeholder="请输入对方账号" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="转账金额"
            rules={[{ required: true, message: '请输入转账金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入转账金额"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              确认转账
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuickTransfer; 