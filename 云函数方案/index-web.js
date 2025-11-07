/**
 * 恋爱测试授权码验证云函数
 * 腾讯云 Web 函数版本 (适配函数URL)
 *
 * 功能: 验证用户输入的授权码是否有效
 * 复杂度: 极简 (仅25行核心代码)
 */

// 可用授权码列表
const VALID_CODES = [
  'LOVE2025',
  'TEST1234',
  'DEMO5678',
  'SWEET001',
  'HEART999'
];

// 管理员密钥
const ADMIN_KEY = 'admin123'; // 建议修改为更安全的密钥

/**
 * Web函数入口 - 自动处理HTTP请求
 * @param {Object} req - HTTP请求对象
 * @param {Object} res - HTTP响应对象
 */
exports.main_handler = async (req, res) => {
  // 自动处理CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  try {
    // 解析请求体
    const body = req.body || {};
    const { code, action, adminKey, count } = body;

    // 功能1: 验证授权码
    if (!action || action === 'verify') {
      if (!code) {
        res.status(400).json({
          success: false,
          message: '请输入授权码'
        });
        return;
      }

      const codeUpper = code.toUpperCase();

      if (VALID_CODES.includes(codeUpper)) {
        res.status(200).json({
          success: true,
          message: '授权码验证成功',
          data: {
            code: codeUpper,
            validUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        });
        return;
      }

      res.status(403).json({
        success: false,
        message: '授权码无效,请检查后重试'
      });
      return;
    }

    // 功能2: 生成新授权码 (管理员功能)
    if (action === 'generate') {
      if (adminKey !== ADMIN_KEY) {
        res.status(403).json({
          success: false,
          message: '无权限'
        });
        return;
      }

      const newCodes = [];
      const codeCount = count || 1;

      for (let i = 0; i < codeCount; i++) {
        const newCode = generateRandomCode();
        newCodes.push(newCode);
      }

      res.status(200).json({
        success: true,
        message: `成功生成 ${codeCount} 个授权码`,
        data: newCodes,
        note: '注意: 云函数中生成的授权码需要添加到代码后重新部署'
      });
      return;
    }

    // 功能3: 查询授权码列表 (管理员功能)
    if (action === 'list') {
      if (adminKey !== ADMIN_KEY) {
        res.status(403).json({
          success: false,
          message: '无权限'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          total: VALID_CODES.length,
          codes: VALID_CODES
        }
      });
      return;
    }

    // 未知操作
    res.status(400).json({
      success: false,
      message: '未知操作'
    });

  } catch (error) {
    console.error('云函数执行错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error.message
    });
  }
};

/**
 * 生成8位随机授权码
 * @returns {string} 随机授权码
 */
function generateRandomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
