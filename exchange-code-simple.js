// 兑换码验证模块（简化版 - 本地API）
// 这是独立的兑换码验证逻辑，与主测试逻辑分离

class ExchangeCodeVerifier {
    constructor() {
        // 本地API地址 - 根据实际情况调整
        this.apiBaseUrl = 'http://101.132.176.113:3000';
    }

    // 显示兑换码输入弹窗（用户界面）
    showCodeModal(callback) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4">兑换码验证</h3>
                <p class="text-gray-600 text-sm mb-4">请输入兑换码以开始SCL-90症状自评量表测试</p>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            兑换码
                        </label>
                        <input
                            type="text"
                            id="exchange-code-input"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入兑换码"
                            autocomplete="off"
                        />
                    </div>
                    <div id="code-error" class="text-red-600 text-sm hidden"></div>
                    <div class="flex space-x-3">
                        <button
                            id="cancel-btn"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            id="verify-btn"
                            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            确认使用
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        document.getElementById('verify-btn').addEventListener('click', () => {
            this.verifyCode(document.getElementById('exchange-code-input').value.trim(), callback, modal);
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // 回车键验证
        document.getElementById('exchange-code-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCode(document.getElementById('exchange-code-input').value.trim(), callback, modal);
            }
        });

        // 自动聚焦到输入框
        document.getElementById('exchange-code-input').focus();
    }

    // 验证兑换码
    async verifyCode(code, callback, modal) {
        if (!code) {
            document.getElementById('code-error').textContent = '请输入兑换码';
            document.getElementById('code-error').classList.remove('hidden');
            return;
        }

        const verifyBtn = document.getElementById('verify-btn');
        const errorDiv = document.getElementById('code-error');

        verifyBtn.disabled = true;
        verifyBtn.textContent = '验证中...';
        errorDiv.classList.add('hidden');

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/codes/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code })
            });

            const result = await response.json();


        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = '确认使用';
        }
    }

    // 检查服务器连接
    async checkConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/codes/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: 'connection-test'
                })
            });
            return true;
        } catch (error) {
            console.warn('服务器连接检查失败:', error);
            return false;
        }
    }
}

// 全局兑换码验证器实例
window.exchangeCodeVerifier = new ExchangeCodeVerifier();

// 页面加载时检查服务器连接
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔗 正在连接验证服务器:', window.exchangeCodeVerifier.apiBaseUrl);

    const isOnline = await window.exchangeCodeVerifier.checkConnection();
    if (!isOnline) {
        console.warn('⚠️ 无法连接到兑换码验证服务器');
        console.log('📡 服务器地址:', window.exchangeCodeVerifier.apiBaseUrl);
    } else {
        console.log('✅ 兑换码验证服务器连接正常');
    }
});
