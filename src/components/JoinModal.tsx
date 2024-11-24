import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, User } from 'lucide-react';
import { useStore } from '../store/useStore';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  court: any;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, booking, court }) => {
  const { user } = useStore(); // Assumindo que o estado do usuário é armazenado no store
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [selectedPosition, setSelectedPosition] = useState<string>('');

  const handleJoin = () => {
    if (!name || !email || !selectedPosition) {
      alert('Por favor, preencha todos os campos antes de continuar.');
      return;
    }

    // Simulação de adicionar o usuário como participante
    const newParticipant = {
      name,
      email,
      position: selectedPosition,
    };
    console.log(`Usuário entrou:`, newParticipant);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Entrar na Reserva
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Quadra:</span> {court.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Esporte:</span> {court.sport}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Horário:</span> {booking.time}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Jogadores:</span> {booking.currentPlayers}/{booking.maxPlayers}
            </p>

            {/* List of confirmed players */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Jogadores Confirmados:
              </h3>
              <ul className="space-y-2">
                {booking.participants && booking.participants.length > 0 ? (
                  booking.participants.map((participant: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      {participant.name} - {participant.position}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum jogador confirmado ainda.</p>
                )}
              </ul>
            </div>

            {/* User Information */}
            {!user && (
              <div className="mt-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome:
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Digite seu nome"
                />

                <label htmlFor="email" className="mt-4 block text-sm font-medium text-gray-700">
                  E-mail:
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Digite seu e-mail"
                  type="email"
                />
              </div>
            )}

            {/* Position Selection */}
            <div className="mt-4">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Selecione sua posição:
              </label>
              <select
                id="position"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Escolha uma posição</option>
                <option value="Atacante">Atacante</option>
                <option value="Defensor">Defensor</option>
                <option value="Goleiro">Goleiro</option>
              </select>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleJoin}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Confirmar Entrada
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JoinModal;
