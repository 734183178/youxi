// 简单兑换码验证弹窗组件 - API版本
class RedeemModal {
    constructor() {
        this.isVerifying = false;
        this.onSuccess = null;
        this.onCancel = null;

        // 🔐 API配置
        this.API_CONFIG = {
            url: 'http://101.132.176.113:8080/verify_code.php',
            key: 'K9mP2xQ7nL4vB8wT6jF3hR5yU1cN0sA9gD'
        };
    }

    init() {
        this.loadStyles();
        this.createModal();
        this.bindEvents();
    }

    // 加载外部CSS样式
    loadStyles() {
        if (document.getElementById('redeem-modal-styles')) {
            return;
        }
        const link = document.createElement('link');
        link.id = 'redeem-modal-styles';
        link.rel = 'stylesheet';
        link.href = 'redeem-modal.css';
        document.head.appendChild(link);
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
                    </div>

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
                        <span>验证成功!正在跳转...</span>
                    </div>

                    <div class="space-y-3">
                        <input
                            type="text"
                            id="redeemCodeInput"
                            placeholder="请输入兑换码"
                            class="code-input"
                            autocomplete="off"
                        />

                        <button
                            id="verifyBtn"
                            class="verify-btn"
                        >
                            <span id="btnText">验证兑换码</span>
                        </button>

                        <button
                            id="getCodeBtn"
                            class="get-code-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                            </svg>
                            获取兑换码
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

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        const input = document.getElementById('redeemCodeInput');
        const verifyBtn = document.getElementById('verifyBtn');
        const getCodeBtn = document.getElementById('getCodeBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const overlay = document.getElementById('redeemModalContainer');

        verifyBtn.addEventListener('click', () => this.verifyRedeemCode());
        getCodeBtn.addEventListener('click', () => this.openGetCodeLink());
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
    }

    close() {
        const modal = document.getElementById('redeemModalContainer');
        modal.style.display = 'none';
        document.body.style.overflow = '';

        if (this.onCancel) {
            this.onCancel();
        }
    }

    // API验证兑换码
    async verifyRedemptionCodeAPI(code) {
        try {
            const response = await fetch(this.API_CONFIG.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_CONFIG.key
                },
                body: JSON.stringify({
                    action: 'verify',
                    code: code
                })
            });

            if (!response.ok) {
                throw new Error('网络响应错误');
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('API调用失败:', error);
            return {
                success: false,
                message: '网络连接失败，请检查网络后重试'
            };
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

        // 调用API验证
        const result = await this.verifyRedemptionCodeAPI(code);

        if (result.success) {
            // 验证成功
            this.showSuccess();

            const codeInfo = {
                code: code,
                verifyTime: new Date().toISOString(),
                apiResponse: result
            };

            console.log('验证成功:', codeInfo);

            setTimeout(() => {
                this.close();
                if (this.onSuccess) {
                    this.onSuccess({
                        code: code,
                        valid: true,
                        info: codeInfo
                    });
                }
            }, 1500);
        } else {
            // 验证失败
            const errorMessage = result.message || '兑换码无效，请检查后重试';
            this.showError(errorMessage);
        }

        this.setVerifying(false);
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

    // 跳转到获取兑换码链接
    openGetCodeLink() {
        const link = 'https://xhslink.com/m/4fFDMAcHhTf';
        window.open(link, '_blank', 'noopener,noreferrer');
    }
}

window.RedeemModal = RedeemModal;