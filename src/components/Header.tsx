import React from 'react';

interface HeaderProps {
  onLoginToggle: () => void; // Prop para alternar entre login e home
}

const Header: React.FC<HeaderProps> = ({ onLoginToggle }) => {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-lg font-bold text-gray-900">Sportify</h1>
      <button
        onClick={onLoginToggle}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Entrar
      </button>
    </header>
  );
};

export default Header;
