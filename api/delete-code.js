/**
 * API: 删除兑换码
 * DELETE /api/delete-code
 *
 * 请求头:
 * {
 *   "x-admin-password": "管理员密码"
 * }
 *
 * 请求体:
 * {
 *   "password": "管理员密码",
 *   "code": "RPH5WD2B"
 * }
 *
 * 响应:
 * {
 *   "success": true,
 *   "message": "兑换码已删除",
 *   "code": "RPH5WD2B"
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
    // 仅允许DELETE请求
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 获取密码
        const password = req.body?.password || req.headers['x-admin-password'];

        // 验证密码
        if (!password || !verifyAdminPassword(password)) {
            return res.status(401).json({
                success: false,
                message: '未授权:管理员密码错误或未提供'
            });
        }

        // 获取要删除的兑换码
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: '兑换码不能为空'
            });
        }

        const upperCode = code.toUpperCase().trim();

        // 检查兑换码是否存在
        const codeKey = `redemption:${upperCode}`;
        const exists = await kv.exists(codeKey);

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: '兑换码不存在'
            });
        }

        // 删除兑换码
        await kv.del(codeKey);

        // 从索引中移除
        await kv.srem('redemption:all', upperCode);

        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '兑换码已删除',
            code: upperCode
        });

    } catch (error) {
        console.error('删除兑换码时出错:', error);
        return res.status(500).json({
            success: false,
            message: '服务器错误,请稍后重试'
        });
    }
}
