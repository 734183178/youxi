import React, { useState, useEffect } from 'react';
import { getRandomQuestions, scoreOptions } from '../data/questions';

function Test({ mode = 'self', onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const modeText = mode === 'self' ? '您' : 'TA';
  const modeTitle = mode === 'self' ? '独自已测' : '为恋人测';

  useEffect(() => {
    const randomQuestions = getRandomQuestions();
    setQuestions(randomQuestions);
  }, []);

  const handleAnswer = (score) => {
    setAnswers({
      ...answers,
      [currentIndex]: score
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 测试完成，计算总分
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      onComplete({
        questions,
        answers,
        totalScore,
        timestamp: new Date().toISOString(),
        mode
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="page test-page" style={{ padding: '40px' }}>
        <p style={{ textAlign: 'center', padding: '40px' }}>正在加载题目...</p>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const currentAnswer = answers[currentIndex];
  const canProceed = currentAnswer !== undefined;

  // 将题目中的"我"替换为对应的代词
  const questionText = questions[currentIndex].replace(/我/g, modeText);

  return (
    <div className="page test-page" style={{ padding: '40px' }}>
      <div className="test-mode-indicator" style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#FF6B9D',
        fontWeight: '600'
      }}>
        {modeTitle}
      </div>

      <div className="progress-text">
        题目 {currentIndex + 1} / {questions.length}
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-card">
        <div className="question-number">第 {currentIndex + 1} 题</div>
        <div className="question-text">{questionText}</div>

        <div className="options">
          {scoreOptions.map((option) => (
            <button
              key={option.value}
              className={`option-btn ${currentAnswer === option.value ? 'selected' : ''}`}
              onClick={() => handleAnswer(option.value)}
            >
              <span className="option-value">{option.value}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="navigation">
        <button
          className="btn btn-secondary"
          onClick={currentIndex === 0 ? onBack : handlePrev}
        >
          {currentIndex === 0 ? '返回首页' : '上一题'}
        </button>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!canProceed}
          style={{
            opacity: canProceed ? 1 : 0.5,
            cursor: canProceed ? 'pointer' : 'not-allowed'
          }}
        >
          {currentIndex === questions.length - 1 ? '查看结果' : '下一题'}
        </button>
      </div>
    </div>
  );
}

export default Test;
