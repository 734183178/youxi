/**
 * API: 生成兑换码
 * POST /api/generate-code
 * 或 GET /api/generate-code?password=YOUR_ADMIN_PASSWORD
 *
 * 请求头(可选):
 * {
 *   "x-admin-password": "管理员密码"
 * }
 *
 * 请求体(POST):
 * {
 *   "password": "管理员密码",
 *   "count": 1,  // 可选,生成数量,默认1
 *   "expiryDays": 30  // 可选,过期天数,默认不过期
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "codes": ["RPH5WD2B"],
 *   "count": 1
 * }
 */

import { kv } from '@vercel/kv';

// 生成随机兑换码(字母+数字,8位)
function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆的字符 I, O, 0, 1
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 验证管理员密码
function verifyAdminPassword(password) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        console.warn('警告: ADMIN_PASSWORD 环境变量未设置');
        return false;
    }

    return password === adminPassword;
}

export default async function handler(req, res) {
    try {
        // 获取密码(支持多种方式)
        let password;
        if (req.method === 'GET') {
            password = req.query.password;
        } else if (req.method === 'POST') {
            password = req.body?.password;
        } else {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        // 也支持从header中获取
        if (!password) {
            password = req.headers['x-admin-password'];
        }

        // 验证密码
        if (!password || !verifyAdminPassword(password)) {
            return res.status(401).json({
                success: false,
                message: '未授权:管理员密码错误或未提供'
            });
        }

        // 获取生成数量
        const count = parseInt(req.body?.count || req.query?.count || 1);
        if (count < 1 || count > 100) {
            return res.status(400).json({
                success: false,
                message: '生成数量必须在1-100之间'
            });
        }

        // 获取过期天数
        const expiryDays = parseInt(req.body?.expiryDays || req.query?.expiryDays || 0);

        // 计算过期日期
        let expiryDate = null;
        if (expiryDays > 0) {
            expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + expiryDays);
        }

        // 生成兑换码
        const generatedCodes = [];
        for (let i = 0; i < count; i++) {
            let code;
            let attempts = 0;
            const maxAttempts = 10;

            // 确保生成的兑换码不重复
            while (attempts < maxAttempts) {
                code = generateCode();
                const exists = await kv.exists(`redemption:${code}`);

                if (!exists) {
                    break;
                }

                attempts++;
            }

            if (attempts >= maxAttempts) {
                return res.status(500).json({
                    success: false,
                    message: '生成兑换码失败:无法生成唯一代码'
                });
            }

            // 保存兑换码信息
            const codeData = {
                code,
                createdAt: new Date().toISOString(),
                used: false,
                usedAt: null,
                usedIp: null,
                usedUserAgent: null,
                expiryDate: expiryDate ? expiryDate.toISOString() : null
            };

            await kv.set(`redemption:${code}`, codeData);

            // 添加到索引(方便后续列表查询)
            await kv.sadd('redemption:all', code);

            generatedCodes.push(code);
        }

        // 返回成功响应
        return res.status(200).json({
            success: true,
            codes: generatedCodes,
            count: generatedCodes.length,
            expiryDate: expiryDate ? expiryDate.toISOString() : null
        });

    } catch (error) {
        console.error('生成兑换码时出错:', error);
        return res.status(500).json({
            success: false,
            message: '服务器错误,请稍后重试'
        });
    }
}
