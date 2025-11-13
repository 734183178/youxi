const { useState, useEffect } = React;

// 恋爱占有欲题目库
const allQuestions = [
  "我需要不断确认伴侣是否还爱我",
  "我会频繁查看伴侣的手机消息",
  "伴侣和异性朋友聊天会让我感到不安",
  "我希望伴侣的所有时间都只属于我",
  "伴侣晚归时我会不断追问原因",
  "我会限制伴侣参加有异性的社交活动",
  "我需要知道伴侣的所有行踪",
  "伴侣和别人（尤其是异性）互动时我会嫉妒",
  "我不喜欢伴侣有除我之外的亲密朋友",
  "我会因为伴侣和别人聊天而感到被忽视",
  "我希望伴侣的社交圈完全在我的掌控中",
  "伴侣对别人（尤其是异性）好会让我不开心",
  "我会因为伴侣没及时回消息而焦虑",
  "我不允许伴侣有秘密瞒着我",
  "我会因为伴侣和朋友出去玩而感到不满",
  "我希望伴侣把我放在所有事情的第一位",
  "我会检查伴侣的消费记录或社交平台",
  "伴侣和前任有联系会让我无法接受",
  "我会因为伴侣和同事走得近而猜疑",
  "我需要伴侣时刻向我报备动态",
  "我不喜欢伴侣有自己的私人空间",
  "伴侣夸奖别人会让我觉得他/她对我不够专注",
  "我会因为伴侣和朋友聚会而感到被冷落",
  "我希望伴侣的生活重心完全围绕我",
  "我会因为伴侣没优先回复我而生气",
  "我不允许伴侣和我不认识的人过多接触",
  "我会因为伴侣和别人分享心事而感到嫉妒",
  "我需要伴侣在任何时候都能立即回应我",
  "我会限制伴侣的业余爱好（如果需要花时间独处）",
  "伴侣和异性同事加班会让我胡思乱想",
  "我希望伴侣的朋友圈里只有我们的合照",
  "我会因为伴侣关注其他异性的社交媒体而不快",
  "我不喜欢伴侣有自己的社交圈",
  "伴侣和朋友出去旅游我会感到不安",
  "我需要伴侣把所有密码都告诉我",
  "我会因为伴侣和别人开玩笑而觉得他/她不够认真",
  "我希望伴侣的所有决定都和我商量",
  "我会因为伴侣和别人（尤其是异性）吃饭而追问细节",
  "我不允许伴侣单独和异性朋友见面",
  "我会因为伴侣对别人（尤其是异性）微笑而感到不舒服",
  "我需要伴侣在我需要的时候随时出现",
  "我会限制伴侣的工作应酬（如果有异性参与）",
  "伴侣和异性同学联系会让我产生怀疑",
  "我希望伴侣的生活里只有我一个重要的人",
  "我会因为伴侣没把我介绍给他/她的所有朋友而不满",
  "我不喜欢伴侣有除了我之外的倾诉对象",
  "伴侣参加公司团建（有异性）我会反复叮嘱",
  "我需要伴侣时刻表达对我的爱意",
  "我会因为伴侣和别人（尤其是异性）有共同兴趣而感到威胁",
  "当伴侣没有第一时间回复我时，我会感到被忽视",
  "我会因为伴侣多看了一眼异性而生气",
  "我希望伴侣的手机壁纸是我们的合照",
  "伴侣和别人（尤其是异性）打电话时我会想知道内容",
  "我会因为伴侣没告诉我一件小事而感到被排斥",
  "我希望伴侣主动向我汇报所有社交活动",
  "伴侣和异性的任何身体接触都会让我不适",
  "我会检查伴侣的社交媒体私信",
  "我不喜欢伴侣对别人（尤其是异性）过于友善",
  "伴侣和朋友聚会时我希望他/她随时回复我的消息",
  "我会因为伴侣没带我参加某个活动而猜疑",
  "我希望伴侣的家人和朋友都喜欢我",
  "我会因为伴侣称赞别人的优点而感到威胁",
  "我希望伴侣的工作中没有太多异性同事",
  "我会因为伴侣和别人（尤其是异性）有共同话题而不快",
  "我需要知道伴侣的所有网络账号密码",
  "伴侣和别人（尤其是异性）分享笑话会让我不舒服",
  "我会限制伴侣与前任的任何形式的联系",
  "我希望伴侣把我的照片设为手机屏保",
  "伴侣和异性朋友的聊天记录我都想查看",
  "我会因为伴侣关注了新的异性社交媒体账号而询问原因",
  "我希望伴侣在社交场合中大部分时间都和我在一起",
  "我会因为伴侣帮了异性一个小忙而感到不满",
  "我需要伴侣每天告诉我他/她的所有想法",
  "伴侣和异性的工作交流我都会想了解细节",
  "我不喜欢伴侣有我不认识的异性朋友",
  "我会因为伴侣和别人（尤其是异性）开玩笑而生气",
  "我希望伴侣在做任何决定前都先问我的意见",
  "伴侣和异性的眼神交流都会让我感到不舒服",
  "我会定期查看伴侣的通话记录",
  "我希望伴侣把我的需求放在他/她家人的需求之前",
  "我会因为伴侣记得别人的生日而不开心",
  "我不喜欢伴侣有和异性的任何形式的单独相处",
  "我需要知道伴侣和谁一起吃饭",
  "伴侣和异性的工作邮件往来我都想了解",
  "我会因为伴侣没及时告诉我他/她的行踪而焦虑",
  "我希望伴侣所有的空闲时间都用来陪我",
  "我会因为伴侣和别人（尤其是异性）有共同爱好而嫉妒",
  "我不喜欢伴侣在社交媒体上和异性互动",
  "我需要伴侣随时能接我的电话",
  "伴侣和异性的任何亲近举动都会让我感到威胁",
  "我会因为伴侣没把我的照片发到社交媒体而不满",
  "我希望伴侣的朋友圈动态都与我有关",
  "我会因为伴侣对别人（尤其是异性）的问题更耐心而不快",
  "我需要知道伴侣和谁一起参加了聚会",
  "伴侣和异性的工作合作我都会感到不安",
  "我会因为伴侣没告诉我他/她的想法而感到被疏远",
  "我希望伴侣把我放在他/她的朋友之前",
  "我会因为伴侣关注了异性的社交媒体而质问原因",
  "我不喜欢伴侣和异性有任何形式的礼物交换",
  "我需要伴侣每天说爱我多次"
];

// Fisher-Yates 洗牌算法，随机抽取50道题
function getRandomQuestions() {
  const questionsCopy = [...allQuestions];
  for (let i = questionsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsCopy[i], questionsCopy[j]] = [questionsCopy[j], questionsCopy[i]];
  }
  return questionsCopy.slice(0, 50);
}

// 评分选项
const scoreOptions = [
  { value: 1, label: '非常不符合' },
  { value: 2, label: '不太符合' },
  { value: 3, label: '一般' },
  { value: 4, label: '比较符合' },
  { value: 5, label: '非常符合' }
];

// 根据总分计算结果等级
function calculateResult(totalScore) {
  const percentage = (totalScore / 250) * 100; // 50题×5分=250分满分

  if (percentage < 20) {
    return {
      level: '低占有欲',
      score: totalScore,
      percentage: percentage.toFixed(1),
      description: '你在恋爱关系中展现出很低的占有欲，给予伴侣充分的自由和信任。你理解独立空间的重要性，能够健康地处理恋爱关系中的边界感。',
      suggestion: '继续保持这种健康的恋爱态度，同时也要注意适当表达你的在乎和关心，让伴侣感受到你的爱意。',
      color: '#4CAF50'
    };
  } else if (percentage < 40) {
    return {
      level: '适度占有欲',
      score: totalScore,
      percentage: percentage.toFixed(1),
      description: '你的占有欲处于较为健康的水平。你在乎伴侣，但也能给予对方足够的空间。你懂得平衡关心与自由，这是健康恋爱关系的基础。',
      suggestion: '保持现在的状态，继续与伴侣保持良好的沟通，互相理解和尊重彼此的需求。',
      color: '#8BC34A'
    };
  } else if (percentage < 60) {
    return {
      level: '中等占有欲',
      score: totalScore,
      percentage: percentage.toFixed(1),
      description: '你的占有欲处于中等水平。你对伴侣有一定的控制需求，有时会因为对方的社交活动感到不安。这可能会给关系带来一些压力。',
      suggestion: '尝试增强自信，学会信任伴侣。给予对方更多的自由空间，同时也关注自己的个人成长和社交圈。',
      color: '#FFC107'
    };
  } else if (percentage < 80) {
    return {
      level: '较高占有欲',
      score: totalScore,
      percentage: percentage.toFixed(1),
      description: '你表现出较高的占有欲，经常需要掌控伴侣的行踪和社交。这种程度的占有欲可能会让伴侣感到压力，影响关系的健康发展。',
      suggestion: '建议反思自己的不安全感来源，可以考虑通过心理咨询来改善。学会信任和放手，给彼此更多的呼吸空间。',
      color: '#FF9800'
    };
  } else {
    return {
      level: '极高占有欲',
      score: totalScore,
      percentage: percentage.toFixed(1),
      description: '你的占有欲达到了很高的水平，可能会严重限制伴侣的自由，这对恋爱关系是不健康的。过度的控制欲可能源于深层的不安全感。',
      suggestion: '强烈建议寻求专业心理咨询帮助。学习建立健康的依恋关系，培养自我价值感，同时给予伴侣应有的尊重和自由。',
      color: '#F44336'
    };
  }
}

// 主应用组件
const LoveTestApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [testMode, setTestMode] = useState('self'); // 'self' 或 'partner'
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  // 开始测试
  const handleStartTest = (mode) => {
    setTestMode(mode);
    const randomQuestions = getRandomQuestions();
    setQuestions(randomQuestions);
    setAnswers({});
    setCurrentQuestion(0);
    setCurrentPage('test');
  };

  // 处理答案
  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 计算结果
      const totalScore = Object.values(newAnswers).reduce((sum, score) => sum + score, 0);
      const result = calculateResult(totalScore);
      setTestResult(result);
      setCurrentPage('result');
    }
  };

  // 上一题
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // 重新开始
  const handleRestart = () => {
    setCurrentPage('home');
    setTestMode('self');
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setTestResult(null);
  };

  // 计算进度
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // 渲染首页
  const renderHomePage = () => (
    <div className="page home-page">
      {/* 导航栏 */}
      <div className="navbar">
        <div className="logo">
          <span className="logo-icon">💕</span>
          <span className="logo-text">RPI Calculator</span>
          <span className="logo-subtitle">恋爱占有欲指数计算器</span>
        </div>
        <div className="nav-menu">
          <button className="nav-item">📊 我的测试报告</button>
          <button className="nav-item">📖 使用指南</button>
          <button className="nav-item">👨‍🔬 科学依据</button>
        </div>
      </div>

      {/* Hero区域 */}
      <div className="hero-section">
        <div className="badge">💗 基于心理学研究的专业测评工具</div>
        <h1 className="main-title">恋爱占有欲指数计算器</h1>
        <p className="subtitle">
          专业的恋爱心理评估工具，基于经过验证的心理测量量表，
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
              系统会根据测评结果，结合恋爱体验等因素，<strong>提供个性化的分析结果和建议</strong>，
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
          <div className="stat-value">50</div>
          <div className="stat-label">精心题目</div>
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
    </div>
  );

  // 渲染测试页面
  const renderTestPage = () => {
    const currentQuestionText = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    return (
      <div className="test-page">
        <div className="test-header">
          <h1 className="test-title">
            {testMode === 'self' ? '给自己测' : '为恋人测'} - 恋爱占有欲评估
          </h1>
          <p className="test-subtitle">
            请根据{testMode === 'self' ? '自己的' : '您伴侣的'}真实情况选择最符合的选项
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            第 {currentQuestion + 1} 题 / 共 {questions.length} 题 ({progress.toFixed(1)}%)
          </div>
        </div>

        <div className="question-container">
          <div className="question-text">{currentQuestionText}</div>
          <div className="options-container">
            {scoreOptions.map((option) => (
              <button
                key={option.value}
                className={`option-button ${currentAnswer === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(option.value)}
                style={{
                  backgroundColor: currentAnswer === option.value ? '#fff0f5' : '#f8f9fa',
                  borderColor: currentAnswer === option.value ? '#e92063' : '#e9ecef',
                  color: currentAnswer === option.value ? '#e92063' : '#495057'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="test-navigation">
          <button
            className="nav-button prev"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            style={{
              opacity: currentQuestion === 0 ? 0.5 : 1,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← 上一题
          </button>
          <span>
            剩余 {questions.length - currentQuestion - 1} 题
          </span>
        </div>
      </div>
    );
  };

  // 渲染结果页面
  const renderResultPage = () => {
    if (!testResult) return null;

    return (
      <div className="result-page">
        <div className="result-header">
          <div className="result-level" style={{ color: testResult.color }}>
            {testResult.level}
          </div>
          <div className="result-score" style={{ color: testResult.color }}>
            {testResult.score} 分
          </div>
          <div className="result-percentage">
            占有欲指数: {testResult.percentage}%
          </div>
          <div className="result-description">
            {testResult.description}
          </div>
          <div className="result-suggestion">
            <strong>💡 建议：</strong> {testResult.suggestion}
          </div>
        </div>

        <div className="result-actions">
          <button className="action-button primary" onClick={handleRestart}>
            🔄 重新测试
          </button>
          <button className="action-button secondary" onClick={() => setCurrentPage('home')}>
            🏠 返回首页
          </button>
        </div>
      </div>
    );
  };

  // 根据当前页面渲染不同内容
  switch (currentPage) {
    case 'home':
      return renderHomePage();
    case 'test':
      return renderTestPage();
    case 'result':
      return renderResultPage();
    default:
      return renderHomePage();
  }
};

// 渲染应用到页面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<LoveTestApp />);