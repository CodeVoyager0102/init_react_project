import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../../utils/auth';
import './index.css';

const { Option } = Select;

const BillPayment = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    if (!checkPermission('BILL_PAYMENT')) {
      message.error('您没有生活缴费权限');
      return;
    }

    setLoading(true);
    try {
      // 模拟缴费成功
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const updatedUserInfo = {
        ...userInfo,
        balance: (parseFloat(userInfo.balance) - values.amount).toFixed(2)
      };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      message.success('缴费成功');
      navigate('/user');
    } catch (error) {
      message.error('缴费失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bill-payment-container">
      <Card title="生活缴费" className="bill-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="billType"
            label="缴费类型"
            rules={[{ required: true, message: '请选择缴费类型' }]}
          >
            <Select placeholder="请选择缴费类型">
              <Option value="water">水费</Option>
              <Option value="electricity">电费</Option>
              <Option value="gas">燃气费</Option>
              <Option value="phone">话费</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="缴费金额"
            rules={[{ required: true, message: '请输入缴费金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="请输入缴费金额"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              确认缴费
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BillPayment; 