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
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1
        onClick={() => navigate('/')}
        className="cursor-pointer text-lg font-bold text-gray-900 hover:text-emerald-600"
      >
        Sportify
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 hover:text-emerald-600"
      >
        <LogOut className="h-5 w-5 text-gray-700 hover:text-emerald-600" />
        <span>Sair</span>
      </button>
    </header>
  );
};

export default Header;
