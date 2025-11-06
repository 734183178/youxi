import React, { useState } from 'react';
import './AuthCodeModal.css';

function AuthCodeModal({ isOpen, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('请输入授权码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://backend-og7jw9vwf-734183178s-projects.vercel.app/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('authCode', code.toUpperCase());
        sessionStorage.setItem('authValidUntil', data.data.validUntil);
        onSuccess();
      } else {
        setError(data.message || '授权码验证失败');
      }
    } catch (err) {
      setError('网络错误，请检查后端服务是否启动');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {/* 顶部区域 */}
        <div className="modal-header-section">
          <span className="modal-icon">🔐</span>
          <h2 className="modal-title">请输入授权码</h2>
        </div>

        {/* 输入区域 */}
        <div className="input-section">
          <input
            type="text"
            className="auth-input"
            placeholder="请输入8位授权码"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            maxLength={8}
            autoFocus
          />
          <p style={{ fontSize: '11px', color: '#999', marginTop: '6px', textAlign: 'center', margin: '6px 0 0 0' }}>
            输入8位授权码以开始测试
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* 获取授权码区域 */}
        <div className="get-code-section">
          <div className="section-header">
            <span className="section-icon">🔑</span>
            <h3>获取授权码</h3>
          </div>

          <p style={{ fontSize: '11px', color: '#999', marginBottom: '10px', margin: '0 0 10px 0' }}>
            测试授权码可以在以下平台获取：
          </p>

          <div className="platform-buttons">
            <button className="platform-btn platform-btn-yellow">
              <span className="platform-icon">📦</span>
              <div className="platform-info">
                <span className="platform-name">闲鱼店铺</span>
                <span className="platform-desc">搜索"恋爱测试"</span>
              </div>
            </button>
            <button className="platform-btn platform-btn-red">
              <span className="platform-icon">📕</span>
              <div className="platform-info">
                <span className="platform-name">小红书店铺</span>
                <span className="platform-desc">搜索"RPI测试"</span>
              </div>
            </button>
          </div>

          {/* 温馨提示 */}
          <div className="tips-box">
            <div className="tips-header">
              <span className="tips-icon">💡</span>
              <span>温馨提示：</span>
            </div>
            <ul className="tips-list">
              <li>授权码购买后立即可用，一码一测</li>
              <li>测试结果保存在本地，可随时查看</li>
              <li>支持"给自己"和"为TA人测"两种模式</li>
            </ul>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
          >
            {loading ? '验证中...' : '开始测试 →'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthCodeModal;
