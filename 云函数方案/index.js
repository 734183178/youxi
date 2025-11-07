/**
 * 恋爱测试授权码验证云函数
 * 腾讯云函数 (SCF) 版本
 *
 * 功能: 验证用户输入的授权码是否有效
 * 复杂度: 极简 (仅30行核心代码)
 */

// 可用授权码列表 - 可在云函数控制台直接编辑
const VALID_CODES = [
  'LOVE2025',
  'TEST1234',
  'DEMO5678',
  'SWEET001',
  'HEART999'
];

// 管理员密钥 - 用于生成新授权码
const ADMIN_KEY = 'admin123'; // 建议修改为更安全的密钥

/**
 * 云函数入口函数
 * @param {Object} event - 触发事件,包含请求信息
 */
exports.main_handler = async (event) => {
  try {
    // 处理跨域请求
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // 处理OPTIONS预检请求
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    // 解析请求体
    const body = JSON.parse(event.body || '{}');
    const { code, action, adminKey, count } = body;

    // 功能1: 验证授权码
    if (!action || action === 'verify') {
      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: '请输入授权码'
          })
        };
      }

      const codeUpper = code.toUpperCase();

      if (VALID_CODES.includes(codeUpper)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: '授权码验证成功',
            data: {
              code: codeUpper,
              validUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString()
            }
          })
        };
      }

      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          success: false,
          message: '授权码无效,请检查后重试'
        })
      };
    }

    // 功能2: 生成新授权码 (管理员功能)
    if (action === 'generate') {
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            success: false,
            message: '无权限'
          })
        };
      }

      const newCodes = [];
      const codeCount = count || 1;

      for (let i = 0; i < codeCount; i++) {
        const newCode = generateRandomCode();
        newCodes.push(newCode);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `成功生成 ${codeCount} 个授权码`,
          data: newCodes,
          note: '注意: 云函数中生成的授权码在代码中添加后需要重新部署'
        })
      };
    }

    // 功能3: 查询授权码状态 (管理员功能)
    if (action === 'list') {
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            success: false,
            message: '无权限'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: {
            total: VALID_CODES.length,
            codes: VALID_CODES
          }
        })
      };
    }

    // 未知操作
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        message: '未知操作'
      })
    };

  } catch (error) {
    console.error('云函数执行错误:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器错误',
        error: error.message
      })
    };
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
