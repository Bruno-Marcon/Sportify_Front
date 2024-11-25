// App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastContainer'; // Importa o ToastProvider
import { AuthProvider } from './context/AuthContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastProvider />
        <Routes>
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <div className="flex w-full">
                  <Sidebar />
                  <div className="flex-1">
                    <Header />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/myBookings" element={<MyBookings />} />
                      <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
