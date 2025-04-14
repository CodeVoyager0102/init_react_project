import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import User from './pages/User';
import Admin from './pages/Admin';
import './styles/App.less';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<User />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
          {/* 其他路由 */}
        </Routes>
      </div>
    </Router>
  );
};

export default App; 