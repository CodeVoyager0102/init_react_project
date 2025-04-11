import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Button, message, Tabs, Modal, Divider } from 'antd';
import { UserOutlined, LockOutlined, WechatOutlined, QqOutlined, WeiboOutlined } from '@ant-design/icons';
import ImageVerify from '../../components/ImageVerify';
import { handleThirdPartyLogin } from '../../utils/oauth';
import './index.less';

const { TabPane } = Tabs;

const Login = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [imageVerified, setImageVerified] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFaceApiLoaded, setIsFaceApiLoaded] = useState(false);
  
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef();
  
  // 动态加载face-api.js
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        // 动态导入face-api.js
        const faceapi = await import('face-api.js');
        
        // 加载模型
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        
        console.log('人脸识别模型加载成功');
        setIsFaceApiLoaded(true);
      } catch (error) {
        console.error('加载人脸识别模型失败:', error);
        message.error('加载人脸识别模型失败，请刷新页面重试');
      }
    };
    
    loadFaceApi();
    
    return () => {
      // 清理资源
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // 处理验证码验证成功
  const handleImageSuccess = () => {
    setImageVerified(true);
    message.success('验证码正确');
  };
  
  // 处理验证码验证失败
  const handleImageFail = () => {
    setImageVerified(false);
    message.error('验证码错误，请重试');
  };
  
  // 开始人脸识别
  const startFaceRecognition = async () => {
    if (!isFaceApiLoaded) {
      message.warning('人脸识别模型正在加载中，请稍后再试');
      return;
    }
    
    try {
      setIsModalVisible(true);
      setIsLoading(true);
      
      // 获取摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      // 等待视频加载
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          resolve();
        };
      });
      
      // 开始播放视频
      videoRef.current.play();
      
      // 动态导入face-api.js
      const faceapi = await import('face-api.js');
      
      // 开始人脸检测
      const interval = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );
          
          // 绘制检测结果
          const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          
          // 如果检测到人脸，则验证成功
          if (detections.length > 0) {
            clearInterval(interval);
            setFaceVerified(true);
            message.success('人脸识别成功');
            stopFaceRecognition();
          }
        }
      }, 100);
      
      // 保存interval ID以便清理
      streamRef.current.intervalId = interval;
      
    } catch (error) {
      console.error('启动摄像头失败:', error);
      message.error('启动摄像头失败，请检查权限设置');
      setIsLoading(false);
    }
  };
  
  // 停止人脸识别
  const stopFaceRecognition = () => {
    if (streamRef.current) {
      // 清除interval
      if (streamRef.current.intervalId) {
        clearInterval(streamRef.current.intervalId);
      }
      
      // 停止所有视频轨道
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsModalVisible(false);
    setIsLoading(false);
  };
  
  // 处理表单提交
  const handleSubmit = async (values) => {
    // 检查验证状态
    if (activeTab === '1' && !imageVerified) {
      message.error('请输入正确的验证码');
      return;
    }
    
    if (activeTab === '2' && !faceVerified) {
      message.error('请完成人脸识别');
      return;
    }
    
    try {
      // 这里应该调用实际的登录API
      console.log('登录信息:', values);
      message.success('登录成功');
      
      // 登录成功后的处理，例如跳转到首页
      // history.push('/dashboard');
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请重试');
    }
  };
  
  // 处理第三方登录
  const handleThirdPartyLogin = (platform) => {
    // 这里应该调用实际的第三方登录API
    console.log(`使用${platform}登录`);
    message.info(`正在跳转到${platform}登录页面...`);
    
    // 根据不同平台调用不同的登录方法
    switch (platform) {
      case 'wechat':
        // 调用微信登录
        break;
      case 'qq':
        // 调用QQ登录
        break;
      case 'weibo':
        // 调用微博登录
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">用户登录</h2>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="账号密码登录" key="1">
            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              
              <Form.Item>
                <ImageVerify
                  onSuccess={handleImageSuccess}
                  onFail={handleImageFail}
                />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  登录
                </Button>
              </Form.Item>
            </Form>
            
            <Divider>其他登录方式</Divider>
            <div className="third-party-login">
              <Button 
                icon={<WechatOutlined />} 
                onClick={() => handleThirdPartyLogin('wechat')}
                className="third-party-btn wechat"
              >
                微信登录
              </Button>
              <Button 
                icon={<QqOutlined />} 
                onClick={() => handleThirdPartyLogin('qq')}
                className="third-party-btn qq"
              >
                QQ登录
              </Button>
              <Button 
                icon={<WeiboOutlined />} 
                onClick={() => handleThirdPartyLogin('weibo')}
                className="third-party-btn weibo"
              >
                微博登录
              </Button>
            </div>
          </TabPane>
          
          <TabPane tab="人脸识别登录" key="2">
            <Form
              form={form}
              name="faceLogin"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item>
                <div className="face-recognition-container">
                  <div className="face-recognition-title">人脸识别</div>
                  <div className="face-recognition-wrapper">
                    <Button 
                      type="primary" 
                      onClick={startFaceRecognition}
                      loading={isLoading}
                      disabled={!isFaceApiLoaded}
                      block
                    >
                      {isFaceApiLoaded ? '开始人脸识别' : '模型加载中...'}
                    </Button>
                  </div>
                </div>
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
      
      {/* 人脸识别模态框 */}
      <Modal
        title="人脸识别"
        open={isModalVisible}
        onCancel={stopFaceRecognition}
        footer={null}
        width={500}
      >
        <div className="face-recognition-modal">
          <div className="video-container">
            <video
              ref={videoRef}
              width="400"
              height="300"
              autoPlay
              muted
            />
            <canvas ref={canvasRef} className="face-canvas" />
          </div>
          <div className="face-recognition-tips">
            <p>请将脸部对准摄像头，保持光线充足</p>
            <p>系统将自动识别您的面部特征</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login; 