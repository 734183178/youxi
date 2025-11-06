import { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Test from './pages/Test';
import Result from './pages/Result';
import History from './pages/History';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [testData, setTestData] = useState(null);
  const [testMode, setTestMode] = useState('self'); // 'self' 或 'partner'

  const navigateTo = (page, data = null, mode = null) => {
    setCurrentPage(page);
    if (data) setTestData(data);
    if (mode) setTestMode(mode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStart={(mode) => navigateTo('test', null, mode)} onHistory={() => navigateTo('history')} />;
      case 'test':
        return <Test mode={testMode} onComplete={(data) => navigateTo('result', data)} onBack={() => navigateTo('home')} />;
      case 'result':
        return <Result data={testData} mode={testMode} onRestart={() => navigateTo('home')} onHistory={() => navigateTo('history')} />;
      case 'history':
        return <History onBack={() => navigateTo('home')} />;
      default:
        return <Home onStart={(mode) => navigateTo('test', null, mode)} onHistory={() => navigateTo('history')} />;
    }
  };

  return <div className="app">{renderPage()}</div>;
}

export default App;
