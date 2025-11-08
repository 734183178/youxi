# SCL-90 心理测试系统

基于React的SCL-90症状自评量表,带有兑换码验证功能。

## 功能特点

- ✅ 完整的SCL-90测试流程(90道题)
- 🔐 兑换码验证系统(防止未授权访问)
- 📊 详细的测试结果分析(9个心理因子)
- 🎨 现代化的UI设计
- 📱 响应式布局(支持手机和电脑)
- 🔒 管理后台(生成/管理兑换码)

## 项目结构

```
scl-90zicelove/
├── public/
│   ├── index.html          # 主页面
│   ├── admin.html          # 管理后台
│   ├── css/
│   │   └── styles.css      # 样式文件
│   └── js/
│       ├── app.js          # React应用代码
│       └── redemption.js   # 可复用的兑换码验证模块
├── api/
│   ├── verify-code.js      # 验证兑换码API
│   ├── generate-code.js    # 生成兑换码API
│   ├── list-codes.js       # 列出所有兑换码API
│   └── delete-code.js      # 删除兑换码API
├── package.json            # 项目配置
├── vercel.json             # Vercel部署配置
├── .env.example            # 环境变量示例
└── README.md               # 本文件
```

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd scl-90zicelove
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`:

```bash
cp .env.example .env
```

编辑 `.env`,设置管理员密码:

```
ADMIN_PASSWORD=your_secure_password_here
```

### 4. 本地开发

```bash
npm run dev
```

访问 `http://localhost:3000` 查看测试页面。

## 部署到Vercel

### 步骤1: 准备Git仓库

```bash
# 初始化Git仓库(如果还没有)
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: SCL-90 test with redemption code system"

# 推送到远程仓库(GitHub/GitLab)
git remote add origin <your-repo-url>
git push -u origin main
```

### 步骤2: 在Vercel中导入项目

1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的Git仓库
4. 点击 "Deploy"

### 步骤3: 启用Vercel KV

1. 进入项目设置
2. 点击 "Storage" 标签
3. 点击 "Create Database"
4. 选择 "KV (Redis)"
5. 选择免费计划
6. 点击 "Create"
7. Vercel会自动添加所需的环境变量

### 步骤4: 设置环境变量

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加以下变量:
   - **Key**: `ADMIN_PASSWORD`
   - **Value**: 你的管理员密码(请设置强密码)
4. 点击 "Save"

### 步骤5: 重新部署

1. 点击 "Deployments" 标签
2. 点击最新部署旁边的 "..." 按钮
3. 选择 "Redeploy"

完成!你的SCL-90测试系统已成功部署。

## 使用说明

### 用户端

1. 访问你的Vercel部署URL
2. 点击"开始测试"
3. 输入有效的兑换码
4. 完成90道测试题
5. 查看详细的测试结果

### 管理端

访问 `https://your-domain.vercel.app/admin.html`

#### 登录

使用你在环境变量中设置的 `ADMIN_PASSWORD`

#### 生成兑换码

1. 登录管理后台
2. 在"生成新兑换码"区域
3. 设置生成数量(1-100)
4. 可选:设置过期天数(0表示永不过期)
5. 点击"生成兑换码"
6. 复制生成的兑换码分享给用户

#### 查看兑换码列表

- 查看所有兑换码
- 查看使用状态(已使用/未使用)
- 查看使用时间
- 删除无效的兑换码

### API使用(通过cURL或Postman)

#### 生成兑换码

```bash
# 生成1个兑换码
curl -X GET "https://your-domain.vercel.app/api/generate-code?password=YOUR_ADMIN_PASSWORD"

# 生成多个兑换码
curl -X POST "https://your-domain.vercel.app/api/generate-code" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "YOUR_ADMIN_PASSWORD",
    "count": 10,
    "expiryDays": 30
  }'
```

#### 列出所有兑换码

```bash
curl -X GET "https://your-domain.vercel.app/api/list-codes?password=YOUR_ADMIN_PASSWORD"
```

## 在其他页面复用兑换码功能

兑换码验证模块(`redemption.js`)是完全可复用的。

### 在新页面中使用

1. 复制 `public/js/redemption.js` 到你的项目
2. 在HTML中引入:

```html
<script src="/js/redemption.js"></script>
```

3. 在需要验证的地方调用:

```javascript
// 在用户点击"开始"按钮时
function handleStart() {
  RedemptionCode.verify(
    // 成功回调
    (code) => {
      console.log('验证成功,兑换码:', code);
      // 继续你的流程
      startYourTest();
    },
    // 取消回调
    () => {
      console.log('用户取消了验证');
    }
  );
}
```

### API方法

- `RedemptionCode.verify(onSuccess, onCancel)` - 显示验证弹窗
- `RedemptionCode.isVerified()` - 检查是否已验证
- `RedemptionCode.clearVerification()` - 清除验证状态

## 技术栈

- **前端**: React 18 (通过CDN)
- **后端**: Vercel Serverless Functions
- **数据库**: Vercel KV (Redis)
- **部署**: Vercel
- **样式**: 纯CSS

## 安全建议

1. **管理员密码**: 使用强密码,定期更换
2. **HTTPS**: Vercel自动提供HTTPS,确保所有请求都通过HTTPS
3. **兑换码**: 定期删除过期或已使用的兑换码
4. **访问控制**: 不要公开分享管理后台链接

## 免费额度

Vercel提供的免费额度足够个人和小规模使用:

- **Vercel KV**: 每月256 MB存储,每天10K次请求
- **Serverless Functions**: 每月100GB流量,100小时执行时间
- **部署**: 无限次部署

## 常见问题

### Q: 如何修改兑换码格式?

A: 编辑 `api/generate-code.js` 中的 `generateCode()` 函数。

### Q: 如何导出测试结果?

A: 目前系统不保存测试结果。如需此功能,需要添加数据库存储逻辑。

### Q: 可以设置兑换码使用次数限制吗?

A: 当前每个兑换码只能使用一次。如需多次使用,需要修改API逻辑。

### Q: 如何备份兑换码数据?

A: 使用管理后台的"列出所有兑换码"功能,或直接调用 `/api/list-codes` API。

## 许可证

MIT License

## 支持

如有问题或建议,欢迎提Issue或Pull Request。

---

**祝你使用愉快!** 🎉
