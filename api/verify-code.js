const { createClient } = require('@vercel/kv');

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: '兑换码格式不正确'
      });
    }

    // 创建KV客户端
    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const normalizedCode = code.trim().toUpperCase();

    // 检查兑换码是否存在且可用
    const exists = await kv.exists(`code:${normalizedCode}`);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: '兑换码不存在或已使用'
      });
    }

    // 获取兑换码信息
    const codeInfo = await kv.hgetall(`code:${normalizedCode}`);

    // 标记为已使用
    await kv.hset(`code:${normalizedCode}`, {
      ...codeInfo,
      used: 'true',
      usedAt: new Date().toISOString(),
      usedIP: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    });

    // 设置过期时间（可选：365天后自动删除）
    await kv.expire(`code:${normalizedCode}`, 365 * 24 * 60 * 60);

    return res.status(200).json({
      success: true,
      message: '验证成功',
      codeInfo: {
        createdAt: codeInfo.createdAt,
        batch: codeInfo.batch || 'default'
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: '验证服务暂时不可用，请稍后重试'
    });
  }
}