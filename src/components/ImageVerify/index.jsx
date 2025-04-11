import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import './index.less';

const ImageVerify = ({ onSuccess, onFail }) => {
  const [code, setCode] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  // 生成随机验证码
  const generateCode = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newCode = '';
    for (let i = 0; i < 4; i++) {
      newCode += chars[Math.floor(Math.random() * chars.length)];
    }
    setCode(newCode);
    setInputValue('');
    setIsVerified(false);
  };

  useEffect(() => {
    generateCode();
  }, []);

  // 处理输入变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length === 4) {
      if (value.toLowerCase() === code.toLowerCase()) {
        setIsVerified(true);
        onSuccess && onSuccess();
      } else {
        onFail && onFail();
        generateCode();
      }
    }
  };

  return (
    <div className="image-verify">
      <div className="image-verify-code" onClick={generateCode}>
        {code.split('').map((char, index) => (
          <span
            key={index}
            style={{
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              display: 'inline-block',
              margin: '0 2px',
              color: `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`,
              fontWeight: 'bold',
              fontSize: '20px',
              userSelect: 'none'
            }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="image-verify-input">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          maxLength={4}
          placeholder="请输入验证码"
          disabled={isVerified}
        />
        <Button type="link" onClick={generateCode}>
          看不清？换一张
        </Button>
      </div>
    </div>
  );
};

export default ImageVerify; 