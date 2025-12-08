import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
        
        const codes = await sql`
            SELECT id, code, is_used, created_at, used_at
            FROM codes
            ORDER BY id DESC
            LIMIT 1000
        `;
        
        return res.status(200).json({
            success: true,
            codes: codes,
            count: codes.length
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            message: '获取列表失败: ' + error.message
        });
    }
}
