import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { handleOAuthCallback } from '../../utils/oauth';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        // 从URL路径中获取平台名称
        const platform = location.pathname.split('/')[2]; // /oauth/wechat/callback -> wechat
        
        if (!code || !state) {
          throw new Error('Missing code or state');
        }
        
        // 处理OAuth回调
        const data = await handleOAuthCallback(platform, code, state);
        
        // 登录成功，保存用户信息
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        // 跳转到首页
        navigate('/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    processCallback();
  }, [location, navigate]);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="正在处理登录..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <Result
        status="error"
        title="登录失败"
        subTitle={error}
        extra={[
          <Button type="primary" key="retry" onClick={() => window.location.reload()}>
            重试
          </Button>,
          <Button key="back" onClick={() => navigate('/login')}>
            返回登录页
          </Button>
        ]}
      />
    );
  }
  
  return null;
};

export default OAuthCallback; 