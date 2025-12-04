const TalentAssessment = () => {
  const [currentPage, setCurrentPage] = React.useState('intro');
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [showHistory, setShowHistory] = React.useState(false);
  const [historyRecords, setHistoryRecords] = React.useState([]);
  const chartRef = React.useRef(null);

  // 隐藏功能：快速测试
  const [titleClickCount, setTitleClickCount] = React.useState(0);
  const [clickTime, setClickTime] = React.useState(null);
  const [showQuickTest, setShowQuickTest] = React.useState(false);

  // 10个维度配置
  const dimensions = {
    "语言表达": {
      name: "语言表达",
      icon: "💬",
      color: "#FF6B9D",
      description: "说话、写作、表达能力"
    },
    "逻辑思维": {
      name: "逻辑思维",
      icon: "🧮",
      color: "#FFA726",
      description: "数学、推理、分析能力"
    },
    "空间想象": {
      name: "空间想象",
      icon: "🎨",
      color: "#FFEB3B",
      description: "方向感、绘画、设计能力"
    },
    "自我认知": {
      name: "自我认知",
      icon: "🧘",
      color: "#9C27B0",
      description: "了解自己、情绪管理"
    },
    "人际交往": {
      name: "人际交往",
      icon: "🤝",
      color: "#FF5722",
      description: "社交、共情、领导力"
    },
    "运动协调": {
      name: "运动协调",
      icon: "🏃",
      color: "#4CAF50",
      description: "动手、运动、身体控制"
    },
    "音乐节奏": {
      name: "音乐节奏",
      icon: "🎵",
      color: "#00BCD4",
      description: "乐感、节奏、声音敏感"
    },
    "自然观察": {
      name: "自然观察",
      icon: "🌿",
      color: "#8BC34A",
      description: "动植物、环境、观察力"
    },
    "创意创新": {
      name: "创意创新",
      icon: "✨",
      color: "#E91E63",
      description: "想象力、原创、突破"
    },
    "审美感知": {
      name: "审美感知",
      icon: "🎭",
      color: "#673AB7",
      description: "美感、鉴赏、艺术品味"
    }
  };

  // 50道题目
  const questions = [
    // 语言表达 (1-5)
    { id: 1, text: "我能清晰地向他人解释复杂的概念", dimension: "语言表达" },
    { id: 2, text: "我喜欢通过写作来表达自己的想法", dimension: "语言表达" },
    { id: 3, text: "在聊天或演讲时，我总能找到合适的词汇", dimension: "语言表达" },
    { id: 4, text: "我擅长讲故事，能吸引听众的注意力", dimension: "语言表达" },
    { id: 5, text: "我能快速理解并记住新学的词汇或术语", dimension: "语言表达" },

    // 逻辑思维 (6-10)
    { id: 6, text: "我喜欢解决数学题或逻辑谜题", dimension: "逻辑思维" },
    { id: 7, text: "我能快速发现事物之间的规律和联系", dimension: "逻辑思维" },
    { id: 8, text: "做决策时，我习惯分析利弊后再行动", dimension: "逻辑思维" },
    { id: 9, text: "我擅长用数据和事实来支持自己的观点", dimension: "逻辑思维" },
    { id: 10, text: "我能轻松理解复杂的图表和统计数据", dimension: "逻辑思维" },

    // 空间想象 (11-15)
    { id: 11, text: "我能在脑海中轻松想象三维物体的样子", dimension: "空间想象" },
    { id: 12, text: "我的方向感很好，不容易迷路", dimension: "空间想象" },
    { id: 13, text: "我喜欢画画、设计或手工制作", dimension: "空间想象" },
    { id: 14, text: "我能快速判断物品的尺寸和距离", dimension: "空间想象" },
    { id: 15, text: "我擅长通过视觉方式（图表、思维导图）整理信息", dimension: "空间想象" },

    // 自我认知 (16-20)
    { id: 16, text: "我经常反思自己的行为和想法", dimension: "自我认知" },
    { id: 17, text: "我清楚地知道自己的优点和缺点", dimension: "自我认知" },
    { id: 18, text: "我能准确识别自己的情绪状态", dimension: "自我认知" },
    { id: 19, text: "我喜欢独处，并从中获得能量", dimension: "自我认知" },
    { id: 20, text: "我对自己的人生有清晰的目标和规划", dimension: "自我认知" },

    // 人际交往 (21-25)
    { id: 21, text: "我能快速与陌生人建立友好关系", dimension: "人际交往" },
    { id: 22, text: "我能敏锐地感知他人的情绪变化", dimension: "人际交往" },
    { id: 23, text: "我喜欢团队合作，擅长协调不同意见", dimension: "人际交往" },
    { id: 24, text: "朋友们经常向我倾诉或寻求建议", dimension: "人际交往" },
    { id: 25, text: "我能轻松地在不同社交场合中应对自如", dimension: "人际交往" },

    // 运动协调 (26-30)
    { id: 26, text: "我的手眼协调能力很好（如打球、开车）", dimension: "运动协调" },
    { id: 27, text: "我喜欢通过运动或舞蹈来表达自己", dimension: "运动协调" },
    { id: 28, text: "我能快速学会新的体育技能或动作", dimension: "运动协调" },
    { id: 29, text: "我喜欢动手制作或修理东西", dimension: "运动协调" },
    { id: 30, text: "我习惯用肢体语言来辅助表达", dimension: "运动协调" },

    // 音乐节奏 (31-35)
    { id: 31, text: "我能轻松记住歌曲的旋律", dimension: "音乐节奏" },
    { id: 32, text: "我对音高和音调的变化很敏感", dimension: "音乐节奏" },
    { id: 33, text: "我会演奏乐器或热爱唱歌", dimension: "音乐节奏" },
    { id: 34, text: "听到音乐时，我会不自觉地打节拍", dimension: "音乐节奏" },
    { id: 35, text: "我能辨别不同乐器的声音", dimension: "音乐节奏" },

    // 自然观察 (36-40)
    { id: 36, text: "我喜欢观察动植物的生长和变化", dimension: "自然观察" },
    { id: 37, text: "我能准确分辨不同种类的植物或动物", dimension: "自然观察" },
    { id: 38, text: "我关心环境保护和生态平衡", dimension: "自然观察" },
    { id: 39, text: "我喜欢户外活动，如徒步、露营", dimension: "自然观察" },
    { id: 40, text: "我能注意到自然界中细微的变化（如天气、季节）", dimension: "自然观察" },

    // 创意创新 (41-45)
    { id: 41, text: "我经常产生新颖独特的想法", dimension: "创意创新" },
    { id: 42, text: "我喜欢尝试不同的方法来解决问题", dimension: "创意创新" },
    { id: 43, text: "我不害怕打破常规或挑战传统", dimension: "创意创新" },
    { id: 44, text: "我能从日常事物中发现新的可能性", dimension: "创意创新" },
    { id: 45, text: "我擅长头脑风暴和创意思考", dimension: "创意创新" },

    // 审美感知 (46-50)
    { id: 46, text: "我对色彩搭配和视觉美感很敏感", dimension: "审美感知" },
    { id: 47, text: "我喜欢欣赏艺术作品（绘画、雕塑、建筑等）", dimension: "审美感知" },
    { id: 48, text: "我能快速判断设计或作品的好坏", dimension: "审美感知" },
    { id: 49, text: "我注重生活环境的美观和舒适度", dimension: "审美感知" },
    { id: 50, text: "我能从美的事物中获得情感共鸣", dimension: "审美感知" }
  ];

  // 评分选项
  const options = [
    { value: 1, label: 'A', text: '完全不符合' },
    { value: 2, label: 'B', text: '不太符合' },
    { value: 3, label: 'C', text: '一般' },
    { value: 4, label: 'D', text: '比较符合' },
    { value: 5, label: 'E', text: '非常符合' }
  ];

  // 12种天赋类型
  const talentTypes = {
    "艺术创作者": {
      icon: "🎨",
      dimensions: ["创意创新", "审美感知", "空间想象"],
      description: "想象力丰富，美感出众，具有艺术天赋",
      careers: ["设计师", "艺术家", "策展人", "美术指导", "视觉设计师"],
      color: "from-purple-400 to-pink-400"
    },
    "表达大师": {
      icon: "🎭",
      dimensions: ["语言表达", "人际交往", "创意创新"],
      description: "擅长沟通，感染力强，能够影响他人",
      careers: ["主播", "编剧", "营销策划", "公关", "新媒体运营"],
      color: "from-pink-400 to-red-400"
    },
    "理性分析家": {
      icon: "🧠",
      dimensions: ["逻辑思维", "自我认知", "空间想象"],
      description: "思维缜密，独立思考，擅长分析问题",
      careers: ["程序员", "数据分析师", "研究员", "咨询顾问", "产品经理"],
      color: "from-blue-400 to-cyan-400"
    },
    "音乐艺术家": {
      icon: "🎵",
      dimensions: ["音乐节奏", "审美感知", "创意创新"],
      description: "节奏感强，艺术天赋，对声音敏感",
      careers: ["音乐人", "声音设计师", "配音演员", "音乐制作人", "乐器演奏家"],
      color: "from-indigo-400 to-purple-400"
    },
    "自然探索者": {
      icon: "🌿",
      dimensions: ["自然观察", "空间想象", "自我认知"],
      description: "观察力强，热爱自然，关注生态",
      careers: ["生物学家", "旅行博主", "园艺师", "环保工作者", "户外教练"],
      color: "from-green-400 to-emerald-400"
    },
    "行动实干家": {
      icon: "💪",
      dimensions: ["运动协调", "人际交往", "逻辑思维"],
      description: "执行力强，团队协作，注重实践",
      careers: ["运动员", "项目管理", "健身教练", "活动策划", "团队领导"],
      color: "from-orange-400 to-yellow-400"
    },
    "内心导师": {
      icon: "🧘",
      dimensions: ["自我认知", "人际交往", "语言表达"],
      description: "共情力强，善于倾听，能够指导他人",
      careers: ["心理咨询师", "教师", "HR", "生涯规划师", "社工"],
      color: "from-purple-400 to-indigo-400"
    },
    "创新领袖": {
      icon: "🚀",
      dimensions: ["创意创新", "逻辑思维", "人际交往"],
      description: "创造力与执行力兼具，善于领导团队",
      careers: ["创业者", "产品经理", "导演", "创新顾问", "团队管理"],
      color: "from-red-400 to-orange-400"
    },
    "知识传播者": {
      icon: "📚",
      dimensions: ["语言表达", "逻辑思维", "自我认知"],
      description: "逻辑清晰，善于讲解，热爱分享知识",
      careers: ["教师", "作家", "博主", "培训师", "知识IP"],
      color: "from-cyan-400 to-blue-400"
    },
    "全能型选手": {
      icon: "🎬",
      dimensions: [],
      description: "多才多艺，适应力强，可以在多个领域发展",
      careers: ["斜杠青年", "自由职业者", "创意总监", "多元发展"],
      color: "from-pink-400 via-purple-400 to-blue-400"
    },
    "潜力开发型": {
      icon: "🌟",
      dimensions: [],
      description: "可塑性强，还在探索自己的方向",
      careers: ["建议多尝试不同领域", "发现真正的兴趣所在"],
      color: "from-yellow-400 to-green-400"
    },
    "专精型人才": {
      icon: "💎",
      dimensions: [],
      description: "在某个领域天赋异禀，建议深耕",
      careers: ["在优势领域成为专家"],
      color: "from-purple-400 to-pink-400"
    }
  };

  // 处理标题点击 - 激活隐藏功能
  const handleTitleClick = () => {
    const now = Date.now();

    // 如果距离上次点击超过10秒，重置计数
    if (clickTime && now - clickTime > 10000) {
      setTitleClickCount(1);
      setClickTime(now);
    } else {
      const newCount = titleClickCount + 1;
      setTitleClickCount(newCount);
      setClickTime(now);

      // 点击5次后显示隐藏按钮
      if (newCount === 5) {
        setShowQuickTest(true);
        setTitleClickCount(0); // 重置计数
      }
    }
  };

  // 快速测试 - 自动填充答案并显示结果
  const handleQuickTest = () => {
    const quickAnswers = {};
    questions.forEach(q => {
      // 随机生成1-5的答案
      quickAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });

    console.log('快速测试生成的答案:', quickAnswers);

    // 先设置答案到state
    setAnswers(quickAnswers);

    // 保存结果
    saveResult(quickAnswers);

    // 跳转到结果页
    setCurrentPage('result');
  };

  // 加载历史记录
  React.useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const records = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('talent_test_')) {
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
        `talent_test_${Date.now()}`,
        JSON.stringify(record)
      );
      loadHistory();
    } catch (error) {
      console.log('保存失败:', error);
    }
  };

  const calculateResults = (finalAnswers = answers) => {
    console.log('calculateResults 收到的答案:', finalAnswers);
    console.log('答案数量:', Object.keys(finalAnswers).length);

    const dimensionScores = {};

    Object.keys(dimensions).forEach(dim => {
      dimensionScores[dim] = 0;
    });

    questions.forEach(q => {
      const score = finalAnswers[q.id] || 0;
      dimensionScores[q.dimension] += score;
    });

    console.log('维度总分:', dimensionScores);

    const dimensionAvgScores = {};
    Object.keys(dimensions).forEach(dim => {
      dimensionAvgScores[dim] = (dimensionScores[dim] / 5).toFixed(1);
    });

    console.log('维度平均分:', dimensionAvgScores);

    const sortedDimensions = Object.entries(dimensionAvgScores)
      .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a));

    const topDimensions = sortedDimensions.slice(0, 3);
    const talentType = determineTalentType(topDimensions);

    return {
      dimensionScores,
      dimensionAvgScores,
      topDimensions,
      talentType
    };
  };

  const determineTalentType = (topDimensions) => {
    const top3Names = topDimensions.map(([name]) => name);
    const top1Score = parseFloat(topDimensions[0][1]);

    if (top1Score >= 4.5) {
      return "专精型人才";
    }

    const highScoreCount = topDimensions.filter(([, score]) => parseFloat(score) >= 4.0).length;
    if (highScoreCount >= 3) {
      return "全能型选手";
    }

    for (const [typeName, typeInfo] of Object.entries(talentTypes)) {
      if (typeInfo.dimensions && typeInfo.dimensions.length > 0) {
        const matchCount = typeInfo.dimensions.filter(dim =>
          top3Names.includes(dim)
        ).length;

        if (matchCount >= 2) {
          return typeName;
        }
      }
    }

    if (top1Score >= 3.5) {
      return "潜力开发型";
    }

    return "潜力开发型";
  };

  React.useEffect(() => {
    if (currentPage === 'result' && chartRef.current && typeof Chart !== 'undefined') {
      const results = calculateResults();
      const ctx = chartRef.current.getContext('2d');

      // 销毁现有图表
      const existingChart = Chart.getChart(ctx);
      if (existingChart) {
        existingChart.destroy();
      }

      const dimensionNames = Object.keys(dimensions);
      const chartData = dimensionNames.map(dim =>
        parseFloat(results.dimensionAvgScores[dim])
      );

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
              pointBackgroundColor: dimensionNames.map(dim => dimensions[dim].color),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: dimensionNames.map(dim => dimensions[dim].color),
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                  font: {
                    size: 12
                  }
                },
                pointLabels: {
                  font: {
                    size: 11
                  }
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      } catch (error) {
        console.log('图表创建失败:', error);
      }
    }
  }, [currentPage, answers]);

  const copyResultText = () => {
    const results = calculateResults();
    const typeInfo = talentTypes[results.talentType];

    const text = `🌈 我的天赋测试结果出炉啦！

我是【${results.talentType}】型天赋 ${typeInfo.icon}

✨ 优势天赋：
${results.topDimensions.map(([dim, score], index) =>
  `${index + 1}. ${dimensions[dim].icon} ${dim} ${score}分`
).join('\n')}

${typeInfo.description}

适合方向：${typeInfo.careers.slice(0, 3).join('、')}

#天赋测试 #职业规划 #自我探索`;

    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  const renderIntro = () => (
    React.createElement('div', { className: "min-h-screen rainbow-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: "text-center mb-6 sm:mb-8" },
          React.createElement('div', { className: "text-5xl sm:text-7xl mb-4" }, '🌈'),
          React.createElement('h1', {
            onClick: handleTitleClick,
            className: "text-2xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 sm:mb-4 cursor-pointer select-none",
            style: {userSelect: 'none'}
          }, '多元天赋能力测评'),
          React.createElement('p', { className: "text-sm sm:text-base text-gray-600" }, '发现你的隐藏天赋 · 找到最适合的发展方向')
        ),

        React.createElement('div', { className: "space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base mb-8" },
          React.createElement('div', { className: "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-3 text-purple-800" }, '✨ 测评说明'),
            React.createElement('ul', { className: "space-y-2 text-purple-700" },
              React.createElement('li', null, '• 本测评基于多元智能理论，评估10个维度的天赋能力'),
              React.createElement('li', null, '• 共50道题目，预计5-8分钟完成'),
              React.createElement('li', null, '• 请根据真实感受作答，没有对错之分'),
              React.createElement('li', null, '• 结果会自动保存，支持查看历史记录')
            )
          ),

          React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4" },
            Object.entries(dimensions).map(([key, dim]) =>
              React.createElement('div', {
                key: key,
                className: "dimension-card bg-white border-2 rounded-lg p-3 text-center",
                style: {borderColor: dim.color}
              },
                React.createElement('div', { className: "text-3xl mb-2" }, dim.icon),
                React.createElement('div', { className: "font-semibold text-sm", style: {color: dim.color} }, dim.name)
              )
            )
          )
        ),

        React.createElement('div', { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center" },
          React.createElement('button', {
            onClick: handleStartTest,
            className: "w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          }, '🚀 开始测评 (50题)'),

          historyRecords.length > 0 &&
            React.createElement('button', {
              onClick: () => setShowHistory(!showHistory),
              className: "w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-colors"
            }, `📊 查看历史记录 (${historyRecords.length})`),

          showQuickTest &&
            React.createElement('button', {
              onClick: handleQuickTest,
              className: "w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-yellow-300 animate-pulse",
              title: "彩蛋功能：一键生成随机结果"
            }, '⚡ 快速测试')
        ),

        showHistory && historyRecords.length > 0 &&
          React.createElement('div', { className: "mt-6 bg-gray-50 rounded-xl p-4" },
            React.createElement('h3', { className: "font-bold text-lg mb-3" }, '历史测评记录'),
            React.createElement('div', { className: "space-y-2 max-h-64 overflow-y-auto" },
              historyRecords.map((record, index) =>
                React.createElement('div', {
                  key: index,
                  className: "bg-white p-3 rounded-lg border flex justify-between items-center"
                },
                  React.createElement('div', null,
                    React.createElement('div', { className: "font-semibold" }, record.results.talentType),
                    React.createElement('div', { className: "text-sm text-gray-500" },
                      new Date(record.timestamp).toLocaleString('zh-CN')
                    )
                  ),
                  React.createElement('div', { className: "text-2xl" },
                    talentTypes[record.results.talentType]?.icon
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

    return (
      React.createElement('div', { className: "min-h-screen rainbow-gradient p-3 sm:p-6" },
        React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
          React.createElement('div', { className: "mb-6 sm:mb-8" },
            React.createElement('div', { className: "flex items-center justify-between mb-4" },
              React.createElement('div', { className: "flex items-center space-x-2" },
                React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                React.createElement('span', { className: "font-semibold text-gray-700" }, dimInfo.name)
              ),
              React.createElement('div', { className: "text-right" },
                React.createElement('div', {
                  className: "text-lg sm:text-xl font-bold",
                  style: {color: dimInfo.color}
                }, `第 ${currentQuestion + 1} 题`),
                React.createElement('div', { className: "text-xs sm:text-sm text-gray-500" }, '共 50 题')
              )
            ),

            React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
              React.createElement('div', {
                className: "h-2 rounded-full transition-all duration-300",
                style: {
                  width: `${((currentQuestion + 1) / 50) * 100}%`,
                  background: `linear-gradient(90deg, ${dimInfo.color}, ${dimInfo.color}dd)`
                }
              })
            ),
            React.createElement('div', {
              className: "text-xs sm:text-sm text-gray-500 mt-1 text-right"
            }, `${((currentQuestion + 1) / 50 * 100).toFixed(0)}% 完成`)
          ),

          React.createElement('div', { className: "mb-8" },
            React.createElement('h3', { className: "text-lg sm:text-2xl font-medium text-gray-800 text-center mb-8 leading-relaxed px-2" },
              currentQ.text
            ),

            React.createElement('div', { className: "space-y-3" },
              options.map(option =>
                React.createElement('button', {
                  key: option.value,
                  onClick: () => handleAnswer(option.value),
                  className: "w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200",
                  style: {
                    borderColor: answers[currentQ.id] === option.value ? dimInfo.color : undefined,
                    backgroundColor: answers[currentQ.id] === option.value ? `${dimInfo.color}15` : undefined
                  }
                },
                  React.createElement('div', { className: "flex items-center" },
                    React.createElement('span', {
                      className: "font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center mr-4",
                      style: {
                        backgroundColor: `${dimInfo.color}20`,
                        color: dimInfo.color
                      }
                    }, option.label),
                    React.createElement('span', { className: "text-base text-gray-800" }, option.text)
                  )
                )
              )
            )
          ),

          React.createElement('div', { className: "flex justify-between items-center" },
            currentQuestion > 0 ?
              React.createElement('button', {
                onClick: () => setCurrentQuestion(currentQuestion - 1),
                className: "text-gray-500 hover:text-gray-700 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
              }, '← 上一题') :
              React.createElement('div', null),

            React.createElement('div', { className: "text-sm text-gray-400" },
              `剩余 ${50 - currentQuestion - 1} 题`
            )
          )
        )
      )
    );
  };

  const renderResult = () => {
    // 优先使用answers state，如果为空则从最新的历史记录中读取
    let finalAnswers = answers;

    // 如果answers为空，尝试从localStorage读取最新记录
    if (Object.keys(finalAnswers).length === 0) {
      try {
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('talent_test_')) {
            const data = localStorage.getItem(key);
            if (data) {
              records.push(JSON.parse(data));
            }
          }
        }
        records.sort((a, b) => b.timestamp - a.timestamp);
        if (records.length > 0) {
          finalAnswers = records[0].answers;
          console.log('从localStorage读取答案:', finalAnswers);
        }
      } catch (error) {
        console.log('读取历史答案失败:', error);
      }
    }

    const results = calculateResults(finalAnswers);
    const typeInfo = talentTypes[results.talentType];

    return (
      React.createElement('div', { className: "min-h-screen rainbow-gradient p-3 sm:p-6" },
        React.createElement('div', { className: "max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },

          React.createElement('div', {
            className: `bg-gradient-to-r ${typeInfo.color} rounded-2xl p-6 sm:p-8 mb-8 text-white`
          },
            React.createElement('div', { className: "text-center" },
              React.createElement('div', { className: "text-6xl sm:text-8xl mb-4" }, typeInfo.icon),
              React.createElement('h2', { className: "text-2xl sm:text-4xl font-bold mb-4" }, results.talentType),
              React.createElement('p', { className: "text-lg sm:text-xl mb-6 opacity-90" }, typeInfo.description),

              React.createElement('div', { className: "bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm" },
                React.createElement('h3', { className: "font-bold text-lg mb-3" }, '🎯 适合发展方向'),
                React.createElement('div', { className: "flex flex-wrap justify-center gap-2" },
                  typeInfo.careers.map((career, index) =>
                    React.createElement('span', {
                      key: index,
                      className: "bg-white bg-opacity-30 px-4 py-2 rounded-full text-sm"
                    }, career)
                  )
                )
              )
            )
          ),

          React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8" },
            React.createElement('div', { className: "bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200" },
              React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 text-center" }, '十维能力雷达图'),
              React.createElement('div', { className: "relative h-80" },
                React.createElement('canvas', { ref: chartRef })
              )
            ),

            React.createElement('div', { className: "space-y-4" },
              React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '⭐ 你的优势天赋 TOP3'),
              results.topDimensions.map(([dimName, score], index) => {
                const dimInfo = dimensions[dimName];
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  React.createElement('div', {
                    key: dimName,
                    className: "bg-white border-2 rounded-xl p-4 shadow-sm",
                    style: {borderColor: dimInfo.color}
                  },
                    React.createElement('div', { className: "flex items-center justify-between mb-2" },
                      React.createElement('div', { className: "flex items-center space-x-3" },
                        React.createElement('span', { className: "text-3xl" }, medals[index]),
                        React.createElement('div', null,
                          React.createElement('div', { className: "flex items-center space-x-2" },
                            React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                            React.createElement('span', { className: "font-bold text-lg" }, dimName)
                          ),
                          React.createElement('div', { className: "text-sm text-gray-600" }, dimInfo.description)
                        )
                      ),
                      React.createElement('div', { className: "text-right" },
                        React.createElement('div', {
                          className: "text-2xl font-bold",
                          style: {color: dimInfo.color}
                        }, score),
                        React.createElement('div', { className: "text-xs text-gray-500" }, '/ 5.0')
                      )
                    ),
                    React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
                      React.createElement('div', {
                        className: "h-2 rounded-full transition-all",
                        style: {
                          width: `${(parseFloat(score) / 5) * 100}%`,
                          backgroundColor: dimInfo.color
                        }
                      })
                    )
                  )
                );
              })
            )
          ),

          React.createElement('div', { className: "mb-8" },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '📊 完整能力评估'),
            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
              Object.entries(results.dimensionAvgScores)
                .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a))
                .map(([dimName, score]) => {
                  const dimInfo = dimensions[dimName];
                  const scoreNum = parseFloat(score);
                  let level = '待开发';
                  let levelColor = 'text-gray-500';
                  if (scoreNum >= 4.0) {
                    level = '优势天赋';
                    levelColor = 'text-green-600';
                  } else if (scoreNum >= 3.0) {
                    level = '发展中';
                    levelColor = 'text-blue-600';
                  }

                  return (
                    React.createElement('div', {
                      key: dimName,
                      className: "bg-gray-50 rounded-lg p-4 border"
                    },
                      React.createElement('div', { className: "flex items-center justify-between mb-2" },
                        React.createElement('div', { className: "flex items-center space-x-2" },
                          React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                          React.createElement('span', { className: "font-semibold" }, dimName)
                        ),
                        React.createElement('div', { className: "flex items-center space-x-2" },
                          React.createElement('span', {
                            className: "font-bold text-lg",
                            style: {color: dimInfo.color}
                          }, score),
                          React.createElement('span', {
                            className: `text-xs px-2 py-1 rounded-full bg-white ${levelColor}`
                          }, level)
                        )
                      ),
                      React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-1.5" },
                        React.createElement('div', {
                          className: "h-1.5 rounded-full transition-all",
                          style: {
                            width: `${(scoreNum / 5) * 100}%`,
                            backgroundColor: dimInfo.color
                          }
                        })
                      )
                    )
                  );
                })
            )
          ),

          React.createElement('div', {
            className: "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8"
          },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '💡 个性化发展建议'),
            React.createElement('div', { className: "space-y-3 text-gray-700" },
              React.createElement('p', { className: "leading-relaxed" },
                React.createElement('strong', null, '1. 发挥优势：'),
                ` 你在 ${results.topDimensions[0][0]} 方面表现突出，建议在相关领域深耕，将天赋转化为专业能力。`
              ),
              React.createElement('p', { className: "leading-relaxed" },
                React.createElement('strong', null, '2. 能力组合：'),
                ` 你的 ${results.topDimensions.map(([name]) => name).join('、')} 能力组合，特别适合从事需要${typeInfo.description}的工作。`
              ),
              React.createElement('p', { className: "leading-relaxed" },
                React.createElement('strong', null, '3. 持续成长：'),
                ' 对于得分较低的维度，不必过分担心。每个人都有独特的天赋组合，关键是找到最适合自己的发展路径。'
              )
            )
          ),

          React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center items-center" },
            React.createElement('button', {
              onClick: copyResultText,
              className: "w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            }, '📋 复制结果文案'),

            React.createElement('button', {
              onClick: () => {
                setCurrentPage('intro');
                setCurrentQuestion(0);
                setAnswers({});
              },
              className: "w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            }, '🔄 重新测评')
          ),

          React.createElement('div', { className: "mt-8 text-center text-sm text-gray-500" },
            React.createElement('p', null, '💝 本测评结果已自动保存'),
            React.createElement('p', { className: "mt-1" }, '基于多元智能理论 · 仅供参考 · 探索更多可能')
          )
        )
      )
    );
  };

  // 根据当前页面渲染不同内容
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
root.render(React.createElement(TalentAssessment));