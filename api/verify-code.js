import { neon } from '@neondatabase/serverless';

// Neon数据库连接
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY');
    
    // 处理OPTIONS预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const { action, code } = req.method === 'POST' ? req.body : req.query;
        
        // 验证API密钥（可选）
        const apiKey = req.headers['x-api-key'];
        if (apiKey && apiKey !== process.env.API_KEY) {
            return res.status(401).json({
                success: false,
                message: 'API密钥无效'
            });
        }
        
        switch (action) {
            case 'verify': {
                // 验证兑换码
                const upperCode = code.toUpperCase();
                
                // 查询兑换码
                const result = await sql`
                    SELECT * FROM codes WHERE code = ${upperCode}
                `;
                
                if (result.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: '兑换码不存在'
                    });
                }
                
                const codeData = result[0];
                
                if (codeData.is_used) {
                    return res.status(200).json({
                        success: false,
                        message: '兑换码已被使用',
                        data: {
                            used_at: codeData.used_at
                        }
                    });
                }
                
                // 标记为已使用
                await sql`
                    UPDATE codes 
                    SET is_used = true, used_at = NOW() 
                    WHERE code = ${upperCode}
                `;
                
                return res.status(200).json({
                    success: true,
                    message: '兑换成功',
                    data: {
                        code: upperCode,
                        id: codeData.id
                    }
                });
            }
            
            case 'check': {
                // 查询兑换码状态
                const upperCode = code.toUpperCase();
                
                const result = await sql`
                    SELECT * FROM codes WHERE code = ${upperCode}
                `;
                
                if (result.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: '兑换码不存在'
                    });
                }
                
                const codeData = result[0];
                
                return res.status(200).json({
                    success: true,
                    message: '兑换码有效',
                    data: {
                        code: upperCode,
                        is_used: codeData.is_used ? 1 : 0,
                        created_at: codeData.created_at,
                        used_at: codeData.used_at
                    }
                });
            }
            
            case 'stats': {
                // 获取统计信息
                const stats = await sql`
                    SELECT 
                        COUNT(*) as total,
                        COUNT(*) FILTER (WHERE is_used = false) as unused,
                        COUNT(*) FILTER (WHERE is_used = true) as used
                    FROM codes
                `;
                
                return res.status(200).json({
                    success: true,
                    message: '统计信息获取成功',
                    data: {
                        total: parseInt(stats[0].total),
                        unused: parseInt(stats[0].unused),
                        used: parseInt(stats[0].used)
                    }
                });
            }
            
            default:
                return res.status(400).json({
                    success: false,
                    message: '无效的操作类型'
                });
        }
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: '服务器错误: ' + error.message
        });
    }
}
