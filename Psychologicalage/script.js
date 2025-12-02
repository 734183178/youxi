// ==================== 配置数据 ====================
const CONFIG = {
    // 题目数据 - 32道题
    questions: [
        { id: 1, text: "面对新事物，你的态度是？" },
        { id: 2, text: "你通常几点入睡？" },
        { id: 3, text: "遇到困难时，你会？" },
        { id: 4, text: "你对流行趋势的态度是？" },
        { id: 5, text: "周末你更喜欢？" },
        { id: 6, text: "你对社交媒体的使用频率？" },
        { id: 7, text: "听音乐时，你偏好？" },
        { id: 8, text: "你的朋友圈通常？" },
        { id: 9, text: "面对争执，你倾向于？" },
        { id: 10, text: "你的穿衣风格？" },
        { id: 11, text: "看电影/剧时，你喜欢？" },
        { id: 12, text: "对于计划，你认为？" },
        { id: 13, text: "你对科技产品的态度？" },
        { id: 14, text: "你的饮食习惯？" },
        { id: 15, text: "面对批评，你会？" },
        { id: 16, text: "你的阅读习惯？" },
        { id: 17, text: "旅行时，你更喜欢？" },
        { id: 18, text: "你对怀旧的态度？" },
        { id: 19, text: "工作/学习时，你？" },
        { id: 20, text: "你的消费观念？" },
        { id: 21, text: "面对变化，你？" },
        { id: 22, text: "你的作息规律？" },
        { id: 23, text: "对待健康，你？" },
        { id: 24, text: "你的兴趣爱好？" },
        { id: 25, text: "面对压力，你？" },
        { id: 26, text: "你的学习态度？" },
        { id: 27, text: "对于传统，你？" },
        { id: 28, text: "你的沟通方式？" },
        { id: 29, text: "面对失败，你？" },
        { id: 30, text: "你的人生态度？" },
        { id: 31, text: "对于未来，你？" },
        { id: 32, text: "你认为年龄是？" }
    ],

    // 选项配置 - 5个选项
    options: [
        { value: 5, label: 'A', text: '充满好奇，迫不及待想尝试' },
        { value: 4, label: 'B', text: '谨慎观望，但愿意接受' },
        { value: 3, label: 'C', text: '无所谓，顺其自然' },
        { value: 2, label: 'D', text: '保持怀疑，不太感兴趣' },
        { value: 1, label: 'E', text: '抗拒改变，喜欢熟悉的' }
    ],

    // 每题的得分权重（可根据题目调整）
    questionWeights: {
        1: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        2: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        3: { A: -3, B: -2, C: 0, D: 2, E: 3 },
        4: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        5: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        6: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        7: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        8: { A: -3, B: -2, C: 0, D: 2, E: 3 },
        9: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        10: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        11: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        12: { A: -3, B: -2, C: 0, D: 2, E: 3 },
        13: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        14: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        15: { A: -3, B: -2, C: 0, D: 2, E: 3 },
        16: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        17: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        18: { A: -3, B: -2, C: 0, D: 2, E: 4 },
        19: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        20: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        21: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        22: { A: -3, B: -2, C: 0, D: 2, E: 3 },
        23: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        24: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        25: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        26: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        27: { A: -3, B: -2, C: 0, D: 2, E: 4 },
        28: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        29: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        30: { A: -4, B: -2, C: 0, D: 2, E: 4 },
        31: { A: -5, B: -3, C: 0, D: 3, E: 5 },
        32: { A: -4, B: -2, C: 0, D: 2, E: 4 }
    }
};

// ==================== 全局状态 ====================
let currentQuestionIndex = 0;
let answers = {}; // 存储答案
let actualAge = 0; // 实际年龄

// ==================== 工具函数 ====================

// 显示指定页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 监听年龄输入
document.getElementById('actualAge')?.addEventListener('input', function() {
    const age = parseInt(this.value);
    const startBtn = document.getElementById('startBtn');
    
    if (age >= 8 && age <= 100) {
        startBtn.disabled = false;
    } else {
        startBtn.disabled = true;
    }
});

// ==================== 开始测试 ====================
function startTest() {
    actualAge = parseInt(document.getElementById('actualAge').value);

    if (!actualAge || actualAge < 8 || actualAge > 100) {
        alert('请输入有效的年龄（8-100岁）');
        return;
    }

    // 重置状态
    currentQuestionIndex = 0;
    answers = {};

    // 显示答题页
    showPage('quizPage');

    // 渲染第一题
    renderQuestion();
}

// ==================== 快速测试 ====================
function quickTest() {
    // 随机设置实际年龄（18-65岁之间）
    actualAge = Math.floor(Math.random() * (65 - 18 + 1)) + 18;

    // 重置状态
    currentQuestionIndex = 0;
    answers = {};

    // 决定心理年龄比实际年龄大还是小（50%概率）
    const isOlder = Math.random() < 0.5;
    const ageDifference = Math.floor(Math.random() * 11) + 5; // 5-15岁的差异

    // 根据需要的差异生成有偏好的答案
    CONFIG.questions.forEach(question => {
        let selectedOption;

        if (isOlder) {
            // 心理年龄比实际年龄大：选择偏向成熟的选项（D、E）
            const matureOptions = ['D', 'E'];
            const bias = Math.random() < 0.7; // 70%概率选择成熟选项
            if (bias) {
                const randomMature = Math.floor(Math.random() * matureOptions.length);
                selectedOption = CONFIG.options.find(opt => opt.label === matureOptions[randomMature]);
            } else {
                const randomIndex = Math.floor(Math.random() * CONFIG.options.length);
                selectedOption = CONFIG.options[randomIndex];
            }
        } else {
            // 心理年龄比实际年龄小：选择偏向年轻的选项（A、B）
            const youngOptions = ['A', 'B'];
            const bias = Math.random() < 0.7; // 70%概率选择年轻选项
            if (bias) {
                const randomYoung = Math.floor(Math.random() * youngOptions.length);
                selectedOption = CONFIG.options.find(opt => opt.label === randomYoung);
            } else {
                const randomIndex = Math.floor(Math.random() * CONFIG.options.length);
                selectedOption = CONFIG.options[randomIndex];
            }
        }

        answers[question.id] = selectedOption.label;
    });

    // 检查当前生成的心理年龄，如果差异不够则强制调整
    const currentMentalAge = calculateMentalAge();
    const currentDiff = Math.abs(currentMentalAge - actualAge);

    // 如果差异小于5岁，强制调整关键题目的答案
    if (currentDiff < 5) {
        const questionsToAdjust = Math.min(15, CONFIG.questions.length); // 调整最多15题

        for (let i = 0; i < questionsToAdjust; i++) {
            const questionId = i + 1;
            const weights = CONFIG.questionWeights[questionId];

            if (isOlder) {
                // 需要增加心理年龄：选择最大权重的选项（E或D）
                let maxWeight = -Infinity;
                let bestOption = 'E';
                for (let option in weights) {
                    if (weights[option] > maxWeight) {
                        maxWeight = weights[option];
                        bestOption = option;
                    }
                }
                answers[questionId] = bestOption;
            } else {
                // 需要减少心理年龄：选择最小权重的选项（A或B）
                let minWeight = Infinity;
                let bestOption = 'A';
                for (let option in weights) {
                    if (weights[option] < minWeight) {
                        minWeight = weights[option];
                        bestOption = option;
                    }
                }
                answers[questionId] = bestOption;
            }
        }
    }

    // 验证最终结果，确保达到5-15岁差异
    let finalMentalAge = calculateMentalAge();
    let finalDiff = Math.abs(finalMentalAge - actualAge);

    // 如果还是不够，进行最后一次强制调整
    if (finalDiff < 5) {
        // 根据需要的差异调整最后5个关键题目
        for (let i = 0; i < 5; i++) {
            const questionId = CONFIG.questions.length - i;
            const weights = CONFIG.questionWeights[questionId];

            if (isOlder) {
                answers[questionId] = 'E'; // 最大权重选项
            } else {
                answers[questionId] = 'A'; // 最小权重选项
            }
        }
    }

    // 直接显示结果
    showResult();
}

// ==================== 渲染题目 ====================
function renderQuestion() {
    const question = CONFIG.questions[currentQuestionIndex];
    const totalQuestions = CONFIG.questions.length;
    const answered = Object.keys(answers).length;
    const remaining = totalQuestions - answered;
    const progress = Math.round((answered / totalQuestions) * 100);
    
    // 更新进度信息
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('remainingCount').textContent = remaining;
    
    // 更新题目文字
    document.getElementById('questionText').textContent = question.text;
    
    // 渲染选项
    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';
    
    CONFIG.options.forEach(option => {
        const li = document.createElement('li');
        li.className = 'option-item';
        
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.onclick = () => selectOption(option.label);
        
        // 如果已经选择过，添加选中样式
        if (answers[question.id] === option.label) {
            button.classList.add('selected');
        }
        
        button.innerHTML = `
            <span class="option-label">${option.label}</span>
            <span class="option-text">${option.text}</span>
        `;
        
        li.appendChild(button);
        optionsList.appendChild(li);
    });
    
    // 更新上一题按钮状态
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
}

// ==================== 选择选项 ====================
function selectOption(label) {
    const question = CONFIG.questions[currentQuestionIndex];
    
    // 保存答案
    answers[question.id] = label;
    
    // 等待一小段时间，让用户看到选中效果
    setTimeout(() => {
        // 如果是最后一题，显示结果
        if (currentQuestionIndex === CONFIG.questions.length - 1) {
            showResult();
        } else {
            // 否则，进入下一题
            currentQuestionIndex++;
            renderQuestion();
        }
    }, 300);
}

// ==================== 上一题 ====================
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// ==================== 计算心理年龄 ====================
function calculateMentalAge() {
    let totalScore = 0;
    
    // 累加所有题目的得分
    for (let questionId in answers) {
        const label = answers[questionId];
        const weight = CONFIG.questionWeights[questionId];
        if (weight && weight[label] !== undefined) {
            totalScore += weight[label];
        }
    }
    
    // 根据总分计算心理年龄
    // 总分范围大约：-160 到 +160
    // 心理年龄 = 实际年龄 + (总分 / 4)
    let mentalAge = actualAge + Math.round(totalScore / 4);
    
    // 限制在合理范围内
    mentalAge = Math.max(8, Math.min(80, mentalAge));
    
    return mentalAge;
}

// ==================== 显示结果 ====================
function showResult() {
    const mentalAge = calculateMentalAge();
    const ageDiff = actualAge - mentalAge;

    // 切换到结果页
    showPage('resultPage');

    // 显示年龄
    document.getElementById('mentalAgeDisplay').textContent = `${mentalAge}`;
    document.getElementById('actualAgeDisplay').textContent = `${actualAge}岁`;

    // 设置年龄指示器位置（将年龄映射到15-60岁范围）
    const normalizedAge = Math.max(15, Math.min(60, mentalAge));
    const indicatorPosition = ((normalizedAge - 15) / (60 - 15)) * 100;
    document.getElementById('ageIndicator').style.left = `${indicatorPosition}%`;

    // 设置年龄差文字
    const ageDiffText = document.getElementById('ageDifferenceText');
    if (ageDiff > 0) {
        ageDiffText.textContent = `您的心理年龄比实际年龄年轻 ${ageDiff} 岁，心态非常年轻！`;
    } else if (ageDiff < 0) {
        ageDiffText.textContent = `您的心理年龄比实际年龄成熟 ${Math.abs(ageDiff)} 岁，展现出了超越年龄的智慧。`;
    } else {
        ageDiffText.textContent = '您的心理年龄与实际年龄完全一致，心态平衡得很好！';
    }

    // ==================== 心理年龄段分析和建议生成 ====================
    function generateAgeAnalysis(age) {
        if (age <= 15) {
            return {
                analysis: '您的心理年龄偏年轻化，看待世界仍带着纯粹与直接。对新鲜事物充满天然的好奇心，情绪表达直白不掩饰，开心时会尽情展露，遇到委屈也容易直接流露。内心更依赖身边人的陪伴与指引，做决定时倾向于参考他人意见，尚未形成独立的判断体系，对生活的认知还处在简单、无压力的阶段。',
                suggestion: '• 不用急于强迫自己"变得成熟"，享受当下纯粹的状态，允许自己保留天真的视角\n• 遇到困惑或情绪波动时，主动和信任的人沟通，不用独自扛下压力\n• 尝试做一些力所能及的小事（比如整理自己的物品、规划周末行程），慢慢培养独立意识\n• 多参与集体活动或兴趣小组，在与人互动中学会表达自己、理解他人'
            };
        } else if (age <= 20) {
            return {
                analysis: '您的心理状态正处于探索与迷茫并存的阶段。对世界充满探索欲，愿意尝试新事物、接触新圈子，不畏惧未知的挑战。但同时，面对人生方向、自我定位等问题时，容易产生困惑和摇摆，情绪起伏相对明显，可能会因为他人的评价而影响自我判断，处事方式还带着些许青涩，不够成熟。',
                suggestion: '• 大胆去尝试感兴趣的事，哪怕暂时看不到结果，探索的过程本身就是成长\n• 不必过分在意他人的看法，多倾听自己内心的声音，慢慢建立自我认同\n• 遇到选择时，试着列出利弊再做决定，培养理性思考的习惯\n• 学会管理自己的情绪，比如情绪激动时先冷静5分钟，再做回应'
            };
        } else if (age <= 25) {
            return {
                analysis: '您的心理状态逐渐走向独立，开始有了明确的自我意识。不再盲目跟风他人，对自己的喜好、目标有了初步的清晰认知，愿意为自己的选择负责。面对工作或学习中的问题，会主动想办法解决，而不是一味依赖他人。但在复杂的人际或突发状况面前，仍可能显得经验不足，偶尔会陷入纠结，做事还不够沉稳。',
                suggestion: '• 围绕自己的核心目标，有针对性地提升能力，避免盲目尝试导致精力分散\n• 遇到棘手问题时，不妨向有经验的人请教，借鉴他人经验能少走弯路\n• 学会接纳自己的不完美，不用因一次失误就否定自己，把每一次经历都当作积累\n• 合理规划时间，平衡工作、学习与生活，避免过度消耗自己'
            };
        } else if (age <= 30) {
            return {
                analysis: '您的心理状态趋于成熟，处事更具条理和规划性。对人生有了更清晰的方向，知道自己想要什么、该放弃什么，目标感较强。面对压力和挑战时，能保持基本的冷静，不会轻易被情绪左右，会主动寻找解决问题的方法。责任感明显增强，无论是对工作、家庭还是自己，都能扛起应尽的责任，人际相处中也懂得把握分寸。',
                suggestion: '• 在追求目标的同时，别忽略了身心状态，定期给自己放松的时间，避免过度紧绷\n• 学会适当取舍，不必事事追求完美，把精力放在核心事项上\n• 多和家人、朋友沟通，维护好亲密关系，它们是情绪的重要支撑\n• 持续学习新技能，保持思维的灵活性，避免被固有认知局限'
            };
        } else if (age <= 35) {
            return {
                analysis: '您的心理状态沉稳务实，做事严谨周全。经过多年的积累，已经具备了较强的问题解决能力，面对复杂情况时，能快速抓住核心矛盾，做出理性判断。人际相处中成熟得体，懂得换位思考，能妥善处理各种关系，让人感到可靠。但有时可能因为过于追求稳妥，而缺乏一些冒险精神，偶尔会显得有些保守。',
                suggestion: '• 适当给自己一些"试错空间"，不必事事都求稳，偶尔的突破可能会带来新机遇\n• 学会适当授权，不用事事亲力亲为，相信他人的能力，也给自己减负\n• 在理性处事的同时，多关注自己的内心感受，别让"责任"绑架了生活的温度\n• 培养一项能让自己完全放松的爱好，平衡工作与生活的节奏'
            };
        } else if (age <= 40) {
            return {
                analysis: '您的心理状态从容通透，已经形成了自己的处事原则和人生态度。不再执着于表面的得失，更看重内心的平静与生活的质感。面对生活中的起伏，能以平和的心态接纳，不会过度焦虑或抱怨。经验丰富，看问题通透，能给身边人提供有价值的建议，是他人眼中的"可靠后盾"。但有时可能会因为经验固化，对新事物的接受度变慢。',
                suggestion: '• 保持对新事物的好奇心，主动了解新鲜趋势，避免思维僵化\n• 把自己的经验和智慧分享给他人，在帮助别人的过程中获得新的成就感\n• 注重身心健康，养成规律的作息和运动习惯，为长远生活打下基础\n• 多享受当下的生活，不必为未来过度担忧，学会在平淡中寻找乐趣'
            };
        } else if (age <= 50) {
            return {
                analysis: '您的心理状态豁达包容，对生活的理解更为深刻。经历了岁月的沉淀，已经能坦然面对人生的各种境遇，不纠结于过往的遗憾，也不盲目焦虑未来。待人接物温和包容，懂得尊重不同的观点和生活方式，心态平和，不易被外界琐事干扰。内心足够强大，能在独处中找到安宁，也能在与人相处中传递温暖。',
                suggestion: '• 继续保持平和的心态，享受当下的生活节奏，不用刻意追求过多的目标\n• 多参与能让自己身心愉悦的活动，比如园艺、书法、旅行等，丰富精神生活\n• 加强与家人的陪伴，尤其是和晚辈的交流，在代际互动中感受生活的活力\n• 可以整理自己的人生感悟，无论是分享给他人，还是留给自己回忆，都是珍贵的财富'
            };
        } else if (age <= 60) {
            return {
                analysis: '您的心理状态淡然通透，已经达到了相对成熟的人生境界。看问题直指本质，不再被表象所迷惑，做事不疾不徐，张弛有度。对名利看得更为淡然，更注重内心的富足与精神的自由。待人真诚宽厚，自带一种让人安心的气场，能以平和的心态化解矛盾，传递正能量。生活节奏从容，懂得与自己、与世界和平相处。',
                suggestion: '• 保持从容的生活节奏，根据自身状态安排日常，不勉强自己做超出能力范围的事\n• 多和志同道合的人交流，丰富精神生活，保持心态的年轻活力\n• 注重养生保健，饮食、作息规律，适度运动，守护好身心健康\n• 享受这份历经岁月沉淀的通透，随心而活，感受生活最本真的美好'
            };
        } else {
            return {
                analysis: '您的心理状态超然平和，对人生有着深刻的洞察与体悟。已经超越了世俗的得失计较，更看重精神层面的富足与安宁。待人处事宽厚慈悲，能以包容的心态看待世间万物，不苛求、不纠结。内心平静而强大，无论遇到何种境遇，都能保持从容不迫的状态，自带一种安定人心的力量，活成了自己内心的模样。',
                suggestion: '• 继续保持这份超然的心态，随心而动，不被外界纷扰所影响\n• 可以将自己的人生智慧以合适的方式传递出去，为他人提供指引与温暖\n• 专注于能让自己内心愉悦的事，无论是独处冥想，还是与人闲谈，都享受当下\n• 保持身心的和谐统一，善待自己，在平和中安享生活的馈赠'
            };
        }
    }

    // ==================== 根据心理年龄段生成描述和建议 ====================
    const ageAnalysis = generateAgeAnalysis(mentalAge);

    // 更新内容
    document.getElementById('resultDescription').textContent = ageAnalysis.analysis;
    document.getElementById('resultSuggestion').innerHTML = `
        <h4>个性化建议</h4>
        <p>${ageAnalysis.suggestion}</p>
    `;
}

// ==================== 重新测试 ====================
function restartTest() {
    currentQuestionIndex = 0;
    answers = {};
    actualAge = 0;
    
    // 清空输入
    document.getElementById('actualAge').value = '';
    document.getElementById('startBtn').disabled = true;
    
    // 返回介绍页
    showPage('introPage');
}

// ==================== 全局变量 ====================
let quickTestClickCount = 0;
let quickTestMaxClicks = 10;

// ==================== 页面加载完成 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('心理年龄测试已加载');
});

// ==================== 快速测试隐藏/显示功能 ====================
function toggleQuickTest() {
    quickTestClickCount++;

    if (quickTestClickCount >= quickTestMaxClicks) {
        // 第10次点击时显示快速测试按钮
        document.getElementById('quickTestBtn').style.display = 'block';
        console.log(`快速测试已激活 (第${quickTestClickCount}次点击)`);
    } else {
        // 前9次点击隐藏快速测试按钮
        document.getElementById('quickTestBtn').style.display = 'none';
        console.log(`快速测试未激活 (第${quickTestClickCount}次点击，还需点击${quickTestMaxClicks - quickTestClickCount}次)`);
    }
}