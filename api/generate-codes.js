import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// 生成随机兑换码
function generateRandomCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({
                success: false,
                message: 'API密钥无效'
            });
        }
        
        const { count } = req.body;
        const targetCount = Math.min(Math.max(parseInt(count) || 10, 1), 1000);
        
        const generatedCodes = [];
        let attempts = 0;
        const maxAttempts = targetCount * 3;
        
        while (generatedCodes.length < targetCount && attempts < maxAttempts) {
            const code = generateRandomCode();
            attempts++;
            
            try {
                await sql`
                    INSERT INTO codes (code) 
                    VALUES (${code})
                `;
                generatedCodes.push(code);
            } catch (error) {
                // 重复则跳过
                if (!error.message.includes('unique')) {
                    throw error;
                }
            }
        }
        
        return res.status(200).json({
            success: true,
            message: `成功生成 ${generatedCodes.length} 个兑换码`,
            codes: generatedCodes,
            count: generatedCodes.length
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: '生成失败: ' + error.message
        });
    }
}
