/**
 * API: 列出所有兑换码
 * GET /api/list-codes?password=YOUR_ADMIN_PASSWORD
 *
 * 请求头(可选):
 * {
 *   "x-admin-password": "管理员密码"
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "codes": [
 *     {
 *       "code": "RPH5WD2B",
 *       "createdAt": "2025-01-08T10:00:00Z",
 *       "used": false,
 *       "usedAt": null,
 *       "expiryDate": null
 *     },
 *     ...
 *   ],
 *   "total": 10,
 *   "used": 3,
 *   "unused": 7
 * }
 */

import { kv } from '@vercel/kv';

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
    // 仅允许GET请求
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 获取密码
        const password = req.query.password || req.headers['x-admin-password'];

        // 验证密码
        if (!password || !verifyAdminPassword(password)) {
            return res.status(401).json({
                success: false,
                message: '未授权:管理员密码错误或未提供'
            });
        }

        // 获取所有兑换码的键
        const allCodes = await kv.smembers('redemption:all');

        if (!allCodes || allCodes.length === 0) {
            return res.status(200).json({
                success: true,
                codes: [],
                total: 0,
                used: 0,
                unused: 0
            });
        }

        // 获取所有兑换码的详细信息
        const codeDetails = await Promise.all(
            allCodes.map(async (code) => {
                const data = await kv.get(`redemption:${code}`);
                return data;
            })
        );

        // 过滤掉null值(已删除的兑换码)
        const validCodes = codeDetails.filter(data => data !== null);

        // 统计已使用和未使用的数量
        const usedCount = validCodes.filter(data => data.used).length;
        const unusedCount = validCodes.filter(data => !data.used).length;

        // 排序:未使用的在前,按创建时间倒序
        validCodes.sort((a, b) => {
            if (a.used === b.used) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.used ? 1 : -1;
        });

        // 返回响应
        return res.status(200).json({
            success: true,
            codes: validCodes,
            total: validCodes.length,
            used: usedCount,
            unused: unusedCount
        });

    } catch (error) {
        console.error('列出兑换码时出错:', error);
        return res.status(500).json({
            success: false,
            message: '服务器错误,请稍后重试'
        });
    }
}
