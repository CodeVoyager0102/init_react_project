import React, { useState } from 'react';
import { Card, Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../../utils/auth';
import './index.css';

const Investment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const products = [
    {
      key: '1',
      name: '稳健理财',
      type: '固定收益',
      rate: '3.5%',
      term: '90天',
      minAmount: 1000,
    },
    {
      key: '2',
      name: '进取理财',
      type: '混合型',
      rate: '4.2%',
      term: '180天',
      minAmount: 5000,
    },
    {
      key: '3',
      name: '尊享理财',
      type: '权益类',
      rate: '5.0%',
      term: '360天',
      minAmount: 10000,
    },
  ];

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '预期年化',
      dataIndex: 'rate',
      key: 'rate',
    },
    {
      title: '投资期限',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: '起投金额',
      dataIndex: 'minAmount',
      key: 'minAmount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleInvest(record)}>
          立即投资
        </Button>
      ),
    },
  ];

  const handleInvest = (product) => {
    if (!checkPermission('INVESTMENT')) {
      message.error('您没有投资理财权限');
      return;
    }

    setLoading(true);
    try {
      // 模拟投资成功
      message.success(`成功投资${product.name}`);
      navigate('/user');
    } catch (error) {
      message.error('投资失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="investment-container">
      <Card title="投资理财" className="investment-card">
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Investment; 