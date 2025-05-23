import React, { useState, useEffect } from 'react';

function TransferResult({ resultData, onFinish }) {
  const [isAuditing, setIsAuditing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuditing(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const successStyle = {
      color: '#28a745', // 绿色
      border: '1px solid #28a745',
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
      backgroundColor: '#eaf7ec',
  };

  const failureStyle = {
      color: '#dc3545', // 红色
      border: '1px solid #dc3545',
      padding: '20px',
      borderRadius: '4px',
      textAlign: 'center',
      backgroundColor: '#fdeded',
  };

  const warningStyle = {
        color: '#e67e22', // 橙色
        border: '1px solid #e67e22',
        padding: '10px',
        borderRadius: '4px',
        marginTop: '15px',
        backgroundColor: '#fdf3e6',
        fontSize: '0.9rem',
    };

  const buttonStyle = {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '20px',
  };

  const auditingStyle = {
      padding: '20px',
      textAlign: 'center',
      color: '#555',
      fontSize: '1.1rem',
  };

  return (
    <div>
      <h4>转账结果</h4>

      {isAuditing ? (
        <div style={auditingStyle}>
            <p>⏳ 订单状态：审核中...</p>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>请稍候，正在处理您的转账请求。</p>
        </div>
      ) : (
        <>
          {resultData.success ? (
            <div style={successStyle}>
              <p>✅ {resultData.message}</p>
              {resultData.transactionId && (
                <p style={{ fontSize: '0.9rem', color: '#555' }}>
                  交易流水号: {resultData.transactionId}
                </p>
              )}
              {/* 反欺诈点：即使成功也可能带有风险提示 */} 
              {resultData.riskLevel === 'medium' && resultData.message.includes('风险') && (
                   <div style={warningStyle}>
                     ⚠️ 请关注相关的账户风险提示。
                   </div>
               )}
            </div>
          ) : (
            <div style={failureStyle}>
              <p>❌ {resultData.message}</p>
               {/* 反欺诈点：明确展示风险控制导致的失败 */} 
               {resultData.riskLevel === 'high' && (
                   <p style={{ fontSize: '0.9rem', marginTop:'10px' }}>
                       (失败原因：系统检测到高风险交易)
                   </p>
               )}
            </div>
          )}

          <button onClick={onFinish} style={buttonStyle} disabled={isAuditing}>
             {isAuditing ? '请稍候...' : (resultData.success ? '完成' : '再试一次')}
          </button>
        </>
      )}
    </div>
  );
}

export default TransferResult; 