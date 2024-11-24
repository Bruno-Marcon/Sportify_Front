import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1
        onClick={() => navigate('/')} // Redireciona para a página inicial
        className="cursor-pointer text-lg font-bold text-gray-900 hover:text-emerald-600"
      >
        Sportify
      </h1>
      <button
        onClick={() => navigate('/login')} // Redireciona para a página de login
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Entrar
      </button>
    </header>
  );
};

export default Header;
