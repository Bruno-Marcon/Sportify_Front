import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, User, Award, LogOut, Menu } from 'lucide-react';

interface NavItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Estado para o menu móvel

  const navItems: NavItem[] = [
    { icon: Home, label: 'Tela inicial', path: '/' },
    { icon: Calendar, label: 'Minhas reservas', path: '/myBookings' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Award, label: 'Ranking', path: '/leaderboard' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove o token ou qualquer dado de autenticação
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <>
      {/* Cabeçalho móvel */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-3 sm:hidden">
        <img src="src\public\image\logo.png" alt="Logo Sportify" className="h-8 w-auto" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-emerald-500 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Barra Lateral */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gray-900 text-gray-300 shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:relative sm:translate-x-0`}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Logo e Título */}
          <div>
            <div className="flex items-center gap-3 border-b border-gray-800 p-10">
              <img src="src\public\image\logo.png" alt="Logo Sportify" className="h-20 w-auto" />
            </div>

            {/* Navegação */}
            <nav className="mt-4 space-y-1 p-4">
              {navItems.map(({ icon: Icon, label, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-500 text-gray-900 shadow-md'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-500'
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Fecha o menu ao clicar em um item
                >
                  <Icon className="h-5 w-5 text-emerald-500" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-800 p-4">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false); // Fecha o menu ao fazer logout
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-emerald-500"
            >
              <LogOut className="h-5 w-5 text-emerald-500" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
