import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16">
          {/* Logo */}
          <div
            className="flex items-center cursor-pointer mb-4 sm:mb-0"
            onClick={() => navigate('/')}
          >
            <img
              src="src/public/image/logo.png"
              alt="Logo Sportify"
              className="h-12 w-auto sm:h-16"
            />
            <span className="ml-2 text-base sm:text-lg lg:text-xl font-semibold text-gray-900 text-center sm:text-left">
              Sportify - Quadras
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <LogOut className="h-5 w-5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
