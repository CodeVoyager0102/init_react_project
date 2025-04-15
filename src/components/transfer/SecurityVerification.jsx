import React, { useState, useEffect, useRef } from 'react';

function SecurityVerification({ onSubmit, onCancel, isLoading, message }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  // 组件加载时自动聚焦到输入框
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 简单校验验证码格式（例如，6位数字）
    if (!/^[0-9]{6}$/.test(verificationCode)) {
      setError('请输入6位数字验证码。');
      return;
    }
    onSubmit(verificationCode);
  };

  const formStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
  };

  const inputStyle = {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1.2rem', // 稍大字体
      textAlign: 'center',
      letterSpacing: '0.5em', // 字符间距
  };

  const buttonContainerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
  };

   const buttonStyle = {
       padding: '10px 15px',
       border: 'none',
       borderRadius: '4px',
       fontSize: '0.9rem',
       cursor: 'pointer',
   };

  const submitButtonStyle = {
      ...buttonStyle,
      backgroundColor: '#007bff',
      color: 'white',
      opacity: isLoading ? 0.7 : 1,
  };

   const cancelButtonStyle = {
       ...buttonStyle,
       backgroundColor: '#6c757d',
       color: 'white',
   };

   const errorStyle = {
       color: 'red',
       fontSize: '0.9rem',
       marginTop: '-5px',
   };

   const messageStyle = {
       color: 'green',
       fontSize: '0.9rem',
       marginBottom: '10px',
   };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h4>安全验证</h4>
      {/* 显示从父组件传来的消息，例如 "验证码已发送" */}
      {message && <div style={messageStyle}>{message}</div>}

      <input
        ref={inputRef}
        type="tel" // 使用 tel 类型方便移动端弹出数字键盘
        maxLength={6}
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="请输入6位验证码"
        style={inputStyle}
        disabled={isLoading}
        autoComplete="one-time-code" // 提示浏览器或设备自动填充验证码
      />
      {error && <div style={errorStyle}>{error}</div>}

       <div style={buttonContainerStyle}>
         <button type="button" onClick={onCancel} disabled={isLoading} style={cancelButtonStyle}>取消</button>
         <button type="submit" disabled={isLoading || verificationCode.length !== 6} style={submitButtonStyle}>
           {isLoading ? '验证中...' : '提交验证'}
         </button>
       </div>
    </form>
  );
}

export default SecurityVerification; 