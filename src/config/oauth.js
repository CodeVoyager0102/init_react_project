// 第三方登录配置
export const oauthConfig = {
  // 微信登录配置
  wechat: {
    appId: process.env.REACT_APP_WECHAT_APP_ID,
    appSecret: process.env.REACT_APP_WECHAT_APP_SECRET,
    redirectUri: `${window.location.origin}/oauth/wechat/callback`,
    scope: 'snsapi_userinfo',
    state: 'wechat_state',
  },
  
  // QQ登录配置
  qq: {
    appId: process.env.REACT_APP_QQ_APP_ID,
    appSecret: process.env.REACT_APP_QQ_APP_SECRET,
    redirectUri: `${window.location.origin}/oauth/qq/callback`,
    scope: 'get_user_info',
    state: 'qq_state',
  },
  
  // 微博登录配置
  weibo: {
    appId: process.env.REACT_APP_WEIBO_APP_ID,
    appSecret: process.env.REACT_APP_WEIBO_APP_SECRET,
    redirectUri: `${window.location.origin}/oauth/weibo/callback`,
    scope: 'all',
    state: 'weibo_state',
  },
};

// 第三方登录URL
export const oauthUrls = {
  wechat: 'https://open.weixin.qq.com/connect/qrconnect',
  qq: 'https://graph.qq.com/oauth2.0/authorize',
  weibo: 'https://api.weibo.com/oauth2/authorize',
}; 