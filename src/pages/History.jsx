import React, { useState, useEffect } from 'react';

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'self', 'partner'

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('确定要清空所有历史记录吗？')) {
      localStorage.removeItem('testHistory');
      setHistory([]);
    }
  };

  const deleteItem = (index) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const newHistory = history.filter((_, i) => i !== index);
      setHistory(newHistory);
      localStorage.setItem('testHistory', JSON.stringify(newHistory));
    }
  };

  // 根据Tab筛选
  const filteredHistory = history.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'self') return item.mode === 'self';
    if (activeTab === 'partner') return item.mode === 'partner';
    return true;
  });

  const selfCount = history.filter(item => item.mode === 'self').length;
  const partnerCount = history.filter(item => item.mode === 'partner').length;

  return (
    <div className="page history-page" style={{ padding: '0' }}>
      {/* 顶部导航 */}
      <div className="report-header">
        <div className="report-logo">
          <span className="logo-icon">💕</span>
          <span className="logo-text">RPI Calculator</span>
          <span className="logo-subtitle">恋爱占有欲指数计算器</span>
        </div>
        <button className="back-home-btn" onClick={onBack}>
          ← 返回首页
        </button>
      </div>

      {/* 标题区域 */}
      <div className="report-title-section">
        <div className="report-icon">📊</div>
        <h1>我的测试报告</h1>
        <p>查看和管理您的历史测试记录</p>
      </div>

      {/* Tab切换 */}
      <div className="report-tabs">
        <button
          className={`report-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          全部报告 ({history.length})
        </button>
        <button
          className={`report-tab ${activeTab === 'self' ? 'active' : ''}`}
          onClick={() => setActiveTab('self')}
        >
          给自己测 ({selfCount})
        </button>
        <button
          className={`report-tab ${activeTab === 'partner' ? 'active' : ''}`}
          onClick={() => setActiveTab('partner')}
        >
          为恋人测 ({partnerCount})
        </button>
      </div>

      {/* 内容区域 */}
      <div className="report-content">
        {filteredHistory.length === 0 ? (
          <div className="empty-report">
            <div className="empty-icon">📋</div>
            <p className="empty-title">
              {activeTab === 'all' ? '暂无自己的测试报告' :
               activeTab === 'self' ? '暂无自己的测试报告' : '暂无恋人的测试报告'}
            </p>
            <p className="empty-desc">完成测试后会自动保存记录</p>
            <button className="btn btn-primary" onClick={onBack}>
              去测试
            </button>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item, index) => (
              <div key={index} className="report-card">
                <div className="report-card-header">
                  <div className="report-card-left">
                    <div className="report-card-date">{item.date}</div>
                    {item.modeTitle && (
                      <span className={`report-mode-tag ${item.mode}`}>
                        {item.mode === 'self' ? '💖' : '💑'} {item.modeTitle}
                      </span>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(index)}
                    title="删除此记录"
                  >
                    🗑️
                  </button>
                </div>

                <div className="report-card-body">
                  <div className="report-card-level">
                    <span className="level-badge" style={{ background: item.color }}>
                      {item.level}
                    </span>
                  </div>
                  <div className="report-card-score">
                    <div className="score-main">{item.percentage}%</div>
                    <div className="score-detail">{item.score} / 250 分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredHistory.length > 0 && (
          <div className="report-actions">
            <button className="btn btn-secondary" onClick={onBack}>
              返回首页
            </button>
            <button
              className="btn btn-secondary delete-all-btn"
              onClick={clearHistory}
            >
              清空所有记录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
