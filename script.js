const { useState, useEffect, useRef } = React;

const SCL90Assessment = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const chartRef = useRef(null);

  // SCL-90题目数据
  const questions = [
    { id: 1, text: "头痛", factor: "躯体化" },
    { id: 2, text: "神经过敏，心中不踏实", factor: "强迫症状" },
    { id: 3, text: "头脑中有不必要的想法或字句盘旋", factor: "强迫症状" },
    { id: 4, text: "头昏或昏倒", factor: "躯体化" },
    { id: 5, text: "对异性的兴趣减退", factor: "抑郁症状" },
    { id: 6, text: "对旁人责备求全", factor: "敌对症状" },
    { id: 7, text: "感到别人能控制您的思想", factor: "精神病性" },
    { id: 8, text: "责怪别人制造麻烦", factor: "敌对症状" },
    { id: 9, text: "忘记性大", factor: "强迫症状" },
    { id: 10, text: "担心自己的衣饰整齐及仪表的端正", factor: "强迫症状" },
    { id: 11, text: "容易烦恼和激动", factor: "焦虑症状" },
    { id: 12, text: "胸痛", factor: "躯体化" },
    { id: 13, text: "害怕空旷的场所或街道", factor: "恐怖症状" },
    { id: 14, text: "感到自己的精力下降，活动减慢", factor: "抑郁症状" },
    { id: 15, text: "想结束自己的生命", factor: "抑郁症状" },
    { id: 16, text: "听到旁人听不到的声音", factor: "精神病性" },
    { id: 17, text: "发抖", factor: "焦虑症状" },
    { id: 18, text: "感到大多数人都不可信任", factor: "偏执症状" },
    { id: 19, text: "食欲不振", factor: "睡眠饮食" },
    { id: 20, text: "容易哭泣", factor: "抑郁症状" },
    { id: 21, text: "同异性相处时感到害羞不自在", factor: "人际关系敏感" },
    { id: 22, text: "感到受骗，中圈套或有人想抓住您", factor: "偏执症状" },
    { id: 23, text: "无缘无故地突然感到害怕", factor: "焦虑症状" },
    { id: 24, text: "自己不能控制地大发脾气", factor: "敌对症状" },
    { id: 25, text: "怕单独出门", factor: "恐怖症状" },
    { id: 26, text: "经常责怪自己", factor: "抑郁症状" },
    { id: 27, text: "腰痛", factor: "躯体化" },
    { id: 28, text: "感到难以完成任务", factor: "强迫症状" },
    { id: 29, text: "感到孤独", factor: "抑郁症状" },
    { id: 30, text: "感到苦闷", factor: "抑郁症状" },
    { id: 31, text: "过分担忧", factor: "焦虑症状" },
    { id: 32, text: "对事物不感兴趣", factor: "抑郁症状" },
    { id: 33, text: "感到害怕", factor: "焦虑症状" },
    { id: 34, text: "您的感情容易受到伤害", factor: "人际关系敏感" },
    { id: 35, text: "旁人能知道您的私下想法", factor: "精神病性" },
    { id: 36, text: "感到别人不理解您或不同情您", factor: "人际关系敏感" },
    { id: 37, text: "感到人们对您不友好，不喜欢您", factor: "人际关系敏感" },
    { id: 38, text: "做事必须做得很慢以保证做得正确", factor: "强迫症状" },
    { id: 39, text: "心跳得很厉害", factor: "焦虑症状" },
    { id: 40, text: "恶心或胃部不舒服", factor: "躯体化" },
    { id: 41, text: "感到比不上他人", factor: "人际关系敏感" },
    { id: 42, text: "肌肉酸痛", factor: "躯体化" },
    { id: 43, text: "感到有人在监视您，谈论您", factor: "偏执症状" },
    { id: 44, text: "难以入睡", factor: "睡眠饮食" },
    { id: 45, text: "做事必须反复检查", factor: "强迫症状" },
    { id: 46, text: "难以做出决定", factor: "强迫症状" },
    { id: 47, text: "怕乘电车、公共汽车、地铁或火车", factor: "恐怖症状" },
    { id: 48, text: "呼吸有困难", factor: "焦虑症状" },
    { id: 49, text: "一阵阵发冷或发热", factor: "躯体化" },
    { id: 50, text: "因为感到害怕而避开某些东西、场所或活动", factor: "恐怖症状" },
    { id: 51, text: "脑子变空了", factor: "精神病性" },
    { id: 52, text: "身体发麻或刺痛", factor: "躯体化" },
    { id: 53, text: "喉咙有梗塞感", factor: "躯体化" },
    { id: 54, text: "感到前途没有希望", factor: "抑郁症状" },
    { id: 55, text: "不能集中注意力", factor: "强迫症状" },
    { id: 56, text: "感到身体的某一部分软弱无力", factor: "躯体化" },
    { id: 57, text: "感到紧张或心神不定", factor: "焦虑症状" },
    { id: 58, text: "感到手或脚发重", factor: "躯体化" },
    { id: 59, text: "想到死亡的事", factor: "抑郁症状" },
    { id: 60, text: "吃得太多", factor: "睡眠饮食" },
    { id: 61, text: "当别人看着您或谈论您时感到不自在", factor: "人际关系敏感" },
    { id: 62, text: "有一些不属于您自己的想法", factor: "精神病性" },
    { id: 63, text: "有想打人或伤害他人的冲动", factor: "敌对症状" },
    { id: 64, text: "醒得太早", factor: "睡眠饮食" },
    { id: 65, text: "必须反复洗手、点数", factor: "强迫症状" },
    { id: 66, text: "睡得不稳不深", factor: "睡眠饮食" },
    { id: 67, text: "有想摔坏或破坏东西的想法", factor: "敌对症状" },
    { id: 68, text: "有一些别人没有的想法", factor: "精神病性" },
    { id: 69, text: "感到对别人神经过敏", factor: "人际关系敏感" },
    { id: 70, text: "在商店或电影院等人多的地方感到不自在", factor: "恐怖症状" },
    { id: 71, text: "感到任何事情都很困难", factor: "抑郁症状" },
    { id: 72, text: "一阵阵恐惧或惊恐", factor: "焦虑症状" },
    { id: 73, text: "感到在公共场所吃东西很不舒服", factor: "恐怖症状" },
    { id: 74, text: "经常与人争论", factor: "敌对症状" },
    { id: 75, text: "单独一人时神经很紧张", factor: "恐怖症状" },
    { id: 76, text: "别人对您的成绩没有作出恰当的评价", factor: "偏执症状" },
    { id: 77, text: "即使和别人在一起也感到孤单", factor: "抑郁症状" },
    { id: 78, text: "感到坐立不安心神不定", factor: "焦虑症状" },
    { id: 79, text: "感到自己没有什么价值", factor: "抑郁症状" },
    { id: 80, text: "感到熟悉的东西变成陌生或不真实", factor: "精神病性" },
    { id: 81, text: "大叫或摔东西", factor: "敌对症状" },
    { id: 82, text: "害怕会在公共场所昏倒", factor: "恐怖症状" },
    { id: 83, text: "感到别人想占您的便宜", factor: "偏执症状" },
    { id: 84, text: "为一些有关性的想法而很苦恼", factor: "精神病性" },
    { id: 85, text: "您认为应该因为自己的过错而受到惩罚", factor: "偏执症状" },
    { id: 86, text: "感到要很快把事情做完", factor: "强迫症状" },
    { id: 87, text: "感到自己的身体有严重问题", factor: "躯体化" },
    { id: 88, text: "从未感到和其他人很亲近", factor: "人际关系敏感" },
    { id: 89, text: "感到有罪", factor: "偏执症状" },
    { id: 90, text: "感到自己的脑子有毛病", factor: "精神病性" }
  ];

  // 选项标签
  const options = [
    { value: 1, label: 'A', text: '从无' },
    { value: 2, label: 'B', text: '很轻' },
    { value: 3, label: 'C', text: '中等' },
    { value: 4, label: 'D', text: '偏重' },
    { value: 5, label: 'E', text: '严重' }
  ];

  // 因子分类和详细信息
  const factors = {
    "躯体化": {
      name: "躯体化",
      items: [],
      description: "反映主观感受到的身体不适感，包括各种疼痛和不适症状",
      suggestions: ["适当的体育锻炼", "放松训练", "规律作息", "必要时就医检查"]
    },
    "强迫症状": {
      name: "强迫症状",
      items: [],
      description: "反映强迫观念和强迫行为，包括思维和行为的重复性",
      suggestions: ["认知行为疗法", "放松训练", "转移注意力", "建立良好的生活习惯"]
    },
    "人际关系敏感": {
      name: "人际关系敏感",
      items: [],
      description: "在人际交往中的不自在感和自卑感",
      suggestions: ["提升沟通技巧", "培养自信心", "参与社交活动", "寻求专业心理支持"]
    },
    "抑郁症状": {
      name: "抑郁症状",
      items: [],
      description: "反映情绪低落、兴趣减退、绝望感等抑郁相关症状",
      suggestions: ["保持积极心态", "规律运动", "充足睡眠", "寻求专业帮助"]
    },
    "焦虑症状": {
      name: "焦虑症状",
      items: [],
      description: "反映紧张、不安、恐惧等焦虑相关症状",
      suggestions: ["深呼吸练习", "冥想放松", "规律作息", "减少刺激性食物"]
    },
    "敌对症状": {
      name: "敌对症状",
      items: [],
      description: "反映愤怒、冲动、攻击性等敌对情绪和行为",
      suggestions: ["情绪管理技巧", "沟通技巧训练", "寻找情绪发泄渠道", "专业心理咨询"]
    },
    "恐怖症状": {
      name: "恐怖症状",
      items: [],
      description: "反映对特定对象、场所或情境的过度恐惧",
      suggestions: ["渐进式暴露疗法", "放松训练", "认知重构", "寻求专业治疗"]
    },
    "偏执症状": {
      name: "偏执症状",
      items: [],
      description: "反映猜疑、不信任、自我中心等偏执思维",
      suggestions: ["认知行为治疗", "建立信任关系", "理性思维训练", "专业心理帮助"]
    },
    "精神病性": {
      name: "精神病性",
      items: [],
      description: "反映思维、感知异常等精神病性症状",
      suggestions: ["立即寻求专业医疗帮助", "遵医嘱用药", "家人陪伴支持", "定期复诊"]
    },
    "睡眠饮食": {
      name: "睡眠饮食",
      items: [],
      description: "反映睡眠和饮食方面的问题",
      suggestions: ["规律作息时间", "健康饮食习惯", "睡前放松", "避免刺激物质"]
    }
  };

  // 将题目分配到对应因子
  questions.forEach(q => {
    if (factors[q.factor]) {
      factors[q.factor].items.push(q.id);
    }
  });

  const handleStartTest = () => {
    // 初始化兑换码弹窗
    if (typeof window.GithubRedeemModal !== 'undefined') {
      const modal = new window.GithubRedeemModal();

      // 设置成功回调
      modal.setCallbacks({
        onSuccess: (result) => {
          console.log('兑换码验证成功:', result);
          // 验证成功后开始测试
          setCurrentPage('test');
          setCurrentQuestion(0);
          setAnswers({});
        },
        onCancel: () => {
          console.log('用户取消验证');
          // 用户取消，不做任何操作
        }
      });

      // 显示兑换码弹窗
      modal.show();
    } else {
      console.error('兑换码弹窗组件未加载');
      // 如果兑换码组件加载失败，直接开始测试（备用方案）
      setCurrentPage('test');
      setCurrentQuestion(0);
      setAnswers({});
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentPage('result');
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    const factorScores = {};

    // 初始化因子分数
    Object.keys(factors).forEach(factor => {
      factorScores[factor] = 0;
    });

    // 计算总分和各因子分数
    questions.forEach(q => {
      const score = answers[q.id] || 1;
      totalScore += score;
      if (factorScores[q.factor] !== undefined) {
        factorScores[q.factor] += score;
      }
    });

    // 计算平均分
    const avgScore = (totalScore / 90).toFixed(2);

    // 计算各因子平均分
    const factorAvgScores = {};
    Object.keys(factors).forEach(factor => {
      const itemCount = factors[factor].items.length;
      if (itemCount > 0) {
        factorAvgScores[factor] = (factorScores[factor] / itemCount).toFixed(2);
      }
    });

    return { totalScore, avgScore, factorScores, factorAvgScores };
  };

  const getLevel = (avgScore) => {
    const score = parseFloat(avgScore);
    if (score >= 1.0 && score < 2.0) return { level: '良好', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (score >= 2.0 && score < 3.0) return { level: '轻微', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (score >= 3.0 && score < 4.0) return { level: '中度', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    if (score >= 4.0 && score <= 5.0) return { level: '重度', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    return { level: '良好', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  };

  const getOverallAssessment = (totalScore, avgScore) => {
    const score = parseFloat(avgScore);
    const total = parseInt(totalScore);

    if (total <= 160 && score < 2.0) {
      return {
        level: "心理状态良好",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        description: "您的心理状态总体良好，各项指标都在正常范围内。继续保持积极的生活态度和良好的生活习惯。",
        icon: "😊"
      };
    } else if (total <= 200 && score < 3.0) {
      return {
        level: "需要关注",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        description: "您可能在某些方面感受到了一定的心理压力。建议适当调节生活节奏，寻找合适的减压方式。",
        icon: "🤔"
      };
    } else if (total <= 250 && score < 4.0) {
      return {
        level: "建议咨询",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        description: "您的心理状态需要得到关注，建议寻求专业的心理咨询师帮助，进行更深入的评估和指导。",
        icon: "😟"
      };
    } else {
      return {
        level: "需要专业帮助",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        description: "您的心理状态需要专业医疗人员的帮助。建议尽快就医，进行详细的心理健康评估和治疗。",
        icon: "😰"
      };
    }
  };

  // 创建雷达图
  useEffect(() => {
    if (currentPage === 'result' && chartRef.current) {
      const results = calculateResults();
      const ctx = chartRef.current.getContext('2d');

      // 清除之前的图表
      Chart.getChart(ctx)?.destroy();

      const factorNames = Object.keys(factors);
      const factorData = factorNames.map(factor => parseFloat(results.factorAvgScores[factor]));

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: factorNames.map(factor => factors[factor].name),
          datasets: [{
            label: '您的得分',
            data: factorData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(59, 130, 246)'
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
                stepSize: 1
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
    }
  }, [currentPage]);

  const renderIntro = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">SCL-90症状自评量表</h1>
          <p className="text-sm sm:text-base text-gray-600">专业心理健康评估工具</p>
        </div>

        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
          <p className="text-base sm:text-lg">
            SCL-90（Symptom Checklist 90）是一种常用的心理健康自评量表，包含90个项目，涉及感觉、情感、思维、意识、行为、
            生活习惯、人际关系、饮食睡眠等多个方面。
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-800">⚠️ 重要提醒</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• 量表只是辅助评估工具，可以帮助了解自己的情绪状况</li>
              <li>• 测试结果仅供参考，不代表实际诊断</li>
              <li>• 如有严重心理困扰，请及时寻求专业医疗帮助</li>
            </ul>
          </div>

          <p>
            请仔细阅读以下每一条描述，并根据您在<strong>最近一周内</strong>的实际感受，选择最适合的答案。
          </p>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">评分标准：</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">A</span>
                <span className="font-medium">从无：</span>
                <span className="text-sm">没有或很少时间有</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center">B</span>
                <span className="font-medium">很轻：</span>
                <span className="text-sm">少部分时间有</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">C</span>
                <span className="font-medium">中等：</span>
                <span className="text-sm">相当多时间有</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">D</span>
                <span className="font-medium">偏重：</span>
                <span className="text-sm">绝大部分时间有</span>
              </div>
              <div className="flex items-center space-x-2 sm:col-span-2">
                <span className="w-6 h-6 bg-red-700 text-white text-xs font-bold rounded-full flex items-center justify-center">E</span>
                <span className="font-medium">严重：</span>
                <span className="text-sm">全部时间都有</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={handleStartTest}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            开始测试 (90题)
          </button>
        </div>
      </div>
    </div>
  );

  const renderTest = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">SCL-90症状自评量表</h2>
          <div className="text-gray-600">
            <span className="text-lg sm:text-xl font-semibold">第 {currentQuestion + 1} 题</span>
            <span className="ml-2 sm:ml-4 text-sm sm:text-base">共 90 题</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 sm:mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 90) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1">
            {((currentQuestion + 1) / 90 * 100).toFixed(1)}% 完成
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-2xl font-medium text-gray-800 text-center mb-6 sm:mb-8 leading-relaxed px-2">
            {questions[currentQuestion].text}
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-3 sm:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 active:scale-98"
              >
                <div className="flex items-center">
                  <span className="font-bold text-base sm:text-lg text-blue-600 mr-3 sm:mr-4 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    {option.label}
                  </span>
                  <span className="text-sm sm:text-base text-gray-800">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          {currentQuestion > 0 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base py-2 px-4 rounded-lg hover:bg-gray-100"
            >
              ← 上一题
            </button>
          ) : (
            <div></div>
          )}

          <div className="text-xs sm:text-sm text-gray-400">
            剩余 {90 - currentQuestion - 1} 题
          </div>
        </div>
      </div>
    </div>
  );

  const renderResult = () => {
    const results = calculateResults();
    const overallAssessment = getOverallAssessment(results.totalScore, results.avgScore);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8">

          {/* 总体评估卡片 */}
          <div className={`${overallAssessment.bgColor} ${overallAssessment.borderColor} border-2 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8`}>
            <div className="text-center">
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{overallAssessment.icon}</div>
              <h2 className={`text-xl sm:text-3xl font-bold ${overallAssessment.color} mb-2 sm:mb-4`}>
                {overallAssessment.level}
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-3 sm:mb-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gray-800">{results.totalScore}</div>
                  <div className="text-xs sm:text-sm text-gray-600">总分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-bold text-gray-800">{results.avgScore}</div>
                  <div className="text-xs sm:text-sm text-gray-600">平均分</div>
                </div>
              </div>
              <p className={`${overallAssessment.color} text-sm sm:text-base leading-relaxed`}>
                {overallAssessment.description}
              </p>
            </div>
          </div>

          {/* 雷达图和因子得分 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">

            {/* 雷达图 */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">各维度评估图</h3>
              <div className="relative h-64 sm:h-80">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>

            {/* 因子得分列表 */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">详细因子分析</h3>
              <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                {Object.keys(factors).map(factor => {
                  const avgScore = results.factorAvgScores[factor];
                  const level = getLevel(avgScore);
                  return (
                    <div key={factor} className={`${level.bgColor} ${level.borderColor} border rounded-lg p-3 sm:p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`font-semibold text-sm sm:text-base ${level.textColor}`}>
                          {factors[factor].name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm sm:text-base font-bold">{avgScore}</span>
                          <span className={`px-2 py-1 rounded-full text-white text-xs ${level.color}`}>
                            {level.level}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${level.color}`}
                          style={{ width: `${(avgScore / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 详细分析和建议 */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">详细分析与建议</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {Object.keys(factors).map(factor => {
                const avgScore = results.factorAvgScores[factor];
                const level = getLevel(avgScore);
                const factorInfo = factors[factor];

                if (parseFloat(avgScore) >= 2.0) { // 只显示需要关注的因子
                  return (
                    <div key={factor} className={`${level.bgColor} ${level.borderColor} border rounded-xl p-4 sm:p-6`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className={`text-lg font-bold ${level.textColor}`}>
                          {factorInfo.name}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${level.color}`}>
                          {level.level}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                        {factorInfo.description}
                      </p>

                      <div>
                        <h5 className="font-semibold text-gray-800 mb-2 text-sm">💡 改善建议：</h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {factorInfo.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* 评分标准说明 */}
          <div className="mt-6 sm:mt-8 bg-gray-50 rounded-xl p-4 sm:p-6">
            <h4 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">📊 评分标准说明：</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded"></span>
                <span><strong>良好：</strong> 1.0-2.0分</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-yellow-500 rounded"></span>
                <span><strong>轻微：</strong> 2.0-3.0分</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-orange-500 rounded"></span>
                <span><strong>中度：</strong> 3.0-4.0分</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-500 rounded"></span>
                <span><strong>重度：</strong> 4.0-5.0分</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                <strong>参考标准：</strong>按中国常模结果，SCL-90总分超过160分或单项均分超过2分建议进一步检查；
                总分超过200分说明有明显心理问题，可寻求心理咨询；超过250分则较为严重，需要详细医学检查和专业治疗。
              </p>
            </div>
          </div>
          {/* 资源下载链接 */}
<div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6">
  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 text-center">📖 心理健康资源</h4>
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
    <a
      href="https://pan.quark.cn/s/ad34f9a1dc43"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base shadow-lg hover:shadow-xl"
    >
      📚 推荐书单
    </a>
    <a
      href="https://pan.quark.cn/s/ad34f9a1dc43"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base shadow-lg hover:shadow-xl"
    >
      ✨ 提升能量
    </a>
  </div>
</div>
          <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
            <button
              onClick={() => {
                setCurrentPage('intro');
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              重新测试
            </button>

            <div className="text-xs sm:text-sm text-gray-500">
              本测试结果仅供参考，如有严重心理困扰请及时寻求专业医疗帮助
            </div>
          </div>
        </div>
      </div>
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
root.render(<SCL90Assessment />);