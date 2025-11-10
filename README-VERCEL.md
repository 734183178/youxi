# SCL-90 Vercel KV 验证系统部署指南

## 🚀 部署步骤

### 1. 准备文件
确保以下文件已准备就绪：
```
scl/
├── scl-90zicelive-secure.html  # 主页面
├── style.css                   # 样式文件
├── script.js                   # 前端逻辑（已更新）
├── api/
│   ├── verify-code.js          # 验证API
│   └── add-codes.js            # 添加兑换码API
├── package.json                # 依赖配置
├── vercel.json                 # Vercel配置
└── test-codes.html             # 兑换码管理工具
```

### 2. 部署到Vercel

#### 2.1 创建Vercel账号
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录

#### 2.2 创建新项目
1. 点击 "Add New..." → "Project"
2. 导入GitHub仓库 `734183178/youxi`
3. Vercel会自动检测项目配置

#### 2.3 配置环境变量
在Vercel项目设置中添加以下环境变量：

```
KV_URL=@kv_url
KV_REST_API_URL=@kv_rest_api_url
KV_REST_API_TOKEN=@kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=@kv_rest_api_read_only_token
ADMIN_TOKEN=your-secure-admin-token-here
```

#### 2.4 创建Vercel KV数据库
1. 在Vercel项目中，点击 "Storage" → "Create Database"
2. 选择 "KV" 数据库
3. 选择 "Hobby" 免费套餐
4. 连接到您的项目

### 3. 添加测试兑换码

#### 方法1：使用管理工具
1. 访问 `https://your-domain.vercel.app/test-codes.html`
2. 生成或添加兑换码
3. 点击"添加兑换码"

#### 方法2：使用curl命令
```bash
curl -X POST https://your-domain.vercel.app/api/add-codes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-admin-token" \
  -d '{
    "codes": ["LVOE123", "TEST456", "SCL789"],
    "batch": "test"
  }'
```

## 🧪 测试流程

### 1. 验证部署
访问主页面：`https://your-domain.vercel.app/`
检查是否能正常加载

### 2. 测试兑换码
1. 点击"开始测试"
2. 输入测试兑换码（如：LVOE123）
3. 查看验证结果

### 3. 验证唯一性
尝试重复使用同一兑换码，应该显示"已使用"错误

## 📊 免费额度说明

- **存储：** 256MB
- **操作：** 30,000次/月
- **连接：** 1,000个
- **成本：** 完全免费

对于几万个兑换码来说完全够用！

## 🔧 故障排除

### 常见问题
1. **API调用失败** - 检查环境变量配置
2. **CORS错误** - 确认API设置了正确的CORS头
3. **KV连接失败** - 检查KV数据库是否正确连接

### 调试方法
1. 打开浏览器开发者工具 (F12)
2. 查看Console和Network标签页
3. 检查API响应和错误信息

## 🔄 后续管理

### 添加新兑换码
- 使用管理工具页面
- 或调用 `/api/add-codes` API

### 查看使用统计
- 可以扩展API添加统计功能
- 通过Vercel Analytics查看访问量

### 批量导入
- 准备CSV或Excel文件
- 转换为JSON格式
- 使用API批量导入

## 🎯 优势

- ✅ **高性能** - Vercel边缘计算
- ✅ **高可用** - 99.99%可用性保证
- ✅ **易扩展** - 支持数百万兑换码
- ✅ **成本低** - 完全免费
- ✅ **易管理** - Web界面管理
- ✅ **安全性** - API认证和数据保护

现在可以开始部署了！🚀