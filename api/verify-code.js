/**
 * API: 验证兑换码
 * POST /api/verify-code
 *
 * 请求体:
 * {
 *   "code": "RPH5WD2B"
 * }
 *
 * 响应:
 * {
 *   "success": true/false,
 *   "message": "验证信息",
 *   "code": "兑换码"
 * }
 */

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // 仅允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { code } = req.body;

        // 验证输入
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: '兑换码不能为空'
            });
        }

        // 将兑换码转换为大写进行查询
        const upperCode = code.toUpperCase().trim();

        // 从KV中查询兑换码信息
        const codeKey = `redemption:${upperCode}`;
        const codeData = await kv.get(codeKey);

        // 检查兑换码是否存在
        if (!codeData) {
            return res.status(400).json({
                success: false,
                message: '兑换码不存在或已失效'
            });
        }

        // 检查兑换码是否已使用
        if (codeData.used) {
            return res.status(400).json({
                success: false,
                message: '兑换码已被使用'
            });
        }

        // 检查兑换码是否过期
        if (codeData.expiryDate) {
            const expiryDate = new Date(codeData.expiryDate);
            if (new Date() > expiryDate) {
                return res.status(400).json({
                    success: false,
                    message: '兑换码已过期'
                });
            }
        }

        // 标记兑换码为已使用
        const updatedData = {
            ...codeData,
            used: true,
            usedAt: new Date().toISOString(),
            usedIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            usedUserAgent: req.headers['user-agent']
        };

        // 保存更新
        await kv.set(codeKey, updatedData);

        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '兑换码验证成功',
            code: upperCode
        });

    } catch (error) {
        console.error('验证兑换码时出错:', error);
        return res.status(500).json({
            success: false,
            message: '服务器错误,请稍后重试'
        });
    }
}
