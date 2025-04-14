import React, { useRef, useState } from 'react';
import { Form, Input, Button, message, Tabs, Modal, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ImageVerify from '../../components/ImageVerify';
import './index.less';

const { TabPane } = Tabs;

const CameraComponent = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // 初始化摄像头
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480
        } 
      });
      videoRef.current.srcObject = stream;
      setIsCameraReady(true);
      message.success('摄像头已启动');
    } catch (err) {
      console.error('摄像头访问失败:', err);
      message.error('摄像头访问失败');
      setIsCameraReady(false);
    }
  };

  // 拍照
  const capturePhoto = () => {
    console.log('开始拍照...');
    if (!videoRef.current || !canvasRef.current) {
      console.error('视频或画布未就绪');
      message.error('视频未就绪');
      return;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // 设置画布尺寸与视频一致
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImageSrc(dataUrl);
      message.success('照片已捕获');
    } catch (error) {
      console.error('拍照失败:', error);
      message.error('拍照失败');
    }
  };

  // 上传图片并获取URL
  const uploadPhoto = async () => {
    if (!imageSrc) {
      message.error('请先拍照');
      return;
    }

    setLoading(true);
    try {
      // 将Base64转为Blob
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', blob, 'face.jpg');

      // 上传到图片存储接口
      const uploadRes = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || '上传失败');
      }
      
      // 将返回的URL提交到后端
      const faceUrl = uploadRes.data.url;
      const faceRes = await axios.post('/api/user/face', { faceUrl });
      
      if (!faceRes.data.success) {
        throw new Error(faceRes.data.message || '人脸识别失败');
      }
      
      message.success('人脸识别成功！');
      console.log('用户信息:', faceRes.data.user);
      onClose(); // 关闭模态框
    } catch (err) {
      console.error('上传失败:', err);
      message.error(err.message || '上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件卸载时停止摄像头
  React.useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="video-container" style={{ marginBottom: '20px' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ 
            width: '100%',
            borderRadius: '8px'
          }} 
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
          width="640"
          height="480"
        />
      </div>

      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <Button type="primary" onClick={startCamera}>
          启动摄像头
        </Button>
        <Button 
          type="primary" 
          onClick={capturePhoto} 
          disabled={!isCameraReady}
        >
          拍照
        </Button>
      </div>
      
      {imageSrc && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            <img 
              src={imageSrc} 
              alt="预览" 
              style={{ 
                width: '200px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }} 
            />
          </div>
          <Button 
            type="primary" 
            onClick={uploadPhoto} 
            loading={loading}
          >
            {loading ? '上传中...' : '提交照片'}
          </Button>
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');
  const [imageVerified, setImageVerified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userType, setUserType] = useState('user');
  const navigate = useNavigate();
  
  const handleImageSuccess = () => {
    setImageVerified(true);
    message.success('验证码正确');
  };
  
  const handleImageFail = () => {
    setImageVerified(false);
    message.error('验证码错误，请重试');
  };
  
  const handleSubmit = async (values) => {
    if (activeTab === '1' && !imageVerified) {
      message.error('请输入正确的验证码');
      return;
    }
    try {
      console.log('登录信息:', values);
      
      // 模拟登录成功
      const mockUser = {
        username: values.username || '用户',
        id: 1,
        role: userType
      };
      
      // 检查管理员登录
      if (userType === 'admin' && values.username !== 'admin') {
        message.error('管理员账号错误');
        return;
      }
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');
      message.success('登录成功');
      
      // 根据用户类型跳转到不同页面
      navigate(userType === 'admin' ? '/admin' : '/user');
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请重试');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">用户登录</h2>
        
        <Form.Item>
          <Radio.Group 
            value={userType} 
            onChange={e => setUserType(e.target.value)}
            style={{ marginBottom: 16 }}
          >
            <Radio.Button value="user">普通用户</Radio.Button>
            <Radio.Button value="admin">管理员</Radio.Button>
          </Radio.Group>
        </Form.Item>
        
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
          </TabPane>
          
          <TabPane tab="人脸识别登录" key="2">
            <Form
              form={form}
              name="faceLogin"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item>
                <div className="face-login-container">
                  <Button 
                    type="primary" 
                    onClick={() => setIsModalVisible(true)}
                    block
                  >
                    开始人脸识别
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
      
      <Modal
        title="人脸识别"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <CameraComponent onClose={() => setIsModalVisible(false)} />
      </Modal>
    </div>
  );
};

export default Login; 