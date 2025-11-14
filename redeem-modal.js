// GitHub API兑换码验证弹窗组件
class GithubRedeemModal {
    constructor() {
        this.isVerifying = false;
        this.onSuccess = null;
        this.onCancel = null;
        this.githubToken = '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'; // 您的GitHub Token
        this.githubRepo = '734183178/scl90-exchange-codes'; // 您的仓库
        this.filePath = 'redeem-codes.json'; // 仓库中的兑换码文件
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modalHTML = `
            <div id="redeemModalContainer" class="modal-overlay" style="display: none;">
                <div class="modal-content">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">兑换码验证</h3>
                        <p class="text-gray-600 text-sm">请输入兑换码以开始测试</p>
                        <div class="text-xs text-gray-500 mt-2">
                            <span id="availableCodesCount">检查可用兑换码...</span>
                        </div>
                    </div>

                    <!-- 状态显示 -->
                    <div id="statusMessage" class="hidden mb-4 p-3 rounded-lg text-sm">
                        <div class="flex items-center">
                            <span id="statusIcon" class="mr-2"></span>
                            <span id="statusText"></span>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <input
                            type="text"
                            id="redeemCodeInput"
                            placeholder="请输入兑换码"
                            class="code-input"
                            autocomplete="off"
                        />

                        <div id="errorMessage" class="error-message hidden">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                            <span id="errorText"></span>
                        </div>

                        <div id="successMessage" class="success-message hidden">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <span>验证成功！正在跳转...</span>
                        </div>

                        <button
                            id="verifyBtn"
                            class="verify-btn"
                        >
                            <span id="btnText">验证兑换码</span>
                        </button>

                        <button
                            id="cancelBtn"
                            class="w-full py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
            }

            .modal-content {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            .code-input {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: all 0.2s;
                text-align: center;
                letter-spacing: 0.1em;
                box-sizing: border-box;
            }

            .code-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .code-input.error {
                border-color: #ef4444;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
            }

            .verify-btn {
                width: 100%;
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                color: white;
                border: none;
                border-radius: 0.5rem;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                box-sizing: border-box;
            }

            .verify-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                transform: translateY(-1px);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .verify-btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .success-message {
                color: #10b981;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .loading-spinner {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                border: 2px solid #e5e7eb;
                border-top: 2px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .hidden {
                display: none !important;
            }
        `;

        document.head.appendChild(style);
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        const input = document.getElementById('redeemCodeInput');
        const verifyBtn = document.getElementById('verifyBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const overlay = document.getElementById('redeemModalContainer');

        verifyBtn.addEventListener('click', () => this.verifyRedeemCode());
        cancelBtn.addEventListener('click', () => this.close());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isVerifying) {
                this.verifyRedeemCode();
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });

        input.addEventListener('input', () => {
            this.hideMessages();
            input.classList.remove('error');
        });
    }

    show() {
        const modal = document.getElementById('redeemModalContainer');
        const input = document.getElementById('redeemCodeInput');

        modal.style.display = 'flex';
        input.value = '';
        this.hideMessages();
        input.focus();
        document.body.style.overflow = 'hidden';
        this.updateAvailableCodesCount();
    }

    close() {
        const modal = document.getElementById('redeemModalContainer');
        modal.style.display = 'none';
        document.body.style.overflow = '';

        if (this.onCancel) {
            this.onCancel();
        }
    }

    // 从GitHub获取兑换码
    async fetchRedeemCodes() {
        try {
            const url = `https://api.github.com/repos/${this.githubRepo}/contents/${this.filePath}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            const data = await response.json();
            const content = atob(data.content);
            return JSON.parse(content);
        } catch (error) {
            console.error('获取兑换码失败:', error);
            throw error;
        }
    }

    // 更新可用兑换码数量显示
    async updateAvailableCodesCount() {
        const countElement = document.getElementById('availableCodesCount');
        if (!countElement) return;

        try {
            const redeemCodes = await this.fetchRedeemCodes();
            let availableCodes = [];

            if (Array.isArray(redeemCodes)) {
                // 新格式：数组
                availableCodes = redeemCodes;
            } else {
                // 旧格式：对象
                availableCodes = Object.values(redeemCodes);
            }

            countElement.textContent = `当前可用兑换码: ${availableCodes.length} 个`;
            countElement.style.color = '#10b981';
        } catch (error) {
            countElement.textContent = '无法获取兑换码信息';
            countElement.style.color = '#ef4444';
        }
    }

    // 验证兑换码
    async verifyRedeemCode() {
        const input = document.getElementById('redeemCodeInput');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            this.showError('请输入兑换码');
            return;
        }

        this.setVerifying(true);
        this.hideMessages();

        try {
            this.showStatus('正在连接GitHub...', 'loading');

            // 获取兑换码列表
            const redeemCodes = await this.fetchRedeemCodes();
            this.showStatus('正在验证兑换码...', 'loading');

            // 获取所有有效的兑换码（支持数组格式）
            let availableCodes = [];

            if (Array.isArray(redeemCodes)) {
                // 新格式：直接是数组
                availableCodes = redeemCodes;
            } else {
                // 兼容旧格式：对象形式
                availableCodes = Object.values(redeemCodes);
            }

            const codeExists = availableCodes.includes(code);

            if (codeExists) {
                // 验证成功
                this.showSuccess();

                // 获取兑换码的详细信息
                const codeInfo = this.getCodeInfo(code, redeemCodes);

                // 保存本次验证的临时信息（仅用于显示，不做持久化）
                const tempVerification = {
                    code: code,
                    verifyTime: new Date().toISOString(),
                    codeInfo: codeInfo
                };

                console.log('验证成功:', tempVerification);

                setTimeout(() => {
                    this.close();
                    if (this.onSuccess) {
                        this.onSuccess({
                            code: code,
                            valid: true,
                            info: codeInfo,
                            verifyTime: tempVerification.verifyTime
                        });
                    }
                }, 1500);
            } else {
                this.showError('兑换码无效，请检查后重试');
            }
        } catch (error) {
            console.error('验证错误:', error);
            let errorMessage = '网络错误，请稍后重试';

            if (error.message.includes('404')) {
                errorMessage = '兑换码文件不存在，请联系管理员';
            } else if (error.message.includes('403')) {
                errorMessage = 'API权限错误，请联系管理员';
            } else if (error.message.includes('GitHub')) {
                errorMessage = 'GitHub连接失败，请检查网络';
            }

            this.showError(errorMessage);
        } finally {
            this.setVerifying(false);
            setTimeout(() => this.hideStatus(), 1000);
        }
    }

    // 获取兑换码的详细信息
    getCodeInfo(code, redeemCodes) {
        if (Array.isArray(redeemCodes)) {
            // 新格式：数组形式
            return {
                code: code,
                addedDate: '未知',
                format: 'array'
            };
        } else {
            // 兼容旧格式：对象形式
            for (const [date, storedCode] of Object.entries(redeemCodes)) {
                if (storedCode.toUpperCase() === code.toUpperCase()) {
                    return {
                        code: storedCode,
                        originalDate: date,
                        addedDate: date,
                        isHistorical: date !== new Date().toISOString().split('T')[0],
                        format: 'object'
                    };
                }
            }
            return {
                code: code,
                originalDate: '未知',
                addedDate: '未知',
                format: 'object'
            };
        }
    }

    // 检查兑换码是否仍然有效（用于管理员检查）
    async isCodeStillValid(code) {
        try {
            const redeemCodes = await this.fetchRedeemCodes();
            let availableCodes = [];

            if (Array.isArray(redeemCodes)) {
                availableCodes = redeemCodes;
            } else {
                availableCodes = Object.values(redeemCodes);
            }

            return availableCodes.includes(code.toUpperCase());
        } catch (error) {
            console.error('检查兑换码有效性失败:', error);
            return false;
        }
    }

    // 获取所有可用兑换码（用于管理员）
    async getAvailableCodes() {
        try {
            const redeemCodes = await this.fetchRedeemCodes();

            if (Array.isArray(redeemCodes)) {
                // 新格式：数组形式
                return redeemCodes.map((code, index) => ({
                    code: code,
                    index: index,
                    format: 'array'
                }));
            } else {
                // 兼容旧格式：对象形式
                return Object.entries(redeemCodes).map(([date, code]) => ({
                    date: date,
                    code: code,
                    isHistorical: date !== new Date().toISOString().split('T')[0],
                    format: 'object'
                }));
            }
        } catch (error) {
            console.error('获取可用兑换码失败:', error);
            return [];
        }
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('statusMessage');
        const statusText = document.getElementById('statusText');
        const statusIcon = document.getElementById('statusIcon');

        statusDiv.classList.remove('hidden');
        statusDiv.classList.remove('bg-blue-50', 'bg-yellow-50');

        if (type === 'loading') {
            statusDiv.classList.add('bg-blue-50');
            statusDiv.classList.add('text-blue-700');
            statusIcon.innerHTML = '<div class="loading-spinner mr-2"></div>';
        } else {
            statusDiv.classList.add('bg-yellow-50');
            statusDiv.classList.add('text-yellow-700');
            statusIcon.innerHTML = '⚠️';
        }

        statusText.textContent = message;
    }

    hideStatus() {
        document.getElementById('statusMessage').classList.add('hidden');
    }

    setVerifying(verifying) {
        this.isVerifying = verifying;
        const btn = document.getElementById('verifyBtn');
        const btnText = document.getElementById('btnText');
        const input = document.getElementById('redeemCodeInput');

        if (verifying) {
            btn.disabled = true;
            input.disabled = true;
            btnText.innerHTML = '<span class="loading-spinner mr-2"></span>验证中...';
        } else {
            btn.disabled = false;
            input.disabled = false;
            btnText.textContent = '验证兑换码';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const input = document.getElementById('redeemCodeInput');

        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        input.classList.add('error');

        setTimeout(() => {
            input.classList.remove('error');
        }, 3000);
    }

    showSuccess() {
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
    }

    hideMessages() {
        document.getElementById('errorMessage').classList.add('hidden');
        document.getElementById('successMessage').classList.add('hidden');
    }

    setCallbacks(options = {}) {
        this.onSuccess = options.onSuccess || null;
        this.onCancel = options.onCancel || null;
    }

    // 静态方法：检查是否需要验证（每次都返回false，意味着每次都需要验证）
    static shouldVerify() {
        return true; // 每次都需要验证
    }

    // 静态方法：检查兑换码是否在有效期内（基于GitHub文件内容）
    static async isCodeValid(code, githubToken, githubRepo, filePath) {
        try {
            const url = `https://api.github.com/repos/${githubRepo}/contents/${filePath}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            const content = atob(data.content);
            const redeemCodes = JSON.parse(content);
            let availableCodes = [];

            if (Array.isArray(redeemCodes)) {
                // 新格式：数组形式
                availableCodes = redeemCodes;
            } else {
                // 兼容旧格式：对象形式
                availableCodes = Object.values(redeemCodes);
            }

            return availableCodes.includes(code.toUpperCase());
        } catch (error) {
            console.error('检查兑换码有效性失败:', error);
            return false;
        }
    }
}


window.GithubRedeemModal = GithubRedeemModal;
