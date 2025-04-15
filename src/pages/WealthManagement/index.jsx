import React, { useState } from 'react';
import { Card, Tabs, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { checkPermission } from '../../utils/auth';
import './index.css';

const { TabPane } = Tabs;

const WealthManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleService = (service) => {
    if (!checkPermission('WEALTH_MANAGEMENT')) {
      message.error('您没有财富管理权限');
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
    <div className="wealth-management-container">
      <Card title="财富管理" className="wealth-card">
        <Tabs defaultActiveKey="1">
          <TabPane tab="资产配置" key="1">
            <div className="service-content">
              <h3>专业资产配置服务</h3>
              <p>根据您的风险偏好和投资目标，提供个性化的资产配置方案</p>
              <Button 
                type="primary" 
                onClick={() => handleService('资产配置')}
                loading={loading}
              >
                预约服务
              </Button>
            </div>
          </TabPane>
          <TabPane tab="税务规划" key="2">
            <div className="service-content">
              <h3>专业税务规划服务</h3>
              <p>提供全面的税务规划方案，帮助您合理避税</p>
              <Button 
                type="primary" 
                onClick={() => handleService('税务规划')}
                loading={loading}
              >
                预约服务
              </Button>
            </div>
          </TabPane>
          <TabPane tab="退休规划" key="3">
            <div className="service-content">
              <h3>专业退休规划服务</h3>
              <p>为您制定科学的退休规划，确保退休生活质量</p>
              <Button 
                type="primary" 
                onClick={() => handleService('退休规划')}
                loading={loading}
              >
                预约服务
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default WealthManagement; 