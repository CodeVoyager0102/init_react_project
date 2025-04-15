import React, { useState, useCallback } from 'react';
import TransferForm from './TransferForm';
import TransferConfirmation from './TransferConfirmation';
import SecurityVerification from './SecurityVerification';
import TransferResult from './TransferResult';
import { usePermissions } from '../../hooks/usePermissions'; // 假设 hook 在这个路径

// 模拟 API 调用
const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Simulating API call with:', data);
      // 在这里模拟不同的后端响应
      if (data?.verificationCode === 'error') {
          reject({ message: '短信验证码错误或失效。' });
      } else if (data?.amount > 10000) {
           // 模拟后端风险控制拒绝大额交易
           resolve({ success: false, message: '交易金额过大，触发风险控制，转账失败。', riskLevel: 'high' });
      } else if (data?.recipientAccount?.startsWith('danger')) {
           // 模拟收款账户风险
           resolve({ success: true, message: '转账成功，但请注意收款账户风险。', riskLevel: 'medium' });
      } else {
        resolve({ success: true, message: '转账已成功提交！', transactionId: `T${Date.now()}` });
      }
    }, delay);
  });
};

// 模拟检查收款人风险的 API
const checkRecipientRisk = (account) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (account?.length % 2 !== 0) { // 将 else if 改为 if
                 resolve({ isNew: true, riskWarning: '您正在向首次交易的账户转账，请仔细核对信息。' });
            } else {
                resolve({ isNew: false, riskWarning: null });
            }
        }, 500);
    });
};

// 模拟发送短信验证码 API
const sendOtpApi = (phone) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Simulating sending OTP to ${phone}`);
            resolve({ success: true, message: `验证码已发送至尾号 ${phone.slice(-4)} 的手机。` });
        }, 800);
    });
};


function TransferPage() {
  const { hasPermission } = usePermissions();
  const [step, setStep] = useState('form'); // 'form', 'confirm', 'verify', 'result'
  const [transferData, setTransferData] = useState(null);
  const [riskInfo, setRiskInfo] = useState({ isNew: false, riskWarning: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultData, setResultData] = useState(null);
  const [otpMessage, setOtpMessage] = useState('');

  // 处理表单提交
  const handleFormSubmit = useCallback(async (data) => {
    setIsLoading(true);
    setError('');
    try {
        // 模拟调用后端API检查收款人风险
        const riskResult = await checkRecipientRisk(data.recipientAccount);
        setRiskInfo(riskResult);
        setTransferData(data);
        setStep('confirm');
    } catch (err) {
        setError('检查收款人信息时出错，请稍后重试。');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // 处理确认转账
  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setOtpMessage('');
    try {
        // 模拟调用API发送短信验证码 (假设手机号来自用户信息)
        // 在真实应用中，这里应获取当前登录用户的手机号
        const phone = '138****1234'; // 示例手机号
        await sendOtpApi(phone);
        setOtpMessage(`验证码已发送至尾号 ${phone.slice(-4)} 的手机。`);
        setStep('verify');
    } catch (err) {
        setError('发送验证码失败，请稍后重试。');
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);

  // 处理安全验证提交
  const handleVerificationSubmit = useCallback(async (verificationCode) => {
    setIsLoading(true);
    setError('');
    try {
      // 模拟调用后端API进行最终转账操作，并带上验证码
      const finalData = { ...transferData, verificationCode };
      const result = await simulateApiCall(finalData);
      setResultData(result);
      setStep('result');
    } catch (err) {
      setError(err.message || '转账处理失败，请检查您的输入或稍后重试。');
      // 验证失败，停留在验证步骤，让用户重试
      setStep('verify');
    } finally {
      setIsLoading(false);
    }
  }, [transferData]);

  // 返回表单步骤
  const handleBackToForm = useCallback(() => {
    setStep('form');
    setError(''); // 清除可能存在的错误信息
    setOtpMessage('');
  }, []);

    // 处理完成或新的转账
   const handleFinish = useCallback(() => {
       setStep('form');
       setTransferData(null);
       setRiskInfo({ isNew: false, riskWarning: null });
       setError('');
       setResultData(null);
       setIsLoading(false);
       setOtpMessage('');
   }, []);


  // 权限检查
  if (!hasPermission('transfer')) {
    return <div>您没有转账权限。</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>安全转账</h2>
      {isLoading && <div style={{ color: 'blue' }}>处理中...</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>错误：{error}</div>}

      {step === 'form' && (
        <TransferForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}

      {step === 'confirm' && transferData && (
        <TransferConfirmation
          transferData={transferData}
          riskInfo={riskInfo}
          onConfirm={handleConfirm}
          onCancel={handleBackToForm}
          isLoading={isLoading}
        />
      )}

      {step === 'verify' && (
        <SecurityVerification
          onSubmit={handleVerificationSubmit}
          onCancel={handleBackToForm} // 允许取消返回上一步
          isLoading={isLoading}
          message={otpMessage} // 显示 "验证码已发送" 的提示
        />
      )}

      {step === 'result' && resultData && (
        <TransferResult resultData={resultData} onFinish={handleFinish} />
      )}
    </div>
  );
}

export default TransferPage; 