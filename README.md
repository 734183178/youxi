# 游戏页面模板

这是一个用于快速创建游戏单页面的模板系统。通过简单地添加新的游戏数据JSON文件，就可以自动生成完整的游戏页面。

## 目录结构

```
game-page-template/
├── templates/           # HTML模板
│   └── game-template.html
├── css/                 # CSS样式（如果提取出来）
├── js/                  # JavaScript脚本
├── games/               # 游戏数据JSON文件
│   ├── monster-survivors.json
│   └── [其他游戏].json
├── images/              # 游戏相关图片
├── build.js             # 构建脚本
└── dist/                # 生成的页面（自动创建）
    └── games/
        └── [游戏文件夹]/
            └── index.html
```

## 使用方法

### 添加新游戏

1. 在 `games/` 目录下创建一个新的JSON文件，文件名应为游戏的slug（例如 `zombie-defense.json`）
2. 使用现有的JSON格式填写游戏信息
3. 运行构建脚本生成HTML页面

### JSON数据格式

```json
{
  "GAME_TITLE": "游戏标题",
  "GAME_SLUG": "游戏slug",
  "GAME_TYPE": "游戏类型",
  "GAME_META_DESCRIPTION": "游戏的META描述",
  "GAME_OG_DESCRIPTION": "用于Open Graph的描述",
  "GAME_SHORT_DESCRIPTION": "简短的一句话介绍",
  "GAME_IFRAME_URL": "游戏iframe的URL",
  "GAME_TAGS": [
    {"name": "标签1"},
    {"name": "标签2"}
  ],
  "GAME_FEATURES": [
    {
      "icon": "图标名称",
      "color": "颜色类名",
      "title": "特点标题",
      "description": "特点描述"
    }
  ],
  "GAME_CONTROLS": [
    {"key": "按键", "action": "动作描述"}
  ],
  "GAME_TIPS": [
    "游戏提示1",
    "游戏提示2"
  ],
  "GAME_DESCRIPTION": "游戏的详细HTML描述",
  "SIMILAR_GAMES": [
    {
      "title": "相似游戏标题",
      "description": "游戏描述",
      "url": "游戏链接"
    }
  ]
}
```

### 构建页面

运行以下命令构建所有游戏页面：

```bash
node build.js
```

生成的HTML页面将位于 `dist/games/[game-slug]/index.html`。

## 自定义

### 添加新图标

在 `build.js` 文件中的 `getIconPath` 函数中添加新的SVG路径。

### 修改模板

编辑 `templates/game-template.html` 文件来修改页面结构。使用 `{{变量名}}` 语法来插入动态内容。

## 部署

将 `dist` 目录中的内容部署到您的web服务器。
