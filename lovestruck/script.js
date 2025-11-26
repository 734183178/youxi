// 测评数据
const questions = [
    // 依赖程度 (6题)
    { id: 1, text: "恋爱后，你的朋友圈内容会变成全是关于TA的动态", dimension: "依赖程度" },
    { id: 2, text: "如果对方三小时不回消息，你会开始胡思乱想", dimension: "依赖程度" },
    { id: 3, text: "你觉得没有恋爱的生活是不完整的", dimension: "依赖程度" },
    { id: 4, text: "你会因为恋爱而改变自己的生活习惯和作息", dimension: "依赖程度" },
    { id: 5, text: "你需要经常得到对方的关注和回应才能安心", dimension: "依赖程度" },
    { id: 6, text: "你会把对方的事情放在第一位，自己的事往后排", dimension: "依赖程度" },
    
    // 浪漫幻想 (5题)
    { id: 7, text: "你相信世界上存在命中注定的灵魂伴侣", dimension: "浪漫幻想" },
    { id: 8, text: "你经常幻想各种浪漫的恋爱场景", dimension: "浪漫幻想" },
    { id: 9, text: "你觉得真爱可以战胜一切困难", dimension: "浪漫幻想" },
    { id: 10, text: "你期待对方能猜到你的心思，不用说就懂", dimension: "浪漫幻想" },
    { id: 11, text: "你会给未来的恋爱设定很多浪漫的期待", dimension: "浪漫幻想" },
    
    // 失恋抗性 (5题)
    { id: 12, text: "分手后你需要很长时间才能走出来", dimension: "失恋抗性" },
    { id: 13, text: "失恋会严重影响你的生活和工作状态", dimension: "失恋抗性" },
    { id: 14, text: "你很难接受恋爱关系的结束", dimension: "失恋抗性" },
    { id: 15, text: "分手后你会经常回看以前的聊天记录和照片", dimension: "失恋抗性" },
    { id: 16, text: "你会因为分手而怀疑自己的价值", dimension: "失恋抗性" },
    
    // 投入度 (6题)
    { id: 17, text: "恋爱时你会全身心投入，把对方当成生活的全部", dimension: "投入度" },
    { id: 18, text: "你愿意为了爱情放弃很多东西", dimension: "投入度" },
    { id: 19, text: "你会为对方做很多牺牲和妥协", dimension: "投入度" },
    { id: 20, text: "你愿意随时随地陪伴对方，哪怕打乱自己的计划", dimension: "投入度" },
    { id: 21, text: "你会经常给对方准备小惊喜和礼物", dimension: "投入度" },
    { id: 22, text: "你会花很多时间精力去经营这段感情", dimension: "投入度" },
    
    // 理智程度 (5题)
    { id: 23, text: "你会因为一时的感动就确定恋爱关系", dimension: "理智程度" },
    { id: 24, text: "恋爱时你容易忽视对方的缺点和问题", dimension: "理智程度" },
    { id: 25, text: "你会为了挽回感情而降低自己的底线", dimension: "理智程度" },
    { id: 26, text: "即使朋友都不看好这段感情，你也会坚持", dimension: "理智程度" },
    { id: 27, text: "你很难在恋爱中保持客观的判断", dimension: "理智程度" },
    
    // 自我保留 (5题)
    { id: 28, text: "恋爱后你会减少和朋友的联系", dimension: "自我保留" },
    { id: 29, text: "你会为了迁就对方而放弃自己的兴趣爱好", dimension: "自我保留" },
    { id: 30, text: "你很难在恋爱中保持独立的个人空间", dimension: "自我保留" },
    { id: 31, text: "你会因为对方的喜好而改变自己的穿衣风格", dimension: "自我保留" },
    { id: 32, text: "恋爱时你会把对方的想法看得比自己的更重要", dimension: "自我保留" }
];

// 选项
const options = [
    { value: 1, label: '1', text: '非常不符合' },
    { value: 2, label: '2', text: '不太符合' },
    { value: 3, label: '3', text: '一般' },
    { value: 4, label: '4', text: '比较符合' },
    { value: 5, label: '5', text: '非常符合' }
];

// 维度信息
const dimensions = {
    "依赖程度": {
        name: "依赖程度",
        description: "反映你在恋爱中对对方的依赖性和粘人程度",
        suggestions: ["保持适度距离", "培养独立性", "发展个人爱好", "维护社交圈子"]
    },
    "浪漫幻想": {
        name: "浪漫幻想",
        description: "反映你对爱情的理想化程度和浪漫期待",
        suggestions: ["接受现实的爱情", "理性看待感情", "降低完美期待", "珍惜当下"]
    },
    "失恋抗性": {
        name: "失恋抗性",
        description: "反映你面对感情结束的承受能力",
        suggestions: ["提升心理韧性", "建立支持系统", "培养兴趣爱好", "学会放下过去"]
    },
    "投入度": {
        name: "投入度",
        description: "反映你在恋爱中的付出程度和用心程度",
        suggestions: ["平衡付出与回报", "注意自我保护", "理性投入", "保持边界感"]
    },
    "理智程度": {
        name: "理智程度",
        description: "反映你在恋爱时的理性思考能力",
        suggestions: ["保持清醒判断", "听取他人意见", "注意危险信号", "理性决策"]
    },
    "自我保留": {
        name: "自我保留",
        description: "反映你在恋爱中保持自我的能力",
        suggestions: ["维护个人空间", "坚持自我价值", "平衡爱情与生活", "保持独立性"]
    }
};

// 等级配置
const levels = [
    {
        level: 1,
        name: "理智清醒",
        emoji: "🧠",
        minScore: 20,
        maxScore: 25,
        color: "#4CAF50",
        bgColor: "#E8F5E9",
        borderColor: "#A5D6A7",
        description: "恭喜你！你在感情中非常理智清醒，懂得平衡爱情与生活。你不会轻易被情绪左右，能够保持独立思考。继续保持这份清醒，同时也别忘了偶尔感性一下，享受恋爱的美好～"
    },
    {
        level: 2,
        name: "轻度恋爱脑",
        emoji: "💙",
        minScore: 26,
        maxScore: 35,
        color: "#2196F3",
        bgColor: "#E3F2FD",
        borderColor: "#90CAF9",
        description: "你开始有一些恋爱脑的倾向了！在感情中会投入一定的精力，但还能保持理智。你懂得享受恋爱的甜蜜，也知道适可而止。这是一个很不错的状态，继续保持就好～"
    },
    {
        level: 3,
        name: "轻中度恋爱脑",
        emoji: "💜",
        minScore: 36,
        maxScore: 45,
        color: "#9C27B0",
        bgColor: "#F3E5F5",
        borderColor: "#CE93D8",
        description: "你的恋爱脑开始显现啦！在感情中会比较投入，也会有一些浪漫的小幻想。虽然还能保持一定的理智，但有时候也会被情绪影响。建议适当保持距离，给自己留一些空间～"
    },
    {
        level: 4,
        name: "中度恋爱脑",
        emoji: "💕",
        minScore: 46,
        maxScore: 55,
        color: "#FF6B9D",
        bgColor: "#FFE5EC",
        borderColor: "#FFB6C1",
        description: "你已经是标准的恋爱脑了！在感情中投入很多，对方的一举一动都会牵动你的情绪。你享受恋爱的感觉，也愿意为对方付出。但要注意不要过度依赖，保持一定的独立性会让感情更健康～"
    },
    {
        level: 5,
        name: "中重度恋爱脑",
        emoji: "💖",
        minScore: 56,
        maxScore: 65,
        color: "#E91E63",
        bgColor: "#FCE4EC",
        borderColor: "#F48FB1",
        description: "你的恋爱脑指数比较高！感情在你的生活中占据了很重要的位置，你会为了爱情做出很多改变和牺牲。这份真诚很可贵，但也要记得爱自己，不要在感情中完全迷失自我哦～"
    },
    {
        level: 6,
        name: "重度恋爱脑",
        emoji: "💗",
        minScore: 66,
        maxScore: 75,
        color: "#F44336",
        bgColor: "#FFEBEE",
        borderColor: "#EF9A9A",
        description: "你是重度恋爱脑患者！恋爱几乎成为了你生活的全部，你会全身心投入感情，甚至忽略其他重要的事情。建议培养一些个人兴趣，保持社交圈子，这样才能拥有更平衡的生活～"
    },
    {
        level: 7,
        name: "极重度恋爱脑",
        emoji: "💘",
        minScore: 76,
        maxScore: 85,
        color: "#D32F2F",
        bgColor: "#FFCDD2",
        borderColor: "#E57373",
        description: "警告！你的恋爱脑指数已经爆表！你在感情中完全失去理智，可能会做出一些冲动的决定。强烈建议你暂停一下，冷静思考，找回自己。记住：健康的爱情是相互成就，而不是自我消耗！"
    },
    {
        level: 8,
        name: "终极恋爱脑",
        emoji: "💝",
        minScore: 86,
        maxScore: 95,
        color: "#C62828",
        bgColor: "#FFEBEE",
        borderColor: "#EF5350",
        description: "你的恋爱脑已经达到终极水平！爱情就是你的信仰，其他的都可以为爱让路。这种状态其实挺危险的，容易在感情中受伤。建议寻求专业的心理咨询，学会建立健康的亲密关系～"
    },
    {
        level: 9,
        name: "满级恋爱脑",
        emoji: "🌪️",
        minScore: 96,
        maxScore: 100,
        color: "#B71C1C",
        bgColor: "#FFEBEE",
        borderColor: "#EF5350",
        description: "满级恋爱脑！你已经完全沉浸在爱情的漩涡中无法自拔。这不是健康的状态，可能会严重影响你的生活和工作。请一定要寻求帮助，重新找回自我，学会独立和自爱。记住：你值得更好的自己！"
    }
];

// 全局变量
let currentQuestion = 0;
let answers = {};
let chartInstance = null;

// DOM元素
const pages = {
    intro: document.getElementById('intro-page'),
    test: document.getElementById('test-page'),
    result: document.getElementById('result-page'),
    history: document.getElementById('history-page')
};

// 页面切换
function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');
    window.scrollTo(0, 0);
}

// 开始测试
document.getElementById('start-btn').addEventListener('click', () => {
    currentQuestion = 0;
    answers = {};
    showPage('test');
    renderQuestion();
});

// 渲染问题
function renderQuestion() {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length * 100).toFixed(1);
    
    document.getElementById('current-num').textContent = currentQuestion + 1;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('progress-percent').textContent = progress + '%';
    document.getElementById('remaining').textContent = questions.length - currentQuestion - 1;
    document.getElementById('question-text').textContent = question.text;
    
    // 渲染选项
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `
            <span class="option-label">${option.label}</span>
            <span>${option.text}</span>
        `;
        btn.addEventListener('click', () => handleAnswer(option.value));
        optionsContainer.appendChild(btn);
    });
    
    // 上一题按钮
    const prevBtn = document.getElementById('prev-btn');
    if (currentQuestion > 0) {
        prevBtn.style.visibility = 'visible';
    } else {
        prevBtn.style.visibility = 'hidden';
    }
}

// 处理答案
function handleAnswer(value) {
    answers[questions[currentQuestion].id] = value;
    
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        showResults();
    }
}

// 上一题
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
});

// 计算结果
function calculateResults() {
    let rawScore = 0;
    const dimensionScores = {};
    
    // 初始化维度分数
    Object.keys(dimensions).forEach(dim => {
        dimensionScores[dim] = { score: 0, count: 0 };
    });
    
    // 计算原始分数和各维度分数
    questions.forEach(q => {
        const score = answers[q.id] || 1;
        rawScore += score;
        dimensionScores[q.dimension].score += score;
        dimensionScores[q.dimension].count++;
    });
    
    // 将原始分数转换为100分制
    // 原始分数范围: 32-160, 转换为 20-100
    const totalScore = Math.round(((rawScore - 32) / (160 - 32)) * (100 - 20) + 20);
    
    // 计算维度平均分
    const dimensionAvgScores = {};
    Object.keys(dimensionScores).forEach(dim => {
        const { score, count } = dimensionScores[dim];
        dimensionAvgScores[dim] = (score / count).toFixed(2);
    });
    
    return { totalScore, dimensionAvgScores };
}

// 获取等级
function getLevel(totalScore) {
    return levels.find(level => 
        totalScore >= level.minScore && totalScore <= level.maxScore
    ) || levels[0];
}

// 获取维度等级
function getDimensionLevel(avgScore) {
    const score = parseFloat(avgScore);
    if (score < 2.0) return { level: '很低', color: '#4CAF50' };
    if (score < 3.0) return { level: '较低', color: '#2196F3' };
    if (score < 3.5) return { level: '中等', color: '#FBC02D' };
    if (score < 4.0) return { level: '较高', color: '#FF9800' };
    return { level: '很高', color: '#F44336' };
}

// 显示结果
function showResults() {
    const results = calculateResults();
    const level = getLevel(results.totalScore);
    
    // 渲染总体结果
    const overallResult = document.getElementById('overall-result');
    overallResult.style.background = level.bgColor;
    overallResult.style.border = `2px solid ${level.borderColor}`;
    overallResult.innerHTML = `
        <div class="result-emoji">${level.emoji}</div>
        <div class="result-level" style="color: ${level.color}">
            ${level.name}
        </div>
        <div class="result-scores">
            <div class="score-item">
                <div class="score-value">${results.totalScore}</div>
                <div class="score-label">总分</div>
            </div>
        </div>
        <div class="result-description" style="color: ${level.color}">
            ${level.description}
        </div>
    `;
    
    // 渲染雷达图
    renderRadarChart(results.dimensionAvgScores);
    
    // 渲染维度列表
    renderDimensions(results.dimensionAvgScores);
    
    // 渲染建议
    renderSuggestions(results.dimensionAvgScores);
    
    // 保存历史记录
    saveHistory(results.totalScore, level);
    
    showPage('result');
}

// 渲染雷达图
function renderRadarChart(dimensionAvgScores) {
    const ctx = document.getElementById('radar-chart');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const labels = Object.keys(dimensions).map(dim => dimensions[dim].name);
    const data = Object.keys(dimensions).map(dim => parseFloat(dimensionAvgScores[dim]));
    
    chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: '得分',
                data: data,
                borderColor: '#FF6B9D',
                backgroundColor: 'rgba(255, 107, 157, 0.2)',
                pointBackgroundColor: '#FF6B9D',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#FF6B9D'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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

// 渲染维度列表
function renderDimensions(dimensionAvgScores) {
    const container = document.getElementById('dimensions-container');
    container.innerHTML = '';
    
    Object.keys(dimensions).forEach(dim => {
        const avgScore = dimensionAvgScores[dim];
        const dimLevel = getDimensionLevel(avgScore);
        const percentage = (parseFloat(avgScore) / 5 * 100).toFixed(0);
        
        const item = document.createElement('div');
        item.className = 'dimension-item';
        item.style.backgroundColor = dimLevel.color + '10';
        item.style.borderColor = dimLevel.color;
        
        item.innerHTML = `
            <div class="dimension-header">
                <span class="dimension-name" style="color: ${dimLevel.color}">${dimensions[dim].name}</span>
                <div class="dimension-score-badge">
                    <span class="dimension-score">${avgScore}</span>
                    <span class="dimension-level" style="background: ${dimLevel.color}">${dimLevel.level}</span>
                </div>
            </div>
            <div class="dimension-progress">
                <div class="dimension-progress-fill" style="width: ${percentage}%; background: ${dimLevel.color}"></div>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// 渲染建议
function renderSuggestions(dimensionAvgScores) {
    const container = document.getElementById('suggestions-section');
    
    // 找出得分最高的维度
    const highScoreDimensions = Object.keys(dimensionAvgScores)
        .filter(dim => parseFloat(dimensionAvgScores[dim]) >= 3.5)
        .sort((a, b) => parseFloat(dimensionAvgScores[b]) - parseFloat(dimensionAvgScores[a]))
        .slice(0, 2);
    
    if (highScoreDimensions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #4CAF50;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
                <h3 style="color: #4CAF50; margin-bottom: 0.5rem;">状态很棒！</h3>
                <p style="color: #666;">你在各个维度都保持着良好的平衡，继续保持这样的状态～</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<h3 class="section-title">💡 改善建议</h3><div class="suggestion-grid"></div>';
    const grid = container.querySelector('.suggestion-grid');
    
    highScoreDimensions.forEach(dim => {
        const dimLevel = getDimensionLevel(dimensionAvgScores[dim]);
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.style.backgroundColor = dimLevel.color + '10';
        card.style.borderColor = dimLevel.color;
        
        card.innerHTML = `
            <h4 style="color: ${dimLevel.color}">${dimensions[dim].name}</h4>
            <p>${dimensions[dim].description}</p>
            <ul>
                ${dimensions[dim].suggestions.map(sug => `<li>${sug}</li>`).join('')}
            </ul>
        `;
        
        grid.appendChild(card);
    });
}

// 保存历史记录
function saveHistory(totalScore, level) {
    const history = JSON.parse(localStorage.getItem('loveBrainHistory') || '[]');
    
    const record = {
        date: new Date().toLocaleString('zh-CN'),
        timestamp: Date.now(),
        totalScore: totalScore,
        level: level.level,
        levelName: level.name,
        emoji: level.emoji
    };
    
    history.unshift(record);
    
    // 只保留最近10条记录
    if (history.length > 10) {
        history.splice(10);
    }
    
    localStorage.setItem('loveBrainHistory', JSON.stringify(history));
}

// 显示历史记录
function showHistory() {
    const history = JSON.parse(localStorage.getItem('loveBrainHistory') || '[]');
    const container = document.getElementById('history-container');
    
    if (history.length === 0) {
        container.innerHTML = `
            <div class="history-empty">
                <div class="history-empty-icon">📝</div>
                <p>还没有测评记录哦～</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">快去做一次测评吧！</p>
            </div>
        `;
    } else {
        container.innerHTML = history.map((record, index) => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-date">${record.date}</span>
                    <button class="history-delete-btn" onclick="deleteHistory(${index})">🗑️</button>
                </div>
                <div class="history-result">
                    <div class="history-level">
                        ${record.emoji} ${record.levelName}
                    </div>
                    <div class="history-score">
                        总分：${record.totalScore}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showPage('history');
}

// 删除历史记录
function deleteHistory(index) {
    if (confirm('确定要删除这条记录吗？')) {
        const history = JSON.parse(localStorage.getItem('loveBrainHistory') || '[]');
        history.splice(index, 1);
        localStorage.setItem('loveBrainHistory', JSON.stringify(history));
        showHistory();
    }
}

// 自动测试功能 - 显示选择弹窗
document.getElementById('auto-test-btn').addEventListener('click', () => {
    showAutoTestModal();
});

// 显示自动测试选择弹窗
function showAutoTestModal() {
    const modal = document.getElementById('auto-test-modal');
    modal.classList.add('active');
}

// 关闭自动测试弹窗
function closeAutoTestModal() {
    const modal = document.getElementById('auto-test-modal');
    modal.classList.remove('active');
}

// 执行自动测试
function runAutoTest(mode) {
    currentQuestion = 0;
    answers = {};
    
    // 根据不同模式生成分数
    questions.forEach(q => {
        let score;
        switch(mode) {
            case 'low':
                // 低分：主要在1-2分之间
                score = Math.random() < 0.7 ? 1 : 2;
                break;
            case 'medium':
                // 中分：主要在2-4分之间
                score = Math.floor(Math.random() * 3) + 2;
                break;
            case 'high':
                // 高分：主要在4-5分之间
                score = Math.random() < 0.7 ? 5 : 4;
                break;
            case 'random':
            default:
                // 随机：1-5分随机
                score = Math.floor(Math.random() * 5) + 1;
                break;
        }
        answers[q.id] = score;
    });
    
    // 关闭弹窗并显示结果
    closeAutoTestModal();
    showResults();
}

// 事件监听
document.getElementById('history-btn').addEventListener('click', showHistory);
document.getElementById('view-history-btn').addEventListener('click', showHistory);
document.getElementById('back-to-intro-btn').addEventListener('click', () => showPage('intro'));

document.getElementById('restart-btn').addEventListener('click', () => {
    currentQuestion = 0;
    answers = {};
    showPage('intro');
});

// 自动测试弹窗事件监听
document.getElementById('close-modal-btn').addEventListener('click', closeAutoTestModal);
document.getElementById('auto-test-low').addEventListener('click', () => runAutoTest('low'));
document.getElementById('auto-test-medium').addEventListener('click', () => runAutoTest('medium'));
document.getElementById('auto-test-high').addEventListener('click', () => runAutoTest('high'));
document.getElementById('auto-test-random').addEventListener('click', () => runAutoTest('random'));

// 点击弹窗背景关闭
document.getElementById('auto-test-modal').addEventListener('click', (e) => {
    if (e.target.id === 'auto-test-modal') {
        closeAutoTestModal();
    }
});