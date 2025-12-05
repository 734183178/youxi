const { useState, useEffect, useRef } = React;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('应用错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-6"
      },
        React.createElement('div', {
          className: "bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        },
          React.createElement('div', { className: "text-6xl mb-4" }, '⚠️'),
          React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-4" }, '抱歉,出现了一些问题'),
          React.createElement('p', { className: "text-gray-600 mb-6" },
            '应用遇到了错误。请刷新页面重试。'
          ),
          React.createElement('button', {
            onClick: () => window.location.reload(),
            className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          }, '🔄 刷新页面')
        )
      );
    }

    return this.props.children;
  }
}

const FamilyHealthAssessment = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [agreedToWarning, setAgreedToWarning] = useState(false);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const titleClickTimerRef = useRef(null);
  const chartRef = useRef(null);

  const dimensions = {
    "低自我价值": {
      name: "低自我价值",
      icon: "💔",
      color: "#3B82F6",
      description: "对自我的贬抑、羞愧、批判"
    },
    "过度掌控": {
      name: "过度掌控",
      icon: "🎭",
      color: "#F59E0B",
      description: "控制他人情绪和行为"
    },
    "回避依恋": {
      name: "回避依恋",
      icon: "🚪",
      color: "#8B5CF6",
      description: "情感疏离、难以亲密"
    },
    "过度反应": {
      name: "过度反应",
      icon: "⚡",
      color: "#EF4444",
      description: "情绪敏感、易被触发"
    },
    "边界模糊": {
      name: "边界模糊",
      icon: "🌊",
      color: "#FBBF24",
      description: "无法设定健康界限"
    },
    "自责内疚": {
      name: "自责内疚",
      icon: "😔",
      color: "#EC4899",
      description: "过度承担责任"
    },
    "情绪纠结": {
      name: "情绪纠结",
      icon: "🌀",
      color: "#06B6D4",
      description: "矛盾的情感体验"
    },
    "自我隐藏": {
      name: "自我隐藏",
      icon: "🎭",
      color: "#10B981",
      description: "压抑真实需求和感受"
    }
  };

  const options = [
    { value: 1, label: 'A', text: '完全不符合' },
    { value: 2, label: 'B', text: '不太符合' },
    { value: 3, label: 'C', text: '有时如此' },
    { value: 4, label: 'D', text: '经常如此' },
    { value: 5, label: 'E', text: '完全符合' }
  ];

  const getLevelInfo = (score) => {
    if (score >= 4.2) return { level: '严重', class: 'badge-severe', desc: '非常高' };
    if (score >= 3.5) return { level: '较高', class: 'badge-high', desc: '较高' };
    if (score >= 2.8) return { level: '中等', class: 'badge-moderate', desc: '中等' };
    if (score >= 2.0) return { level: '轻微', class: 'badge-mild', desc: '轻微' };
    return { level: '健康', class: 'badge-healthy', desc: '健康' };
  };

  const getOverallHealth = (avgScore) => {
    if (avgScore >= 4.0) return { level: '需要专业支持', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (avgScore >= 3.2) return { level: '建议寻求帮助', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (avgScore >= 2.5) return { level: '有成长空间', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (avgScore >= 1.8) return { level: '相对健康', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    return { level: '健康良好', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const questions = [
    { id: 1, text: "我经常觉得自己不够好，无论多努力都达不到标准", dimension: "低自我价值" },
    { id: 2, text: "我习惯性地贬低自己的成就，觉得只是运气好", dimension: "低自我价值" },
    { id: 3, text: "别人的批评会让我长时间痛苦，难以释怀", dimension: "低自我价值" },
    { id: 4, text: "我总觉得自己配不上好的东西或好的关系", dimension: "低自我价值" },
    { id: 5, text: "我很难接受别人的赞美，总觉得他们在客套", dimension: "低自我价值" },
    { id: 6, text: "我对自己的外表、能力感到深深的羞愧", dimension: "低自我价值" },
    { id: 7, text: "我会通过操控或给予建议的方式来影响他人", dimension: "过度掌控" },
    { id: 8, text: "当事情不按我的想法发展时，我会感到焦虑不安", dimension: "过度掌控" },
    { id: 9, text: "我很难接受别人有不同的想法或选择", dimension: "过度掌控" },
    { id: 10, text: "我会用关心作为理由，过度干预他人的生活", dimension: "过度掌控" },
    { id: 11, text: "我需要知道事情的每个细节，否则会感到失控", dimension: "过度掌控" },
    { id: 12, text: "当别人不听从我的建议时，我会生气或难过", dimension: "过度掌控" },
    { id: 13, text: "我很难向他人表达真实的情感需求", dimension: "回避依恋" },
    { id: 14, text: "在亲密关系中，我总想保持一定距离", dimension: "回避依恋" },
    { id: 15, text: "我倾向于用忙碌来逃避深度的情感连接", dimension: "回避依恋" },
    { id: 16, text: "我不相信有人能真正理解和接纳我", dimension: "回避依恋" },
    { id: 17, text: "当关系变得太亲密时，我会想要逃离", dimension: "回避依恋" },
    { id: 18, text: "我很难向他人寻求帮助，即使我很需要", dimension: "回避依恋" },
    { id: 19, text: "一些小事就能让我情绪崩溃或暴怒", dimension: "过度反应" },
    { id: 20, text: "我的情绪起伏很大，难以保持稳定", dimension: "过度反应" },
    { id: 21, text: "别人无意的话语会让我感到被深深伤害", dimension: "过度反应" },
    { id: 22, text: "我会把当下的冲突和过去的伤痛联系起来", dimension: "过度反应" },
    { id: 23, text: "我很容易感到被拒绝或被抛弃", dimension: "过度反应" },
    { id: 24, text: "在冲突中，我会说出过激的话或做出冲动的行为", dimension: "过度反应" },
    { id: 25, text: "我很难对他人的要求说\"不\"", dimension: "边界模糊" },
    { id: 26, text: "我常常为了维护关系而牺牲自己的需求", dimension: "边界模糊" },
    { id: 27, text: "我不清楚什么是我应该承担的，什么不是", dimension: "边界模糊" },
    { id: 28, text: "我允许他人侵犯我的时间、空间或情感", dimension: "边界模糊" },
    { id: 29, text: "我会过度卷入他人的问题，忽略自己的生活", dimension: "边界模糊" },
    { id: 30, text: "我分不清哪些情绪是我的，哪些是别人的", dimension: "边界模糊" },
    { id: 31, text: "我总觉得很多问题都是我的错", dimension: "自责内疚" },
    { id: 32, text: "即使不是我的责任，我也会感到深深的内疚", dimension: "自责内疚" },
    { id: 33, text: "我会为家人的不快乐而责备自己", dimension: "自责内疚" },
    { id: 34, text: "我很难原谅自己过去的错误", dimension: "自责内疚" },
    { id: 35, text: "我常常活在\"如果当初我...\"的懊悔中", dimension: "自责内疚" },
    { id: 36, text: "我觉得让家人失望是不可饶恕的", dimension: "自责内疚" },
    { id: 37, text: "我对家人既爱又恨，情感非常矛盾", dimension: "情绪纠结" },
    { id: 38, text: "我既渴望亲密又害怕受伤", dimension: "情绪纠结" },
    { id: 39, text: "我一边想要独立，一边又离不开家人", dimension: "情绪纠结" },
    { id: 40, text: "我对过去的记忆充满矛盾的情感", dimension: "情绪纠结" },
    { id: 41, text: "我经常在愤怒和心疼之间反复横跳", dimension: "情绪纠结" },
    { id: 42, text: "我既想改变关系，又害怕改变会带来更多伤害", dimension: "情绪纠结" },
    { id: 43, text: "我习惯性地压抑自己的真实情绪", dimension: "自我隐藏" },
    { id: 44, text: "当我感到委屈愤怒时，不敢表达，不会表达", dimension: "自我隐藏" },
    { id: 45, text: "我会刻意隐藏自己的需求，假装不在乎", dimension: "自我隐藏" },
    { id: 46, text: "我害怕展现真实的自己会被拒绝", dimension: "自我隐藏" },
    { id: 47, text: "我总是戴着面具与人相处，包括亲密的人", dimension: "自我隐藏" },
    { id: 48, text: "我不知道真实的自己是什么样子", dimension: "自我隐藏" }
  ];

  const dimensionDetails = {
    "低自我价值": {
      manifestation: "你的自我价值感很低，以致对别人的情绪很敏感。你习惯性的压抑自己的情绪，当自己感到委屈愤怒的时候，不敢表达，不会表达。你习惯性的压抑自己的需求，当别人侵犯自己的时间、空间、精力与资源的时候，不会维护，不敢维护。",
      cause: "低自我价值可能来源于童年或青年期父母对你的忽视。被迫早早独立、无所依靠，你只能把自己变成\"小大人\"，一个人扛起许多责任，变得无坚不摧。",
      impact: "你的内心常生活在矛盾中，一方面渴望别人喜欢自己，另一方面又怀疑别人，害怕他们不喜欢自己；你有强烈的好胜心，常与别人比较，会以成就衡量自己的价值高低，注重自己的形象，但是也慷慨表达内心感受。"
    },
    "过度掌控": {
      manifestation: "有时你会通过操控或给予建议的方式来影响他人，使别人顺从自己的意见或控制事件的发生发展。",
      cause: "过度掌控可能来源于童年或青年期父母对你的忽视。被迫早早独立、无所依靠，你只能把自己变成\"小大人\"，一个人扛起许多责任，变得无坚不摧。",
      impact: "一方面，过度掌控事件或关注他人使你过于关注他人，而忽视了自身的需求。另一方面，当事情不顺心时，你容易形成悲观主义倾向，它可能造成你心理的无名之火，造成你的负面思维模式。"
    },
    "回避依恋": {
      manifestation: "你倾向于在亲密关系中保持距离，难以真正依赖和信任他人。你可能用忙碌、理性化等方式来回避深层的情感连接。",
      cause: "可能源于童年时期养育者不稳定的回应，或者过早经历分离，导致你学会了自我保护，不再轻易依赖他人。",
      impact: "这种模式可能导致你在关系中感到孤独，难以建立深度的亲密连接，也可能让亲密的人感到被拒绝和疏远。"
    },
    "过度反应": {
      manifestation: "你对外界刺激的情绪反应强烈且持久，小事也能引发大的情绪波动。你可能会将当前的情境与过去的创伤联系起来。",
      cause: "可能源于童年时期长期处于高压或不安全的环境中，导致你的情绪系统处于高度警觉状态。",
      impact: "这种过度敏感可能影响人际关系，让你在冲突中容易失控，也可能让你感到精疲力竭。"
    },
    "边界模糊": {
      manifestation: "你很难区分自己和他人的责任、情绪和需求。你可能习惯性地为他人牺牲，或者过度卷入他人的问题。",
      cause: "可能源于童年时期你的边界经常被侵犯，或者你被要求承担超出年龄的责任。",
      impact: "模糊的边界会让你感到耗竭，也容易在关系中失去自我，难以维护自己的权益。"
    },
    "自责内疚": {
      manifestation: "你习惯性地把问题归咎于自己，即使很多事情并非你的责任。你可能对过去的错误无法释怀。",
      cause: "可能源于童年时期被过度责备，或者你被暗示家庭的问题是因为你而起。",
      impact: "过度的自责会消耗你的心理能量，让你难以享受生活，也可能导致抑郁和焦虑。"
    },
    "情绪纠结": {
      manifestation: "你对重要的人或事物有着矛盾复杂的情感，既爱又恨，既渴望又抗拒。",
      cause: "可能源于童年时期养育者给予了不一致的对待，既有关爱也有伤害。",
      impact: "这种情感纠结会让你在关系中感到痛苦和困惑，难以做出清晰的决定。"
    },
    "自我隐藏": {
      manifestation: "你习惯性地隐藏真实的自我，压抑真实的情绪和需求。你可能不知道真实的自己是什么样子。",
      cause: "可能源于童年时期真实的自我不被接纳，你学会了戴上面具来获得认可和安全。",
      impact: "长期的自我压抑会导致与自己和他人的疏离感，也可能引发身心健康问题。"
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const records = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('family_health_')) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.timestamp && parsed.answers && parsed.results) {
                records.push(parsed);
              }
            }
          } catch (e) {
            console.log('读取记录失败:', key, e);
          }
        }
      }
      records.sort((a, b) => b.timestamp - a.timestamp);
      setHistoryRecords(records);
    } catch (error) {
      console.log('历史记录功能暂不可用:', error);
      setHistoryRecords([]);
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
      const key = `family_health_${Date.now()}`;
      localStorage.setItem(key, JSON.stringify(record));
      loadHistory();

      const allKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('family_health_')) {
          allKeys.push(k);
        }
      }
      if (allKeys.length > 20) {
        allKeys.sort().slice(0, allKeys.length - 20).forEach(k => {
          try {
            localStorage.removeItem(k);
          } catch (e) {
            console.log('清理旧记录失败:', k);
          }
        });
      }
    } catch (error) {
      console.log('保存失败:', error);
      if (error.name === 'QuotaExceededError') {
        alert('存储空间已满,无法保存测评记录。请清理浏览器缓存后重试。');
      }
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
      dimensionAvgScores[dim] = (dimensionScores[dim] / 6).toFixed(2);
    });

    const sortedDimensions = Object.entries(dimensionAvgScores)
      .sort(([, a], [, b]) => parseFloat(b) - parseFloat(a));

    const topDimensions = sortedDimensions.slice(0, 3);

    const avgScore = (Object.values(dimensionAvgScores)
      .reduce((sum, score) => sum + parseFloat(score), 0) / 8).toFixed(2);

    return {
      dimensionScores,
      dimensionAvgScores,
      topDimensions,
      sortedDimensions,
      avgScore
    };
  };

  const handleTitleClick = () => {
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);

    if (titleClickTimerRef.current) {
      clearTimeout(titleClickTimerRef.current);
    }

    if (newCount === 5) {
      setShowQuickTest(true);
      setTitleClickCount(0);
    }

    titleClickTimerRef.current = setTimeout(() => {
      setTitleClickCount(0);
    }, 10000);
  };

  const handleQuickTest = () => {
    const quickAnswers = {};
    questions.forEach(q => {
      quickAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
    });

    saveResult(quickAnswers);
    setCurrentPage('result');
    setAnswers(quickAnswers);
    setShowQuickTest(false);
  };

  const handleStartTest = () => {
    if (!agreedToWarning) {
      alert('请先阅读并同意心理健康提示');
      return;
    }
    setCurrentPage('test');
    setCurrentQuestion(0);
    setAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 200);
    } else {
      saveResult(newAnswers);
      setCurrentPage('result');
    }
  };

  const renderIntro = () => (
    React.createElement('div', { className: "min-h-screen healing-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: "text-center mb-6 sm:mb-8" },
          React.createElement('div', { className: "text-5xl sm:text-7xl mb-4" }, '🏡'),
          React.createElement('h1', {
            onClick: handleTitleClick,
            className: "text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4 cursor-pointer transition-transform hover:scale-105"
          },
            '原生家庭健康度测评'
          ),
          React.createElement('p', { className: "text-sm sm:text-base text-gray-600" },
            '探索内心 · 关照自己的一面镜子'
          )
        ),

        React.createElement('div', { className: "warning-box rounded-xl p-4 sm:p-6 mb-6 fade-in" },
          React.createElement('div', { className: "flex items-start space-x-3" },
            React.createElement('div', { className: "text-2xl flex-shrink-0" }, '⚠️'),
            React.createElement('div', { className: "flex-1" },
              React.createElement('h3', { className: "text-lg font-bold text-amber-900 mb-3" },
                '心理健康提示'
              ),
              React.createElement('ul', { className: "space-y-2 text-sm text-amber-800" },
                React.createElement('li', null, '• 本测评仅供自我探索参考，不能替代专业心理咨询'),
                React.createElement('li', null, '• 如果在测评过程中感到强烈不适，请随时停止'),
                React.createElement('li', null, '• 测评结果可能触及敏感话题，请在安全的环境中进行'),
                React.createElement('li', null, '• 如需专业帮助，建议寻求心理咨询师的支持')
              ),
              React.createElement('div', { className: "mt-4 flex items-center" },
                React.createElement('input', {
                  type: "checkbox",
                  id: "agreeWarning",
                  checked: agreedToWarning,
                  onChange: (e) => setAgreedToWarning(e.target.checked),
                  className: "w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500",
                  'aria-label': "同意心理健康提示"
                }),
                React.createElement('label', {
                  htmlFor: "agreeWarning",
                  className: "ml-2 text-sm font-medium text-amber-900 cursor-pointer"
                },
                  '我已阅读并理解以上提示'
                )
              )
            )
          )
        ),

        React.createElement('div', { className: "space-y-4 sm:space-y-6 text-gray-700 mb-8" },
          React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-3 text-blue-900" },
              '📋 测评说明'
            ),
            React.createElement('ul', { className: "space-y-2 text-blue-800 text-sm sm:text-base" },
              React.createElement('li', null, '• 本测评评估8个维度的原生家庭影响'),
              React.createElement('li', null, '• 共48道题目，预计8-12分钟完成'),
              React.createElement('li', null, '• 请根据真实感受作答，没有对错之分'),
              React.createElement('li', null, '• 结果会自动保存，支持查看历史记录')
            )
          ),

          React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" },
            Object.entries(dimensions).map(([key, dim]) =>
              React.createElement('div', {
                key: key,
                className: "dimension-card bg-white border-2 rounded-lg p-3 text-center hover:shadow-lg",
                style: { borderColor: dim.color }
              },
                React.createElement('div', { className: "text-3xl mb-2" }, dim.icon),
                React.createElement('div', {
                  className: "font-semibold text-sm",
                  style: { color: dim.color }
                }, dim.name),
                React.createElement('div', { className: "text-xs text-gray-500 mt-1" },
                  dim.description
                )
              )
            )
          )
        ),

        React.createElement('div', { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center" },
          React.createElement('button', {
            onClick: handleStartTest,
            disabled: !agreedToWarning,
            className: `w-full sm:w-auto font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg ${agreedToWarning
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`,
            'aria-label': "开始测评"
          },
            '🚀 开始测评 (48题)'
          ),

          showQuickTest && React.createElement('button', {
            onClick: handleQuickTest,
            className: "w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          },
            '⚡ 快速测试 (随机)'
          ),

          historyRecords.length > 0 && React.createElement('button', {
            onClick: () => setShowHistory(!showHistory),
            className: "w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-colors",
            'aria-label': showHistory ? '隐藏历史记录' : '查看历史记录'
          },
            `📊 查看历史记录 (${historyRecords.length})`
          )
        ),

        showHistory && historyRecords.length > 0 && React.createElement('div', { className: "mt-6 bg-gray-50 rounded-xl p-4 fade-in" },
          React.createElement('h3', { className: "font-bold text-lg mb-3" }, '历史测评记录'),
          React.createElement('div', { className: "space-y-2 max-h-64 overflow-y-auto" },
            historyRecords.map((record, index) => {
              const health = getOverallHealth(parseFloat(record.results.avgScore));
              return React.createElement('div', {
                key: index,
                className: "bg-white p-3 rounded-lg border flex justify-between items-center hover:shadow-md transition-shadow"
              },
                React.createElement('div', null,
                  React.createElement('div', { className: "font-semibold flex items-center space-x-2" },
                    React.createElement('span', { className: health.color }, health.level),
                    React.createElement('span', { className: "text-gray-400 text-sm" },
                      `(平均 ${record.results.avgScore} 分)`
                    )
                  ),
                  React.createElement('div', { className: "text-sm text-gray-500" },
                    new Date(record.timestamp).toLocaleString('zh-CN')
                  )
                ),
                React.createElement('button', {
                  onClick: () => {
                    setAnswers(record.answers);
                    setCurrentPage('result');
                  },
                  className: "text-purple-600 hover:text-purple-800 text-sm font-medium"
                },
                  '查看详情 →'
                )
              );
            })
          )
        )
      )
    )
  );

  const renderTest = () => {
    const currentQ = questions[currentQuestion];
    const dimInfo = dimensions[currentQ.dimension];

    return React.createElement('div', { className: "min-h-screen healing-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 fade-in" },
        React.createElement('div', { className: "mb-6 sm:mb-8" },
          React.createElement('div', { className: "flex items-center justify-between mb-4" },
            React.createElement('div', { className: "flex items-center space-x-2" },
              React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
              React.createElement('span', { className: "font-semibold text-gray-700" },
                dimInfo.name
              )
            ),
            React.createElement('div', { className: "text-right" },
              React.createElement('div', {
                className: "text-lg sm:text-xl font-bold",
                style: { color: dimInfo.color }
              },
                `第 ${currentQuestion + 1} 题`
              ),
              React.createElement('div', { className: "text-xs sm:text-sm text-gray-500" },
                '共 48 题'
              )
            )
          ),

          React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
            React.createElement('div', {
              className: "h-2 rounded-full transition-all duration-300",
              style: {
                width: `${((currentQuestion + 1) / 48) * 100}%`,
                background: `linear-gradient(90deg, ${dimInfo.color}, ${dimInfo.color}dd)`
              }
            })
          ),
          React.createElement('div', { className: "text-xs sm:text-sm text-gray-500 mt-1 text-right" },
            `${((currentQuestion + 1) / 48 * 100).toFixed(0)}% 完成`
          )
        ),

        React.createElement('div', { className: "mb-8" },
          React.createElement('h3', { className: "text-lg sm:text-2xl font-medium text-gray-800 text-center mb-8 leading-relaxed px-2" },
            currentQ.text
          ),

          React.createElement('div', { className: "space-y-3" },
            options.map((option) =>
              React.createElement('button', {
                key: option.value,
                onClick: () => handleAnswer(option.value),
                className: "w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2",
                style: {
                  borderColor: answers[currentQ.id] === option.value ? dimInfo.color : undefined,
                  backgroundColor: answers[currentQ.id] === option.value ? `${dimInfo.color}15` : undefined
                },
                'aria-pressed': answers[currentQ.id] === option.value,
                role: "button"
              },
                React.createElement('div', { className: "flex items-center" },
                  React.createElement('span', {
                    className: "font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center mr-4 transition-colors flex-shrink-0",
                    style: {
                      backgroundColor: answers[currentQ.id] === option.value ? dimInfo.color : `${dimInfo.color}20`,
                      color: answers[currentQ.id] === option.value ? '#fff' : dimInfo.color
                    }
                  },
                    option.label
                  ),
                  React.createElement('span', { className: "text-sm sm:text-base text-gray-800 break-words" },
                    option.text
                  )
                )
              )
            )
          )
        ),

        React.createElement('div', { className: "flex justify-between items-center" },
          currentQuestion > 0 ? React.createElement('button', {
            onClick: () => setCurrentQuestion(currentQuestion - 1),
            className: "text-gray-500 hover:text-gray-700 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
          },
            '← 上一题'
          ) : React.createElement('div', null),

          React.createElement('div', { className: "text-sm text-gray-400" },
            `剩余 ${48 - currentQuestion - 1} 题`
          )
        )
      )
    );
  };

  useEffect(() => {
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
          type: 'radar',
          data: {
            labels: dimensionNames,
            datasets: [
              {
                label: '您的分数',
                data: chartData,
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                pointBackgroundColor: dimensionNames.map(
                  dim => dimensions[dim].color
                ),
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: dimensionNames.map(
                  dim => dimensions[dim].color
                ),
                pointRadius: 6,
                pointHoverRadius: 8
              },
              {
                label: '参考值',
                data: Array(8).fill(2.5),
                borderColor: 'rgba(251, 191, 36, 0.6)',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                pointRadius: 0,
                borderDash: [5, 5]
              }
            ]
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
                  font: { size: 11 }
                },
                pointLabels: {
                  font: { size: 10 }
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
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
    const health = getOverallHealth(parseFloat(results.avgScore));

    const text = `🏡 我的原生家庭健康度测评结果

整体评估：${health.level}
平均分数：${results.avgScore} / 5.0

📊 重点关注维度 TOP3：
${results.topDimensions.map(([dim, score], index) =>
        `${index + 1}. ${dimensions[dim].icon} ${dim} - ${score}分`
      ).join('\n')}

这是一面帮助我们更好认识自己的镜子 🪞
#原生家庭 #自我成长 #疗愈之路`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ 结果已复制到剪贴板！');
      }).catch((err) => {
        console.error('复制失败:', err);
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      alert('✅ 结果已复制到剪贴板！');
    } catch (err) {
      console.error('复制失败:', err);
      alert('❌ 复制失败,请手动复制内容');
    }
    document.body.removeChild(textArea);
  };

  const renderResult = () => {
    let finalAnswers = answers;

    if (Object.keys(finalAnswers).length === 0) {
      try {
        const records = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('family_health_')) {
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
    const health = getOverallHealth(parseFloat(results.avgScore));

    return React.createElement('div', { className: "min-h-screen healing-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8 fade-in" },

        React.createElement('div', { className: `${health.bgColor} rounded-2xl p-6 sm:p-8 mb-8 border-2 border-gray-200` },
          React.createElement('div', { className: "text-center" },
            React.createElement('div', { className: "text-6xl sm:text-8xl mb-4" }, '🪞'),
            React.createElement('h2', { className: `text-2xl sm:text-4xl font-bold mb-4 ${health.color}` },
              health.level
            ),
            React.createElement('div', { className: "text-lg sm:text-xl text-gray-700 mb-6" },
              '您的整体平均分数：',
              React.createElement('span', { className: `font-bold text-2xl ml-2 ${health.color}` },
                results.avgScore
              ),
              React.createElement('span', { className: "text-gray-500" }, ' / 5.0')
            ),

            parseFloat(results.avgScore) >= 3.5 && React.createElement('div', { className: "bg-white bg-opacity-70 rounded-xl p-4 backdrop-blur-sm" },
              React.createElement('p', { className: "text-gray-700 leading-relaxed" },
                '💡 建议寻求专业的心理咨询支持，专业咨询师可以帮助您更好地理解和疗愈原生家庭带来的影响。'
              )
            )
          )
        ),

        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8" },
          React.createElement('div', { className: "bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200" },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 text-center" },
              '您的原生家庭伤痛结构图'
            ),
            React.createElement('div', { className: "relative h-80" },
              React.createElement('canvas', { ref: chartRef })
            ),
            React.createElement('p', { className: "text-sm text-gray-600 text-center mt-3" },
              '越靠近顶端，说明您的伤痛越大'
            )
          ),

          React.createElement('div', { className: "space-y-4" },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" },
              '⭐ 重点关注维度 TOP3'
            ),
            results.topDimensions.map(([dimName, score], index) => {
              const dimInfo = dimensions[dimName];
              const levelInfo = getLevelInfo(parseFloat(score));
              const medals = ['🥇', '🥈', '🥉'];

              return React.createElement('div', {
                key: dimName,
                className: "bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow",
                style: { borderColor: dimInfo.color }
              },
                React.createElement('div', { className: "flex items-center justify-between mb-2" },
                  React.createElement('div', { className: "flex items-center space-x-3" },
                    React.createElement('span', { className: "text-3xl" }, medals[index]),
                    React.createElement('div', null,
                      React.createElement('div', { className: "flex items-center space-x-2" },
                        React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                        React.createElement('span', { className: "font-bold text-lg" }, dimName)
                      ),
                      React.createElement('div', { className: "text-sm text-gray-600" },
                        dimInfo.description
                      )
                    )
                  ),
                  React.createElement('div', { className: "text-right" },
                    React.createElement('div', {
                      className: "text-2xl font-bold",
                      style: { color: dimInfo.color }
                    },
                      score
                    ),
                    React.createElement('div', { className: `result-badge ${levelInfo.class} mt-1` },
                      levelInfo.desc
                    )
                  )
                ),
                React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2 mt-3" },
                  React.createElement('div', {
                    className: "h-2 rounded-full transition-all",
                    style: {
                      width: `${(parseFloat(score) / 5) * 100}%`,
                      backgroundColor: dimInfo.color
                    }
                  })
                )
              );
            })
          )
        ),

        React.createElement('div', { className: "mb-8 space-y-6" },
          React.createElement('h3', { className: "text-2xl font-bold text-gray-800 mb-4" },
            '📖 重点维度深度解读'
          ),
          results.topDimensions.map(([dimName, score]) => {
            const dimInfo = dimensions[dimName];
            const detail = dimensionDetails[dimName];
            const levelInfo = getLevelInfo(parseFloat(score));

            return React.createElement('div', {
              key: dimName,
              className: "bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-l-4 shadow-sm",
              style: { borderLeftColor: dimInfo.color }
            },
              React.createElement('div', { className: "flex items-center justify-between mb-4" },
                React.createElement('div', { className: "flex items-center space-x-3" },
                  React.createElement('span', { className: "text-4xl" }, dimInfo.icon),
                  React.createElement('div', null,
                    React.createElement('h4', { className: "text-xl font-bold", style: { color: dimInfo.color } },
                      dimName
                    ),
                    React.createElement('span', { className: `result-badge ${levelInfo.class} mt-1` },
                      `伤痛程度：${levelInfo.desc}`
                    )
                  )
                )
              ),

              React.createElement('div', { className: "space-y-4 text-gray-700" },
                React.createElement('div', null,
                  React.createElement('h5', { className: "font-semibold text-gray-800 mb-2 flex items-center" },
                    React.createElement('span', { className: "mr-2" }, '▲'),
                    '具体表现'
                  ),
                  React.createElement('p', { className: "leading-relaxed pl-6" },
                    detail.manifestation
                  )
                ),

                React.createElement('div', null,
                  React.createElement('h5', { className: "font-semibold text-gray-800 mb-2 flex items-center" },
                    React.createElement('span', { className: "mr-2" }, '◆'),
                    '伤痛成因'
                  ),
                  React.createElement('p', { className: "leading-relaxed pl-6" },
                    detail.cause
                  )
                ),

                React.createElement('div', null,
                  React.createElement('h5', { className: "font-semibold text-gray-800 mb-2 flex items-center" },
                    React.createElement('span', { className: "mr-2" }, '●'),
                    '影响与建议'
                  ),
                  React.createElement('p', { className: "leading-relaxed pl-6" },
                    detail.impact
                  )
                )
              )
            );
          })
        ),

        React.createElement('div', { className: "mb-8" },
          React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" },
            '📊 完整维度评估'
          ),
          React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
            results.sortedDimensions.map(([dimName, score]) => {
              const dimInfo = dimensions[dimName];
              const scoreNum = parseFloat(score);
              const levelInfo = getLevelInfo(scoreNum);

              return React.createElement('div', {
                key: dimName,
                className: "bg-gray-50 rounded-lg p-4 border hover:shadow-md transition-shadow"
              },
                React.createElement('div', { className: "flex items-center justify-between mb-2" },
                  React.createElement('div', { className: "flex items-center space-x-2" },
                    React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                    React.createElement('span', { className: "font-semibold" }, dimName)
                  ),
                  React.createElement('div', { className: "flex items-center space-x-2" },
                    React.createElement('span', {
                      className: "font-bold text-lg",
                      style: { color: dimInfo.color }
                    },
                      score
                    ),
                    React.createElement('span', { className: `result-badge ${levelInfo.class}` },
                      levelInfo.level
                    )
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
              );
            })
          )
        ),

        React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8" },
          React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 flex items-center" },
            React.createElement('span', { className: "mr-2" }, '💡'),
            '疗愈与成长建议'
          ),
          React.createElement('div', { className: "space-y-3 text-gray-700" },
            React.createElement('p', { className: "leading-relaxed" },
              React.createElement('strong', null, '1. 接纳与觉察：'),
              ' 认识到这些模式的存在，是疗愈的第一步。对自己温柔一些，这些反应是你为了生存而发展出的保护机制。'
            ),
            React.createElement('p', { className: "leading-relaxed" },
              React.createElement('strong', null, '2. 寻求支持：'),
              parseFloat(results.avgScore) >= 3.5
                ? '您的得分较高，强烈建议寻求专业心理咨询师的帮助。专业的支持可以让疗愈之路更加安全有效。'
                : '考虑加入支持小组，或寻求心理咨询，在专业的陪伴下探索和疗愈。'
            ),
            React.createElement('p', { className: "leading-relaxed" },
              React.createElement('strong', null, '3. 建立新模式：'),
              ' 通过正念练习、情绪日记等方式，逐步建立更健康的应对模式。改变需要时间，请给自己足够的耐心。'
            )
          )
        ),

        React.createElement('div', { className: "mb-8" },
          React.createElement('div', { className: "bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200" },
            React.createElement('div', { className: "text-center mb-6" },
              React.createElement('h3', { className: "text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center" },
                React.createElement('span', { className: "mr-2" }, '📚'),
                '心理成长资源推荐'
              ),
              React.createElement('p', { className: "text-gray-600 text-sm" }, '探索内心,关照自己的每一面')
            ),

            React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
              React.createElement('a', {
                href: "https://xhslink.com/m/9D0epdzjqnw",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 group"
              },
                React.createElement('div', { className: "flex items-start space-x-3" },
                  React.createElement('span', { className: "text-3xl group-hover:scale-110 transition-transform" }, '📖'),
                  React.createElement('div', { className: "flex-1" },
                    React.createElement('div', { className: "font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors" },
                      '更多心理自测工具'
                    ),
                    React.createElement('div', { className: "text-sm text-gray-500" },
                      '帮助觉察当下情绪'
                    )
                  ),
                  React.createElement('span', { className: "text-gray-400 group-hover:text-green-600 transition-colors" }, '→')
                )
              ),

              React.createElement('a', {
                href: "https://pan.quark.cn/s/266f60aa5bbf",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "block bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group"
              },
                React.createElement('div', { className: "flex items-start space-x-3" },
                  React.createElement('span', { className: "text-3xl group-hover:scale-110 transition-transform" }, '💡'),
                  React.createElement('div', { className: "flex-1" },
                    React.createElement('div', { className: "font-bold text-gray-800 mb-1 group-hover:text-yellow-600 transition-colors" },
                      '2026重启人生365天时间规划表'
                    ),
                    React.createElement('div', { className: "text-sm text-gray-500" },
                      '系统规划美好未来'
                    )
                  ),
                  React.createElement('span', { className: "text-gray-400 group-hover:text-yellow-600 transition-colors" }, '→')
                )
              )
            )
          )
        ),

        React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center items-center" },
          React.createElement('button', {
            onClick: copyResultText,
            className: "w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          },
            '📋 复制结果文案'
          ),

          React.createElement('button', {
            onClick: () => {
              setCurrentPage('intro');
              setCurrentQuestion(0);
              setAnswers({});
              setAgreedToWarning(false);
              window.scrollTo(0, 0);
            },
            className: "w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          },
            '🔄 重新测评'
          )
        ),

        React.createElement('div', { className: "mt-8 text-center text-sm text-gray-500 space-y-2" },
          React.createElement('p', null, '💝 本测评结果已自动保存'),
          React.createElement('p', { className: "max-w-2xl mx-auto" },
            '此测评仅供自我探索参考，不能替代专业诊断。如需专业帮助，请寻求心理咨询师的支持。'
          ),
          React.createElement('p', { className: "text-xs text-gray-400 mt-4" },
            '疗愈是一个过程，请温柔地对待自己 🌱'
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
root.render(
  React.createElement(ErrorBoundary, null,
    React.createElement(FamilyHealthAssessment)
  )
);