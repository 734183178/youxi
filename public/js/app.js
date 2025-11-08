/**
 * SCL-90测试应用
 * React应用主文件
 */

const { useState, useEffect } = React;

// SCL-90题目数据
const questions = [
    { id: 1, text: "头痛", factor: "躯体化" },
    { id: 2, text: "神经过敏,心中不踏实", factor: "强迫症状" },
    { id: 3, text: "头脑中有不必要的想法或字句盘旋", factor: "强迫症状" },
    { id: 4, text: "头昏或昏倒", factor: "躯体化" },
    { id: 5, text: "对异性的兴趣减退", factor: "人际关系敏感" },
    { id: 6, text: "对旁人责骂求全", factor: "敌对" },
    { id: 7, text: "感到别人能控制您的思想", factor: "偏执" },
    { id: 8, text: "责怪别人制造麻烦", factor: "偏执" },
    { id: 9, text: "忘性大", factor: "精神病性" },
    { id: 10, text: "担心自己的衣饰整齐及仪态的端正", factor: "强迫症状" },
    { id: 11, text: "容易烦恼和激动", factor: "敌对" },
    { id: 12, text: "胸痛", factor: "躯体化" },
    { id: 13, text: "害怕空旷的场所或街道", factor: "恐怖" },
    { id: 14, text: "感到自己的精力下降,活动减慢", factor: "抑郁" },
    { id: 15, text: "想结束自己的生命", factor: "抑郁" },
    { id: 16, text: "听到旁人所听不到的声音", factor: "精神病性" },
    { id: 17, text: "发抖", factor: "焦虑" },
    { id: 18, text: "感到大多数人都不可信任", factor: "人际关系敏感" },
    { id: 19, text: "胃口不好", factor: "躯体化" },
    { id: 20, text: "容易哭泣", factor: "抑郁" },
    { id: 21, text: "同异性相处时感到害羞不自在", factor: "人际关系敏感" },
    { id: 22, text: "感到受骗,中了圈套或有人想抓您", factor: "偏执" },
    { id: 23, text: "无缘无故地突然感到害怕", factor: "恐怖" },
    { id: 24, text: "自己不能控制地大发脾气", factor: "敌对" },
    { id: 25, text: "怕单独出门", factor: "恐怖" },
    { id: 26, text: "经常责怪自己", factor: "抑郁" },
    { id: 27, text: "腰痛", factor: "躯体化" },
    { id: 28, text: "感到难以完成任务", factor: "强迫症状" },
    { id: 29, text: "感到孤独", factor: "抑郁" },
    { id: 30, text: "感到苦闷", factor: "抑郁" },
    { id: 31, text: "过分担忧", factor: "焦虑" },
    { id: 32, text: "对事物不感兴趣", factor: "抑郁" },
    { id: 33, text: "感到害怕", factor: "恐怖" },
    { id: 34, text: "您的感情容易受到伤害", factor: "人际关系敏感" },
    { id: 35, text: "旁人能知道您的私下想法", factor: "精神病性" },
    { id: 36, text: "感到别人不理解您、不同情您", factor: "人际关系敏感" },
    { id: 37, text: "感到人们对您不友好,不喜欢您", factor: "人际关系敏感" },
    { id: 38, text: "做事必须做得很慢以保证做得正确", factor: "强迫症状" },
    { id: 39, text: "心跳得很厉害", factor: "焦虑" },
    { id: 40, text: "恶心或胃部不舒服", factor: "躯体化" },
    { id: 41, text: "感到比不上他人", factor: "人际关系敏感" },
    { id: 42, text: "肌肉酸痛", factor: "躯体化" },
    { id: 43, text: "感到有人在监视您、谈论您", factor: "偏执" },
    { id: 44, text: "难以入睡", factor: "抑郁" },
    { id: 45, text: "做事必须反复检查", factor: "强迫症状" },
    { id: 46, text: "难以做出决定", factor: "强迫症状" },
    { id: 47, text: "怕乘电车、公共汽车、地铁或火车", factor: "恐怖" },
    { id: 48, text: "呼吸有困难", factor: "焦虑" },
    { id: 49, text: "一阵阵发冷或发热", factor: "躯体化" },
    { id: 50, text: "因为感到害怕而避开某些东西、场合或活动", factor: "恐怖" },
    { id: 51, text: "脑子变空了", factor: "精神病性" },
    { id: 52, text: "身体发麻或刺痛", factor: "躯体化" },
    { id: 53, text: "喉咙有梗塞感", factor: "躯体化" },
    { id: 54, text: "感到前途没有希望", factor: "抑郁" },
    { id: 55, text: "不能集中注意力", factor: "强迫症状" },
    { id: 56, text: "感到身体的某一部分软弱无力", factor: "躯体化" },
    { id: 57, text: "感到紧张或容易紧张", factor: "焦虑" },
    { id: 58, text: "感到手或脚发重", factor: "躯体化" },
    { id: 59, text: "想到死亡的事", factor: "抑郁" },
    { id: 60, text: "吃得太多", factor: "躯体化" },
    { id: 61, text: "当别人看着您或谈论您时感到不自在", factor: "人际关系敏感" },
    { id: 62, text: "有一些不属于您自己的想法", factor: "精神病性" },
    { id: 63, text: "有想打人或伤害他人的冲动", factor: "敌对" },
    { id: 64, text: "醒得太早", factor: "抑郁" },
    { id: 65, text: "必须反复洗手、点数", factor: "强迫症状" },
    { id: 66, text: "睡得不稳不深", factor: "抑郁" },
    { id: 67, text: "有想摔坏或破坏东西的想法", factor: "敌对" },
    { id: 68, text: "有一些别人没有的想法或念头", factor: "精神病性" },
    { id: 69, text: "感到对别人神经过敏", factor: "人际关系敏感" },
    { id: 70, text: "在商店或电影院等人多的地方感到不自在", factor: "恐怖" },
    { id: 71, text: "感到任何事情都很困难", factor: "抑郁" },
    { id: 72, text: "一阵阵恐惧或惊恐", factor: "焦虑" },
    { id: 73, text: "感到公共场合吃东西很不舒服", factor: "恐怖" },
    { id: 74, text: "经常与人争论", factor: "敌对" },
    { id: 75, text: "单独一人时神经很紧张", factor: "恐怖" },
    { id: 76, text: "别人对您的成绩没有做出恰当的评价", factor: "偏执" },
    { id: 77, text: "即使和别人在一起也感到孤单", factor: "人际关系敏感" },
    { id: 78, text: "感到坐立不安心神不定", factor: "焦虑" },
    { id: 79, text: "感到自己没有什么价值", factor: "抑郁" },
    { id: 80, text: "感到熟悉的东西变成陌生或不真实", factor: "精神病性" },
    { id: 81, text: "大叫或摔东西", factor: "敌对" },
    { id: 82, text: "害怕会在公共场合昏倒", factor: "恐怖" },
    { id: 83, text: "感到别人想占您的便宜", factor: "偏执" },
    { id: 84, text: "为一些有关性的想法而很苦恼", factor: "精神病性" },
    { id: 85, text: "您认为应该因为自己的过错而受到惩罚", factor: "精神病性" },
    { id: 86, text: "感到要赶快把事情做完", factor: "强迫症状" },
    { id: 87, text: "感到自己的身体有严重问题", factor: "躯体化" },
    { id: 88, text: "从未感到和其他人很亲近", factor: "人际关系敏感" },
    { id: 89, text: "感到自己有罪", factor: "抑郁" },
    { id: 90, text: "感到自己的脑子有毛病", factor: "精神病性" }
];

// 因子说明
const factorDescriptions = {
    "躯体化": "反映主观的身体不适感,包括心血管、胃肠道、呼吸系统等方面的不适,以及头痛、背痛、肌肉酸痛等症状。",
    "强迫症状": "主要指那些明知没有必要,但又无法摆脱的无意义的思想、冲动和行为,还有一些比较一般的认知障碍。",
    "人际关系敏感": "主要指某些个人不自在感和自卑感,特别是在与其他人相比较时更加突出。",
    "抑郁": "包括生活兴趣的减退、缺乏活动愿望、丧失生活动力等表现。还包括失望、悲观等情绪体验。",
    "焦虑": "指烦躁、坐立不安、神经过敏,以及由此产生的躯体症状,如震颤等。",
    "敌对": "主要从思维、情感及行为三方面来反映病人的敌对表现。",
    "恐怖": "恐怖的对象包括出门旅行、空旷场所、人群或公共场所和交通工具。此外还有社交恐怖。",
    "偏执": "主要指投射性思维、敌对、猜疑、妄想、被动体验和夸大等。",
    "精神病性": "反映各式各样的急性症状和行为,即限定不严的精神病性过程的症状表现。"
};

// 答案选项
const options = [
    { value: 1, label: "从无" },
    { value: 2, label: "很轻" },
    { value: 3, label: "中等" },
    { value: 4, label: "偏重" },
    { value: 5, label: "严重" }
];

// 主应用组件
function App() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isStarted, setIsStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [result, setResult] = useState(null);

    // 处理开始测试 - 整合兑换码验证
    const handleStart = () => {
        // 调用兑换码验证模块
        if (typeof RedemptionCode !== 'undefined') {
            RedemptionCode.verify(
                // 验证成功回调
                () => {
                    setIsStarted(true);
                },
                // 取消回调
                () => {
                    console.log('用户取消了兑换码验证');
                }
            );
        } else {
            // 如果兑换码模块不可用,直接开始(开发环境)
            console.warn('兑换码验证模块未加载,直接开始测试');
            setIsStarted(true);
        }
    };

    // 处理答案选择
    const handleAnswer = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    // 处理下一题
    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    // 处理上一题
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // 处理提交
    const handleSubmit = () => {
        const unanswered = questions.filter(q => !answers[q.id]);
        if (unanswered.length > 0) {
            alert(`还有 ${unanswered.length} 题未作答,请完成所有题目后再提交。`);
            return;
        }

        calculateResult();
        setIsCompleted(true);
    };

    // 计算结果
    const calculateResult = () => {
        // 计算总分
        const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

        // 计算各因子分数
        const factorScores = {};
        const factorCounts = {};

        questions.forEach(q => {
            const factor = q.factor;
            const score = answers[q.id] || 0;

            if (!factorScores[factor]) {
                factorScores[factor] = 0;
                factorCounts[factor] = 0;
            }

            factorScores[factor] += score;
            factorCounts[factor]++;
        });

        // 计算因子分(因子总分/因子题目数)
        const factorAverages = {};
        Object.keys(factorScores).forEach(factor => {
            factorAverages[factor] = (factorScores[factor] / factorCounts[factor]).toFixed(2);
        });

        // 计算阳性项目数(评分>1的项目数)
        const positiveItems = Object.values(answers).filter(val => val > 1).length;

        // 总均分
        const totalAverage = (totalScore / 90).toFixed(2);

        setResult({
            totalScore,
            totalAverage,
            positiveItems,
            factorScores: factorAverages,
            factorRawScores: factorScores,
            factorCounts
        });
    };

    // 重新开始
    const handleRestart = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setIsStarted(false);
        setIsCompleted(false);
        setResult(null);
    };

    // 欢迎页面
    if (!isStarted) {
        return (
            <div className="welcome-screen">
                <h1>SCL-90 症状自评量表</h1>
                <div className="welcome-content">
                    <h2>测试说明</h2>
                    <p>SCL-90症状自评量表是世界上最著名的心理健康测试量表之一,是当前使用最为广泛的精神障碍和心理疾病门诊检查量表。</p>

                    <h3>测试包含以下9个因子:</h3>
                    <ul>
                        <li><strong>躯体化:</strong> 反映主观的身体不适感</li>
                        <li><strong>强迫症状:</strong> 无法摆脱的无意义思想和行为</li>
                        <li><strong>人际关系敏感:</strong> 人际交往中的不自在感和自卑感</li>
                        <li><strong>抑郁:</strong> 生活兴趣减退、缺乏活动愿望</li>
                        <li><strong>焦虑:</strong> 烦躁、坐立不安、神经过敏</li>
                        <li><strong>敌对:</strong> 思维、情感及行为上的敌对表现</li>
                        <li><strong>恐怖:</strong> 对特定场所、物体、活动的恐惧</li>
                        <li><strong>偏执:</strong> 投射性思维、猜疑、妄想</li>
                        <li><strong>精神病性:</strong> 各式各样的急性症状和行为</li>
                    </ul>

                    <h3>注意事项:</h3>
                    <ul>
                        <li>本测试共90道题,请根据最近一周的实际感受作答</li>
                        <li>每题有5个选项:从无、很轻、中等、偏重、严重</li>
                        <li>请认真、如实地回答每一题,不要遗漏</li>
                        <li>测试时间约10-15分钟</li>
                    </ul>

                    <button className="btn-primary" onClick={handleStart}>
                        开始测试
                    </button>
                </div>
            </div>
        );
    }

    // 测试完成页面
    if (isCompleted && result) {
        return (
            <div className="result-screen">
                <h1>测试结果</h1>

                <div className="result-summary">
                    <div className="result-item">
                        <span className="result-label">总分:</span>
                        <span className="result-value">{result.totalScore}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">总均分:</span>
                        <span className="result-value">{result.totalAverage}</span>
                    </div>
                    <div className="result-item">
                        <span className="result-label">阳性项目数:</span>
                        <span className="result-value">{result.positiveItems}</span>
                    </div>
                </div>

                <div className="result-interpretation">
                    <h3>结果解释</h3>
                    <ul>
                        <li><strong>总分:</strong> 超过160分,可能存在心理健康问题</li>
                        <li><strong>总均分:</strong> 超过2分,建议寻求专业帮助</li>
                        <li><strong>阳性项目数:</strong> 超过43项,提示可能存在心理障碍</li>
                        <li><strong>因子分:</strong> 任一因子分超过2分,提示该方面可能存在问题</li>
                    </ul>
                </div>

                <div className="factor-scores">
                    <h3>各因子得分</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>因子</th>
                                <th>因子分</th>
                                <th>状态</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(result.factorScores).map(([factor, score]) => (
                                <tr key={factor}>
                                    <td>{factor}</td>
                                    <td>{score}</td>
                                    <td className={parseFloat(score) > 2 ? 'status-warning' : 'status-normal'}>
                                        {parseFloat(score) > 2 ? '需要关注' : '正常'}
                                    </td>
                                    <td className="factor-description">{factorDescriptions[factor]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="result-note">
                    <p><strong>注意:</strong> 本测试结果仅供参考,不能作为诊断依据。如果您感到困扰,请及时寻求专业心理咨询师或精神科医生的帮助。</p>
                </div>

                <button className="btn-primary" onClick={handleRestart}>
                    重新测试
                </button>
            </div>
        );
    }

    // 测试进行中页面
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const currentAnswer = answers[question.id];

    return (
        <div className="test-screen">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="question-info">
                <span className="question-number">第 {currentQuestion + 1} / {questions.length} 题</span>
                <span className="question-factor">因子: {question.factor}</span>
            </div>

            <div className="question-text">
                <h2>{question.text}</h2>
            </div>

            <div className="options">
                {options.map(option => (
                    <button
                        key={option.value}
                        className={`option-btn ${currentAnswer === option.value ? 'selected' : ''}`}
                        onClick={() => handleAnswer(question.id, option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="navigation">
                <button
                    className="btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    上一题
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                    >
                        提交测试
                    </button>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={handleNext}
                        disabled={!currentAnswer}
                    >
                        下一题
                    </button>
                )}
            </div>

            <div className="answer-summary">
                <p>已答题: {Object.keys(answers).length} / {questions.length}</p>
            </div>
        </div>
    );
}

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
