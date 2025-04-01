const fs = require('fs');
const path = require('path');

// 读取游戏模板
const templatePath = path.join(__dirname, 'templates', 'game-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// 读取游戏数据目录
const gamesDir = path.join(__dirname, 'games');
const outputDir = path.join(__dirname, 'dist');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 处理每个游戏数据文件
fs.readdirSync(gamesDir).forEach(file => {
  if (path.extname(file) !== '.json') return;
  
  const gameSlug = path.basename(file, '.json');
  const gameDataPath = path.join(gamesDir, file);
  const gameData = JSON.parse(fs.readFileSync(gameDataPath, 'utf8'));
  
  // 创建游戏目录
  const gameOutputDir = path.join(outputDir, 'games', gameSlug);
  if (!fs.existsSync(gameOutputDir)) {
    fs.mkdirSync(gameOutputDir, { recursive: true });
  }
  
  // 处理HTML模板
  let gameHTML = template;
  
  // 替换基本变量
  Object.keys(gameData).forEach(key => {
    if (typeof gameData[key] === 'string') {
      gameHTML = gameHTML.replace(new RegExp(`{{${key}}}`, 'g'), gameData[key]);
    }
  });
  
  // 处理游戏标签
  if (Array.isArray(gameData.GAME_TAGS)) {
    const tagsHTML = gameData.GAME_TAGS.map(tag => 
      `<span class="bg-primary bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">${tag.name}</span>`
    ).join('\n                    ');
    gameHTML = gameHTML.replace('{{GAME_TAGS}}', tagsHTML);
  }
  
  // 处理游戏特点
  if (Array.isArray(gameData.GAME_FEATURES)) {
    const featuresHTML = gameData.GAME_FEATURES.map(feature => `
                <!-- Feature -->
                <div class="feature-card bg-white rounded-xl p-6 shadow-md">
                    <div class="w-12 h-12 bg-${feature.color} rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${getIconPath(feature.icon)}" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
                    <p class="text-dark-lighter">${feature.description}</p>
                </div>
    `).join('\n');
    gameHTML = gameHTML.replace('{{GAME_FEATURES}}', featuresHTML);
  }
  
  // 处理游戏控制
  if (Array.isArray(gameData.GAME_CONTROLS)) {
    const controlsHTML = gameData.GAME_CONTROLS.map(control => `
                            <li class="flex items-start">
                                <span class="bg-secondary text-white rounded px-2 py-1 text-sm mr-3">${control.key}</span>
                                <span>${control.action}</span>
                            </li>
    `).join('\n');
    gameHTML = gameHTML.replace('{{GAME_CONTROLS}}', controlsHTML);
  }
  
  // 处理游戏技巧
  if (Array.isArray(gameData.GAME_TIPS)) {
    const tipsHTML = gameData.GAME_TIPS.map(tip => `
                            <li>${tip}</li>
    `).join('\n');
    gameHTML = gameHTML.replace('{{GAME_TIPS}}', tipsHTML);
  }
  
  // 处理相似游戏
  if (Array.isArray(gameData.SIMILAR_GAMES)) {
    const similarGamesHTML = gameData.SIMILAR_GAMES.map(game => `
                <!-- Game -->
                <div class="bg-light rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-2 duration-300">
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-1">${game.title}</h3>
                        <p class="text-dark-lighter text-sm mb-3 line-clamp-2">${game.description}</p>
                        <a href="${game.url}" class="inline-block bg-secondary hover:bg-secondary-dark text-white text-center py-2 px-4 rounded-lg transition-colors duration-300 w-full">Play Now</a>
                    </div>
                </div>
    `).join('\n');
    gameHTML = gameHTML.replace('{{SIMILAR_GAMES}}', similarGamesHTML);
  }
  
  // 写入生成的HTML文件
  const outputFilePath = path.join(gameOutputDir, 'index.html');
  fs.writeFileSync(outputFilePath, gameHTML);
  console.log(`Generated: ${outputFilePath}`);
});

// 获取SVG图标路径
function getIconPath(iconName) {
  const iconPaths = {
    'bolt': 'M13 10V3L4 14h7v7l9-11h-7z',
    'users': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    // 可以添加更多图标
  };
  
  return iconPaths[iconName] || '';
}
