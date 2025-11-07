# 腾讯云函数部署指南 (函数URL方式)

## 🎯 更新说明

API网关已停止服务,现在使用**函数URL**方式,这实际上**更简单**!

---

## 📋 快速部署步骤

### 第一步: 创建云函数

1. **访问腾讯云函数控制台**
   - URL: https://console.cloud.tencent.com/scf/list?rid=4&ns=default

2. **点击"新建"按钮**

3. **基本配置**
   ```
   创建方式: 从头开始
   函数类型: Web函数 (重要! 不是事件函数)
   函数名称: love-test-auth
   运行环境: Nodejs 18.15
   地域: 广州 (或保持默认)
   ```

4. **函数代码**
   - 提交方法: 在线编辑
   - 打开 `C:\Users\admin\Desktop\恋爱\云函数方案\index-web.js`
   - 复制完整内容到代码编辑器

5. **高级配置**
   ```
   内存: 128MB
   超时时间: 3秒
   ```

6. **点击"完成"**

---

### 第二步: 启用公网访问

创建完成后:

1. **进入函数详情页**

2. **找到"触发管理"或"函数管理"标签**

3. **启用公网访问**
   - 找到"公网访问"或"Web函数URL"选项
   - 点击"启用"
   - 鉴权方式: 选择 **"免鉴权"**

4. **获取函数URL**
   - 复制显示的URL地址
   - 格式类似: `https://xxxx-xxxx.scf.tencentcs.com`

---

### 第三步: 测试云函数

使用curl测试:

```bash
curl -X POST "https://你的函数URL" \
  -H "Content-Type: application/json" \
  -d '{"code":"LOVE2025"}'
```

应该返回:
```json
{
  "success": true,
  "message": "授权码验证成功",
  "data": {
    "code": "LOVE2025",
    "validUntil": "2025-11-07T11:00:00.000Z"
  }
}
```

---

### 第四步: 更新前端代码

修改 `src/components/AuthCodeModal.jsx` 第21行:

```javascript
// 改为你的云函数URL
const response = await fetch('https://你的函数URL', {
```

---

### 第五步: 提交代码

```bash
cd "C:\Users\admin\Desktop\恋爱"
git add .
git commit -m "feat: 切换到腾讯云函数(函数URL)"
git push origin master:main
```

---

## 🎯 Web函数 vs 事件函数

### 为什么使用Web函数?

| 对比项 | 事件函数 (旧) | Web函数 (新) |
|--------|-------------|-------------|
| **触发方式** | 需要API网关 | 直接HTTP访问 |
| **URL获取** | 复杂 | 一键生成 |
| **CORS配置** | 需手动配置 | 自动支持 |
| **部署难度** | 中等 | ✅ 简单 |

---

## 📝 Web函数代码说明

代码需要符合HTTP服务器格式:

```javascript
// 原来的事件函数格式
exports.main_handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({...})
  };
};

// 现在的Web函数格式 (兼容Express)
exports.main_handler = async (req, res) => {
  res.status(200).json({...});
};
```

---

## 🔧 常见问题

### Q1: 找不到"Web函数"选项?
A: 确保选择"从头开始",在"函数类型"中会看到"Web函数"选项。

### Q2: 函数URL无法访问?
A: 检查是否启用了"公网访问",鉴权方式必须是"免鉴权"。

### Q3: CORS报错?
A: Web函数自动处理CORS,无需额外配置。

---

## ✅ 部署检查清单

- [ ] 已创建Web函数(不是事件函数)
- [ ] 已粘贴Web函数代码
- [ ] 已启用公网访问(免鉴权)
- [ ] 已获取函数URL
- [ ] 已测试API正常工作
- [ ] 已更新前端代码
- [ ] 已提交推送到GitHub

---

**函数URL方式更简单,无需复杂的API网关配置!** 🚀
