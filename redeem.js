const { useState } = React;

// 简单的兑换码验证弹窗
const RedeemModal = ({ isOpen, onClose, onConfirm }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError('请输入兑换码');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // 调用API验证兑换码
      const response = await fetch('http://101.132.176.113:3000/api/codes/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: trimmedCode,
          usedBy: 'SCL90_USER' // 可选的使用人标识
        })
      });

      const data = await response.json();

      if (data.success) {
        // 验证成功
        setIsLoading(false);
        setCode('');
        onConfirm(data);
      } else {
        // 验证失败
        setError(data.error || '验证失败');
        setIsLoading(false);
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
      setIsLoading(false);
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
        <h2 className="modal-title">兑换码验证</h2>

        <p className="modal-description">请输入兑换码以开始测试</p>

        <input
          type="text"
          className={`redeem-input ${error ? 'error' : ''}`}
          placeholder="请输入兑换码"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError('');
          }}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          maxLength={50}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={isLoading}
          >
            取消
          </button>

          <button
            className={`confirm-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={!code.trim() || isLoading}
          >
            {isLoading ? '验证中...' : '确认'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 导出组件
window.RedeemModal = RedeemModal;