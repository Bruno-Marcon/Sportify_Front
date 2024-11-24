import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, User } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    time: string;
    currentPlayers: number;
    maxPlayers: number;
    participants: { name: string; position: string }[];
  };
  court: {
    name: string;
    category: string;
  };
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, booking, court }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
    console.log(`Novo participante:`, newParticipant);

    // Limpa o modal e fecha
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setSelectedPosition('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Juntar-se à Reserva
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="mt-4">
            {/* Court Information */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Quadra:</span> {court.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Esporte:</span> {court.category}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Horário:</span> {booking.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Jogadores:</span> {booking.currentPlayers}/{booking.maxPlayers}
              </p>
            </div>

            {/* Participants List */}
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Jogadores Confirmados:
              </h3>
              <ul className="space-y-2">
                {booking.participants && booking.participants.length > 0 ? (
                  booking.participants.map((participant, index) => (
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
            <div>
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
              onClick={handleClose}
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
