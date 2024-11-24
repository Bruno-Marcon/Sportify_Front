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
    </header>
  );
};

export default Header;
