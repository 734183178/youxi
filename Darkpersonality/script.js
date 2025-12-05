const DarkPersonalityAssessment = () => {
  const [currentPage, setCurrentPage] = React.useState('intro');
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showHistory, setShowHistory] = React.useState(false);
  const [historyRecords, setHistoryRecords] = React.useState([]);
  const [quickTestMode, setQuickTestMode] = React.useState(false);
  const [titleClickCount, setTitleClickCount] = React.useState(0);
  const [titleClickTimer, setTitleClickTimer] = React.useState(null);
  const chartRef = React.useRef(null);

  // 10个黑暗人格维度配置
  const dimensions = {
    "马基雅维利主义": {
      name: "马基雅维利主义",
      nameEn: "Machiavellianism",
      icon: "🎭",
      color: "#7C3AED",
      description: "操纵他人、策略性思维、权术导向"
    },
    "自恋": {
      name: "自恋",
      nameEn: "Narcissism",
      icon: "👑",
      color: "#F59E0B",
      description: "自我中心、优越感、需要崇拜"
    },
    "精神病态": {
      name: "精神病态",
      nameEn: "Psychopathy",
      icon: "🎯",
      color: "#DC2626",
      description: "冷酷无情、冲动性、缺乏共情"
    },
    "施虐倾向": {
      name: "施虐倾向",
      nameEn: "Sadism",
      icon: "⚡",
      color: "#B91C1C",
      description: "享受他人痛苦、攻击性行为"
    },
    "利己主义": {
      name: "利己主义",
      nameEn: "Egoism",
      icon: "💎",
      color: "#9333EA",
      description: "极端自私、只顾自身利益"
    },
    "道德推脱": {
      name: "道德推脱",
      nameEn: "Moral Disengagement",
      icon: "🎪",
      color: "#EA580C",
      description: "合理化不道德行为、逃避责任"
    },
    "心理特权感": {
      name: "心理特权感",
      nameEn: "Entitlement",
      icon: "🏆",
      color: "#D97706",
      description: "认为应得特殊待遇、特权思维"
    },
    "恶意": {
      name: "恶意",
      nameEn: "Spitefulness",
      icon: "🗡️",
      color: "#991B1B",
      description: "主动伤害他人、报复心理"
    },
    "自我为中心": {
      name: "自我为中心",
      nameEn: "Self-Centeredness",
      icon: "🌟",
      color: "#A855F7",
      description: "缺乏对他人的关注和共情"
    },
    "怨恨": {
      name: "怨恨",
      nameEn: "Resentment",
      icon: "⚔️",
      color: "#7C2D12",
      description: "对他人和世界的敌意态度"
    }
  };

  // 50道题目 - 每个维度5题
  const questions = [
    // 马基雅维利主义 (1-5)
    { id: 1, text: "为了达成重要目标，必要时可以欺骗他人", dimension: "马基雅维利主义" },
    { id: 2, text: "我善于察言观色，利用他人的弱点", dimension: "马基雅维利主义" },
    { id: 3, text: "在竞争中，策略比道德更重要", dimension: "马基雅维利主义" },
    { id: 4, text: "我擅长操纵局面，让事情按我的意愿发展", dimension: "马基雅维利主义" },
    { id: 5, text: "只要不被发现，违反规则也无妨", dimension: "马基雅维利主义" },

    // 自恋 (6-10)
    { id: 6, text: "我比大多数人更有才华和能力", dimension: "自恋" },
    { id: 7, text: "我喜欢成为众人关注的焦点", dimension: "自恋" },
    { id: 8, text: "我的成就应该得到更多的认可", dimension: "自恋" },
    { id: 9, text: "我对自己的外表和形象非常自信", dimension: "自恋" },
    { id: 10, text: "别人应该更多地尊重和崇拜我", dimension: "自恋" },

    // 精神病态 (11-15)
    { id: 11, text: "我很少为自己的行为感到内疚或后悔", dimension: "精神病态" },
    { id: 12, text: "我喜欢冒险和刺激性的活动", dimension: "精神病态" },
    { id: 13, text: "别人的痛苦很难引起我的情感共鸣", dimension: "精神病态" },
    { id: 14, text: "我经常凭冲动做决定，不考虑后果", dimension: "精神病态" },
    { id: 15, text: "在压力下，我能保持冷静和理性", dimension: "精神病态" },

    // 施虐倾向 (16-20)
    { id: 16, text: "看到别人尴尬或出丑时，我会觉得有趣", dimension: "施虐倾向" },
    { id: 17, text: "我享受在游戏或竞争中完全压制对手", dimension: "施虐倾向" },
    { id: 18, text: "惩罚冒犯我的人会让我感到满足", dimension: "施虐倾向" },
    { id: 19, text: "我有时想看到某些人受到教训", dimension: "施虐倾向" },
    { id: 20, text: "在辩论中让对方哑口无言会让我感到愉悦", dimension: "施虐倾向" },

    // 利己主义 (21-25)
    { id: 21, text: "我的需求和利益永远是第一位的", dimension: "利己主义" },
    { id: 22, text: "如果帮助别人会损害我的利益，我会拒绝", dimension: "利己主义" },
    { id: 23, text: "每个人都应该优先考虑自己", dimension: "利己主义" },
    { id: 24, text: "我很少为了他人而牺牲自己的时间或资源", dimension: "利己主义" },
    { id: 25, text: "在分配资源时，我会确保自己得到最多", dimension: "利己主义" },

    // 道德推脱 (26-30)
    { id: 26, text: "只要是为了正当目的，手段并不重要", dimension: "道德推脱" },
    { id: 27, text: "有时环境会迫使人做出不道德的选择", dimension: "道德推脱" },
    { id: 28, text: "如果大家都在做，那就不算错", dimension: "道德推脱" },
    { id: 29, text: "我的不当行为往往是别人逼出来的", dimension: "道德推脱" },
    { id: 30, text: "与更大的恶相比，我的小过失不值一提", dimension: "道德推脱" },

    // 心理特权感 (31-35)
    { id: 31, text: "我应该得到特殊待遇和优先权", dimension: "心理特权感" },
    { id: 32, text: "规则对我来说应该更灵活一些", dimension: "心理特权感" },
    { id: 33, text: "我不应该像其他人一样排队等待", dimension: "心理特权感" },
    { id: 34, text: "我期望别人满足我的需求", dimension: "心理特权感" },
    { id: 35, text: "平凡的标准不适用于我", dimension: "心理特权感" },

    // 恶意 (36-40)
    { id: 36, text: "如果有人伤害了我，我会想办法报复", dimension: "恶意" },
    { id: 37, text: "我享受让欺负过我的人尝到苦头", dimension: "恶意" },
    { id: 38, text: "即使损害自己，我也要确保敌人更惨", dimension: "恶意" },
    { id: 39, text: "有机会的话，我会给冒犯我的人制造麻烦", dimension: "恶意" },
    { id: 40, text: "我会记住每一个对我不好的人", dimension: "恶意" },

    // 自我为中心 (41-45)
    { id: 41, text: "我很难真正关心别人的感受", dimension: "自我为中心" },
    { id: 42, text: "谈话时，我更喜欢谈论自己", dimension: "自我为中心" },
    { id: 43, text: "别人的问题与我无关", dimension: "自我为中心" },
    { id: 44, text: "我很少主动询问他人的近况", dimension: "自我为中心" },
    { id: 45, text: "我对他人的困境不太感兴趣", dimension: "自我为中心" },

    // 怨恨 (46-50)
    { id: 46, text: "这个世界对我是不公平的", dimension: "怨恨" },
    { id: 47, text: "我对那些比我成功的人感到不满", dimension: "怨恨" },
    { id: 48, text: "人们总是在占我的便宜", dimension: "怨恨" },
    { id: 49, text: "我经常对社会和制度感到愤怒", dimension: "怨恨" },
    { id: 50, text: "我觉得自己没有得到应得的认可", dimension: "怨恨" }
  ];

  // 评分选项
  const options = [
    { value: 1, label: 'A', text: '完全不符合' },
    { value: 2, label: 'B', text: '不太符合' },
    { value: 3, label: 'C', text: '中立' },
    { value: 4, label: 'D', text: '比较符合' },
    { value: 5, label: 'E', text: '非常符合' }
  ];

  // 人格类型定义
  const personalityTypes = {
    "黑暗君王": {
      icon: "👑",
      dimensions: ["马基雅维利主义", "自恋", "精神病态"],
      description: "三维俱高，具有强大的暗黑人格特质",
      careers: ["高层管理", "政治家", "投资人", "战略顾问"],
      color: "from-purple-600 to-red-600"
    },
    "策略大师": {
      icon: "🎭",
      dimensions: ["马基雅维利主义", "道德推脱", "心理特权感"],
      description: "善于策略和操纵，追求目标不择手段",
      careers: ["商业谈判", "公关顾问", "政治策略师"],
      color: "from-purple-500 to-indigo-600"
    },
    "自恋领袖": {
      icon: "🌟",
      dimensions: ["自恋", "心理特权感", "自我为中心"],
      description: "极度自信和自我中心，追求关注和崇拜",
      careers: ["企业CEO", "演艺人员", "社交媒体达人"],
      color: "from-yellow-500 to-orange-500"
    },
    "冷酷执行者": {
      icon: "🎯",
      dimensions: ["精神病态", "施虐倾向", "恶意"],
      description: "缺乏共情，行事果断冷酷",
      careers: ["外科医生", "特种部队", "危机处理"],
      color: "from-red-600 to-gray-800"
    },
    "利己主义者": {
      icon: "💎",
      dimensions: ["利己主义", "心理特权感", "自我为中心"],
      description: "极端自私，只关注自身利益",
      careers: ["投资交易", "独立创业"],
      color: "from-purple-500 to-pink-500"
    }
  };

  // 核心逻辑函数
  const loadHistory = () => {
    try {
      const records = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('dark_personality_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              records.push(JSON.parse(data));
            }
          } catch (e) {
            console.log('读取记录失败:', key);
          }
        }
      }
      records.sort((a, b) => b.timestamp - a.timestamp);
      setHistoryRecords(records);
    } catch (error) {
      console.log('历史记录功能暂不可用:', error);
    }
  };

  const handleStartTest = () => {
    setCurrentPage('test');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleTitleClick = () => {
    const now = Date.now();
    if (titleClickTimer) {
      clearTimeout(titleClickTimer);
    }
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    if (newCount >= 5) {
      setQuickTestMode(true);
      setTitleClickCount(0);
      alert('🚀 快速测试模式已激活！');
    } else {
      const timer = setTimeout(() => {
        setTitleClickCount(0);
      }, 10000);
      setTitleClickTimer(timer);
    }
  };

  const handleQuickTest = () => {
    if (!window.confirm('确定要进行快速测试吗？系统将自动随机填充所有答案。')) {
      return;
    }
    const randomAnswers = {};
    questions.forEach(q => {
      randomAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });
    setAnswers(randomAnswers);
    saveResult(randomAnswers);
    setCurrentPage('result');
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveResult(newAnswers);
      setCurrentPage('result');
    }
  };

  const saveResult = (finalAnswers) => {
    const results = calculateResults(finalAnswers);
    const record = {
      timestamp: Date.now(),
      answers: finalAnswers,
      results: results
    };
    try {
      localStorage.setItem(
        `dark_personality_${Date.now()}`,
        JSON.stringify(record)
      );
      loadHistory();
    } catch (error) {
      console.log('保存失败:', error);
    }
  };

  const calculateResults = (finalAnswers = answers) => {
    const dimensionScores = {};
    Object.keys(dimensions).forEach(dim => {
      dimensionScores[dim] = 0;
    });
    questions.forEach(q => {
      const score = finalAnswers[q.id] || 0;
      dimensionScores[q.dimension] += score;
    });
    const dimensionAvgScores = {};
    Object.keys(dimensions).forEach(dim => {
      dimensionAvgScores[dim] = (dimensionScores[dim] / 5).toFixed(2);
    });
    const dScore = (Object.values(dimensionAvgScores)
      .reduce((sum, score) => sum + parseFloat(score), 0) / 10).toFixed(2);
    const sortedDimensions = Object.entries(dimensionAvgScores)
      .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a));
    const topDimensions = sortedDimensions.slice(0, 3);
    const personalityType = determinePersonalityType(sortedDimensions, dScore);
    return {
      dimensionScores,
      dimensionAvgScores,
      topDimensions,
      dScore,
      personalityType,
      percentile: calculatePercentile(dScore)
    };
  };

  const determinePersonalityType = (sortedDimensions, dScore) => {
    const top3Names = sortedDimensions.slice(0, 3).map(([name]) => name);
    const dScoreNum = parseFloat(dScore);
    if (dScoreNum >= 4.0) {
      return "黑暗君王";
    }
    for (const [typeName, typeInfo] of Object.entries(personalityTypes)) {
      if (typeInfo.dimensions && typeInfo.dimensions.length > 0) {
        const matchCount = typeInfo.dimensions.filter(dim =>
          top3Names.includes(dim)
        ).length;
        if (matchCount >= 2) {
          return typeName;
        }
      }
    }
    if (dScoreNum >= 3.5) {
      return "高暗黑特质";
    } else if (dScoreNum >= 2.5) {
      return "中等暗黑特质";
    } else {
      return "低暗黑特质";
    }
  };

  const calculatePercentile = (dScore) => {
    const score = parseFloat(dScore);
    const mean = 2.5;
    const sd = 0.8;
    const z = (score - mean) / sd;
    let percentile = 50 + (z * 34);
    percentile = Math.max(0, Math.min(100, percentile));
    return Math.round(percentile);
  };

  // 图表初始化
  React.useEffect(() => {
    if (currentPage === 'result' && chartRef.current && typeof Chart !== 'undefined') {
      const results = calculateResults();
      const ctx = chartRef.current.getContext('2d');

      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      const dimensionNames = Object.keys(dimensions);
      const chartData = dimensionNames.map(dim =>
        parseFloat(results.dimensionAvgScores[dim])
      );

      const colors = dimensionNames.map(dim => dimensions[dim].color);

      try {
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: dimensionNames,
            datasets: [{
              label: '您的得分',
              data: chartData,
              borderColor: 'rgba(139, 92, 246, 1)',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              pointBackgroundColor: colors,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors,
              pointRadius: 6,
              pointHoverRadius: 8,
              borderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1,
                  color: '#9ca3af',
                  backdropColor: 'transparent',
                  font: {
                    size: 12
                  }
                },
                pointLabels: {
                  color: '#d1d5db',
                  font: {
                    size: 11,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(156, 163, 175, 0.2)'
                },
                angleLines: {
                  color: 'rgba(156, 163, 175, 0.2)'
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.parsed.r.toFixed(2)} 分`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.log('图表创建失败:', error);
      }
    }
  }, [currentPage, answers]);

  React.useEffect(() => {
    loadHistory();
  }, []);

  // 渲染组件
  const renderIntro = () => (
    React.createElement('div', { className: "min-h-screen dark-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-5xl mx-auto w-full" },
        !showHistory ? React.createElement(React.Fragment, null,
          React.createElement('div', { className: "flex items-center justify-center min-h-[70vh]" },
            React.createElement('div', { className: "w-full" },
              React.createElement('div', { className: "text-center mb-4 sm:mb-8" },
                React.createElement('div', { className: "inline-block mb-3 sm:mb-6" },
                  React.createElement('div', { className: "text-5xl sm:text-8xl mb-2 sm:mb-4 animate-pulse" }, '🌑'),
                  React.createElement('div', { className: "h-1 w-20 sm:w-24 mx-auto bg-gradient-to-r from-purple-600 via-red-600 to-purple-600 rounded-full" })
                ),
                React.createElement('h1', {
                  className: "text-2xl sm:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent leading-relaxed cursor-pointer select-none",
                  onClick: handleTitleClick
                },
                  '黑暗人格特质测评'
                ),
                React.createElement('p', { className: "text-base sm:text-xl text-gray-300 mb-1 sm:mb-2" }, 'Dark Personality Assessment'),
                React.createElement('p', { className: "text-xs sm:text-base text-gray-400" },
                  '基于黑暗十因子理论 · 科学评估人格暗面特质'
                )
              ),
              React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-10 mb-4 sm:mb-8 neon-border purple-glow" },
                React.createElement('div', { className: "mb-4 block sm:hidden" },
                  React.createElement('div', { className: "text-center text-gray-300 text-sm leading-relaxed" },
                    React.createElement('p', { className: "mb-2" },
                      React.createElement('strong', { className: "text-purple-400" }, '基于黑暗十因子模型')
                    ),
                    React.createElement('p', { className: "text-xs text-gray-400" },
                      '50题 · 10维度 · 约8分钟 · 本地存储'
                    )
                  )
                ),
                React.createElement('div', { className: "bg-red-900 bg-opacity-20 border border-red-500 rounded-lg sm:rounded-xl p-3 sm:p-5 mb-0 sm:mb-6" },
                  React.createElement('h3', { className: "text-base sm:text-lg font-bold mb-2 sm:mb-3 text-red-300 flex items-center" },
                    React.createElement('span', { className: "mr-2" }, '⚠️'),
                    '重要声明'
                  ),
                  React.createElement('ul', { className: "space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm" },
                    React.createElement('li', null, '• 本测评仅用于自我认知和心理学研究，不构成任何诊断'),
                    React.createElement('li', { className: "hidden sm:block" }, '• 得分高低不代表好坏，每个人都有独特的人格特征'),
                    React.createElement('li', { className: "hidden sm:block" }, '• 黑暗特质在特定情境下可能是优势（如领导力、决断力）'),
                    React.createElement('li', { className: "hidden sm:block" }, '• 如感到困扰，建议寻求专业心理咨询')
                  )
                )
              ),
              React.createElement('div', { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-4 sm:mb-6" },
                React.createElement('button', {
                  onClick: handleStartTest,
                  className: "w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 flex items-center justify-center space-x-2"
                },
                  React.createElement('span', null, '🚀'),
                  React.createElement('span', null, '开始测评 (50题)')
                ),
                quickTestMode && React.createElement('button', {
                  onClick: handleQuickTest,
                  className: "w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 flex items-center justify-center space-x-2"
                },
                  React.createElement('span', null, '⚡'),
                  React.createElement('span', null, '快速测试')
                ),
                historyRecords.length > 0 && React.createElement('button', {
                  onClick: () => setShowHistory(!showHistory),
                  className: "w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 sm:py-5 px-8 sm:px-10 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-600 text-sm sm:text-base"
                },
                  React.createElement('span', null, '📊'),
                  React.createElement('span', null, `历史记录 (${historyRecords.length})`)
                )
              )
            )
          )
        ) : React.createElement(React.Fragment, null,
          React.createElement('div', { className: "mb-4" },
            React.createElement('button', {
              onClick: () => setShowHistory(false),
              className: "w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-600 text-sm sm:text-base"
            },
              React.createElement('span', null, '←'),
              React.createElement('span', null, '返回首页')
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 neon-border purple-glow mb-4" },
            React.createElement('h2', { className: "text-2xl sm:text-4xl font-bold mb-6 text-white flex items-center" },
              React.createElement('span', { className: "mr-3" }, '📊'),
              '历史记录'
            ),
            React.createElement('div', { className: "space-y-4" },
              historyRecords.length > 0 ? historyRecords.map((record, idx) => {
                const recordDate = new Date(record.timestamp);
                const dateStr = recordDate.toLocaleString('zh-CN');
                const recordResults = record.results || calculateResults(record.answers);
                return React.createElement('div', {
                  key: record.timestamp,
                  className: "bg-gray-800 bg-opacity-50 rounded-lg p-4 sm:p-6 border border-gray-700 hover:border-purple-600 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/20"
                },
                  React.createElement('div', { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3" },
                    React.createElement('div', null,
                      React.createElement('div', { className: "text-base sm:text-lg font-semibold text-white" },
                        `记录 ${historyRecords.length - idx}`
                      ),
                      React.createElement('div', { className: "text-xs sm:text-sm text-gray-400" },
                        dateStr
                      )
                    ),
                    React.createElement('div', { className: "mt-2 sm:mt-0 text-right" },
                      React.createElement('div', {
                        className: "text-2xl sm:text-3xl font-bold",
                        style: { color: '#8B5CF6' }
                      },
                        recordResults.dScore
                      ),
                      React.createElement('div', { className: "text-xs text-gray-400" },
                        `百分位: ${recordResults.percentile}%`
                      )
                    )
                  ),
                  React.createElement('div', { className: "flex flex-wrap gap-2 items-center" },
                    React.createElement('span', { className: "inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-900 to-purple-800 text-purple-200 border border-purple-600" },
                      recordResults.personalityType || '计算中...'
                    ),
                    React.createElement('span', { className: "text-gray-400 text-xs" }, '·'),
                    recordResults.topDimensions && recordResults.topDimensions.slice(0, 3).map(([dim, score]) =>
                      React.createElement('span', {
                        key: dim,
                        className: "text-xs text-gray-300 bg-gray-700 px-2 py-1 rounded"
                      },
                        `${dim}: ${score}`)
                    )
                  )
                );
              }) : React.createElement('div', { className: "text-center py-12" },
                React.createElement('div', { className: "text-5xl mb-4" }, '📭'),
                React.createElement('p', { className: "text-gray-400 text-lg" },
                  '暂无历史记录'
                )
              )
            )
          )
        )
      )
    )
  );

  const renderTest = () => {
    const currentQ = questions[currentQuestion];
    const dimInfo = dimensions[currentQ.dimension];
    const progress = ((currentQuestion + 1) / questions.length * 100).toFixed(1);

    return (
      React.createElement('div', { className: "min-h-screen dark-gradient p-3 sm:p-6" },
        React.createElement('div', { className: "max-w-3xl mx-auto" },
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 neon-border" },
            React.createElement('div', { className: "flex items-center justify-between mb-6" },
              React.createElement('div', { className: "flex items-center space-x-3" },
                React.createElement('span', { className: "text-4xl" }, dimInfo.icon),
                React.createElement('div', null,
                  React.createElement('div', { className: "text-white font-bold text-lg sm:text-xl" },
                    dimInfo.name
                  ),
                  React.createElement('div', { className: "text-gray-400 text-xs sm:text-sm" },
                    dimInfo.nameEn
                  )
                )
              ),
              React.createElement('div', { className: "text-right" },
                React.createElement('div', {
                  className: "text-2xl sm:text-3xl font-bold mb-1",
                  style: { color: dimInfo.color }
                },
                  `${currentQuestion + 1} / 50`
                ),
                React.createElement('div', { className: "text-xs text-gray-400" },
                  `第 ${Math.floor(currentQuestion / 5) + 1} 维度`
                )
              )
            ),
            React.createElement('div', { className: "mb-4" },
              React.createElement('div', { className: "w-full bg-gray-700 rounded-full h-3 overflow-hidden" },
                React.createElement('div', {
                  className: "h-3 rounded-full transition-all duration-500 ease-out relative",
                  style: {
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${dimInfo.color}, ${dimInfo.color}dd)`
                  }
                },
                React.createElement('div', { className: "absolute inset-0 bg-white opacity-20 animate-pulse" })
              ),
              React.createElement('div', { className: "flex justify-between items-center mt-2 text-xs sm:text-sm" },
                React.createElement('span', { className: "text-gray-400" }, `${progress}% 完成`),
                React.createElement('span', { className: "text-gray-400" }, `剩余 ${50 - currentQuestion - 1} 题`)
              )
            ),
            React.createElement('div', { className: "bg-gray-800 bg-opacity-50 rounded-lg p-3 border border-gray-700" },
              React.createElement('div', { className: "text-gray-300 text-xs sm:text-sm" },
                React.createElement('span', { className: "text-purple-400 font-semibold" }, '当前评估：'),
                dimInfo.description
              )
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-6 sm:p-10 mb-6 neon-border purple-glow" },
            React.createElement('div', { className: "mb-10" },
              React.createElement('div', { className: "text-center mb-4" },
                React.createElement('span', {
                  className: "inline-block px-4 py-2 rounded-full text-xs font-semibold",
                  style: {
                    backgroundColor: dimInfo.color + '20',
                    color: dimInfo.color,
                    border: `1px solid ${dimInfo.color}40`
                  }
                },
                  `题目 ${currentQ.id}`
                )
              ),
              React.createElement('h3', { className: "text-xl sm:text-2xl lg:text-3xl font-medium text-white text-center leading-relaxed px-2 min-h-[80px] flex items-center justify-center" },
                currentQ.text
              )
            ),
            React.createElement('div', { className: "space-y-3 sm:space-y-4" },
              options.map(option => {
                const isSelected = answers[currentQ.id] === option.value;
                return React.createElement('button', {
                  key: option.value,
                  onClick: () => handleAnswer(option.value),
                  className: `answer-option w-full text-left p-4 sm:p-5 border-2 rounded-xl transition-all duration-200 ${isSelected ? 'border-opacity-100 shadow-lg' : 'border-gray-700 hover:border-gray-600'}`,
                  style: {
                    borderColor: isSelected ? dimInfo.color : undefined,
                    backgroundColor: isSelected ? `${dimInfo.color}15` : 'rgba(31, 41, 55, 0.5)',
                    boxShadow: isSelected ? `0 0 20px ${dimInfo.color}40` : undefined
                  }
                },
                  React.createElement('div', { className: "flex items-center" },
                    React.createElement('div', {
                      className: "font-bold text-lg sm:text-xl w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 transition-all",
                      style: {
                        backgroundColor: isSelected ? dimInfo.color : `${dimInfo.color}30`,
                        color: isSelected ? 'white' : dimInfo.color,
                        border: `2px solid ${isSelected ? dimInfo.color : `${dimInfo.color}60`}`
                      }
                    },
                      option.label
                    ),
                    React.createElement('div', null,
                      React.createElement('div', { className: "text-base sm:text-lg text-white font-medium mb-1" },
                        option.text
                      ),
                      React.createElement('div', { className: "text-xs text-gray-400" },
                        option.value === 1 && '我完全不是这样的',
                        option.value === 2 && '我不太认同这个描述',
                        option.value === 3 && '说不准/有时是有时不是',
                        option.value === 4 && '我比较认同这个描述',
                        option.value === 5 && '这非常符合我的情况'
                      )
                    )
                  )
                );
              })
            )
          ),
          React.createElement('div', { className: "flex justify-between items-center" },
            currentQuestion > 0 ? React.createElement('button', {
              onClick: () => setCurrentQuestion(currentQuestion - 1),
              className: "bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 border border-gray-600"
            },
              React.createElement('span', null, '←'),
              React.createElement('span', null, '上一题')
            ) : React.createElement('button', {
              onClick: () => {
                if (window.confirm('确定要退出测评吗？当前进度将不会保存。')) {
                  setCurrentPage('intro');
                  setAnswers({});
                }
              },
              className: "bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 border border-gray-600"
            },
              React.createElement('span', null, '✕'),
              React.createElement('span', null, '退出')
            ),
            React.createElement('div', { className: "text-right" },
              answers[currentQ.id] ? React.createElement('div', { className: "text-green-400 text-sm flex items-center space-x-2" },
                React.createElement('span', null, '✓'),
                React.createElement('span', null, '已作答')
              ) : React.createElement('div', { className: "text-gray-500 text-sm" },
                React.createElement('span', null, '请选择答案')
              )
            )
          )
        )
      )
    );
  };

  const renderResult = () => {
    let finalAnswers = answers;
    if (Object.keys(finalAnswers).length === 0) {
      try {
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('dark_personality_')) {
            const data = localStorage.getItem(key);
            if (data) {
              records.push(JSON.parse(data));
            }
          }
        }
        records.sort((a, b) => b.timestamp - a.timestamp);
        if (records.length > 0) {
          finalAnswers = records[0].answers;
        }
      } catch (error) {
        console.log('读取历史答案失败:', error);
      }
    }

    const results = calculateResults(finalAnswers);
    const typeInfo = personalityTypes[results.personalityType] || {
      icon: "🌑",
      description: "您的人格特征独特",
      careers: ["多元发展"],
      color: "from-gray-700 to-gray-900"
    };

    const generateShareText = (results, typeInfo) => {
      return `🌑 黑暗人格特质测评结果

【人格类型】${results.personalityType} ${typeInfo.icon}
${typeInfo.description}

【核心数据】
• D值总分：${results.dScore} / 5.0
• 百分位：${results.percentile}%

【突出特质 TOP3】
${results.topDimensions.map(([dim, score], idx) =>
    `${idx + 1}. ${dimensions[dim].icon} ${dim} - ${score}分`
  ).join('\n')}

【适合领域】
${typeInfo.careers.slice(0, 3).join(' · ')}

---
💡 了解人格暗面，探索真实自我
⚠️ 测评结果仅供参考，不构成诊断

#黑暗人格 #心理测评 #自我认知`;
    };

    return (
      React.createElement('div', { className: "min-h-screen dark-gradient p-3 sm:p-6" },
        React.createElement('div', { className: "max-w-7xl mx-auto" },
          React.createElement('div', {
            className: `bg-gradient-to-r ${typeInfo.color} rounded-2xl p-8 sm:p-12 mb-8 text-white shadow-2xl neon-border`
          },
            React.createElement('div', { className: "text-center" },
              React.createElement('div', { className: "text-7xl sm:text-9xl mb-6 animate-pulse" }, typeInfo.icon),
              React.createElement('h2', { className: "text-3xl sm:text-5xl font-bold mb-4" },
                results.personalityType
              ),
              React.createElement('p', { className: "text-lg sm:text-2xl mb-6 opacity-90" },
                typeInfo.description
              ),
              React.createElement('div', { className: "flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-6" },
                React.createElement('div', { className: "bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm min-w-[200px]" },
                  React.createElement('div', { className: "text-sm opacity-80 mb-2" }, 'D值总分'),
                  React.createElement('div', { className: "text-5xl font-bold" }, results.dScore),
                  React.createElement('div', { className: "text-xs opacity-70 mt-1" }, '满分 5.0')
                ),
                React.createElement('div', { className: "bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm min-w-[200px]" },
                  React.createElement('div', { className: "text-sm opacity-80 mb-2" }, '百分位排名'),
                  React.createElement('div', { className: "text-5xl font-bold" }, `${results.percentile}%`),
                  React.createElement('div', { className: "text-xs opacity-70 mt-1" }, `超过 ${results.percentile}% 的人`)
                )
              )
            )
          ),
          React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center items-center mb-8" },
            React.createElement('button', {
              onClick: () => {
                const text = generateShareText(results, typeInfo);
                navigator.clipboard.writeText(text).then(() => {
                  alert('✅ 结果已复制到剪贴板！');
                }).catch(() => {
                  alert('❌ 复制失败，请手动复制');
                });
              },
              className: "w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-green-500/50 flex items-center justify-center space-x-2"
            },
              React.createElement('span', null, '📋'),
              React.createElement('span', null, '复制结果')
            ),
            React.createElement('button', {
              onClick: () => {
                setCurrentPage('intro');
                setCurrentQuestion(0);
                setAnswers({});
              },
              className: "w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 flex items-center justify-center space-x-2"
            },
              React.createElement('span', null, '🔄'),
              React.createElement('span', null, '重新测评')
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-8 neon-border" },
            React.createElement('h3', { className: "text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center" },
              React.createElement('span', { className: "mr-3" }, '📊'),
              '人格维度雷达图'
            ),
            React.createElement('div', { className: "w-full h-[400px] sm:h-[500px]" },
              React.createElement('canvas', { ref: chartRef })
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-8 neon-border" },
            React.createElement('h3', { className: "text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center" },
              React.createElement('span', { className: "mr-3" }, '🎯'),
              '突出特质 TOP3'
            ),
            React.createElement('div', { className: "space-y-6" },
              results.topDimensions.map(([dimName, score], idx) => {
                const dimInfo = dimensions[dimName];
                const percentage = (parseFloat(score) / 5 * 100).toFixed(0);
                return React.createElement('div', {
                  key: dimName,
                  className: "dimension-card rounded-xl p-5 border-2 border-gray-700"
                },
                  React.createElement('div', { className: "flex items-center justify-between mb-3" },
                    React.createElement('div', { className: "flex items-center space-x-3" },
                      React.createElement('div', {
                        className: "text-4xl sm:text-5xl flex-shrink-0"
                      },
                        dimInfo.icon
                      ),
                      React.createElement('div', null,
                        React.createElement('div', { className: "text-lg sm:text-xl font-bold text-white" },
                          `${idx + 1}. ${dimName}`
                        ),
                        React.createElement('div', { className: "text-sm text-gray-400" },
                          dimInfo.nameEn
                        )
                      )
                    ),
                    React.createElement('div', { className: "text-right" },
                      React.createElement('div', {
                        className: "text-3xl sm:text-4xl font-bold",
                        style: { color: dimInfo.color }
                      },
                        score
                      ),
                      React.createElement('div', { className: "text-xs text-gray-400" },
                        '/ 5.0'
                      )
                    )
                  ),
                  React.createElement('div', { className: "mb-3" },
                    React.createElement('div', { className: "w-full bg-gray-700 rounded-full h-3 overflow-hidden" },
                      React.createElement('div', {
                        className: "h-3 rounded-full transition-all duration-1000",
                        style: {
                          width: `${percentage}%`,
                          backgroundColor: dimInfo.color
                        }
                      })
                    )
                  ),
                  React.createElement('p', { className: "text-gray-300 text-sm" },
                    dimInfo.description
                  )
                );
              })
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-8 neon-border" },
            React.createElement('h3', { className: "text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center" },
              React.createElement('span', { className: "mr-3" }, '📈'),
              '全部维度得分'
            ),
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
              Object.entries(results.dimensionAvgScores)
                .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a))
                .map(([dimName, score]) => {
                  const dimInfo = dimensions[dimName];
                  const percentage = (parseFloat(score) / 5 * 100).toFixed(0);
                  return React.createElement('div', {
                    key: dimName,
                    className: "bg-gray-800 bg-opacity-50 rounded-lg p-4 border border-gray-700"
                  },
                    React.createElement('div', { className: "flex items-center justify-between mb-2" },
                      React.createElement('div', { className: "flex items-center space-x-2" },
                        React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                        React.createElement('span', { className: "text-white font-semibold text-sm" },
                          dimName
                        )
                      ),
                      React.createElement('span', {
                        className: "text-xl font-bold",
                        style: { color: dimInfo.color }
                      },
                        score
                      )
                    ),
                    React.createElement('div', { className: "w-full bg-gray-700 rounded-full h-2 overflow-hidden" },
                      React.createElement('div', {
                        className: "h-2 rounded-full transition-all duration-1000",
                        style: {
                          width: `${percentage}%`,
                          backgroundColor: dimInfo.color
                        }
                      })
                    )
                  );
                })
            )
          ),
          typeInfo.careers && React.createElement('div', { className: "bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-8 neon-border" },
            React.createElement('h3', { className: "text-2xl sm:text-3xl font-bold mb-6 text-white flex items-center" },
              React.createElement('span', { className: "mr-3" }, '💼'),
              '适合发展领域'
            ),
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" },
              typeInfo.careers.map((career, idx) =>
                React.createElement('div', {
                  key: idx,
                  className: "bg-gradient-to-br from-purple-900 to-purple-800 bg-opacity-30 rounded-lg p-4 border border-purple-600 border-opacity-30 text-center"
                },
                  React.createElement('div', { className: "text-lg font-semibold text-purple-300" },
                    career
                  )
                )
              )
            )
          )
        )
      )
    );
  };

  // 主渲染函数
  switch (currentPage) {
    case 'intro':
      return renderIntro();
    case 'test':
      return renderTest();
    case 'result':
      return renderResult();
    default:
      return renderIntro();
  }
};

// 渲染应用到页面
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(DarkPersonalityAssessment));