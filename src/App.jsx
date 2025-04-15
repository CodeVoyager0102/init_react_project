import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import OAuthCallback from './pages/OAuthCallback';
import User from './pages/User';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import QuickTransfer from './pages/QuickTransfer';
import BillPayment from './pages/BillPayment';
import Investment from './pages/Investment';
import WealthManagement from './pages/WealthManagement';
import PrivateBanking from './pages/PrivateBanking';
import './styles/App.less';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
          <Route 
            path="/quick-transfer" 
            element={<PrivateRoute requiredLevel="LEVEL_2"><QuickTransfer /></PrivateRoute>} 
          />
          <Route 
            path="/bill" 
            element={<PrivateRoute requiredLevel="LEVEL_2"><BillPayment /></PrivateRoute>} 
          />
          <Route 
            path="/investment" 
            element={<PrivateRoute requiredLevel="LEVEL_3"><Investment /></PrivateRoute>} 
          />
          <Route 
            path="/wealth" 
            element={<PrivateRoute requiredLevel="LEVEL_4"><WealthManagement /></PrivateRoute>} 
          />
          <Route 
            path="/private" 
            element={<PrivateRoute requiredLevel="LEVEL_5"><PrivateBanking /></PrivateRoute>} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 