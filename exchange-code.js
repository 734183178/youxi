// 兑换码验证模块
// 这是独立的兑换码验证逻辑，与主测试逻辑分离

class ExchangeCodeVerifier {
    constructor() {
        this.githubConfig = {
            token: localStorage.getItem('github_token') || '',
            owner: localStorage.getItem('github_owner') || '',
            repo: localStorage.getItem('github_repo') || 'scl90-exchange-codes'
        };
        this.verifier = null;
        this.initVerifier();
    }

    // 初始化GitHub验证器
    initVerifier() {
        if (this.githubConfig.token && this.githubConfig.owner) {
            try {
                this.verifier = new GitHubExchangeCodeVerifier(this.githubConfig);
                console.log('GitHub验证器初始化成功');
            } catch (error) {
                console.error('GitHub验证器初始化失败:', error);
            }
        }
    }

    // 显示兑换码输入弹窗
    showCodeModal(callback) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4">输入兑换码</h3>
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
                        />
                    </div>
                    <div id="code-error" class="text-red-600 text-sm hidden"></div>
                    <div class="flex space-x-3">
                        <button
                            id="cancel-btn"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            id="verify-btn"
                            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            验证
                        </button>
                    </div>
                    <div class="text-center">
                        <button
                            id="config-btn"
                            class="text-blue-500 hover:text-blue-600 text-sm"
                        >
                            配置GitHub API
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

        document.getElementById('config-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            this.showConfigModal();
        });

        // 回车键验证
        document.getElementById('exchange-code-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyCode(document.getElementById('exchange-code-input').value.trim(), callback, modal);
            }
        });
    }

    // 验证兑换码
    async verifyCode(code, callback, modal) {
        if (!this.verifier) {
            document.getElementById('code-error').textContent = '请先配置GitHub API';
            document.getElementById('code-error').classList.remove('hidden');
            return;
        }

        const verifyBtn = document.getElementById('verify-btn');
        const errorDiv = document.getElementById('code-error');

        verifyBtn.disabled = true;
        verifyBtn.textContent = '验证中...';
        errorDiv.classList.add('hidden');

        try {
            const result = await this.verifier.verifyCode(code);

            if (result.success) {
                document.body.removeChild(modal);
                callback(true);
            } else {
                errorDiv.textContent = result.message;
                errorDiv.classList.remove('hidden');
            }
        } catch (error) {
            errorDiv.textContent = '验证失败，请重试';
            errorDiv.classList.remove('hidden');
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = '验证';
        }
    }

    // 显示GitHub配置弹窗
    showConfigModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-lg font-semibold mb-4">GitHub API 配置</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            GitHub Token
                        </label>
                        <input
                            type="password"
                            id="token-input"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入GitHub Token"
                            value="${this.githubConfig.token}"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            GitHub 用户名
                        </label>
                        <input
                            type="text"
                            id="owner-input"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入GitHub用户名"
                            value="${this.githubConfig.owner}"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            仓库名称
                        </label>
                        <input
                            type="text"
                            id="repo-input"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="scl90-exchange-codes"
                            value="${this.githubConfig.repo}"
                        />
                    </div>
                    <div class="flex space-x-3">
                        <button
                            id="cancel-config-btn"
                            class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            id="save-config-btn"
                            class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            保存配置
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        document.getElementById('save-config-btn').addEventListener('click', () => {
            this.saveConfig(modal);
        });

        document.getElementById('cancel-config-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // 保存GitHub配置
    saveConfig(modal) {
        this.githubConfig = {
            token: document.getElementById('token-input').value.trim(),
            owner: document.getElementById('owner-input').value.trim(),
            repo: document.getElementById('repo-input').value.trim()
        };

        if (!this.githubConfig.token || !this.githubConfig.owner) {
            alert('请填写完整的GitHub API配置信息');
            return;
        }

        // 保存到本地存储
        localStorage.setItem('github_token', this.githubConfig.token);
        localStorage.setItem('github_owner', this.githubConfig.owner);
        localStorage.setItem('github_repo', this.githubConfig.repo);

        // 重新初始化验证器
        this.initVerifier();

        document.body.removeChild(modal);
        alert('配置保存成功！');
    }
}

// GitHub API 兑换码验证核心类
class GitHubExchangeCodeVerifier {
    constructor(options = {}) {
        this.token = options.token || '';
        this.owner = options.owner || '';
        this.repo = options.repo || 'scl90-exchange-codes';
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30秒缓存
    }

    // 验证兑换码
    async verifyCode(code) {
        try {
            const normalizedCode = code.trim().toUpperCase();

            // 1. 读取当前兑换码数据
            const codesData = await this.getCodesData();
            if (!codesData) {
                return { success: false, message: '无法获取兑换码数据，请检查网络连接' };
            }

            // 2. 查找兑换码
            const codeIndex = codesData.codes.findIndex(c => c.code === normalizedCode);

            if (codeIndex === -1) {
                return { success: false, message: '兑换码不存在，请检查输入是否正确' };
            }

            const codeInfo = codesData.codes[codeIndex];

            // 3. 检查状态
            if (codeInfo.status !== 'available') {
                return {
                    success: false,
                    message: `兑换码已${codeInfo.status === 'used' ? '使用' : '失效'}`,
                    data: {
                        usedAt: codeInfo.usedAt,
                        usedBy: codeInfo.usedBy
                    }
                };
            }

            // 4. 更新为已使用
            codesData.codes[codeIndex].status = 'used';
            codesData.codes[codeIndex].usedAt = new Date().toISOString();
            codesData.codes[codeIndex].usedBy = this.getUserInfo();

            // 5. 更新统计
            this.updateStats(codesData);

            // 6. 保存回GitHub
            const updateResult = await this.saveCodesData(codesData);
            if (!updateResult.success) {
                return {
                    success: false,
                    message: '验证成功但更新失败，请重试或联系管理员'
                };
            }

            // 7. 清除缓存
            this.clearCache();

            return {
                success: true,
                message: '验证成功！即将开始测试...',
                data: {
                    code: normalizedCode,
                    batch: codeInfo.batch,
                    verifiedAt: codesData.codes[codeIndex].usedAt
                }
            };

        } catch (error) {
            console.error('验证失败:', error);
            return {
                success: false,
                message: '验证失败: ' + error.message
            };
        }
    }

    // 获取兑换码数据
    async getCodesData() {
        const cacheKey = 'codes_data';
        const cached = this.cache.get(cacheKey);

        // 检查缓存
        if (cached && (Date.now() - cached.timestamp < this.cacheTimeout)) {
            return cached.data;
        }

        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/codes.json`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            const content = JSON.parse(atob(data.content));

            // 缓存数据
            this.cache.set(cacheKey, {
                data: content,
                timestamp: Date.now()
            });

            return content;

        } catch (error) {
            console.error('获取数据失败:', error);
            return null;
        }
    }

    // 保存兑换码数据
    async saveCodesData(codesData) {
        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/codes.json`;

            // 先获取当前文件信息
            const currentData = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            const current = await currentData.json();

            const content = btoa(unescape(encodeURIComponent(JSON.stringify(codesData, null, 2))));

            const updateData = {
                message: `Update exchange codes - ${new Date().toISOString()}`,
                content: content,
                sha: current.sha
            };

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '更新失败');
            }

            return { success: true };

        } catch (error) {
            console.error('保存数据失败:', error);
            return { success: false, message: error.message };
        }
    }

    // 更新统计信息
    updateStats(codesData) {
        const total = codesData.codes.length;
        const used = codesData.codes.filter(c => c.status === 'used').length;
        const available = total - used;

        codesData.stats = {
            total,
            available,
            used,
            lastUpdated: new Date().toISOString()
        };
    }

    // 获取用户信息
    getUserInfo() {
        try {
            return {
                userAgent: navigator.userAgent.substring(0, 100),
                ip: 'unknown', // 前端无法直接获取真实IP
                timestamp: new Date().toISOString()
            };
        } catch {
            return { timestamp: new Date().toISOString() };
        }
    }

    // 清除缓存
    clearCache() {
        this.cache.clear();
    }

    // 检查连接
    async checkConnection() {
        try {
            const result = await this.getCodesData();
            return result !== null;
        } catch {
            return false;
        }
    }
}

// 全局兑换码验证器实例
window.exchangeCodeVerifier = new ExchangeCodeVerifier();