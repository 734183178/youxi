import React, { useEffect } from 'react';
import { calculateResult } from '../data/questions';

function Result({ data, mode = 'self', onRestart, onHistory }) {
  const result = calculateResult(data.totalScore);
  const modeTitle = mode === 'self' ? '独自已测' : '为恋人测';

  useEffect(() => {
    // 清除授权码，确保一次性使用
    sessionStorage.removeItem('authCode');
    sessionStorage.removeItem('authValidUntil');

    // 保存测试结果到 LocalStorage
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]');
    history.unshift({
      ...result,
      timestamp: data.timestamp,
      date: new Date(data.timestamp).toLocaleString('zh-CN'),
      mode: mode,
      modeTitle: modeTitle
    });
    // 最多保存20条历史记录
    if (history.length > 20) {
      history.pop();
    }
    localStorage.setItem('testHistory', JSON.stringify(history));
  }, [data, result, mode, modeTitle]);

  return (
    <div className="page result-page" style={{ padding: '40px' }}>
      <div style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '16px' }}>
        {modeTitle}
      </div>
      <h1>🎯 测试结果</h1>

      <div className="result-card" style={{ background: `linear-gradient(135deg, ${result.color} 0%, ${result.color}dd 100%)` }}>
        <div className="result-level">{result.level}</div>
        <div className="result-percentage">{result.percentage}%</div>
        <div className="result-score">
          总分：{result.score} / 250
        </div>

        <div className="result-description">
          {result.description}
        </div>
      </div>

      <div className="result-suggestion">
        <h3>💡 建议</h3>
        <p>{result.suggestion}</p>
      </div>

      <div className="button-group">
        <button className="btn btn-primary" onClick={onRestart}>
          重新测试
        </button>
        <button className="btn btn-secondary" onClick={onHistory}>
          查看历史
        </button>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
        <p>* 本测试结果仅供参考，不构成专业医疗建议</p>
        <p>如有严重的情感问题，建议咨询专业心理咨询师</p>
      </div>
    </div>
  );
}

export default Result;
