const { useState } = React;

// 弹窗1：需要兑换码弹窗 - 按照详细需求创建
const StartTestModal = ({ isOpen, onClose, onConfirm, onShowRedeemModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="redeem-required-modal">
        {/* 标题区域 */}
        <div className="modal-header">
          <div className="title-icon">
            {/* 黄色钥匙图标 */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.24 2 7 4.24 7 7C7 9.38 8.69 11.34 11 11.87V22H13V11.87C15.31 11.34 17 9.38 17 7C17 4.24 14.76 2 12 2ZM12 9C10.35 9 9 7.65 9 6C9 4.35 10.35 3 12 3C13.65 3 15 4.35 15 6C15 7.65 13.65 9 12 9Z" fill="#FFC105"/>
              <rect x="14" y="16" width="8" height="2" fill="#FFC105"/>
              <rect x="14" y="19" width="6" height="2" fill="#FFC105"/>
            </svg>
          </div>
          <h2 className="modal-title">需要兑换码</h2>
        </div>

        {/* 说明文字区域 */}
        <p className="modal-description">使用本测评需要兑换码激活。</p>

        {/* 平台选择区域 */}
        <div className="platform-section">
          <div className="platform-icon">
            {/* 蓝色钻石图标 */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4"/>
              <path d="M2 17L12 22L22 17" stroke="#4285F4" strokeWidth="2" fill="none"/>
              <path d="M2 12L12 17L22 12" stroke="#4285F4" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <p className="platform-text">请选择以下平台获取兑换码：</p>
        </div>

        {/* 按钮区域 */}
        <div className="modal-buttons">
          {/* 小红书获取按钮 */}
          <button
            className="xiaohongshu-btn"
            onClick={() => {
              // 打开小红书链接
              window.open('https://www.xiaohongshu.com', '_blank');
            }}
          >
            <div className="xiaohongshu-logo">
              {/* 小红书logo - 红色方块带白色文字 */}
              <div className="logo-container">
                <div className="logo-background"></div>
                <span className="logo-text">小红书</span>
              </div>
            </div>
            <span className="btn-text">小红书获取</span>
          </button>

          {/* 输入兑换码按钮 */}
          <button
            className="input-redeem-btn"
            onClick={onShowRedeemModal}
          >
            输入兑换码
          </button>
        </div>

        {/* 取消按钮 */}
        <button className="cancel-bottom-btn" onClick={onClose}>
          取消
        </button>
      </div>
    </div>
  );
};

// 弹窗2：兑换码输入弹窗 - 按照详细需求创建
const RedeemCodeModal = ({ isOpen, onClose, onConfirm }) => {
  const [redeemCode, setRedeemCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (redeemCode.trim()) {
      onConfirm(redeemCode.trim());
      setRedeemCode('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="redeem-input-modal">
        {/* 关闭按钮 - 黑色×符号 */}
        <button className="redeem-close" onClick={onClose}>
          ×
        </button>

        {/* 标题区域 */}
        <h2 className="redeem-title">使用兑换码</h2>

        {/* 说明文字区域 */}
        <p className="redeem-description">请输入您获取的兑换码</p>

        {/* 兑换码输入框 - 红色边框 */}
        <input
          type="text"
          className="redeem-input"
          placeholder="请输入兑换码"
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={50}
        />

        {/* 平台获取区域 */}
        <div className="platform-redeem-section">
          <div className="platform-redeem-icon">
            {/* 蓝色钻石图标 */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4"/>
              <path d="M2 17L12 22L22 17" stroke="#4285F4" strokeWidth="2" fill="none"/>
              <path d="M2 12L12 17L22 12" stroke="#4285F4" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <p className="platform-redeem-text">还没有兑换码？请选择以下平台获取：</p>
        </div>

        {/* 小红书获取按钮 */}
        <button
          className="xiaohongshu-redeem-btn"
          onClick={() => {
            // 打开小红书链接
            window.open('https://www.xiaohongshu.com', '_blank');
          }}
        >
          <div className="xiaohongshu-redeem-logo">
            {/* 小红书logo - 红色方块带白色文字 */}
            <div className="logo-redeem-container">
              <div className="logo-redeem-background"></div>
              <span className="logo-redeem-text">小红书</span>
            </div>
          </div>
          <span className="btn-redeem-text">小红书获取</span>
        </button>

        {/* 下一步按钮 - 粉色背景 */}
        <button
          className="next-step-btn"
          onClick={handleSubmit}
          disabled={!redeemCode.trim()}
        >
          下一步
        </button>
      </div>
    </div>
  );
};

// 导出组件供其他文件使用
window.StartTestModal = StartTestModal;
window.RedeemCodeModal = RedeemCodeModal;