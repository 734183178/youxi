import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 授权码数据库（生产环境应使用真实数据库）
// 格式: { code: string, used: boolean, usedAt: Date, createdAt: Date }
let authCodes = [
  { code: 'LOVE2025', used: false, createdAt: new Date() },
  { code: 'TEST1234', used: false, createdAt: new Date() },
  { code: 'DEMO5678', used: false, createdAt: new Date() },
  { code: 'SWEET001', used: false, createdAt: new Date() },
  { code: 'HEART999', used: false, createdAt: new Date() },
];

// API: 验证授权码
app.post('/api/verify-code', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: '请输入授权码'
    });
  }

  const authCode = authCodes.find(ac => ac.code === code.toUpperCase());

  if (!authCode) {
    return res.status(404).json({
      success: false,
      message: '授权码无效，请检查后重试'
    });
  }

  if (authCode.used) {
    return res.status(403).json({
      success: false,
      message: '此授权码已被使用，每个授权码只能使用一次'
    });
  }

  // 标记为已使用
  authCode.used = true;
  authCode.usedAt = new Date();

  return res.json({
    success: true,
    message: '授权码验证成功',
    data: {
      code: authCode.code,
      validUntil: new Date(Date.now() + 30 * 60 * 1000) // 30分钟有效期
    }
  });
});

// API: 生成新授权码（管理员功能）
app.post('/api/generate-code', (req, res) => {
  const { count = 1, adminKey } = req.body;

  // 简单的管理员验证（生产环境应使用更安全的方式）
  if (adminKey !== 'admin123') {
    return res.status(403).json({
      success: false,
      message: '无权限'
    });
  }

  const newCodes = [];
  for (let i = 0; i < count; i++) {
    const code = generateRandomCode();
    authCodes.push({
      code,
      used: false,
      createdAt: new Date()
    });
    newCodes.push(code);
  }

  return res.json({
    success: true,
    message: `成功生成 ${count} 个授权码`,
    data: newCodes
  });
});

// API: 获取授权码列表（管理员功能）
app.get('/api/codes', (req, res) => {
  const { adminKey } = req.query;

  if (adminKey !== 'admin123') {
    return res.status(403).json({
      success: false,
      message: '无权限'
    });
  }

  return res.json({
    success: true,
    data: {
      total: authCodes.length,
      used: authCodes.filter(ac => ac.used).length,
      unused: authCodes.filter(ac => !ac.used).length,
      codes: authCodes
    }
  });
});

// 生成随机授权码
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 授权码服务已启动！`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`\n可用授权码 (${authCodes.filter(ac => !ac.used).length}/${authCodes.length}):`);
  authCodes.filter(ac => !ac.used).forEach(ac => {
    console.log(`  - ${ac.code}`);
  });
  console.log(`\n管理面板: http://localhost:${PORT}/api/codes?adminKey=admin123\n`);
});
