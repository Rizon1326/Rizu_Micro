// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { HomePage } from './pages/HomePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CreatePostPage } from './pages/CreatePostPage';


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
