const { useState } = React;

// 弹窗1：开始测试弹窗
const StartTestModal = ({ isOpen, onClose, onConfirm, onShowRedeemModal }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="start-test-modal">
        <h2 className="start-test-title">开始测试</h2>
        <p className="start-test-description">
          这个测试需要5-10分钟，请确保您有足够的时间和安静的环境进行答题。
        </p>
        <div className="start-test-buttons">
          <button className="btn-cancel" onClick={onClose}>
            取消
          </button>
          <button className="btn-redeem" onClick={onShowRedeemModal}>
            输入兑换码
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// 弹窗2：兑换码输入弹窗
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
      <div className="redeem-modal">
        <button className="redeem-close" onClick={onClose}></button>
        <h2 className="redeem-title">输入兑换码</h2>
        <p className="redeem-subtitle">请输入您获得的兑换码以激活专业版功能</p>
        <input
          type="text"
          className="redeem-input"
          placeholder="请输入兑换码"
          value={redeemCode}
          onChange={(e) => setRedeemCode(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={50}
        />
        <button
          className="redeem-submit"
          onClick={handleSubmit}
          disabled={!redeemCode.trim()}
        >
          确定
        </button>
      </div>
    </div>
  );
};

// 导出组件供其他文件使用
window.StartTestModal = StartTestModal;
window.RedeemCodeModal = RedeemCodeModal;