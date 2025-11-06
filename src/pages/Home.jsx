import React, { useState } from 'react';
import AuthCodeModal from '../components/AuthCodeModal';

function Home({ onStart, onHistory }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleStartTest = (mode) => {
    setSelectedMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    onStart(selectedMode);
  };

  return (
    <>
      <div className="page home-page">
        {/* 导航栏 */}
        <div className="navbar">
          <div className="logo">
            <span className="logo-icon">💕</span>
            <span className="logo-text">RPI Calculator</span>
            <span className="logo-subtitle">恋爱占有欲指数计算器</span>
          </div>
          <div className="nav-menu">
            <button className="nav-item" onClick={onHistory}>
              📊 我的测试报告
            </button>
            <button className="nav-item">
              📖 使用指南
            </button>
            <button className="nav-item">
              👨‍🔬 科学依据
            </button>
          </div>
        </div>

        {/* Hero区域 */}
        <div className="hero-section">
          <div className="badge">💗 基于心理学研究的专业测评工具</div>
          <h1 className="main-title">恋爱占有欲指数计算器</h1>
          <p className="subtitle">
            专业的恋爱心理评估工具，基于多个经过验证的心理测量量表，
            帮助您科学地了解自己或恋人的占有欲程度，促进健康和谐的亲密关系发展。
          </p>
        </div>

        {/* 双视角智能评估提示框 */}
        <div className="dual-test-notice-section">
          <div className="dual-test-notice">
            <div className="notice-icon-wrapper">
              <div className="notice-icon">⚠️</div>
            </div>
            <div className="notice-content">
              <h3>双视角智能评估</h3>
              <p>
                提供"给自己测"和"为恋人测"两种视角，
                系统会根据的结果，显示，<strong>恋爱体验等因素，提供个性化的分析结果和建议</strong>，
                帮助您更全面地认识占有欲表现特点。
              </p>
            </div>
          </div>
        </div>

        {/* 快捷按钮区域 */}
        <div className="quick-actions">
          <button className="btn-large btn-large-primary" onClick={() => handleStartTest('self')}>
            ✨ 给自己测
          </button>
          <button className="btn-large btn-large-secondary" onClick={() => handleStartTest('partner')}>
            💑 为恋人测
          </button>
        </div>

        {/* 数据统计卡片 */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">10-15</div>
            <div className="stat-label">分钟完成</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">4</div>
            <div className="stat-label">核心维度</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div className="stat-value">100%</div>
            <div className="stat-label">隐私保护</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">双视角</div>
            <div className="stat-label">深度分析</div>
          </div>
        </div>

        {/* 选择测评视角 */}
        <div className="test-modes-section">
          <h2 className="section-title">选择测评视角</h2>
          <p className="section-desc">
            提供两种测评视角，您可以以自己或帮助了解伴侣的占有欲特点
          </p>

          <div className="test-modes">
            {/* 给自己测 */}
            <div className="test-mode-card featured">
              <div className="mode-badge">✨ 推荐</div>
              <div className="mode-header">
                <div className="mode-icon">👤</div>
                <div className="mode-info">
                  <h3 className="mode-title">给自己测</h3>
                  <p className="mode-subtitle">深入了解自己的占有欲程度</p>
                </div>
              </div>

              <div className="mode-features">
                <div className="feature-item">✓ 控制欲望程度量表</div>
                <div className="feature-item">✓ 嫉妒强度量表</div>
                <div className="feature-item">✓ 情感依赖量表</div>
                <div className="feature-item">✓ 关系不安全感量表</div>
              </div>

              <div className="mode-stats">
                <div className="mode-stat">
                  <span className="stat-label-sm">预计用时</span>
                  <span className="stat-value-sm">10-15 分钟</span>
                </div>
                <div className="mode-stat">
                  <span className="stat-label-sm">题目数量</span>
                  <span className="stat-value-sm">40 题</span>
                </div>
              </div>

              <button className="mode-btn mode-btn-primary" onClick={() => handleStartTest('self')}>
                → ❤️ 给自己测
              </button>
            </div>

            {/* 为恋人测 */}
            <div className="test-mode-card">
              <div className="mode-header">
                <div className="mode-icon">💑</div>
                <div className="mode-info">
                  <h3 className="mode-title">为恋人测</h3>
                  <p className="mode-subtitle">了解伴侣对您的占有欲程度</p>
                </div>
              </div>

              <div className="mode-features">
                <div className="feature-item">✓ 恋人控制欲望程度量表</div>
                <div className="feature-item">✓ 恋人嫉妒强度量表</div>
                <div className="feature-item">✓ 恋人情感依赖量表</div>
                <div className="feature-item">✓ 恋人关系不安全感量表</div>
              </div>

              <div className="mode-stats">
                <div className="mode-stat">
                  <span className="stat-label-sm">预计用时</span>
                  <span className="stat-value-sm">10-15 分钟</span>
                </div>
                <div className="mode-stat">
                  <span className="stat-label-sm">题目数量</span>
                  <span className="stat-value-sm">40 题</span>
                </div>
              </div>

              <button className="mode-btn mode-btn-secondary" onClick={() => handleStartTest('partner')}>
                → 💕 为恋人测
              </button>
            </div>
          </div>
        </div>

        {/* 科学可靠的评估基础 */}
        <div className="science-section">
          <h2 className="section-title">科学可靠的评估基础</h2>
          <p className="section-desc">
            基于心理学研究和专业量表，全面评估您的恋爱占有欲的四个核心心理维度
          </p>

          <div className="science-grid">
            <div className="science-card">
              <div className="science-icon">👤</div>
              <h4>控制欲望</h4>
              <p>评估在恋爱关系中对伴侣的控制倾向和监控行为</p>
            </div>
            <div className="science-card">
              <div className="science-icon">💖</div>
              <h4>嫉妒强度</h4>
              <p>测量在恋爱关系中的嫉妒情绪和排他性倾向</p>
            </div>
            <div className="science-card">
              <div className="science-icon">👥</div>
              <h4>情感依赖</h4>
              <p>评估对伴侣的情感依赖程度及独立性水平</p>
            </div>
            <div className="science-card">
              <div className="science-icon">✅</div>
              <h4>关系不安</h4>
              <p>测量在亲密关系中的不安全感和焦虑程度</p>
            </div>
          </div>
        </div>

        {/* 隐私声明 */}
        <div className="privacy-section">
          <div className="privacy-icon">🔐</div>
          <h3>您的隐私是我们的首要关注</h3>
          <p>
            所有评估数据都仅在本地处理和存储，您随时可以删除测评历史，
            我们绝不会对外泄露您的信息。
          </p>
          <div className="privacy-badges">
            <span className="privacy-badge">✓ 本地加密存储</span>
            <span className="privacy-badge">✓ 完全匿名化</span>
            <span className="privacy-badge">✓ 可随时删除</span>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <h2>准备好探索恋爱关系的真相了吗？</h2>
          <p>通过科学的评估，深入了解恋爱占有欲的占有欲特点，促进更健康和谐的亲密关系关系。</p>
          <button className="cta-btn" onClick={() => handleStartTest('self')}>
            ✨ 立即开始测评
          </button>
        </div>

        {/* 底部信息 */}
        <div className="footer">
          <div className="footer-logo">
            <span className="logo-icon">💕</span>
            <span>RPI Calculator</span>
          </div>
          <p className="footer-text">
            基于心理学研究的恋爱占有欲评估工具，帮助您了解自己或伴侣的占有欲特点。
          </p>
          <p className="footer-copyright">
            © 2025 恋爱占有欲指数计算器 | 测评结果仅供参考，不构成医疗建议 | 如有疑问请咨询专业心理咨询师
          </p>
        </div>
      </div>

      {/* 授权码弹窗 */}
      <AuthCodeModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Home;
