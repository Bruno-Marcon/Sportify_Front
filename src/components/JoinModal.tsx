import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, User } from 'lucide-react';
import { fetchUserInformation } from '../connection/apiConnection';

interface Participant {
  name: string;
  email: string;
}

interface Court {
  id: string;
  name: string;
  category: string;
}

interface Booking {
  id: string;
  time: string;
  maxPlayers: number;
  participants: Participant[];
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  court: Court;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, booking, court }) => {
  const [userInfo, setUserInfo] = useState<Participant | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUserInfo(true);
      try {
        const response = await fetchUserInformation();
        const user = response.data.attributes;
        setUserInfo({ name: user.name, email: user.email });
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
        alert('Erro ao carregar informações do usuário.');
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleJoin = () => {
    if (!userInfo) {
      alert('Erro ao identificar o usuário.');
      return;
    }

    // Verifica se o usuário já está na lista de participantes
    const alreadyJoined = booking.participants.some(
      (participant) => participant.name === userInfo.name
    );

    if (alreadyJoined) {
      alert('Você já está confirmado nesta reserva.');
      return;
    }

    // Adiciona o usuário à lista de participantes
    const newParticipant = {
      name: userInfo.name,
      email: userInfo.email,
    };
    console.log('Usuário entrou:', newParticipant);
    booking.participants.push(newParticipant); // Atualiza a lista de participantes
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
              <span className="font-medium">Esporte:</span> {court.category}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Horário:</span> {booking.time}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Jogadores:</span> {booking.participants.length}/{booking.maxPlayers}
            </p>

            {/* List of confirmed players */}
            <div className="mt-4">
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
                      {participant.name}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhum jogador confirmado ainda.</p>
                )}
              </ul>
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
              disabled={!userInfo}
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
