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
    document.getElementById('mentalAgeDisplay').textContent = `${mentalAge}岁`;
    document.getElementById('actualAgeDisplay').textContent = `${actualAge}岁`;
    
    // 根据年龄差显示不同的表情和评价
    let emoji, message, description;
    
    if (ageDiff >= 10) {
        // 心理年龄小很多 - 非常年轻
        emoji = '😊';
        message = `您的心理年龄年轻${ageDiff}岁！`;
        description = `太棒了！您拥有一颗年轻的心。您对生活充满热情和好奇心，勇于尝试新事物，保持着积极乐观的态度。这种年轻的心态让您更容易适应变化，享受生活的每一刻。继续保持这份活力，它会让您的人生更加精彩！`;
    } else if (ageDiff >= 5) {
        // 心理年龄小一些 - 年轻态
        emoji = '😄';
        message = `您的心理年龄年轻${ageDiff}岁！`;
        description = `很不错！您保持着一颗年轻的心。您对新鲜事物保持开放态度，善于从生活中发现乐趣。这种心态帮助您在面对压力时更加从容，也让您的生活充满活力。继续保持这份对生活的热爱吧！`;
    } else if (ageDiff >= -4) {
        // 心理年龄相近 - 成熟稳重
        emoji = '😌';
        message = '您的心理年龄与实际年龄相符';
        description = `您的心理年龄与实际年龄基本一致，展现出了与年龄相匹配的成熟和稳重。您对生活有着清晰的认识，懂得在激情与理性之间找到平衡。您既能欣赏新事物的魅力，也能珍惜传统的价值，这种平衡的心态让您的人生更加从容。`;
    } else if (ageDiff >= -10) {
        // 心理年龄大一些 - 早熟
        emoji = '🤔';
        message = `您的心理年龄年长${Math.abs(ageDiff)}岁`;
        description = `您展现出超越实际年龄的成熟。您对生活有着深刻的思考，处事稳重，善于从经验中学习。这种成熟让您在面对困难时更加冷静和理智。不过也要记得，偶尔放松一下，尝试一些新鲜事物，保持生活的趣味性哦！`;
    } else {
        // 心理年龄大很多 - 老成
        emoji = '🧐';
        message = `您的心理年龄年长${Math.abs(ageDiff)}岁`;
        description = `您拥有超越年龄的成熟和智慧。您看待问题深刻，处事谨慎，重视经验和传统。这种成熟的心态让您在生活中更加稳重可靠。不过，也要记得给自己一些空间去尝试新事物、享受生活的乐趣。适当的放松和改变，能让生活更加丰富多彩！`;
    }
    
    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultMessage').textContent = message;
    document.getElementById('resultDescription').textContent = description;
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

// ==================== 页面加载完成 ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('心理年龄测试已加载');
});