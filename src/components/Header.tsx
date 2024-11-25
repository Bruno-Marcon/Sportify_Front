import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token ou qualquer dado de autenticação
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      {/* Título do aplicativo */}
      <h1
        onClick={() => navigate('/')} // Redireciona para a página inicial
        className="cursor-pointer text-lg font-bold text-gray-900 hover:text-emerald-600"
      >
        Sportify
      </h1>

      {/* Botão de Logout */}
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
