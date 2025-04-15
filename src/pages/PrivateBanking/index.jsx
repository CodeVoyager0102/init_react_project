import React, { useState } from 'react';
import { Card, List, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../../utils/auth';
import './index.css';

const PrivateBanking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const services = [
    {
      title: '专属理财顾问',
      description: '为您配备专业的理财顾问，提供一对一的财富管理服务',
    },
    {
      title: '全球资产配置',
      description: '提供全球范围内的资产配置方案，实现资产多元化',
    },
    {
      title: '家族信托服务',
      description: '专业的家族信托规划，保障家族财富传承',
    },
    {
      title: '高端保险服务',
      description: '定制化的高端保险方案，全面保障您的资产安全',
    },
  ];

  const handleService = (service) => {
    if (!checkPermission('PRIVATE_BANKING')) {
      message.error('您没有私人银行服务权限');
      return;
    }

    setLoading(true);
    try {
      // 模拟服务预约成功
      message.success(`成功预约${service}服务`);
      navigate('/user');
    } catch (error) {
      message.error('预约失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="private-banking-container">
      <Card title="私人银行服务" className="private-card">
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => handleService(item.title)}
                  loading={loading}
                >
                  预约服务
                </Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default PrivateBanking; 