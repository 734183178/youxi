const SRIAssessment = () => {
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

  // 四个维度配置
  const dimensions = {
    "性观感反向": {
      name: "性观感反向",
      icon: "🌸",
      color: "#FF6B9D",
      description: "对性的开放/保守态度"
    },
    "性内疚": {
      name: "性内疚",
      icon: "😔",
      color: "#FF8E72",
      description: "性相关的内疚感"
    },
    "性羞耻": {
      name: "性羞耻",
      icon: "😳",
      color: "#FF8E91",
      description: "性相关的羞耻感"
    },
    "抑制优势": {
      name: "抑制优势",
      icon: "🔒",
      color: "#F8679E",
      description: "性抑制/性兴奋系统"
    }
  };

  // 24道题目
  const questions = [
    // 性观感反向 (1-6)
    { id: 1, text: "我认为\"禁果\"往往被过度神秘化了", dimension: "性观感反向" },
    { id: 2, text: "在文学或艺术作品中，我能自然地欣赏身体之美", dimension: "性观感反向" },
    { id: 3, text: "我觉得成年人之间的\"亲密接触\"是私人选择", dimension: "性观感反向" },
    { id: 4, text: "我能坦然地与信任的朋友讨论\"那些话题\"", dimension: "性观感反向" },
    { id: 5, text: "我认为传统观念中的某些\"禁忌\"可以被重新审视", dimension: "性观感反向" },
    { id: 6, text: "我不会因为他人的\"亲密行为\"而感到不适", dimension: "性观感反向" },

    // 性内疚 (7-12)
    { id: 7, text: "我有时会为自己脑海中的\"不该有的想法\"感到不安", dimension: "性内疚" },
    { id: 8, text: "当身体产生某些\"自然反应\"时，我会感到愧疚", dimension: "性内疚" },
    { id: 9, text: "我觉得享受\"身体愉悦\"是需要克制的", dimension: "性内疚" },
    { id: 10, text: "我担心自己内心深处的\"欲望\"会被他人发现", dimension: "性内疚" },
    { id: 11, text: "我会因为过去某些\"越界的经历\"而自责", dimension: "性内疚" },
    { id: 12, text: "我认为过度追求\"感官体验\"是不道德的", dimension: "性内疚" },

    // 性羞耻 (13-18)
    { id: 13, text: "我对自己的身体某些部位感到难以启齿", dimension: "性羞耻" },
    { id: 14, text: "在亲密时刻，我很难完全放下戒备", dimension: "性羞耻" },
    { id: 15, text: "我担心伴侣会对\"那方面\"的我感到失望", dimension: "性羞耻" },
    { id: 16, text: "向伴侣表达\"身体需求\"让我觉得难为情", dimension: "性羞耻" },
    { id: 17, text: "我倾向于在昏暗环境中进行\"亲密活动\"", dimension: "性羞耻" },
    { id: 18, text: "当话题涉及\"床笫之事\"时，我总想转移话题", dimension: "性羞耻" },

    // 抑制优势 (19-24)
    { id: 19, text: "我对\"那方面\"的兴趣相对较低或不稳定", dimension: "抑制优势" },
    { id: 20, text: "工作压力或情绪波动会让我完全失去\"那种心情\"", dimension: "抑制优势" },
    { id: 21, text: "我需要很特殊的情境才能进入\"状态\"", dimension: "抑制优势" },
    { id: 22, text: "环境中的小干扰就能让我失去\"兴致\"", dimension: "抑制优势" },
    { id: 23, text: "相比\"鱼水之欢\"，我更看重其他生活目标", dimension: "抑制优势" },
    { id: 24, text: "我认为\"云雨之事\"在生活中并非必需品", dimension: "抑制优势" }
  ];

  // 评分选项
  const options = [
    { value: 1, label: 'A', text: '完全不符合' },
    { value: 2, label: 'B', text: '不太符合' },
    { value: 3, label: 'C', text: '一般' },
    { value: 4, label: 'D', text: '比较符合' },
    { value: 5, label: 'E', text: '非常符合' }
  ];

  // 6种性态度类型
  const attitudeTypes = {
    "极度开放型": {
      icon: "🦋",
      scoreRange: "0-19",
      description: "对性持极度开放的态度，几乎不受传统观念约束。在享受这种自由的同时，也要注意在亲密关系中保持尊重、安全和责任感。",
      characteristics: [
        "对性持极度开放的态度",
        "完全不受内疚或羞耻感困扰",
        "能够自由讨论和探索性话题",
        "挑战传统性观念",
        "追求性自主和性自由"
      ],
      suggestions: [
        "保持开放的同时注重安全",
        "尊重他人的边界和选择",
        "在关系中保持沟通和共识",
        "注意保护自己的身心健康",
        "理解并尊重不同性态度的人"
      ],
      color: "from-purple-400 to-pink-400"
    },
    "开放探索者": {
      icon: "🌸",
      scoreRange: "20-34",
      description: "对性持开放态度，较少受到内疚和羞耻感的困扰。你能够自然地看待性，并在适当的情况下自在地讨论和探索。",
      characteristics: [
        "对性持开放和接纳的态度",
        "较少感到内疚或羞耻",
        "能够坦然讨论性话题",
        "在亲密关系中表达自在",
        "认为性是生活的自然组成部分"
      ],
      suggestions: [
        "保持这种健康的性态度",
        "在关系中注重沟通和尊重",
        "尊重伴侣的节奏和边界",
        "继续学习健康的性知识",
        "帮助他人建立健康性观念"
      ],
      color: "from-pink-400 to-rose-400"
    },
    "平衡协调者": {
      icon: "⚖️",
      scoreRange: "35-55",
      description: "性态度介于保守和开放之间，能够理解不同观点，也能理解现代想法。性在生活中有适度的位置，能够根据情况灵活调整自己的态度和行为。",
      characteristics: [
        "性态度介于保守和开放之间",
        "能够理解不同的观点和立场",
        "在亲密关系中比较灵活适应",
        "对性话题有自己的独立思考",
        "能够在不同情境下调整自己的态度"
      ],
      suggestions: [
        "继续保持这种平衡的心态",
        "根据需要调整自己的态度",
        "与伴侣坦诚沟通彼此的期待",
        "尊重双方的需求和边界",
        "平衡是一种智慧，你做得很好"
      ],
      color: "from-amber-400 to-orange-400"
    },
    "低欲望型": {
      icon: "🕊️",
      scoreRange: "56-70",
      description: "性欲望相对较低，倾向于保守的态度。这表明你不会因性欲望而感到困扰，性在你的生活中占据适度的位置。",
      characteristics: [
        "性欲望程度较低",
        "倾向于保持传统观念",
        "不会过分压抑也不过分开放",
        "对性相关话题比较谨慎",
        "认为性应该在特定关系中发生"
      ],
      suggestions: [
        "这是完全正常的性态度类型",
        "不需要强迫自己改变",
        "在关系中清晰表达自己的节奏",
        "寻找理解你节奏的伴侣",
        "尊重自己的舒适区"
      ],
      color: "from-cyan-400 to-blue-400"
    },
    "压抑明显型": {
      icon: "🔒",
      scoreRange: "71-85",
      description: "存在较明显的性压抑倾向，可能受到内疚感、羞耻感或传统观念的影响。这种压抑可能会影响你的亲密关系质量和个人幸福感。",
      characteristics: [
        "对性持较为保守的态度",
        "容易产生内疚或羞耻感",
        "在亲密关系中较难放松",
        "倾向于回避性相关话题",
        "可能受到成长环境影响较深"
      ],
      suggestions: [
        "尝试理解自己态度形成的原因",
        "阅读性教育相关的科学资料",
        "与信任的人或专业人士交流",
        "逐步挑战限制性的信念",
        "记住：健康的性态度有助于幸福"
      ],
      color: "from-indigo-400 to-purple-400"
    },
    "高度压抑型": {
      icon: "🚫",
      scoreRange: "86-100",
      description: "存在严重的性压抑，可能深受内疚、羞耻或传统观念束缚。这种高度压抑可能对身心健康和亲密关系造成负面影响，建议寻求专业支持。",
      characteristics: [
        "对性持非常保守或抗拒的态度",
        "强烈的内疚感和羞耻感",
        "难以在亲密关系中获得满足",
        "完全回避性相关话题",
        "可能影响整体生活质量"
      ],
      suggestions: [
        "建议咨询心理健康专业人士",
        "了解性压抑的心理根源",
        "逐步建立健康的性认知",
        "给自己时间和耐心",
        "记住：寻求帮助是勇敢的表现"
      ],
      color: "from-red-400 to-pink-400"
    }
  };

  // 处理标题点击 - 激活隐藏功能
  const handleTitleClick = () => {
    const now = Date.now();

    if (clickTime && now - clickTime > 10000) {
      setTitleClickCount(1);
      setClickTime(now);
    } else {
      const newCount = titleClickCount + 1;
      setTitleClickCount(newCount);
      setClickTime(now);

      if (newCount === 5) {
        setShowQuickTest(true);
        setTitleClickCount(0);
      }
    }
  };

  // 快速测试
  const handleQuickTest = () => {
    const quickAnswers = {};
    questions.forEach(q => {
      quickAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });

    setAnswers(quickAnswers);
    saveResult(quickAnswers);
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
        if (key && key.startsWith('sri_test_')) {
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
        `sri_test_${Date.now()}`,
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
      let score = finalAnswers[q.id] || 0;

      // 性观感反向维度需要反向计分
      if (q.dimension === "性观感反向") {
        score = 6 - score;
      }

      dimensionScores[q.dimension] += score;
    });

    const dimensionAvgScores = {};
    Object.keys(dimensions).forEach(dim => {
      dimensionAvgScores[dim] = (dimensionScores[dim] / 6).toFixed(1);
    });

    // 计算SRI总分（0-100）
    // 四个维度平均分的总和范围是4-20
    const totalRawScore = Object.values(dimensionAvgScores).reduce((sum, score) => {
      return sum + parseFloat(score);
    }, 0);

    // 转换到0-100范围
    // 最小值: (4-4)/(20-4) * 100 = 0分（极度开放）
    // 最大值: (20-4)/(20-4) * 100 = 100分（高度压抑）
    const sriScore = Math.round(((totalRawScore - 4) / 16) * 100);

    return {
      dimensionScores,
      dimensionAvgScores,
      sriScore
    };
  };

  const determineAttitudeType = () => {
    const results = calculateResults();
    const score = results.sriScore;

    if (score >= 86) return "高度压抑型";
    if (score >= 71) return "压抑明显型";
    if (score >= 56) return "低欲望型";
    if (score >= 35) return "平衡协调者";
    if (score >= 20) return "开放探索者";
    return "极度开放型";
  };

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

      try {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: dimensionNames,
            datasets: [{
              label: '您的得分',
              data: chartData,
              backgroundColor: [
                'rgba(255, 107, 157, 0.7)',
                'rgba(255, 142, 114, 0.7)',
                'rgba(255, 142, 145, 0.7)',
                'rgba(248, 103, 158, 0.7)'
              ],
              borderColor: [
                '#FF6B9D',
                '#FF8E72',
                '#FF8E91',
                '#F8679E'
              ],
              borderWidth: 2,
              borderRadius: 8
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1,
                  font: {
                    size: 12
                  }
                }
              },
              y: {
                ticks: {
                  font: {
                    size: 12
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
    const attitudeType = determineAttitudeType();
    const typeInfo = attitudeTypes[attitudeType];

    const text = `💕 我的性压抑指数测试结果出炉啦！

我的性态度类型是【${attitudeType}】${typeInfo.icon}

性压抑指数 (SRI): ${results.sriScore}分

${typeInfo.description}

建议：
${typeInfo.suggestions.slice(0, 3).join('\n')}

#性态度测评 #自我探索 #心理健康`;

    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板！');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  const renderIntro = () => (
    React.createElement('div', { className: "min-h-screen pink-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: "text-center mb-6 sm:mb-8" },
          React.createElement('div', { className: "text-5xl sm:text-7xl mb-4" }, '💕'),
          React.createElement('h1', {
            onClick: handleTitleClick,
            className: "text-2xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 bg-clip-text text-transparent mb-2 sm:mb-4 cursor-pointer select-none",
            style: {userSelect: 'none'}
          }, '性压抑指数测评'),
          React.createElement('p', { className: "text-sm sm:text-base text-gray-600" }, '了解你的性态度 · 探索更多可能性')
        ),

        React.createElement('div', { className: "space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base mb-8" },
          React.createElement('div', { className: "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-3 text-pink-800" }, '✨ 测评说明'),
            React.createElement('ul', { className: "space-y-2 text-pink-700" },
              React.createElement('li', null, '• 本测评基于性压抑指数理论，评估4个维度'),
              React.createElement('li', null, '• 共24道题目，预计3-5分钟完成'),
              React.createElement('li', null, '• 请根据真实感受作答，没有对错之分'),
              React.createElement('li', null, '• 结果会自动保存，支持查看历史记录'),
              React.createElement('li', null, '• 本测评仅供参考，不构成医学或心理学建议')
            )
          ),

          React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" },
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
            className: "w-full sm:w-auto bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 hover:from-pink-600 hover:via-red-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          }, '🚀 开始测评 (24题)'),

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
                    React.createElement('div', { className: "font-semibold" }, `SRI: ${record.results.sriScore}`),
                    React.createElement('div', { className: "text-sm text-gray-500" },
                      new Date(record.timestamp).toLocaleString('zh-CN')
                    )
                  ),
                  React.createElement('div', { className: "text-2xl" }, '💕')
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
      React.createElement('div', { className: "min-h-screen pink-gradient p-3 sm:p-6" },
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
                React.createElement('div', { className: "text-xs sm:text-sm text-gray-500" }, '共 24 题')
              )
            ),

            React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
              React.createElement('div', {
                className: "h-2 rounded-full transition-all duration-300",
                style: {
                  width: `${((currentQuestion + 1) / 24) * 100}%`,
                  background: `linear-gradient(90deg, ${dimInfo.color}, ${dimInfo.color}dd)`
                }
              })
            ),
            React.createElement('div', {
              className: "text-xs sm:text-sm text-gray-500 mt-1 text-right"
            }, `${((currentQuestion + 1) / 24 * 100).toFixed(0)}% 完成`)
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
                  className: "w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-200",
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
              `剩余 ${24 - currentQuestion - 1} 题`
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
          if (key && key.startsWith('sri_test_')) {
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
    const attitudeType = determineAttitudeType();
    const typeInfo = attitudeTypes[attitudeType];

    return (
      React.createElement('div', { className: "min-h-screen pink-gradient p-3 sm:p-6" },
        React.createElement('div', { className: "max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },

          React.createElement('div', {
            className: `bg-gradient-to-r ${typeInfo.color} rounded-2xl p-6 sm:p-8 mb-8 text-white`
          },
            React.createElement('div', { className: "text-center" },
              React.createElement('div', { className: "text-6xl sm:text-8xl mb-4" }, typeInfo.icon),
              React.createElement('h2', { className: "text-2xl sm:text-4xl font-bold mb-4" }, attitudeType),
              React.createElement('div', {
                className: "text-5xl sm:text-6xl font-bold mb-2",
                style: {}
              }, results.sriScore),
              React.createElement('div', { className: "text-lg sm:text-xl opacity-90 mb-4" }, '性压抑指数'),
              React.createElement('p', { className: "text-base sm:text-lg opacity-90" }, typeInfo.description)
            )
          ),

          React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8" },
            React.createElement('div', { className: "bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200" },
              React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 text-center" }, '四维度评估'),
              React.createElement('div', { className: "relative h-80" },
                React.createElement('canvas', { ref: chartRef })
              )
            ),

            React.createElement('div', { className: "space-y-4" },
              React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '📊 维度得分'),
              Object.entries(results.dimensionAvgScores)
                .map(([dimName, score]) => {
                  const dimInfo = dimensions[dimName];
                  const scoreNum = parseFloat(score);
                  return (
                    React.createElement('div', {
                      key: dimName,
                      className: "bg-white border-2 rounded-xl p-4",
                      style: {borderColor: dimInfo.color}
                    },
                      React.createElement('div', { className: "flex items-center justify-between mb-2" },
                        React.createElement('div', { className: "flex items-center space-x-2" },
                          React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                          React.createElement('span', { className: "font-semibold" }, dimName)
                        ),
                        React.createElement('span', {
                          className: "font-bold text-lg",
                          style: {color: dimInfo.color}
                        }, score)
                      ),
                      React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
                        React.createElement('div', {
                          className: "h-2 rounded-full transition-all",
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
            className: "bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 mb-8"
          },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '💡 关键特征'),
            React.createElement('ul', { className: "space-y-2 text-gray-700" },
              typeInfo.characteristics.map((char, index) =>
                React.createElement('li', {
                  key: index,
                  className: "flex items-start"
                },
                  React.createElement('span', { className: "text-pink-500 mr-3 font-bold" }, '✓'),
                  React.createElement('span', null, char)
                )
              )
            )
          ),

          React.createElement('div', {
            className: "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8"
          },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, '🌟 个性化建议'),
            React.createElement('ul', { className: "space-y-2 text-gray-700" },
              typeInfo.suggestions.map((sug, index) =>
                React.createElement('li', {
                  key: index,
                  className: "flex items-start"
                },
                  React.createElement('span', { className: "text-amber-600 mr-3 font-bold" }, '→'),
                  React.createElement('span', null, sug)
                )
              )
            )
          ),

          React.createElement('div', {
            className: "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8"
          },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-2" }, '📚 心理成长资源推荐'),
            React.createElement('p', { className: "text-sm text-gray-600 mb-4" }, '探索内心，关照自己的每一面'),
            React.createElement('div', { className: "space-y-2" },
              React.createElement('a', {
                href: "https://xhslink.com/m/9D0epdzjqnw",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
              },
                React.createElement('span', { className: "text-gray-800 font-semibold" }, '📖 更多心理自测工具'),
                React.createElement('span', { className: "text-blue-500" }, '→')
              ),
              React.createElement('a', {
                href: "https://pan.quark.cn/s/266f60aa5bbf",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all"
              },
                React.createElement('span', { className: "text-gray-800 font-semibold" }, '💡 2026重启人生365天时间规划表'),
                React.createElement('span', { className: "text-blue-500" }, '→')
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
              className: "w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            }, '🔄 重新测评')
          ),

          React.createElement('div', { className: "mt-8 text-center text-sm text-gray-500" },
            React.createElement('p', null, '💝 本测评结果已自动保存'),
            React.createElement('p', { className: "mt-1" }, '本测评仅供参考，不构成医学建议 · 探索更多可能')
          )
        )
      )
    );
  };

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(SRIAssessment));
