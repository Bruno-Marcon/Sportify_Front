import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'myBookings' | 'profile' | 'login'>('home');

  const handlePageChange = (page: 'home' | 'myBookings' | 'profile' | 'login') => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {currentPage === 'login' ? (
        // Renderiza apenas a tela de login
        <div className="flex-1">
          <Login />
        </div>
      ) : (
        // Renderiza a aplicação com Sidebar e Header
        <>
          <Sidebar onNavigate={handlePageChange} />
          <div className="flex-1 pl-64">
            <Header onLoginToggle={() => handlePageChange('login')} />
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'myBookings' && <MyBookings />}
            {currentPage === 'profile' && <UserProfile />}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
