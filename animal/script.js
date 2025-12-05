const { useState, useEffect, useRef } = React;

const AnimalPersonalityTest = () => {
  const [currentPage, setCurrentPage] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [titleClickCount, setTitleClickCount] = useState(0);
  const [titleClickTimes, setTitleClickTimes] = useState([]);
  const [showQuickTest, setShowQuickTest] = useState(false);
  const chartRef = useRef(null);

  // 8个维度配置
  const dimensions = {
    "支配性": { name: "支配性", icon: "👑", color: "#FF6B6B", description: "领导欲望、掌控力" },
    "社交性": { name: "社交性", icon: "🎭", color: "#4ECDC4", description: "群居倾向、社交能力" },
    "敏捷性": { name: "敏捷性", icon: "⚡", color: "#FFE66D", description: "反应速度、灵活度" },
    "力量感": { name: "力量感", icon: "💪", color: "#95E1D3", description: "稳定性、可靠性" },
    "服从性": { name: "服从性", icon: "🤝", color: "#C7CEEA", description: "忠诚度、配合度" },
    "敏感性": { name: "敏感性", icon: "🌸", color: "#FFB3BA", description: "细腻、情绪感知" },
    "独立性": { name: "独立性", icon: "🦅", color: "#A8DADC", description: "自主能力、独行" },
    "好奇心": { name: "好奇心", icon: "🔍", color: "#FFAAA5", description: "探索欲、创新性" }
  };

  // 20种动物类型
  const animalTypes = {
    "狮子": { icon: "🦁", dimensions: ["支配性", "力量感", "独立性"], slogan: "王者风范，一呼百应", description: "你是天生的领袖，拥有强大的气场和掌控力。你习惯主导一切，在团队中自然成为核心。你的存在就是力量的象征，让人不自觉地想要追随。虽然有时显得强势，但这正是你的魅力所在。", traits: ["天生领导者", "决策果断", "气场强大", "掌控欲强"], careers: ["管理者", "创业者", "决策者", "团队领袖"], color: "from-orange-400 to-red-500" },
    "狼": { icon: "🐺", dimensions: ["支配性", "社交性", "力量感"], slogan: "独行虽快，众行方远", description: "你既有领导力，又懂得团队合作的重要性。你是天生的团队领袖，能够凝聚众人的力量。你懂得在独立和协作之间找到平衡，这让你在任何环境中都能游刃有余。", traits: ["团队领袖", "战略思维", "忠诚可靠", "社群意识强"], careers: ["项目经理", "团队领导", "组织者", "协调者"], color: "from-gray-600 to-blue-700" },
    "老虎": { icon: "🐯", dimensions: ["支配性", "独立性", "力量感"], slogan: "深藏不露，一击必杀", description: "你是独行的强者，拥有强大的个人能力和魄力。你不需要依赖他人，独自就能完成目标。你的气场强大但不张扬，只在关键时刻展现实力，一鸣惊人。", traits: ["独立强者", "爆发力强", "低调沉稳", "目标明确"], careers: ["独立顾问", "专家", "自由职业", "个体创业"], color: "from-orange-500 to-yellow-600" },
    "仓鼠": { icon: "🐹", dimensions: ["敏感性", "好奇心", "敏捷性"], slogan: "今天存粮，明天不慌", description: "你是勤劳可爱的囤货专家，总是为未来做准备。你对细节敏感，善于发现生活中的小确幸。虽然体型小巧，但你的活力和热情感染着身边的人。", traits: ["未雨绸缪", "细心谨慎", "活力充沛", "可爱讨喜"], careers: ["理财规划", "细节工作", "助理", "运营专员"], color: "from-yellow-300 to-orange-400" },
    "兔子": { icon: "🐰", dimensions: ["敏感性", "敏捷性", "服从性"], slogan: "温柔外表，灵动内心", description: "你温柔善良，反应敏捷。你总能在第一时间感知周围的变化，并快速做出调整。你的温柔不是软弱，而是一种生存智慧。你用自己的方式在世界中优雅地生存。", traits: ["温柔体贴", "反应敏捷", "适应性强", "善解人意"], careers: ["客服", "护理", "教育", "服务行业"], color: "from-pink-300 to-purple-400" },
    "考拉": { icon: "🐨", dimensions: ["服从性", "敏感性", "独立性"], slogan: "慢慢来，比较快", description: "你是佛系生活的代表，追求内心的平静。你不着急不焦虑，按照自己的节奏生活。虽然行动缓慢，但你总能在关键时刻做出正确的选择。慢生活也是一种态度。", traits: ["从容淡定", "享受当下", "佛系心态", "内心平和"], careers: ["设计师", "艺术家", "自由职业", "慢节奏工作"], color: "from-gray-400 to-green-500" },
    "刺猬": { icon: "🦔", dimensions: ["敏感性", "独立性", "服从性"], slogan: "看似扎手，内心柔软", description: "你外表防备，内心柔软。你用刺保护自己，但对信任的人会展现温柔的一面。你需要时间去建立信任，但一旦建立，你会是最忠诚的朋友。", traits: ["外刚内柔", "自我保护", "谨慎敏感", "忠诚深情"], careers: ["心理咨询", "写作", "研究", "独立工作"], color: "from-brown-400 to-yellow-600" },
    "狐狸": { icon: "🦊", dimensions: ["敏捷性", "好奇心", "独立性"], slogan: "以智取胜，见招拆招", description: "你机智灵活，善于应变。你的头脑转得很快，总能找到解决问题的巧妙方法。你喜欢用智慧而非蛮力达成目标，这让你在各种情况下都能游刃有余。", traits: ["机智灵活", "应变能力强", "善于谋略", "独立思考"], careers: ["策略规划", "咨询", "销售", "公关"], color: "from-orange-400 to-red-500" },
    "猫咪": { icon: "🐱", dimensions: ["独立性", "敏感性", "好奇心"], slogan: "我有九条命，怕什么", description: "你优雅独立，按照自己的意愿生活。你不需要别人的认可，只做自己想做的事。你的独立和神秘感让人着迷，但你只对少数人敞开心扉。", traits: ["优雅独立", "神秘莫测", "选择性社交", "自我中心"], careers: ["自由职业", "艺术创作", "设计", "独立工作"], color: "from-purple-400 to-pink-500" },
    "浣熊": { icon: "🦝", dimensions: ["好奇心", "敏捷性", "社交性"], slogan: "万物皆可研究", description: "你对世界充满好奇，喜欢探索未知。你的双手灵巧，头脑聪明，总是在研究新事物。你的好奇心和探索精神让生活充满乐趣。", traits: ["好奇宝宝", "爱探索", "灵巧聪明", "学习能力强"], careers: ["研究员", "产品经理", "创新岗位", "探索者"], color: "from-gray-500 to-orange-400" },
    "松鼠": { icon: "🐿️", dimensions: ["敏捷性", "好奇心", "社交性"], slogan: "停不下来的小马达", description: "你活泼好动，精力充沛。你总是在行动中，闲不下来。你的活力和热情感染着身边的人，让生活充满欢笑和惊喜。", traits: ["活力四射", "停不下来", "热情开朗", "社交活跃"], careers: ["活动策划", "销售", "运营", "媒体"], color: "from-orange-400 to-yellow-500" },
    "熊熊": { icon: "🐻", dimensions: ["力量感", "独立性", "服从性"], slogan: "外表憨憨，内心稳稳", description: "你憨厚可靠，是大家的守护者。你看似笨拙，实则内心强大。你用自己的方式保护着在乎的人，是值得信赖的靠山。", traits: ["憨厚可靠", "力量强大", "保护欲强", "温和稳重"], careers: ["保护类工作", "后勤支持", "技术岗位", "服务行业"], color: "from-brown-500 to-yellow-700" },
    "牛牛": { icon: "🐂", dimensions: ["力量感", "服从性", "独立性"], slogan: "一步一个脚印", description: "你踏实可靠，是团队的基石。你不追求速度，但每一步都走得扎实。你的稳重和可靠让人安心，是可以托付重任的伙伴。", traits: ["踏实稳重", "任劳任怨", "可靠持久", "默默奉献"], careers: ["执行岗位", "技术工作", "生产制造", "后勤保障"], color: "from-brown-600 to-green-700" },
    "河马": { icon: "🦛", dimensions: ["力量感", "社交性", "服从性"], slogan: "平时佛系，发火要命", description: "你温和憨厚，但有自己的底线。你通常很好说话，但一旦被触怒，爆发力惊人。你的反差萌让人既喜欢又敬畏。", traits: ["温和有底线", "爆发力强", "看似温顺", "实则强大"], careers: ["客户服务", "管理岗位", "协调工作", "支持角色"], color: "from-purple-400 to-blue-500" },
    "狗狗": { icon: "🐶", dimensions: ["服从性", "社交性", "敏感性"], slogan: "你的快乐就是我的使命", description: "你忠诚可靠，是最值得信赖的伙伴。你对朋友掏心掏肺，总是第一时间出现在需要的时候。你的忠诚和热情让人感动。", traits: ["忠诚可靠", "热情友善", "善解人意", "无私奉献"], careers: ["服务行业", "助理", "支持岗位", "团队协作"], color: "from-yellow-400 to-orange-500" },
    "海豚": { icon: "🐬", dimensions: ["社交性", "好奇心", "敏捷性"], slogan: "团队才是力量源泉", description: "你聪明友善，是社交场上的明星。你懂得团队协作的力量，善于协调各方关系。你的智慧和亲和力让你在人群中脱颖而出。", traits: ["聪明社交", "团队精神", "协调能力强", "受欢迎"], careers: ["公关", "协调", "销售", "团队管理"], color: "from-blue-400 to-cyan-500" },
    "企鹅": { icon: "🐧", dimensions: ["社交性", "服从性", "力量感"], slogan: "一起摇摆才快乐", description: "你喜欢群体生活，在团队中找到归属感。你可爱憨厚，总能给人带来欢乐。你懂得抱团取暖的重要性，是团队不可或缺的一员。", traits: ["团队意识强", "可爱友善", "适应力强", "集体主义"], careers: ["团队协作", "集体项目", "组织工作", "协调岗位"], color: "from-gray-700 to-blue-400" },
    "猫头鹰": { icon: "🦉", dimensions: ["独立性", "好奇心", "敏感性"], slogan: "白天睡觉，晚上开工", description: "你是智慧的象征，喜欢在夜晚思考。你独立深沉，有自己的生活节奏。你的洞察力和智慧让你看透事物的本质。", traits: ["智慧深沉", "夜猫子", "洞察力强", "独立思考"], careers: ["研究", "写作", "咨询", "创作"], color: "from-purple-700 to-gray-600" },
    "熊猫": { icon: "🐼", dimensions: ["服从性", "敏感性", "独立性"], slogan: "吃竹子就是最大的事业", description: "你是佛系国宝，追求简单快乐的生活。你不争不抢，按照自己的节奏生活。你的可爱和淡定让人羡慕，活出了别人向往的样子。", traits: ["佛系可爱", "知足常乐", "淡定从容", "惹人喜爱"], careers: ["创意工作", "设计", "自由职业", "慢节奏岗位"], color: "from-gray-800 to-white" },
    "袋鼠": { icon: "🦘", dimensions: ["敏捷性", "力量感", "独立性"], slogan: "向前跳，不回头", description: "你充满活力，勇往直前。你的跳跃能力惊人，总是向着目标前进。你不回头看过去，只专注于未来，这种积极的态度让你不断突破。", traits: ["积极向前", "爆发力强", "不惧困难", "目标明确"], careers: ["销售", "创业", "运动", "挑战性工作"], color: "from-orange-500 to-brown-600" }
  };

  // 42道题目
  const questions = [
    { id: 1, text: "🎮 组队打游戏时，你更愿意：", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '指挥全场："都听我的，跟我冲！"' },
      { value: 3, label: 'B', text: '当副C："你指挥，我配合"' },
      { value: 2, label: 'C', text: '划水摆烂："随便啦，你们打我躺"' },
      { value: 1, label: 'D', text: '单干："别管我，我自己玩"' }
    ]},
    { id: 2, text: "🎂 朋友生日聚会，谁来策划？", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '必须是我！从订餐到游戏都安排好' },
      { value: 4, label: 'B', text: '我提建议，大家一起商量' },
      { value: 2, label: 'C', text: '你们定就行，我到时候去' },
      { value: 1, label: 'D', text: '要不算了，出去吃个饭得了' }
    ]},
    { id: 3, text: "🚗 自驾游迷路了，你会：", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '"让我来！"夺过导航自己研究' },
      { value: 3, label: 'B', text: '"大家看看哪条路好"一起决策' },
      { value: 2, label: 'C', text: '"老司机你决定"完全听从' },
      { value: 1, label: 'D', text: '"迷路就迷路呗"走哪算哪' }
    ]},
    { id: 4, text: "🍜 点外卖拼单时：", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '"都听我的统一点这家，方便"' },
      { value: 4, label: 'B', text: '"大家各点各的，我统一下单"' },
      { value: 2, label: 'C', text: '"你们点啥我就点啥"' },
      { value: 1, label: 'D', text: '"我不拼了，自己点"' }
    ]},
    { id: 5, text: "🎬 看电影选片时：", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '"就这部！"直接拍板决定' },
      { value: 3, label: 'B', text: '"来来来投个票"民主决策' },
      { value: 2, label: 'C', text: '"你们选吧我随便"佛系跟随' },
      { value: 1, label: 'D', text: '"我不去了你们看吧"退出群聊' }
    ]},
    { id: 6, text: "🏝️ 荒岛求生，队伍需要领袖：", dimension: "支配性", options: [
      { value: 5, label: 'A', text: '"我有想法！大家听我指挥"' },
      { value: 4, label: 'B', text: '"咱们分工合作，各司其职"' },
      { value: 2, label: 'C', text: '"你说怎么办就怎么办"' },
      { value: 1, label: 'D', text: '"我先去找个山洞躲起来"' }
    ]},
    { id: 7, text: "🎉 电梯里遇到陌生人：", dimension: "社交性", options: [
      { value: 5, label: 'A', text: '"哎你也住这儿啊？"主动搭话' },
      { value: 3, label: 'B', text: '尴尬微笑，假装看手机' },
      { value: 2, label: 'C', text: '面无表情盯着楼层数字' },
      { value: 1, label: 'D', text: '默默往角落挤，减少存在感' }
    ]},
    { id: 8, text: "🍕 公司团建活动：", dimension: "社交性", options: [
      { value: 5, label: 'A', text: '"我来组织游戏！"全场最嗨' },
      { value: 4, label: 'B', text: '参与互动，气氛担当' },
      { value: 2, label: 'C', text: '礼貌参加，低调坐着' },
      { value: 1, label: 'D', text: '"突然身体不适"请假回家' }
    ]},
    { id: 9, text: "📱 微信群里有人@所有人：", dimension: "社交性", options: [
      { value: 5, label: 'A', text: '第一个跳出来回复' },
      { value: 3, label: 'B', text: '看看情况再决定要不要回' },
      { value: 2, label: 'C', text: '等别人都说完了再冒泡' },
      { value: 1, label: 'D', text: '已读不回，装没看见' }
    ]},
    { id: 10, text: "🎤 KTV包厢里：", dimension: "社交性", options: [
      { value: 5, label: 'A', text: '"我先来！"抢麦霸位' },
      { value: 4, label: 'B', text: '点几首喜欢的歌唱唱' },
      { value: 2, label: 'C', text: '被点名才勉强唱一首' },
      { value: 1, label: 'D', text: '"我不唱我给你们鼓掌"' }
    ]},
    { id: 11, text: "🏖️ 假期结束，你的朋友圈：", dimension: "社交性", options: [
      { value: 5, label: 'A', text: '九宫格美照配长文，记录一切' },
      { value: 3, label: 'B', text: '发几张精选照片就好' },
      { value: 2, label: 'C', text: '转发别人的，自己懒得发' },
      { value: 1, label: 'D', text: '什么都不发，保持神秘' }
    ]},
    { id: 12, text: "🔥 火锅店上菜了，你：", dimension: "敏捷性", options: [
      { value: 5, label: 'A', text: '"我来！"迅速夹菜，手速第一' },
      { value: 3, label: 'B', text: '不急不慢，稳稳地夹' },
      { value: 2, label: 'C', text: '等锅里煮好了再慢慢捞' },
      { value: 1, label: 'D', text: '"你们帮我夹点"坐等投喂' }
    ]},
    { id: 13, text: "🎮 玩反应类游戏时：", dimension: "敏捷性", options: [
      { value: 5, label: 'A', text: '战神！连击不断' },
      { value: 3, label: 'B', text: '还行吧，偶尔失误' },
      { value: 2, label: 'C', text: '手残党，经常按错' },
      { value: 1, label: 'D', text: '"我不玩这个我会吐"' }
    ]},
    { id: 14, text: "🚶 走在路上突然要下雨：", dimension: "敏捷性", options: [
      { value: 5, label: 'A', text: '立刻冲刺找避雨的地方' },
      { value: 3, label: 'B', text: '加快脚步，淡定前进' },
      { value: 2, label: 'C', text: '慢悠悠走，反正都要淋' },
      { value: 1, label: 'D', text: '"算了躺平"站着淋雨' }
    ]},
    { id: 15, text: "🧠 学新东西的速度：", dimension: "敏捷性", options: [
      { value: 5, label: 'A', text: '一看就会，一学就通' },
      { value: 4, label: 'B', text: '看两遍就能掌握' },
      { value: 2, label: 'C', text: '需要反复练习才会' },
      { value: 1, label: 'D', text: '"我学不会，放弃了"' }
    ]},
    { id: 16, text: "🎯 做决定的速度：", dimension: "敏捷性", options: [
      { value: 5, label: 'A', text: '秒选！不纠结' },
      { value: 4, label: 'B', text: '想一小会就决定' },
      { value: 2, label: 'C', text: '需要纠结很久' },
      { value: 1, label: 'D', text: '选择困难症晚期' }
    ]},
    { id: 17, text: "🏋️ 被人撞了一下，你：", dimension: "力量感", options: [
      { value: 5, label: 'A', text: '"哎你没事吧？"很淡定' },
      { value: 4, label: 'B', text: '踉跄一下但站稳了' },
      { value: 2, label: 'C', text: '差点摔倒，惊慌失措' },
      { value: 1, label: 'D', text: '直接倒地，需要人扶' }
    ]},
    { id: 18, text: "💼 工作/学习压力大时：", dimension: "力量感", options: [
      { value: 5, label: 'A', text: '"小意思！"继续硬刚' },
      { value: 4, label: 'B', text: '咬咬牙能扛住' },
      { value: 2, label: 'C', text: '有点崩溃想哭' },
      { value: 1, label: 'D', text: '已经躺平摆烂了' }
    ]},
    { id: 19, text: "🌪️ 生活突然来个大变故：", dimension: "力量感", options: [
      { value: 5, label: 'A', text: '冷静分析，快速应对' },
      { value: 3, label: 'B', text: '慌一下但能调整' },
      { value: 2, label: 'C', text: '需要很久才能缓过来' },
      { value: 1, label: 'D', text: '"完蛋了"直接破防' }
    ]},
    { id: 20, text: "🎢 面对不确定性：", dimension: "力量感", options: [
      { value: 5, label: 'A', text: '"来啊！"迎难而上' },
      { value: 3, label: 'B', text: '有点紧张但能接受' },
      { value: 2, label: 'C', text: '很焦虑，不喜欢变化' },
      { value: 1, label: 'D', text: '恐慌，需要确定性' }
    ]},
    { id: 21, text: "⚓ 你给人的感觉是：", dimension: "力量感", options: [
      { value: 5, label: 'A', text: '靠山！有你在就安心' },
      { value: 4, label: 'B', text: '靠谱，能指望得上' },
      { value: 2, label: 'C', text: '挺好，但关键时刻不太行' },
      { value: 1, label: 'D', text: '泥菩萨过河自身难保' }
    ]},
    { id: 22, text: "👔 老板/老师安排任务：", dimension: "服从性", options: [
      { value: 1, label: 'A', text: '"为什么？我觉得不合理"质疑' },
      { value: 2, label: 'B', text: '"我有个想法..."提建议' },
      { value: 5, label: 'C', text: '"好的收到"立刻执行' },
      { value: 3, label: 'D', text: '"嗯嗯知道了"敷衍了事' }
    ]},
    { id: 23, text: "🎲 游戏规则不喜欢：", dimension: "服从性", options: [
      { value: 1, label: 'A', text: '"不玩了！这规则有问题"' },
      { value: 2, label: 'B', text: '"能不能改改规则"提议修改' },
      { value: 5, label: 'C', text: '"行吧"勉强接受' },
      { value: 1, label: 'D', text: '"那算了"直接退出' }
    ]},
    { id: 24, text: "🍔 朋友约你吃你不爱吃的：", dimension: "服从性", options: [
      { value: 1, label: 'A', text: '"换一家！我不吃这个"强硬拒绝' },
      { value: 2, label: 'B', text: '"要不咱们吃XX吧"建议其他' },
      { value: 5, label: 'C', text: '"行吧随你"迁就对方' },
      { value: 1, label: 'D', text: '"你们去吧我不去了"' }
    ]},
    { id: 25, text: "👥 团队意见和你不一样：", dimension: "服从性", options: [
      { value: 1, label: 'A', text: '"我觉得不对"坚持己见' },
      { value: 2, label: 'B', text: '"听我说说"尝试说服' },
      { value: 5, label: 'C', text: '"那就按你们的来吧"妥协' },
      { value: 2, label: 'D', text: '"我不管了你们决定"退出讨论' }
    ]},
    { id: 26, text: "🎯 被安排不喜欢的工作：", dimension: "服从性", options: [
      { value: 1, label: 'A', text: '"凭什么是我？"明确反对' },
      { value: 2, label: 'B', text: '"能不能换个人"尝试推脱' },
      { value: 5, label: 'C', text: '"好吧"虽然不爽但接受' },
      { value: 4, label: 'D', text: '憋着气做完然后记仇' }
    ]},
    { id: 27, text: "😢 看感人电影时：", dimension: "敏感性", options: [
      { value: 5, label: 'A', text: '眼泪哗哗的，止不住' },
      { value: 4, label: 'B', text: '眼眶湿润，但忍住了' },
      { value: 2, label: 'C', text: '感动，但不至于哭' },
      { value: 1, label: 'D', text: '"啥玩意儿有啥好哭的"' }
    ]},
    { id: 28, text: "🎵 听到某首歌：", dimension: "敏感性", options: [
      { value: 5, label: 'A', text: '瞬间想起当年的事，情绪拉满' },
      { value: 4, label: 'B', text: '有点感触，回忆涌上' },
      { value: 2, label: 'C', text: '"嗯这歌挺好听"' },
      { value: 1, label: 'D', text: '无感，纯路过' }
    ]},
    { id: 29, text: "💬 朋友语气有点不对：", dimension: "敏感性", options: [
      { value: 5, label: 'A', text: '立刻察觉"你怎么了？"' },
      { value: 4, label: 'B', text: '感觉怪怪的，私下问问' },
      { value: 2, label: 'C', text: '好像不太对？算了不管' },
      { value: 1, label: 'D', text: '完全没注意' }
    ]},
    { id: 30, text: "🌅 看到美景时：", dimension: "敏感性", options: [
      { value: 5, label: 'A', text: '"太美了！"感动到想哭' },
      { value: 4, label: 'B', text: '拍照记录，心情很好' },
      { value: 2, label: 'C', text: '"嗯挺好看"' },
      { value: 1, label: 'D', text: '"就这？"无感' }
    ]},
    { id: 31, text: "😤 被误解时：", dimension: "敏感性", options: [
      { value: 5, label: 'A', text: '很委屈，玻璃心碎一地' },
      { value: 3, label: 'B', text: '有点难受，但能解释' },
      { value: 2, label: 'C', text: '"算了懒得说"不在意' },
      { value: 1, label: 'D', text: '"误解就误解呗"无所谓' }
    ]},
    { id: 32, text: "🍜 一个人吃饭：", dimension: "独立性", options: [
      { value: 5, label: 'A', text: '完全OK！自在得很' },
      { value: 4, label: 'B', text: '还行吧，习惯了' },
      { value: 2, label: 'C', text: '有点孤单，但能接受' },
      { value: 1, label: 'D', text: '不行！必须找个人陪' }
    ]},
    { id: 33, text: "✈️ 独自旅行：", dimension: "独立性", options: [
      { value: 5, label: 'A', text: '"最爱solo！"自由自在' },
      { value: 3, label: 'B', text: '可以，但有人更好' },
      { value: 2, label: 'C', text: '不太习惯，缺乏安全感' },
      { value: 1, label: 'D', text: '不敢，必须组队' }
    ]},
    { id: 34, text: "🏠 周末独处：", dimension: "独立性", options: [
      { value: 5, label: 'A', text: '充电时间！完美！' },
      { value: 4, label: 'B', text: '还不错，可以做自己的事' },
      { value: 2, label: 'C', text: '有点无聊，刷刷手机' },
      { value: 1, label: 'D', text: '煎熬！赶紧约人出去' }
    ]},
    { id: 35, text: "💭 做决定时：", dimension: "独立性", options: [
      { value: 5, label: 'A', text: '自己拿主意，不问别人' },
      { value: 4, label: 'B', text: '自己想清楚，偶尔参考意见' },
      { value: 2, label: 'C', text: '喜欢听听别人怎么说' },
      { value: 1, label: 'D', text: '必须有人帮我决定' }
    ]},
    { id: 36, text: "🆘 遇到困难时：", dimension: "独立性", options: [
      { value: 5, label: 'A', text: '自己想办法解决' },
      { value: 3, label: 'B', text: '先试试，不行再求助' },
      { value: 2, label: 'C', text: '马上找人帮忙' },
      { value: 1, label: 'D', text: '"救命！"第一时间呼救' }
    ]},
    { id: 37, text: "🎁 收到神秘包裹：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '立刻拆！迫不及待' },
      { value: 3, label: 'B', text: '猜一猜是什么再拆' },
      { value: 2, label: 'C', text: '等会儿再拆，不着急' },
      { value: 1, label: 'D', text: '"哦"放一边，可能忘了拆' }
    ]},
    { id: 38, text: "🗺️ 旅游时看到岔路：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '"去看看！"探索未知' },
      { value: 3, label: 'B', text: '查查地图再决定' },
      { value: 2, label: 'C', text: '算了还是走大路吧' },
      { value: 1, label: 'D', text: '迷路可不行，拒绝冒险' }
    ]},
    { id: 39, text: "📱 新App推荐：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '马上下载试试' },
      { value: 3, label: 'B', text: '看看评价再决定' },
      { value: 2, label: 'C', text: '观望一阵，没兴趣' },
      { value: 1, label: 'D', text: '懒得折腾，不下' }
    ]},
    { id: 40, text: "🍱 菜单上没吃过的菜：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '"点这个！"尝试新口味' },
      { value: 3, label: 'B', text: '问问服务员怎么样' },
      { value: 2, label: 'C', text: '还是点熟悉的吧' },
      { value: 1, label: 'D', text: '固定就吃那几样' }
    ]},
    { id: 41, text: "🔬 遇到不懂的东西：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '立刻搜索研究透' },
      { value: 3, label: 'B', text: '有空会查一查' },
      { value: 2, label: 'C', text: '知道就知道，不知道拉倒' },
      { value: 1, label: 'D', text: '懒得管，反正不影响我' }
    ]},
    { id: 42, text: "🎪 朋友说'我发现一个秘密基地'：", dimension: "好奇心", options: [
      { value: 5, label: 'A', text: '"在哪？带我去！"兴奋' },
      { value: 4, label: 'B', text: '"什么基地？"好奇询问' },
      { value: 2, label: 'C', text: '"哦这样啊"淡淡回应' },
      { value: 1, label: 'D', text: '"关我啥事"毫无兴趣' }
    ]}
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const handleTitleClick = () => {
    const now = Date.now();
    const newClickTimes = [...titleClickTimes, now].filter(time => now - time <= 10000);
    setTitleClickTimes(newClickTimes);
    setTitleClickCount(newClickTimes.length);
    if (newClickTimes.length >= 5) {
      setShowQuickTest(true);
    }
  };

  const handleQuickTest = () => {
    if (!confirm('确定要进行快速测试吗？将自动随机选择所有选项并生成结果。')) {
      return;
    }
    const quickAnswers = {};
    questions.forEach(q => {
      const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
      quickAnswers[q.id] = randomOption.value;
    });
    setAnswers(quickAnswers);
    saveResult(quickAnswers);
    setCurrentPage('result');
    setShowQuickTest(false);
    setTitleClickTimes([]);
    setTitleClickCount(0);
  };

  const loadHistory = () => {
    try {
      const records = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('animal_test_')) {
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
      localStorage.setItem(`animal_test_${Date.now()}`, JSON.stringify(record));
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
      const answer = finalAnswers[q.id];
      if (answer) {
        const selectedOption = q.options.find(opt => opt.value === answer);
        if (selectedOption) {
          dimensionScores[q.dimension] += selectedOption.value;
        }
      }
    });
    const dimensionCounts = {};
    questions.forEach(q => {
      dimensionCounts[q.dimension] = (dimensionCounts[q.dimension] || 0) + 1;
    });
    const dimensionAvgScores = {};
    Object.keys(dimensions).forEach(dim => {
      const count = dimensionCounts[dim] || 1;
      dimensionAvgScores[dim] = (dimensionScores[dim] / count).toFixed(1);
    });
    const sortedDimensions = Object.entries(dimensionAvgScores)
      .sort(([,a], [,b]) => parseFloat(b) - parseFloat(a));
    const topDimensions = sortedDimensions.slice(0, 3);
    const animalType = determineAnimalType(dimensionAvgScores, sortedDimensions);
    return {
      dimensionScores,
      dimensionAvgScores,
      sortedDimensions,
      topDimensions,
      animalType
    };
  };

  const determineAnimalType = (avgScores, sortedDims) => {
    const top3Names = sortedDims.slice(0, 3).map(([name]) => name);
    const dimScores = {};
    sortedDims.forEach(([dim, score]) => {
      dimScores[dim] = parseFloat(score);
    });
    let bestMatch = null;
    let bestScore = -1;
    Object.entries(animalTypes).forEach(([animalName, animalInfo]) => {
      if (animalInfo.dimensions && animalInfo.dimensions.length > 0) {
        let matchScore = 0;
        animalInfo.dimensions.forEach(dim => {
          if (dimScores[dim]) {
            matchScore += dimScores[dim];
          }
        });
        matchScore = matchScore / animalInfo.dimensions.length;
        const matchCount = animalInfo.dimensions.filter(dim =>
          top3Names.includes(dim)
        ).length;
        matchScore += matchCount * 0.5;
        if (matchScore > bestScore) {
          bestScore = matchScore;
          bestMatch = animalName;
        }
      }
    });
    if (!bestMatch) {
      const topDim = top3Names[0];
      const dimToAnimal = {
        "支配性": "狮子",
        "社交性": "狗狗",
        "敏捷性": "狐狸",
        "力量感": "熊熊",
        "服从性": "狗狗",
        "敏感性": "猫咪",
        "独立性": "猫咪",
        "好奇心": "浣熊"
      };
      bestMatch = dimToAnimal[topDim] || "猫咪";
    }
    return bestMatch;
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
            datasets: [{
              label: '你的得分',
              data: chartData,
              borderColor: 'rgba(139, 92, 246, 1)',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              pointBackgroundColor: dimensionNames.map(dim => dimensions[dim].color),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: dimensionNames.map(dim => dimensions[dim].color),
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
                max: 5,
                min: 0,
                ticks: {
                  stepSize: 1,
                  font: { size: 12 },
                  backdropColor: 'transparent'
                },
                pointLabels: {
                  font: { size: 13, weight: 'bold' }
                },
                grid: { color: 'rgba(0, 0, 0, 0.1)' },
                angleLines: { color: 'rgba(0, 0, 0, 0.1)' }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 }
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
    const animalInfo = animalTypes[results.animalType];
    const text = `🎉 我的动物塑性测评结果出炉啦！

我是【${results.animalType}】${animalInfo.icon}
"${animalInfo.slogan}"

✨ 性格特征：
${animalInfo.traits.map((trait, index) => `${index + 1}. ${trait}`).join('\n')}

🎯 我的优势维度：
${results.topDimensions.map(([dim, score], index) =>
  `${index + 1}. ${dimensions[dim].icon} ${dim} ${score}分`
).join('\n')}

💼 适合方向：${animalInfo.careers.join('、')}

#动物性格测试 #自我探索 #趣味测评`;
    navigator.clipboard.writeText(text).then(() => {
      alert('结果已复制到剪贴板！快去分享吧 🎉');
    }).catch(() => {
      alert('复制失败，请手动复制');
    });
  };

  const renderIntro = () => {
    return React.createElement('div', { className: "min-h-screen wild-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: "text-center mb-6 sm:mb-8 relative" },
          React.createElement('div', { className: "text-5xl sm:text-7xl mb-4 animate-bounce" }, '🦁'),
          React.createElement('h1', {
            onClick: handleTitleClick,
            className: "text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2 sm:mb-4 cursor-pointer hover:opacity-80 transition-opacity",
            title: "连续点击标题5次启动快速测试！"
          }, '动物塑性测评'),
          React.createElement('p', { className: "text-sm sm:text-base text-gray-600" }, '发现你的动物性格 · 找到真实的自己')
        ),
        showQuickTest && React.createElement('div', { className: "mb-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl p-4 sm:p-6 animate-pulse" },
          React.createElement('div', { className: "text-center" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold text-green-700 mb-3 flex items-center justify-center" },
              React.createElement('span', { className: "mr-2 text-2xl" }, '⚡'),
              '快速测试模式已解锁！'
            ),
            React.createElement('p', { className: "text-sm sm:text-base text-green-600 mb-4" }, '点击下方按钮即可自动随机选择所有选项并快速生成测评结果'),
            React.createElement('button', {
              onClick: handleQuickTest,
              className: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            }, '⚡ 启动快速测试')
          )
        ),
        React.createElement('div', { className: "space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base mb-8" },
          React.createElement('div', { className: "bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-3 text-orange-800 flex items-center" },
              React.createElement('span', { className: "mr-2" }, '🎯'),
              '测评说明'
            ),
            React.createElement('ul', { className: "space-y-2 text-orange-700" },
              React.createElement('li', { className: "flex items-start" },
                React.createElement('span', { className: "mr-2" }, '•'),
                React.createElement('span', {}, '基于8大动物性格维度，科学有趣的性格测评')
              ),
              React.createElement('li', { className: "flex items-start" },
                React.createElement('span', { className: "mr-2" }, '•'),
                React.createElement('span', {}, '共42道趣味题目，预计5-8分钟完成')
              ),
              React.createElement('li', { className: "flex items-start" },
                React.createElement('span', { className: "mr-2" }, '•'),
                React.createElement('span', {}, '根据真实感受作答，没有对错之分')
              ),
              React.createElement('li', { className: "flex items-start" },
                React.createElement('span', { className: "mr-2" }, '•'),
                React.createElement('span', {}, '匹配20种动物性格，找到最真实的你')
              )
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-4 text-blue-800 flex items-center" },
              React.createElement('span', { className: "mr-2" }, '🎨'),
              '8大性格维度'
            ),
            React.createElement('div', { className: "grid grid-cols-2 sm:grid-cols-4 gap-3" },
              Object.entries(dimensions).map(([key, dim]) =>
                React.createElement('div', {
                  key: key,
                  className: "animal-card bg-white border-2 rounded-lg p-3 text-center cursor-pointer",
                  style: { borderColor: dim.color }
                },
                  React.createElement('div', { className: "text-3xl mb-2" }, dim.icon),
                  React.createElement('div', { className: "font-semibold text-xs sm:text-sm", style: { color: dim.color } }, dim.name),
                  React.createElement('div', { className: "text-xs text-gray-500 mt-1" }, dim.description)
                )
              )
            )
          ),
          React.createElement('div', { className: "bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-4 sm:p-6" },
            React.createElement('h3', { className: "text-lg sm:text-xl font-bold mb-4 text-green-800 flex items-center" },
              React.createElement('span', { className: "mr-2" }, '🦁'),
              '可能的你'
            ),
            React.createElement('div', { className: "grid grid-cols-4 sm:grid-cols-10 gap-2 sm:gap-3" },
              Object.entries(animalTypes).slice(0, 20).map(([name, info]) =>
                React.createElement('div', {
                  key: name,
                  className: "animal-card bg-white rounded-lg p-2 text-center cursor-pointer hover:shadow-lg transition-all",
                  title: name
                },
                  React.createElement('div', { className: "text-2xl sm:text-3xl" }, info.icon),
                  React.createElement('div', { className: "text-xs font-medium text-gray-700 mt-1 truncate" }, name)
                )
              )
            )
          )
        ),
        React.createElement('div', { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center" },
          React.createElement('button', {
            onClick: handleStartTest,
            className: "w-full sm:w-auto bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          }, '🚀 开始测评 (42题)'),
          historyRecords.length > 0 && React.createElement('button', {
            onClick: () => setShowHistory(!showHistory),
            className: "w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-colors border-2 border-gray-200"
          }, `📊 查看历史记录 (${historyRecords.length})`)
        ),
        showHistory && historyRecords.length > 0 && React.createElement('div', { className: "mt-6 bg-gray-50 rounded-xl p-4 border-2 border-gray-200" },
          React.createElement('h3', { className: "font-bold text-lg mb-3 text-gray-800" }, '📜 历史测评记录'),
          React.createElement('div', { className: "space-y-2 max-h-64 overflow-y-auto" },
            historyRecords.map((record, index) => {
              const animalInfo = animalTypes[record.results.animalType];
              return React.createElement('div', {
                key: index,
                className: "bg-white p-3 rounded-lg border-2 border-gray-100 hover:border-orange-300 transition-colors flex justify-between items-center cursor-pointer"
              },
                React.createElement('div', {},
                  React.createElement('div', { className: "font-semibold text-gray-800 flex items-center" },
                    React.createElement('span', { className: "text-2xl mr-2" }, animalInfo?.icon),
                    record.results.animalType
                  ),
                  React.createElement('div', { className: "text-xs text-gray-500 mt-1" },
                    new Date(record.timestamp).toLocaleString('zh-CN')
                  )
                ),
                React.createElement('div', { className: "text-right" },
                  React.createElement('div', { className: "text-xs text-gray-600" },
                    `"${animalInfo?.slogan}"`
                  )
                )
              );
            })
          )
        ),
        React.createElement('div', { className: "mt-8 text-center text-xs sm:text-sm text-gray-500" },
          React.createElement('p', {}, '💡 测评结果仅供娱乐参考'),
          React.createElement('p', { className: "mt-1" }, '发现真实的自己 · 接纳不完美的我们')
        )
      )
    );
  };

  const renderTest = () => {
    const currentQ = questions[currentQuestion];
    const dimInfo = dimensions[currentQ.dimension];
    const progress = ((currentQuestion + 1) / questions.length * 100).toFixed(0);
    return React.createElement('div', { className: "min-h-screen wild-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: "mb-6 sm:mb-8" },
          React.createElement('div', { className: "flex items-center justify-between mb-4" },
            React.createElement('div', { className: "flex items-center space-x-2" },
              React.createElement('span', { className: "text-2xl sm:text-3xl" }, dimInfo.icon),
              React.createElement('div', {},
                React.createElement('div', { className: "font-bold text-gray-800 text-sm sm:text-base" }, dimInfo.name),
                React.createElement('div', { className: "text-xs text-gray-500" }, dimInfo.description)
              )
            ),
            React.createElement('div', { className: "text-right" },
              React.createElement('div', { className: "text-lg sm:text-2xl font-bold", style: { color: dimInfo.color } },
                `${currentQuestion + 1}/42`
              ),
              React.createElement('div', { className: "text-xs text-gray-500" }, `${progress}%`)
            )
          ),
          React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner" },
            React.createElement('div', {
              className: "h-3 rounded-full transition-all duration-500 ease-out",
              style: {
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${dimInfo.color}, ${dimInfo.color}dd)`
              }
            })
          )
        ),
        React.createElement('div', { className: "mb-8" },
          React.createElement('div', { className: "bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 mb-6" },
            React.createElement('h3', { className: "text-lg sm:text-2xl font-medium text-gray-800 text-center leading-relaxed" },
              currentQ.text
            )
          ),
          React.createElement('div', { className: "space-y-3" },
            currentQ.options.map((option) => {
              const isSelected = answers[currentQ.id] === option.value;
              return React.createElement('button', {
                key: option.value,
                onClick: () => handleAnswer(option.value),
                className: `w-full text-left p-4 sm:p-5 border-2 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 shadow-md scale-[1.02]'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:shadow-sm'
                }`
              },
                React.createElement('div', { className: "flex items-start" },
                  React.createElement('span', {
                    className: `font-bold text-base sm:text-lg w-8 h-8 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0 ${
                      isSelected ? 'text-white' : 'text-gray-600'
                    }`,
                    style: {
                      backgroundColor: isSelected ? dimInfo.color : `${dimInfo.color}20`,
                      border: isSelected ? 'none' : `2px solid ${dimInfo.color}40`
                    }
                  }, option.label),
                  React.createElement('span', { className: `text-sm sm:text-base leading-relaxed ${
                    isSelected ? 'text-gray-800 font-medium' : 'text-gray-700'
                  }` }, option.text)
                )
              );
            })
          )
        ),
        React.createElement('div', { className: "flex justify-between items-center pt-4 border-t-2 border-gray-100" },
          currentQuestion > 0 ?
            React.createElement('button', {
              onClick: () => setCurrentQuestion(currentQuestion - 1),
              className: "flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
            },
              React.createElement('span', {}, '←'),
              React.createElement('span', { className: "text-sm sm:text-base" }, '上一题')
            ) :
            React.createElement('button', {
              onClick: () => setCurrentPage('intro'),
              className: "flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors py-2 px-4 rounded-lg hover:bg-gray-100"
            },
              React.createElement('span', {}, '←'),
              React.createElement('span', { className: "text-sm sm:text-base" }, '返回首页')
            ),
          React.createElement('div', { className: "text-sm text-gray-400" },
            '还剩 ',
            React.createElement('span', { className: "font-bold text-orange-500" }, 42 - currentQuestion - 1),
            ' 题'
          )
        ),
        React.createElement('div', { className: "mt-6 text-center" },
          React.createElement('div', { className: "inline-block bg-blue-50 border border-blue-200 rounded-full px-4 py-2" },
            React.createElement('p', { className: "text-xs text-blue-700" }, '💡 选择最接近你真实想法的选项')
          )
        )
      )
    );
  };

  const renderResult = () => {
    const results = calculateResults();
    const animalInfo = animalTypes[results.animalType];
    return React.createElement('div', { className: "min-h-screen wild-gradient p-3 sm:p-6" },
      React.createElement('div', { className: "max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-4 sm:p-8" },
        React.createElement('div', { className: `bg-gradient-to-r ${animalInfo.color} rounded-2xl p-6 sm:p-10 mb-8 text-white shadow-2xl` },
          React.createElement('div', { className: "text-center" },
            React.createElement('div', { className: "text-7xl sm:text-9xl mb-4 animate-bounce" }, animalInfo.icon),
            React.createElement('h2', { className: "text-3xl sm:text-5xl font-bold mb-3 sm:mb-4" },
              `你是【${results.animalType}】`
            ),
            React.createElement('p', { className: "text-xl sm:text-2xl mb-6 opacity-90 font-medium italic" },
              `"${animalInfo.slogan}"`
            ),
            React.createElement('div', { className: "bg-white bg-opacity-20 rounded-xl p-4 sm:p-6 backdrop-blur-sm" },
              React.createElement('p', { className: "text-base sm:text-lg leading-relaxed mb-4" }, animalInfo.description),
              React.createElement('div', { className: "mt-4" },
                React.createElement('h3', { className: "font-bold text-lg mb-3 flex items-center justify-center" },
                  React.createElement('span', { className: "mr-2" }, '✨'),
                  '性格特征'
                ),
                React.createElement('div', { className: "flex flex-wrap justify-center gap-2" },
                  animalInfo.traits.map((trait, index) =>
                    React.createElement('span', {
                      key: index,
                      className: "bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-medium"
                    }, trait)
                  )
                )
              ),
              React.createElement('div', { className: "mt-4" },
                React.createElement('h3', { className: "font-bold text-lg mb-3 flex items-center justify-center" },
                  React.createElement('span', { className: "mr-2" }, '💼'),
                  '适合发展方向'
                ),
                React.createElement('div', { className: "flex flex-wrap justify-center gap-2" },
                  animalInfo.careers.map((career, index) =>
                    React.createElement('span', {
                      key: index,
                      className: "bg-white bg-opacity-30 px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base"
                    }, career)
                  )
                )
              )
            )
          )
        ),
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8" },
          React.createElement('div', { className: "bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200" },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center" },
              React.createElement('span', { className: "mr-2" }, '📊'),
              '八维能力雷达图'
            ),
            React.createElement('div', { className: "relative h-80 sm:h-96" },
              React.createElement('canvas', { ref: chartRef })
            ),
            React.createElement('div', { className: "mt-4 text-center text-xs text-gray-600" },
              '* 满分5分，分数越高该维度越突出'
            )
          ),
          React.createElement('div', { className: "space-y-4" },
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 flex items-center" },
              React.createElement('span', { className: "mr-2" }, '🏆'),
              '你的优势维度 TOP3'
            ),
            results.topDimensions.map(([dimName, score], index) => {
              const dimInfo = dimensions[dimName];
              const medals = ['🥇', '🥈', '🥉'];
              const scoreNum = parseFloat(score);
              return React.createElement('div', {
                key: dimName,
                className: "bg-white border-2 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow",
                style: { borderColor: dimInfo.color }
              },
                React.createElement('div', { className: "flex items-center justify-between mb-3" },
                  React.createElement('div', { className: "flex items-center space-x-3 flex-1" },
                    React.createElement('span', { className: "text-4xl" }, medals[index]),
                    React.createElement('div', { className: "flex-1" },
                      React.createElement('div', { className: "flex items-center space-x-2 mb-1" },
                        React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                        React.createElement('span', { className: "font-bold text-lg" }, dimName)
                      ),
                      React.createElement('div', { className: "text-sm text-gray-600" }, dimInfo.description)
                    )
                  ),
                  React.createElement('div', { className: "text-right ml-4" },
                    React.createElement('div', { className: "text-3xl font-bold", style: { color: dimInfo.color } }, score),
                    React.createElement('div', { className: "text-xs text-gray-500" }, '/ 5.0')
                  )
                ),
                React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-3 overflow-hidden" },
                  React.createElement('div', {
                    className: "h-3 rounded-full transition-all duration-1000",
                    style: {
                      width: `${(scoreNum / 5) * 100}%`,
                      backgroundColor: dimInfo.color
                    }
                  })
                )
              );
            }),
            React.createElement('div', { className: "bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 mt-6" },
              React.createElement('h4', { className: "font-bold text-gray-800 mb-2 flex items-center" },
                React.createElement('span', { className: "mr-2" }, '💡'),
                '性格解读'
              ),
              React.createElement('p', { className: "text-sm text-gray-700 leading-relaxed" },
                '你在',
                React.createElement('strong', {}, results.topDimensions[0][0]),
                '方面表现突出，这让你',
                animalInfo.description.substring(0, 30),
                '...结合你的',
                React.createElement('strong', {}, results.topDimensions[1][0]),
                '和',
                React.createElement('strong', {}, results.topDimensions[2][0]),
                '特质，你是一个',
                animalInfo.traits.slice(0, 2).join('、'),
                '的人。'
              )
            )
          )
        ),
        React.createElement('div', { className: "mb-8" },
          React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 flex items-center" },
            React.createElement('span', { className: "mr-2" }, '📈'),
            '完整能力评估'
          ),
          React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
            results.sortedDimensions.map(([dimName, score]) => {
              const dimInfo = dimensions[dimName];
              const scoreNum = parseFloat(score);
              let level = '待开发';
              let levelColor = 'text-gray-500';
              let levelBg = 'bg-gray-100';
              if (scoreNum >= 4.0) {
                level = '优势天赋';
                levelColor = 'text-green-600';
                levelBg = 'bg-green-100';
              } else if (scoreNum >= 3.5) {
                level = '突出表现';
                levelColor = 'text-blue-600';
                levelBg = 'bg-blue-100';
              } else if (scoreNum >= 3.0) {
                level = '发展中';
                levelColor = 'text-yellow-600';
                levelBg = 'bg-yellow-100';
              }
              return React.createElement('div', {
                key: dimName,
                className: "bg-gray-50 rounded-xl p-4 border-2 border-gray-100 hover:border-gray-200 transition-colors"
              },
                React.createElement('div', { className: "flex items-center justify-between mb-2" },
                  React.createElement('div', { className: "flex items-center space-x-2 flex-1" },
                    React.createElement('span', { className: "text-2xl" }, dimInfo.icon),
                    React.createElement('span', { className: "font-semibold text-gray-800" }, dimName)
                  ),
                  React.createElement('div', { className: "flex items-center space-x-2" },
                    React.createElement('span', { className: "font-bold text-xl", style: { color: dimInfo.color } }, score),
                    React.createElement('span', { className: `text-xs px-2 py-1 rounded-full ${levelBg} ${levelColor} font-medium` }, level)
                  )
                ),
                React.createElement('div', { className: "w-full bg-gray-200 rounded-full h-2" },
                  React.createElement('div', {
                    className: "h-2 rounded-full transition-all duration-1000",
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
        React.createElement('div', { className: "bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-6 mb-8" },
          React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4 flex items-center" },
            React.createElement('span', { className: "mr-2" }, '💡'),
            '给你的建议'
          ),
          React.createElement('div', { className: "space-y-3 text-gray-700" },
            React.createElement('p', { className: "leading-relaxed flex items-start" },
              React.createElement('span', { className: "text-orange-500 mr-2 font-bold" }, '1.'),
              React.createElement('span', {},
                React.createElement('strong', { className: "text-orange-600" }, '发挥优势：'),
                '你在',
                React.createElement('strong', {}, results.topDimensions[0][0]),
                '方面表现出色（',
                results.topDimensions[0][1],
                '分），这是你的核心竞争力。建议在相关领域深耕，将天赋转化为实力。'
              )
            ),
            React.createElement('p', { className: "leading-relaxed flex items-start" },
              React.createElement('span', { className: "text-orange-500 mr-2 font-bold" }, '2.'),
              React.createElement('span', {},
                React.createElement('strong', { className: "text-orange-600" }, '能力组合：'),
                '你的',
                results.topDimensions.map(([name]) => name).join('、'),
                '能力组合，特别适合',
                animalInfo.careers.slice(0, 2).join('、'),
                '等领域。这种独特的组合是你的优势所在。'
              )
            ),
            React.createElement('p', { className: "leading-relaxed flex items-start" },
              React.createElement('span', { className: "text-orange-500 mr-2 font-bold" }, '3.'),
              React.createElement('span', {},
                React.createElement('strong', { className: "text-orange-600" }, '接纳自己：'),
                '每个人都有自己独特的天赋组合，没有绝对的好坏。接纳真实的自己，在适合的领域发光发热，就是最好的选择。'
              )
            )
          )
        ),
        React.createElement('div', { className: "bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6 mb-8" },
          React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-2 flex items-center justify-center" },
            React.createElement('span', { className: "mr-2" }, '📚'),
            '心理成长资源推荐'
          ),
          React.createElement('p', { className: "text-center text-sm text-gray-600 mb-4" }, '探索内心,关照自己的每一面'),
          React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center" },
            React.createElement('a', {
              href: "https://xhslink.com/m/9D0epdzjqnw",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex-1 bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md text-center"
            },
              React.createElement('div', { className: "text-2xl mb-2" }, '📖'),
              React.createElement('div', { className: "font-semibold text-gray-800" }, '更多心理自测工具')
            ),
            React.createElement('a', {
              href: "https://pan.quark.cn/s/266f60aa5bbf",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex-1 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-4 transition-all shadow-sm hover:shadow-md text-center"
            },
              React.createElement('div', { className: "text-2xl mb-2" }, '💡'),
              React.createElement('div', { className: "font-semibold text-gray-800" }, '2026重启人生365天时间规划表')
            )
          )
        ),
        React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center items-center mb-6" },
          React.createElement('button', {
            onClick: copyResultText,
            className: "w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          },
            React.createElement('span', { className: "mr-2" }, '📋'),
            '复制结果分享'
          ),
          React.createElement('button', {
            onClick: () => {
              setCurrentPage('intro');
              setCurrentQuestion(0);
              setAnswers({});
            },
            className: "w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          },
            React.createElement('span', { className: "mr-2" }, '🔄'),
            '重新测评'
          )
        ),
        React.createElement('div', { className: "text-center" },
          React.createElement('div', { className: "inline-block bg-purple-50 border-2 border-purple-200 rounded-xl px-6 py-3" },
            React.createElement('p', { className: "text-sm text-purple-700 mb-1" },
              '💝 ',
              React.createElement('strong', {}, '测评结果已自动保存')
            ),
            React.createElement('p', { className: "text-xs text-purple-600" }, '基于8维性格理论 · 娱乐参考 · 探索真实自我')
          )
        ),
        React.createElement('div', { className: "mt-6 text-center" },
          React.createElement('p', { className: "text-xs text-gray-400" }, '🎉 分享给朋友，看看他们是什么动物！')
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
root.render(React.createElement(AnimalPersonalityTest));