import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Pencil, PlusCircle, Trash, User, X } from 'lucide-react';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao@example.com',
    photo: null,
    coverPhoto: null,
    sports: [
      { sport: 'Tennis', position: 'Atacante' },
      { sport: 'Futebol', position: 'Defensor' },
    ],
    history: [
      { court: 'Center Court', sport: 'Tennis', time: '10:00', date: '2024-11-20' },
      { court: 'Arena Futebol', sport: 'Futebol', time: '18:00', date: '2024-11-19' },
    ],
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState<File | null>(null);

  const handleSaveChanges = () => {
    setUser((prev) => ({
      ...prev,
      name: newName,
      photo: newPhoto ? URL.createObjectURL(newPhoto) : prev.photo,
      coverPhoto: newCoverPhoto ? URL.createObjectURL(newCoverPhoto) : prev.coverPhoto,
    }));
    setIsEditModalOpen(false);
  };

  const handleDeleteSport = (sport: string) => {
    setUser((prev) => ({
      ...prev,
      sports: prev.sports.filter((s) => s.sport !== sport),
    }));
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Profile Header */}
      <div className="relative bg-emerald-600 rounded-xl h-48">
        {user.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="h-full w-full object-cover rounded-xl"
          />
        ) : (
          <div className="h-full w-full bg-emerald-500 rounded-xl" />
        )}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-4 right-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
        >
          <Pencil className="h-5 w-5 inline-block mr-2" />
          Editar Perfil
        </button>
        <div className="absolute -bottom-12 left-6">
          <div className="relative h-28 w-28 rounded-full bg-white border-4 border-gray-50 overflow-hidden">
            {user.photo ? (
              <img
                src={user.photo}
                alt="User"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-full w-full text-gray-400" />
            )}
          </div>
        </div>
      </div>
      <div className="mt-16 px-6">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Sports List */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Esportes Praticados</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {user.sports.map((sport, index) => (
            <li
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 shadow-sm"
            >
              <div>
                <p className="text-sm">
                  <span className="font-medium">Esporte:</span> {sport.sport}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Posição:</span> {sport.position}
                </p>
              </div>
              <button
                onClick={() => handleDeleteSport(sport.sport)}
                className="rounded-full p-2 text-red-400 hover:text-red-600 hover:bg-red-100"
              >
                <Trash className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Reservation History */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">Histórico de Reservas</h2>
        <ul className="mt-4 space-y-3">
          {user.history.map((reservation, index) => (
            <li
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-100 px-5 py-4 shadow-sm"
            >
              <p className="text-sm">
                <span className="font-medium">Quadra:</span> {reservation.court}
              </p>
              <p className="text-sm">
                <span className="font-medium">Esporte:</span> {reservation.sport}
              </p>
              <p className="text-sm">
                <span className="font-medium">Horário:</span> {reservation.time}
              </p>
              <p className="text-sm">
                <span className="font-medium">Data:</span> {reservation.date}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Editing Profile */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Editar Perfil
              </Dialog.Title>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                  Foto de Perfil
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-emerald-700"
                />
              </div>
              <div>
                <label htmlFor="coverPhoto" className="block text-sm font-medium text-gray-700">
                  Foto de Capa
                </label>
                <input
                  type="file"
                  id="coverPhoto"
                  accept="image/*"
                  onChange={(e) => setNewCoverPhoto(e.target.files?.[0] || null)}
                  className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white file:font-medium hover:file:bg-emerald-700"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveChanges}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Salvar Alterações
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserProfile;
