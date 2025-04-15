import React, { useState } from 'react';

function TransferForm({ onSubmit, isLoading }) {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientName, setRecipientName] = useState(''); // 可选，但推荐
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(''); // 清除之前的错误

    // --- 基本前端校验 --- 
    if (!recipientAccount.trim()) {
      setFormError('请输入收款人账号。');
      return;
    }
    // 简单的账号格式校验 (示例：至少5位数字或字母)
    if (!/^[a-zA-Z0-9]{5,}$/.test(recipientAccount)) {
         setFormError('收款人账号格式不正确（至少5位数字或字母）。');
         return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setFormError('请输入有效的转账金额。');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > 50000) { // 示例：前端单笔限额简单校验
        setFormError('单笔转账金额不能超过 50,000。');
        return;
    }
    // 更多校验可以在这里添加，例如收款人姓名格式等
    // --- 校验结束 ---

    onSubmit({
      recipientAccount,
      recipientName: recipientName.trim(), // 提交时去除前后空格
      amount: parsedAmount, // 提交数字类型
      remark: remark.trim(),
    });
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
      fontSize: '1rem',
  };

  const labelStyle = {
      marginBottom: '-10px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
  };

  const buttonStyle = {
      padding: '12px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      opacity: isLoading ? 0.7 : 1,
  };

  const errorStyle = {
      color: 'red',
      fontSize: '0.9rem',
      marginTop: '-5px',
      marginBottom: '5px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {formError && <div style={errorStyle}>{formError}</div>}
      <div>
          <label htmlFor="recipientAccount" style={labelStyle}>收款人账号</label>
          <input
            id="recipientAccount"
            type="text"
            value={recipientAccount}
            onChange={(e) => setRecipientAccount(e.target.value)}
            placeholder="请输入收款方银行账号或标识"
            style={inputStyle}
            disabled={isLoading}
          />
      </div>
      <div>
          <label htmlFor="recipientName" style={labelStyle}>收款人姓名 (可选)</label>
          <input
            id="recipientName"
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="请输入收款方姓名以便核对"
            style={inputStyle}
            disabled={isLoading}
          />
      </div>
      <div>
          <label htmlFor="amount" style={labelStyle}>转账金额 (元)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="请输入转账金额"
            step="0.01" // 允许输入小数
            min="0.01"   // 最小金额
            style={inputStyle}
            disabled={isLoading}
          />
      </div>
       <div>
          <label htmlFor="remark" style={labelStyle}>备注 (可选)</label>
          <input
            id="remark"
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="选填，最多50字"
            maxLength={50}
            style={inputStyle}
            disabled={isLoading}
          />
      </div>
      <button type="submit" disabled={isLoading} style={buttonStyle}>
        {isLoading ? '处理中...' : '下一步'}
      </button>
    </form>
  );
}

export default TransferForm; 