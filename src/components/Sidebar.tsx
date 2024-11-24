import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Calendar, User, Award, LogOut } from 'lucide-react';

interface NavItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

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
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-gray-900 text-gray-300 shadow-lg">
      <div className="flex h-full flex-col justify-between">
        {/* Logo e Título */}
        <div>
          <div className="flex items-center gap-3 p-6 border-b border-gray-800">
            <Calendar className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-bold tracking-wide text-emerald-500">
              Sportify
            </span>
          </div>

          {/* Navegação */}
          <nav className="mt-4 space-y-1 p-4">
            {navItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 w-full rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-500 text-gray-900 shadow-md'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-emerald-500'
                  }`
                }
              >
                <Icon
                  className={({ isActive }) =>
                    `h-5 w-5 ${
                      isActive ? 'text-gray-900' : 'text-emerald-500'
                    }`
                  }
                />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-emerald-500 transition"
          >
            <LogOut className="h-5 w-5 text-emerald-500" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
