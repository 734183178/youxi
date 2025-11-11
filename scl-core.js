// SCL-90症状自评量表核心逻辑
// 这是主要的测试功能模块

const { useState, useEffect, useRef } = React;

const SCL90Assessment = () => {
    const [currentPage, setCurrentPage] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isTestStarted, setIsTestStarted] = useState(false);
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

    // 因子定义
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

    // 开始测试按钮点击
    const handleStartTest = () => {
        if (!isTestStarted) {
            // 使用兑换码验证器
            if (window.exchangeCodeVerifier) {
                window.exchangeCodeVerifier.showCodeModal((success) => {
                    if (success) {
                        setIsTestStarted(true);
                        setCurrentPage('test');
                    }
                });
            } else {
                alert('兑换码验证模块未加载，请刷新页面重试');
            }
        } else {
            setCurrentPage('test');
        }
    };

    // 处理答案选择
    const handleAnswer = (value) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion]: value
        }));

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setCurrentPage('results');
        }
    };

    // 计算结果
    const calculateResults = () => {
        const factorScores = {};

        // 初始化因子分数
        const factorNames = Object.keys(factors);
        factorNames.forEach(name => {
            factorScores[name] = { total: 0, count: 0, average: 0 };
        });

        // 计算每个因子的分数
        questions.forEach((question, index) => {
            const answer = answers[index];
            if (answer !== undefined) {
                const factor = question.factor;
                if (factorScores[factor]) {
                    factorScores[factor].total += answer;
                    factorScores[factor].count += 1;
                }
            }
        });

        // 计算平均分
        factorNames.forEach(name => {
            const factor = factorScores[name];
            factor.average = factor.count > 0 ? (factor.total / factor.count).toFixed(2) : 0;
        });

        // 计算总分
        const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
        const averageScore = Object.keys(answers).length > 0 ? (totalScore / Object.keys(answers).length).toFixed(2) : 0;

        return {
            factorScores,
            totalScore,
            averageScore,
            completedQuestions: Object.keys(answers).length
        };
    };

    const results = calculateResults();

    // 绘制雷达图
    useEffect(() => {
        if (currentPage === 'results' && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            const factorNames = Object.keys(results.factorScores);
            const factorScores = factorNames.map(name => results.factorScores[name].average);

            // 销毁之前的图表
            if (window.currentChart) {
                window.currentChart.destroy();
            }

            window.currentChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: factorNames,
                    datasets: [{
                        label: '各因子得分',
                        data: factorScores,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
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
                    }
                }
            });
        }

        return () => {
            if (window.currentChart) {
                window.currentChart.destroy();
            }
        };
    }, [currentPage, results]);

    // 介绍页面
    if (currentPage === 'intro') {
        return React.createElement('div', { className: "min-h-screen bg-gray-50 py-8" },
            React.createElement('div', { className: "max-w-3xl mx-auto px-4" },
                React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-8" },
                    React.createElement('h1', { className: "text-4xl font-bold text-center mb-8 text-gray-800" }, "SCL-90症状自评量表"),

                    React.createElement('div', { className: "space-y-6 text-gray-700" },
                        React.createElement('div', null,
                            React.createElement('h2', { className: "text-2xl font-semibold mb-4" }, "量表简介"),
                            React.createElement('p', { className: "leading-relaxed" },
                                "SCL-90症状自评量表是世界上最著名的心理健康测试量表之一，是当前使用最广泛的精神障碍和心理疾病门诊检查量表。" +
                                "该量表从九个维度评估您的心理健康状况，包括躯体化、强迫症状、人际关系敏感、抑郁、焦虑、敌对、恐怖、偏执和精神病性。")
                        ),

                        React.createElement('div', null,
                            React.createElement('h2', { className: "text-2xl font-semibold mb-4" }, "测评说明"),
                            React.createElement('ul', { className: "list-disc list-inside space-y-2 ml-4" },
                                React.createElement('li', null, "请根据您最近一周的实际感受进行评分"),
                                React.createElement('li', null, "每个题目都要回答，不要遗漏"),
                                React.createElement('li', null, "选择最符合您情况的选项，没有对错之分"),
                                React.createElement('li', null, "测试大约需要15-20分钟完成")
                            )
                        ),

                        React.createElement('div', { className: "bg-blue-50 border-l-4 border-blue-500 p-4 rounded" },
                            React.createElement('h3', { className: "font-semibold mb-2" }, "评分标准："),
                            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-5 gap-2 text-sm" },
                                React.createElement('div', { className: "bg-white p-2 rounded text-center" },
                                    React.createElement('span', { className: "font-semibold" }, "1分"), " - 从无"
                                ),
                                React.createElement('div', { className: "bg-white p-2 rounded text-center" },
                                    React.createElement('span', { className: "font-semibold" }, "2分"), " - 很轻"
                                ),
                                React.createElement('div', { className: "bg-white p-2 rounded text-center" },
                                    React.createElement('span', { className: "font-semibold" }, "3分"), " - 中等"
                                ),
                                React.createElement('div', { className: "bg-white p-2 rounded text-center" },
                                    React.createElement('span', { className: "font-semibold" }, "4分"), " - 偏重"
                                ),
                                React.createElement('div', { className: "bg-white p-2 rounded text-center" },
                                    React.createElement('span', { className: "font-semibold" }, "5分"), " - 严重"
                                )
                            )
                        ),

                        React.createElement('div', { className: "bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded" },
                            React.createElement('h3', { className: "font-semibold mb-2" }, "重要提醒："),
                            React.createElement('p', { className: "text-sm" },
                                "本测试结果仅供参考，不能作为专业诊断的依据。如您的测试结果显示症状较为严重，" +
                                "建议及时寻求专业心理医生或心理咨询师的帮助。")
                        )
                    ),

                    React.createElement('div', { className: "mt-8 text-center" },
                        React.createElement('button', {
                            onClick: handleStartTest,
                            className: "bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                        }, "开始测评")
                    )
                )
            )
        );
    }

    // 测试页面
    if (currentPage === 'test') {
        return React.createElement('div', { className: "min-h-screen bg-gray-50 py-8" },
            React.createElement('div', { className: "max-w-4xl mx-auto px-4" },
                React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-8" },
                    // 进度条
                    React.createElement('div', { className: "mb-6" },
                        React.createElement('div', { className: "flex justify-between items-center mb-2" },
                            React.createElement('span', { className: "text-sm font-medium text-gray-700" },
                                `第 ${currentQuestion + 1} 题 / 共 ${questions.length} 题`
                            ),
                            React.createElement('span', { className: "text-sm text-gray-500" },
                                `已完成 ${Object.keys(answers).length} 题`
                            )
                        ),
                        React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
                            React.createElement('div', {
                                className: "bg-blue-500 h-2 rounded-full transition-all duration-300",
                                style: { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                            })
                        )
                    ),

                    // 题目
                    React.createElement('div', { className: "mb-8" },
                        React.createElement('div', { className: "bg-gray-50 rounded-lg p-6 mb-6" },
                            React.createElement('h2', { className: "text-xl font-semibold mb-2 text-gray-800" },
                                `题目 ${questions[currentQuestion].id}`
                            ),
                            React.createElement('p', { className: "text-lg text-gray-700" },
                                questions[currentQuestion].text
                            ),
                            React.createElement('p', { className: "text-sm text-gray-500 mt-2" },
                                `因子：${questions[currentQuestion].factor}`
                            )
                        ),

                        // 选项
                        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3" },
                            options.map((option) =>
                                React.createElement('button', {
                                    key: option.value,
                                    onClick: () => handleAnswer(option.value),
                                    className: `p-4 rounded-lg border-2 transition-all duration-200 ${
                                        answers[currentQuestion] === option.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`
                                },
                                    React.createElement('div', { className: "text-center" },
                                        React.createElement('div', { className: "text-2xl font-bold mb-1" }, option.label),
                                        React.createElement('div', { className: "text-sm" }, option.text)
                                    )
                                )
                            )
                        )
                    ),

                    // 导航按钮
                    React.createElement('div', { className: "flex justify-between items-center" },
                        React.createElement('button', {
                            onClick: () => setCurrentQuestion(Math.max(0, currentQuestion - 1)),
                            disabled: currentQuestion === 0,
                            className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        }, "上一题"),

                        React.createElement('div', { className: "text-sm text-gray-500" },
                            answers[currentQuestion] !== undefined ?
                                React.createElement('span', { className: "text-green-600 font-medium" }, "已选择") :
                                React.createElement('span', null, "请选择答案")
                        ),

                        currentQuestion === questions.length - 1 ?
                            React.createElement('button', {
                                onClick: () => setCurrentPage('results'),
                                disabled: answers[currentQuestion] === undefined,
                                className: "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            }, "完成测试") :
                            React.createElement('button', {
                                onClick: () => setCurrentPage('results'),
                                className: "px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            }, "暂时离开")
                    )
                )
            )
        );
    }

    // 结果页面
    if (currentPage === 'results') {
        return React.createElement('div', { className: "min-h-screen bg-gray-50 py-8" },
            React.createElement('div', { className: "max-w-6xl mx-auto px-4" },
                React.createElement('div', { className: "bg-white rounded-lg shadow-lg p-8 mb-6" },
                    React.createElement('h1', { className: "text-3xl font-bold text-center mb-8 text-gray-800" }, "测试结果报告"),

                    // 总体情况
                    React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" },
                        React.createElement('div', { className: "text-center p-6 bg-blue-50 rounded-lg" },
                            React.createElement('div', { className: "text-3xl font-bold text-blue-600 mb-2" }, results.totalScore),
                            React.createElement('div', { className: "text-gray-700" }, "原始总分"),
                            React.createElement('div', { className: "text-sm text-gray-500 mt-1" }, "满分450分")
                        ),
                        React.createElement('div', { className: "text-center p-6 bg-green-50 rounded-lg" },
                            React.createElement('div', { className: "text-3xl font-bold text-green-600 mb-2" }, results.averageScore),
                            React.createElement('div', { className: "text-gray-700" }, "平均分"),
                            React.createElement('div', { className: "text-sm text-gray-500 mt-1" }, "满分5.0分")
                        ),
                        React.createElement('div', { className: "text-center p-6 bg-purple-50 rounded-lg" },
                            React.createElement('div', { className: "text-3xl font-bold text-purple-600 mb-2" }, results.completedQuestions),
                            React.createElement('div', { className: "text-gray-700" }, "完成题目"),
                            React.createElement('div', { className: "text-sm text-gray-500 mt-1" }, "共90题")
                        )
                    ),

                    // 因子得分表格
                    React.createElement('div', { className: "mb-8" },
                        React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-800" }, "各因子得分详情"),
                        React.createElement('div', { className: "overflow-x-auto" },
                            React.createElement('table', { className: "w-full border-collapse" },
                                React.createElement('thead', null,
                                    React.createElement('tr', { className: "bg-gray-50" },
                                        React.createElement('th', { className: "border border-gray-200 px-4 py-2 text-left" }, "因子"),
                                        React.createElement('th', { className: "border border-gray-200 px-4 py-2 text-center" }, "项目数"),
                                        React.createElement('th', { className: "border border-gray-200 px-4 py-2 text-center" }, "总分"),
                                        React.createElement('th', { className: "border border-gray-200 px-4 py-2 text-center" }, "平均分"),
                                        React.createElement('th', { className: "border border-gray-200 px-4 py-2 text-center" }, "严重程度")
                                    )
                                ),
                                React.createElement('tbody', null,
                                    Object.entries(results.factorScores).map(([name, score]) => {
                                        let severity = '正常';
                                        let severityColor = 'text-green-600';

                                        if (score.average >= 4) {
                                            severity = '严重';
                                            severityColor = 'text-red-600';
                                        } else if (score.average >= 3) {
                                            severity = '较重';
                                            severityColor = 'text-orange-600';
                                        } else if (score.average >= 2) {
                                            severity = '中度';
                                            severityColor = 'text-yellow-600';
                                        } else if (score.average >= 1) {
                                            severity = '轻度';
                                            severityColor = 'text-blue-600';
                                        }

                                        return React.createElement('tr', { key: name, className: "hover:bg-gray-50" },
                                            React.createElement('td', { className: "border border-gray-200 px-4 py-2 font-medium" }, name),
                                            React.createElement('td', { className: "border border-gray-200 px-4 py-2 text-center" }, score.count),
                                            React.createElement('td', { className: "border border-gray-200 px-4 py-2 text-center" }, score.total),
                                            React.createElement('td', { className: "border border-gray-200 px-4 py-2 text-center font-semibold" }, score.average),
                                            React.createElement('td', { className: `border border-gray-200 px-4 py-2 text-center font-semibold ${severityColor}` }, severity)
                                        );
                                    })
                                )
                            )
                        )
                    ),

                    // 雷达图
                    React.createElement('div', { className: "mb-8" },
                        React.createElement('h2', { className: "text-xl font-semibold mb-4 text-gray-800" }, "因子分布雷达图"),
                        React.createElement('div', { className: "bg-gray-50 rounded-lg p-6", style: { height: '400px' } },
                            React.createElement('canvas', { ref: chartRef })
                        )
                    ),

                    // 重新测试按钮
                    React.createElement('div', { className: "text-center" },
                        React.createElement('button', {
                            onClick: () => {
                                setCurrentPage('intro');
                                setCurrentQuestion(0);
                                setAnswers({});
                                setIsTestStarted(false);
                            },
                            className: "bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                        }, "重新测试")
                    )
                )
            )
        );
    }

    return null;
};

// 渲染应用
ReactDOM.render(React.createElement(SCL90Assessment), document.getElementById('root'));