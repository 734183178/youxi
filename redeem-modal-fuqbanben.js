// 兑换码验证弹窗组件
class RedeemModal {
    constructor() {
        this.isVerifying = false;
        this.onSuccess = null;
        this.onCancel = null;
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // 创建弹窗HTML结构
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
                        <p class="text-gray-600 text-sm">请输入您的兑换码以开始测试</p>
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

        // 添加CSS样式
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
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
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

        // 验证按钮点击
        verifyBtn.addEventListener('click', () => this.verifyRedeemCode());

        // 取消按钮点击
        cancelBtn.addEventListener('click', () => this.close());

        // 回车键验证
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isVerifying) {
                this.verifyRedeemCode();
            }
        });

        // 点击背景关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });

        // 输入时清除错误状态
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

        // 防止页面滚动
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

    async verifyRedeemCode() {
        const input = document.getElementById('redeemCodeInput');
        const code = input.value.trim();

        if (!code) {
            this.showError('请输入兑换码');
            return;
        }

        this.setVerifying(true);
        this.hideMessages();

        try {
            const response = await fetch('http://101.132.176.113:3000/api/codes/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    usedBy: 'SCL90-User-' + Date.now()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.showSuccess();

                // 存储验证状态
                localStorage.setItem('scl90_verified', 'true');
                localStorage.setItem('scl90_code', code);

                // 延迟关闭并执行回调
                setTimeout(() => {
                    this.close();
                    if (this.onSuccess) {
                        this.onSuccess({ code, data });
                    }
                }, 1500);
            } else {
                this.showError(data.error || '兑换码验证失败');
            }
        } catch (error) {
            console.error('验证错误:', error);
            this.showError('网络错误，请检查网络连接或稍后重试');
        } finally {
            this.setVerifying(false);
        }
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

    // 设置回调函数
    setCallbacks(options = {}) {
        this.onSuccess = options.onSuccess || null;
        this.onCancel = options.onCancel || null;
    }

    // 检查是否已验证
    static isVerified() {
        return localStorage.getItem('scl90_verified') === 'true';
    }

    // 清除验证状态
    static clearVerification() {
        localStorage.removeItem('scl90_verified');
        localStorage.removeItem('scl90_code');
    }
}

// 自动初始化并暴露到全局
window.RedeemModal = RedeemModal;
