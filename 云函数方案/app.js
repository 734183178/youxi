// 恋爱测试授权码验证 - 腾讯云Web函数版本
// 简化版本,兼容Web函数框架

// 可用授权码
const VALID_CODES = [
  'LOVE2025',
  'TEST1234',
  'DEMO5678',
  'SWEET001',
  'HEART999'
];

const ADMIN_KEY = 'admin123';

// Web函数入口
exports.main_handler = async (event, context) => {
  // 解析请求
  let body = {};

  try {
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        success: false,
        message: '请求格式错误'
      })
    };
  }

  // 处理OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    };
  }

  const { code, action, adminKey, count } = body;

  // 验证授权码
  if (!action || action === 'verify') {
    if (!code) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '授权码无效,请检查后重试'
      })
    };
  }

  // 生成授权码
  if (action === 'generate') {
    if (adminKey !== ADMIN_KEY) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: '无权限'
        })
      };
    }

    const newCodes = [];
    const codeCount = count || 1;

    for (let i = 0; i < codeCount; i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let newCode = '';
      for (let j = 0; j < 8; j++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newCodes.push(newCode);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `成功生成 ${codeCount} 个授权码`,
        data: newCodes
      })
    };
  }

  // 查询授权码
  if (action === 'list') {
    if (adminKey !== ADMIN_KEY) {
      return {
        statusCode: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: '无权限'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          total: VALID_CODES.length,
          codes: VALID_CODES
        }
      })
    };
  }

  // 默认响应
  return {
    statusCode: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: false,
      message: '未知操作'
    })
  };
};
