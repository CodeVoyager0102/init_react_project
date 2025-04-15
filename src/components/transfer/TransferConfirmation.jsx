import React from 'react';

function TransferConfirmation({ transferData, riskInfo, onConfirm, onCancel, isLoading }) {

  const containerStyle = {
    border: '1px solid #eee',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  };

  const itemStyle = {
    marginBottom: '8px',
    fontSize: '1rem',
  };

  const labelStyle = {
      fontWeight: 'bold',
      marginRight: '8px',
      display: 'inline-block',
      minWidth: '80px',
  };

  const riskWarningStyle = {
      color: '#e67e22', // 橙色警告
      fontWeight: 'bold',
      border: '1px solid #e67e22',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '15px',
      backgroundColor: '#fdf3e6',
  };

   const buttonContainerStyle = {
       display: 'flex',
       justifyContent: 'space-between',
       marginTop: '20px',
   };

   const buttonStyle = {
       padding: '10px 15px',
       border: 'none',
       borderRadius: '4px',
       fontSize: '0.9rem',
       cursor: 'pointer',
   };

   const confirmButtonStyle = {
       ...buttonStyle,
       backgroundColor: '#28a745', // 绿色
       color: 'white',
       opacity: isLoading ? 0.7 : 1,
   };

   const cancelButtonStyle = {
       ...buttonStyle,
       backgroundColor: '#6c757d', // 灰色
       color: 'white',
   };

  // 格式化金额
  const formattedAmount = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(transferData.amount);

  return (
    <div>
      <h4>请确认转账信息：</h4>
      <div style={containerStyle}>
          <div style={itemStyle}>
              <span style={labelStyle}>收款账户:</span>
              <span>{transferData.recipientAccount}</span>
          </div>
          {transferData.recipientName && (
            <div style={itemStyle}>
                <span style={labelStyle}>收款人姓名:</span>
                <span>{transferData.recipientName} {/* 真实应用中后端应返回脱敏姓名 */}</span>
            </div>
          )}
          <div style={itemStyle}>
              <span style={labelStyle}>转账金额:</span>
              <span style={{fontWeight: 'bold', color: '#dc3545'}}>{formattedAmount}</span>
          </div>
          {transferData.remark && (
            <div style={itemStyle}>
                <span style={labelStyle}>备注:</span>
                <span>{transferData.remark}</span>
            </div>
          )}
      </div>

      {/* 反欺诈点：显示风险提示 */}
      {riskInfo?.riskWarning && (
        <div style={riskWarningStyle}>
          ⚠️ {riskInfo.riskWarning}
        </div>
      )}

      <div style={buttonContainerStyle}>
        <button onClick={onCancel} disabled={isLoading} style={cancelButtonStyle}>返回修改</button>
        <button onClick={onConfirm} disabled={isLoading} style={confirmButtonStyle}>
          {isLoading ? '处理中...' : '确认转账并验证'}
        </button>
      </div>
    </div>
  );
}

export default TransferConfirmation; 