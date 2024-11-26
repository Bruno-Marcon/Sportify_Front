import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Menu, Shield, Settings, HelpCircle, Layout } from 'lucide-react'; // Importei o ícone "Layout"
import { AuthContext } from '../context/AuthContext';

interface NavItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useContext(AuthContext);

  const isAdmin = user?.role === 'admin';

  const navItems: NavItem[] = [
    { icon: Home, label: 'Tela inicial', path: '/' },
    { icon: Layout, label: 'Quadras', path: '/court' },
  ];

  if (isAdmin) {
    navItems.push({ icon: Shield, label: 'Admin', path: '/admin' });
  }

  const bottomNavItems: NavItem[] = [
    { icon: HelpCircle, label: 'Ajuda', path: '/help' },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-900 px-4 py-3 sm:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 hover:text-emerald-500 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        } sm:relative sm:translate-x-0`}
      >
        <div className="h-full flex flex-col justify-between">
          {/* Top Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-1">
              {navItems.map(({ icon: Icon, label, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-gray-200">
            <nav className="space-y-1">
              {bottomNavItems.map(({ icon: Icon, label, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
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
