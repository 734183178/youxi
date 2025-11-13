const { useState } = React;

const StartTestModal = ({ isOpen, onClose, onConfirm, onShowRedeemModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* 警告图标 */}
        <div className="modal-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF9800" strokeWidth="2"/>
            <path d="M12 8V12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#FF9800"/>
          </svg>
        </div>

        {/* 标题 */}
        <h2 className="modal-title">测试说明</h2>

        {/* 说明内容 */}
        <div className="modal-content">
          <div className="modal-section">
            <div className="modal-section-title">⚠️ 在开始前，请确认：</div>
            <ul className="modal-list">
              <li>这是一个专业的心理健康评估工具</li>
              <li>包含90道题目，预计需要15-20分钟</li>
              <li>请根据最近一周的真实感受作答</li>
              <li>测试结果仅供参考，不能替代专业诊断</li>
            </ul>
          </div>

          <div className="modal-section">
            <div className="modal-section-title">✅ 您需要准备：</div>
            <ul className="modal-list">
              <li>安静的环境，不受打扰</li>
              <li>专注的心态，认真阅读每道题</li>
              <li>诚实作答，选择最符合的选项</li>
            </ul>
          </div>

          <div className="modal-notice">
            <strong>重要提醒：</strong>如有严重心理困扰，建议寻求专业心理咨询师的帮助。
          </div>
        </div>

        {/* 按钮 */}
        <div className="modal-buttons">
          <button className="modal-btn modal-btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="modal-btn modal-btn-redeem" onClick={onShowRedeemModal}>
            输入兑换码
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            开始测试
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <div className="redeem-modal-container">
        {/* 关闭按钮 */}
        <button className="redeem-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 6L18 18" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 标题 */}
        <h2 className="redeem-title">输入兑换码</h2>

        {/* 副标题 */}
        <p className="redeem-subtitle">请输入您获得的兑换码以激活专业版功能</p>

        {/* 输入框 */}
        <div className="redeem-input-group">
          <input
            type="text"
            className="redeem-input"
            placeholder="请输入兑换码"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={20}
          />
        </div>

        {/* 提交按钮 */}
        <button
          className="redeem-submit-btn"
          onClick={handleSubmit}
          disabled={!redeemCode.trim()}
        >
          验证
        </button>
      </div>
    </div>
  );
};

// 导出组件供其他文件使用
window.StartTestModal = StartTestModal;
window.RedeemCodeModal = RedeemCodeModal;