import React, { useState } from 'react';
import { Home, Calendar, User, Award, LogOut, Edit3, Upload } from 'lucide-react';

interface NavItem {
  icon: React.FC<{ className?: string }>;
  label: string;
  page: 'home' | 'myBookings' | 'profile' | 'leaderboard' | 'logout' | 'editProfile';
}

interface SidebarProps {
  onNavigate: (page: 'home' | 'myBookings' | 'profile' | 'leaderboard' | 'logout' | 'editProfile') => void;
  activePage: 'home' | 'myBookings' | 'profile' | 'leaderboard' | 'logout' | 'editProfile';
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  const navItems: NavItem[] = [
    { icon: Home, label: 'Tela inicial', page: 'home' },
    { icon: Calendar, label: 'Minhas reservas', page: 'myBookings' },
    { icon: User, label: 'Perfil', page: 'profile' },
    { icon: Award, label: 'Ranking', page: 'leaderboard' },
  ];

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: 'João Silva',
    coverPhoto: null,
    profilePhoto: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'coverPhoto' | 'profilePhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        [type]: fileURL,
      }));
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      username: e.target.value,
    }));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-emerald-600 text-white">
      <div className="flex h-full flex-col justify-between">
        {/* Logo e Título */}
        <div>
          <div className="flex items-center gap-2 p-6">
            <Calendar className="h-8 w-8 text-white" />
            <span className="text-xl font-bold">Sportify</span>
          </div>

          {/* Navegação */}
          <nav className="space-y-2 p-4">
            {navItems.map(({ icon: Icon, label, page }) => (
              <button
                key={label}
                onClick={() => {
                  setIsEditingProfile(false);
                  onNavigate(page);
                }}
                className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition ${
                  activePage === page
                    ? 'bg-white text-emerald-600'
                    : 'text-white hover:bg-emerald-700'
                }`}
              >
                <Icon className={`h-5 w-5 ${activePage === page ? 'text-emerald-600' : 'text-white'}`} />
                {label}
              </button>
            ))}
          </nav>

          {/* Edit Profile */}
          <div className="mt-6 border-t border-emerald-700 pt-4 px-4">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition ${
                isEditingProfile
                  ? 'bg-white text-emerald-600'
                  : 'text-white hover:bg-emerald-700'
              }`}
            >
              <Edit3 className={`h-5 w-5 ${isEditingProfile ? 'text-emerald-600' : 'text-white'}`} />
              Editar Perfil
            </button>
          </div>

          {/* Profile Editing Options */}
          {isEditingProfile && (
            <div className="mt-4 space-y-4 px-4">
              {/* Edit Cover Photo */}
              <div>
                <label className="block text-sm font-medium">Foto de capa</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'coverPhoto')}
                    className="hidden"
                    id="coverPhoto"
                  />
                  <label
                    htmlFor="coverPhoto"
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                  >
                    <Upload className="h-5 w-5" />
                    Alterar
                  </label>
                </div>
                {profileData.coverPhoto && (
                  <img
                    src={profileData.coverPhoto}
                    alt="Capa"
                    className="mt-2 h-16 w-full rounded-lg object-cover"
                  />
                )}
              </div>

              {/* Edit Profile Photo */}
              <div>
                <label className="block text-sm font-medium">Foto de perfil</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profilePhoto')}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label
                    htmlFor="profilePhoto"
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                  >
                    <Upload className="h-5 w-5" />
                    Alterar
                  </label>
                </div>
                {profileData.profilePhoto && (
                  <img
                    src={profileData.profilePhoto}
                    alt="Perfil"
                    className="mt-2 h-16 w-16 rounded-full object-cover"
                  />
                )}
              </div>

              {/* Edit Username */}
              <div>
                <label className="block text-sm font-medium">Nome de usuário</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={handleUsernameChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={() => onNavigate('logout')}
            className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
