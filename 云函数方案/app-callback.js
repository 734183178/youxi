// 恋爱测试授权码验证 - 腾讯云Web函数
// 使用Express兼容格式

const VALID_CODES = ['LOVE2025', 'TEST1234', 'DEMO5678', 'SWEET001', 'HEART999'];
const ADMIN_KEY = 'admin123';

module.exports.main_handler = async (event, context, callback) => {
  // 设置CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // 处理OPTIONS预检
  if (event.httpMethod === 'OPTIONS') {
    callback(null, {
      statusCode: 200,
      headers: headers,
      body: ''
    });
    return;
  }

  // 解析请求体
  let body = {};
  try {
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }
  } catch (e) {
    callback(null, {
      statusCode: 400,
      headers: headers,
      body: JSON.stringify({ success: false, message: '请求格式错误' })
    });
    return;
  }

  const { code, action, adminKey, count } = body;

  // 验证授权码
  if (!action || action === 'verify') {
    if (!code) {
      callback(null, {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ success: false, message: '请输入授权码' })
      });
      return;
    }

    const codeUpper = code.toUpperCase();
    if (VALID_CODES.includes(codeUpper)) {
      callback(null, {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify({
          success: true,
          message: '授权码验证成功',
          data: {
            code: codeUpper,
            validUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString()
          }
        })
      });
      return;
    }

    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: false, message: '授权码无效,请检查后重试' })
    });
    return;
  }

  // 生成授权码
  if (action === 'generate' && adminKey === ADMIN_KEY) {
    const newCodes = [];
    for (let i = 0; i < (count || 1); i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let newCode = '';
      for (let j = 0; j < 8; j++) {
        newCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newCodes.push(newCode);
    }
    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true, message: `成功生成 ${count || 1} 个授权码`, data: newCodes })
    });
    return;
  }

  // 查询授权码
  if (action === 'list' && adminKey === ADMIN_KEY) {
    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ success: true, data: { total: VALID_CODES.length, codes: VALID_CODES } })
    });
    return;
  }

  // 默认响应
  callback(null, {
    statusCode: 400,
    headers: headers,
    body: JSON.stringify({ success: false, message: '无权限或未知操作' })
  });
};
