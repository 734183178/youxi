/**
 * 可复用的兑换码验证模块
 * 使用方法:
 * 1. 在HTML中引入此脚本
 * 2. 调用 RedemptionCode.verify(onSuccess, onCancel)
 */

const RedemptionCode = (function() {
  'use strict';

  // 验证兑换码的函数
  async function verifyCode(code) {
    try {
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim().toUpperCase() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message || '兑换码验证成功!' };
      } else {
        return { success: false, message: data.message || '兑换码无效或已使用' };
      }
    } catch (error) {
      console.error('验证请求失败:', error);
      return { success: false, message: '网络错误,请稍后重试' };
    }
  }

  // 创建弹窗UI
  function createModal(onSuccess, onCancel) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'redemption-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;

    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'redemption-modal';
    modal.style.cssText = `
      background: white;
      border-radius: 16px;
      padding: 32px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    `;

    // 弹窗内容
    modal.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.5s ease;
        }
      </style>
      <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #1f2937; text-align: center;">
        🔐 请输入兑换码
      </h2>
      <p style="margin: 0 0 24px 0; font-size: 14px; color: #6b7280; text-align: center;">
        需要有效的兑换码才能继续测试
      </p>
      <div style="margin-bottom: 16px;">
        <input
          type="text"
          id="redemptionCodeInput"
          placeholder="请输入8位兑换码"
          maxlength="8"
          style="
            width: 100%;
            padding: 12px 16px;
            font-size: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            outline: none;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
            box-sizing: border-box;
            transition: border-color 0.2s;
          "
          autocomplete="off"
        />
      </div>
      <div id="redemptionMessage" style="
        min-height: 24px;
        margin-bottom: 16px;
        font-size: 14px;
        text-align: center;
      "></div>
      <div style="display: flex; gap: 12px;">
        <button
          id="redemptionCancel"
          style="
            flex: 1;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border: 2px solid #e5e7eb;
            background: white;
            color: #6b7280;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          "
        >
          取消
        </button>
        <button
          id="redemptionSubmit"
          style="
            flex: 1;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
          "
        >
          验证
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // 获取元素
    const input = document.getElementById('redemptionCodeInput');
    const submitBtn = document.getElementById('redemptionSubmit');
    const cancelBtn = document.getElementById('redemptionCancel');
    const message = document.getElementById('redemptionMessage');

    // 自动聚焦
    setTimeout(() => input.focus(), 100);

    // 输入框样式交互
    input.addEventListener('focus', () => {
      input.style.borderColor = '#3b82f6';
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.style.borderColor = '#e5e7eb';
      }
    });

    // 按钮悬停效果
    submitBtn.addEventListener('mouseenter', () => {
      submitBtn.style.transform = 'translateY(-2px)';
      submitBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    });
    submitBtn.addEventListener('mouseleave', () => {
      submitBtn.style.transform = 'translateY(0)';
      submitBtn.style.boxShadow = 'none';
    });

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.borderColor = '#9ca3af';
      cancelBtn.style.color = '#374151';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.borderColor = '#e5e7eb';
      cancelBtn.style.color = '#6b7280';
    });

    // 显示消息
    function showMessage(text, isError = false) {
      message.textContent = text;
      message.style.color = isError ? '#ef4444' : '#10b981';
      message.style.fontWeight = '600';

      if (isError) {
        modal.classList.add('shake');
        setTimeout(() => modal.classList.remove('shake'), 500);
      }
    }

    // 关闭弹窗
    function closeModal() {
      overlay.style.animation = 'fadeIn 0.2s ease reverse';
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 200);
    }

    // 提交验证
    async function handleSubmit() {
      const code = input.value.trim();

      if (!code) {
        showMessage('请输入兑换码', true);
        input.focus();
        return;
      }

      if (code.length !== 8) {
        showMessage('兑换码应为8位字符', true);
        input.focus();
        return;
      }

      // 禁用按钮
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.textContent = '验证中...';

      // 验证兑换码
      const result = await verifyCode(code);

      if (result.success) {
        showMessage(result.message, false);

        // 存储验证状态到sessionStorage
        sessionStorage.setItem('redemptionVerified', 'true');
        sessionStorage.setItem('redemptionCode', code);

        setTimeout(() => {
          closeModal();
          if (onSuccess) onSuccess(code);
        }, 800);
      } else {
        showMessage(result.message, true);

        // 重新启用按钮
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.textContent = '验证';

        input.value = '';
        input.focus();
      }
    }

    // 事件监听
    submitBtn.addEventListener('click', handleSubmit);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    });

    cancelBtn.addEventListener('click', () => {
      closeModal();
      if (onCancel) onCancel();
    });

    // 点击遮罩层关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
        if (onCancel) onCancel();
      }
    });
  }

  // 检查是否已验证
  function isVerified() {
    return sessionStorage.getItem('redemptionVerified') === 'true';
  }

  // 清除验证状态
  function clearVerification() {
    sessionStorage.removeItem('redemptionVerified');
    sessionStorage.removeItem('redemptionCode');
  }

  // 公共API
  return {
    /**
     * 验证兑换码
     * @param {Function} onSuccess - 验证成功回调
     * @param {Function} onCancel - 取消回调
     */
    verify: function(onSuccess, onCancel) {
      // 如果已经验证过,直接调用成功回调
      if (isVerified()) {
        const code = sessionStorage.getItem('redemptionCode');
        if (onSuccess) onSuccess(code);
        return;
      }

      // 显示验证弹窗
      createModal(onSuccess, onCancel);
    },

    /**
     * 检查是否已验证
     */
    isVerified: isVerified,

    /**
     * 清除验证状态
     */
    clearVerification: clearVerification
  };
})();
