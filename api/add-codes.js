const { createClient } = require('@vercel/kv');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 简单的认证检查（生产环境应该更安全）
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { codes, batch = 'default' } = req.body;

    if (!Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        success: false,
        message: '兑换码列表不能为空'
      });
    }

    const kv = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const results = [];
    const timestamp = new Date().toISOString();

    for (const code of codes) {
      if (typeof code !== 'string' || !code.trim()) {
        results.push({ code, status: 'error', message: '兑换码格式不正确' });
        continue;
      }

      const normalizedCode = code.trim().toUpperCase();

      try {
        // 检查是否已存在
        const exists = await kv.exists(`code:${normalizedCode}`);

        if (exists) {
          results.push({ code: normalizedCode, status: 'error', message: '兑换码已存在' });
        } else {
          // 添加新兑换码
          await kv.hset(`code:${normalizedCode}`, {
            code: normalizedCode,
            used: 'false',
            createdAt: timestamp,
            batch: batch
          });

          results.push({ code: normalizedCode, status: 'success', message: '添加成功' });
        }
      } catch (error) {
        results.push({ code: normalizedCode, status: 'error', message: '添加失败' });
      }
    }

    return res.status(200).json({
      success: true,
      message: `批量添加完成，成功：${results.filter(r => r.status === 'success').length}，失败：${results.filter(r => r.status === 'error').length}`,
      results
    });

  } catch (error) {
    console.error('Add codes error:', error);
    return res.status(500).json({
      success: false,
      message: '添加兑换码失败'
    });
  }
}