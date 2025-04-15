import React from 'react';
import { Card, Form, Input, Button, Select, List, Typography, Tag, message } from 'antd';

const { Title } = Typography;

function TransferSection({
    form,
    loading,
    userInfo,
    activeAccount,
    transferRecords,
    onFinish,
    handleAccountChange,
}) {
  // console.log('userInfo.accounts',userInfo.accounts);
    return (
        <>
            <Card title="发起转账" className="transfer-card" style={{ marginBottom: '24px' }}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                     <Form.Item
                        name="fromAccount"
                        label="转出账户"
                        initialValue={activeAccount}
                        rules={[{ required: true, message: "请选择转出账户" }]}
                      >
                        <Select 
                          placeholder="请选择转出账户"
                          onChange={handleAccountChange}
                          value={activeAccount || undefined} // 处理初始 undefined 情况
                        >
                          {userInfo.accounts?.map(account => (
                            <Select.Option key={account.accountNumber} value={account.accountNumber}>
                              {`${account.type} - ${account.accountNumber} (余额: ¥${account.balance})`}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        name="targetAccount"
                        label="收款账号"
                        rules={[
                          { required: true, message: "请输入收款账号" },
                          {
                            // 使用 RegExp 字面量确保正确性
                            pattern: /^[1-9]\d{15,18}$/,
                            message: "请输入正确的银行卡号（16-19位数字，不能以0开头）"
                          },
                           ({ getFieldValue }) => ({
                            validator(_, value) {
                              const sourceAccount = getFieldValue('fromAccount');
                              if (!value || !sourceAccount || value !== sourceAccount) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('收款账户不能与转出账户相同!'));
                            },
                          }),
                        ]}
                      >
                        <Input placeholder="请输入收款账号" />
                      </Form.Item>

                      <Form.Item
                        name="targetName"
                        label="收款人姓名"
                        rules={[{ required: true, message: "请输入收款人姓名" }]} // 添加简单必填校验
                      >
                        <Input placeholder="请输入收款人姓名核实" />
                      </Form.Item>

                      <Form.Item
                        name="amount"
                        label="转账金额 (元)"
                        rules={[
                          { required: true, message: "请输入转账金额" },
                          // 使用 validator 保证输入的是有效数字且大于0
                          {
                            validator: (_, value) => {
                                if (!value) {
                                    return Promise.resolve(); // 交给 required 校验
                                }
                                const numValue = Number(value);
                                if (isNaN(numValue)) {
                                    return Promise.reject(new Error('请输入有效的数字'));
                                }
                                if (numValue <= 0) {
                                    return Promise.reject(new Error('转账金额必须大于0'));
                                }
                                return Promise.resolve();
                            }
                          },
                          ({ getFieldValue }) => ({
                             validator(_, value) {
                                const numValue = Number(value);
                                if (isNaN(numValue)) return Promise.resolve(); // 等待数字校验
                                const selectedAccount = userInfo.accounts?.find(acc => acc.accountNumber === activeAccount);
                                if (!selectedAccount) {
                                    return Promise.reject(new Error('请先选择转出账户'));
                                }
                                if (numValue > selectedAccount.balance) {
                                    return Promise.reject(new Error('账户余额不足!'));
                                }
                                return Promise.resolve();
                             }
                          })
                        ]}
                       >
                        <Input type="number" step="0.01" placeholder="请输入转账金额" />
                      </Form.Item>

                      <Form.Item
                        name="remark"
                        label="备注（可选）"
                      >
                        <Input.TextArea rows={2} placeholder="选填，给对方的留言或标记" />
                      </Form.Item>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                          {loading ? '处理中...' : '确认转账'}
                        </Button>
                      </Form.Item>
                </Form>
            </Card>
            <Card title="近期转账记录" className="transfer-records-card">
                 <List
                    itemLayout="horizontal"
                    dataSource={transferRecords}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <span>
                                转账至 {item.targetName ? `${item.targetName} (${item.targetAccount})` : item.targetAccount}
                            </span>
                           }
                          description={`金额: ¥${item.amount.toFixed(2)} | 时间: ${new Date(item.timestamp).toLocaleString()} ${item.remark ? '| 备注: ' + item.remark : ''}`}
                        />
                        <Tag color={item.status === '成功' ? 'success' : item.status === '处理中' ? 'processing' : 'error'}>
                          {item.status}
                        </Tag>
                      </List.Item>
                    )}
                    locale={{ emptyText: '暂无转账记录' }}
                    pagination={{
                      pageSize: 5, // 每页显示5条
                      hideOnSinglePage: true,
                    }}
                  />
            </Card>
        </>
    );
}

export default TransferSection; 