const { useState } = React;

// 弹窗1：需要兑换码弹窗 - 重新设计
const StartTestModal = ({ isOpen, onClose, onConfirm, onShowRedeemModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="redeem-required-modal">
        {/* 标题 */}
        <h2 className="modal-title">需要兑换码</h2>

        {/* 说明文字 */}
        <p className="modal-description">使用本测试需要兑换码</p>

        {/* 小标题 */}
        <div className="modal-subtitle">
          💎 请选择以下平台获取兑换码
        </div>

        {/* 并排两个按钮 */}
        <div className="modal-buttons">
          {/* 小红书店铺获取按钮 */}
          <button
            className="xiaohongshu-shop-btn"
            onClick={() => {
              // 打开小红书链接
              window.open('https://www.xiaohongshu.com', '_blank');
            }}
          >
            <div className="xiaohongshu-icon">
              {/* 小红书logo - 简化版 */}
              <div className="logo-red-box">
                <span className="logo-text">小红书</span>
              </div>
            </div>
            <span className="btn-text">小红书店铺获取</span>
          </button>

          {/* 输入兑换码按钮 */}
          <button
            className="input-redeem-btn"
            onClick={onShowRedeemModal}
          >
            输入兑换码
          </button>
        </div>
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