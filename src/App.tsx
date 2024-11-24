import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Importa o componente de rota protegida

const App: React.FC = () => {
  // Verifica se o token está presente no localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="flex w-full">
                <Sidebar />
                <div className="flex-1 pl-64">
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
  );
};

export default App;
