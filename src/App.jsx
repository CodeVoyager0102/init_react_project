import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import User from "./pages/User";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import "./styles/App.less";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/user"
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="/oauth/:platform/callback" element={<OAuthCallback />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
