import { oauthConfig, oauthUrls } from '../config/oauth';

// 生成随机state
const generateState = () => {
  return Math.random().toString(36).substring(2, 15);
};

// 保存state到localStorage
const saveState = (platform, state) => {
  localStorage.setItem(`${platform}_oauth_state`, state);
};

// 验证state
const verifyState = (platform, state) => {
  const savedState = localStorage.getItem(`${platform}_oauth_state`);
  return savedState === state;
};

// 构建OAuth URL
const buildOAuthUrl = (platform) => {
  const config = oauthConfig[platform];
  const state = generateState();
  saveState(platform, state);
  
  const params = new URLSearchParams({
    client_id: config.appId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: state,
  });
  
  return `${oauthUrls[platform]}?${params.toString()}`;
};

// 处理第三方登录
export const handleThirdPartyLogin = (platform) => {
  try {
    const url = buildOAuthUrl(platform);
    console.log(`生成的${platform} OAuth URL:`, url);
    window.location.href = url;
  } catch (error) {
    console.error(`${platform}登录失败:`, error);
    throw error;
  }
};

// 处理OAuth回调
export const handleOAuthCallback = async (platform, code, state) => {
  // 验证state
  if (!verifyState(platform, state)) {
    throw new Error('Invalid state');
  }
  
  try {
    // 这里应该调用后端API，用code换取access_token和用户信息
    const response = await fetch('/api/oauth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform,
        code,
        state,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw error;
  }
}; 