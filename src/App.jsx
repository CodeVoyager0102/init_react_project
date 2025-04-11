import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import './styles/App.less';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
          {/* 其他路由 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App; 