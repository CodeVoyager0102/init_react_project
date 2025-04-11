import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.less';
import App from './App';

// 在开发环境下引入mock
if (process.env.NODE_ENV === 'development') {
  require('./mock');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 