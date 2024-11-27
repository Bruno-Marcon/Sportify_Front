import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, AlertCircle, User } from 'lucide-react';
import { joinBooking, listBookingDetails } from '../connection/apiConnection';
import { toast } from 'react-toastify';
import { Booking, Participant, Court, JoinBookingResponse } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  court: Court;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, booking, court }) => {
  const [localBooking, setLocalBooking] = useState<Booking>(booking);
  const [localCourt, setLocalCourt] = useState<Court>(court);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchBookingDetails = async () => {
      setErrorMessage(null);

      try {
        const response = await listBookingDetails(localBooking.id);
        console.log('Detalhes da reserva recebidos:', response);

        // Atualizar informações locais da reserva e quadra
        setLocalBooking((prev) => ({
          ...prev,
          participants: response.data.attributes.players.map((player) => ({
            id: player.id,
            name: player.nickname || `Jogador ${player.id}`,
            isAuthenticated: true,
          })),
        }));

        setLocalCourt({
          id: response.data.attributes.court.id,
          name: response.data.attributes.court.name,
          category: response.data.attributes.court.category,
          maxPlayers: response.data.attributes.court.max_players,
          description: localCourt.description,
          price: localCourt.price,
          status: localCourt.status,
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes da reserva:', error);
        setErrorMessage('Erro ao carregar detalhes da reserva.');
      }
    };

    fetchBookingDetails();
  }, [isOpen, localBooking.id]);

  const handleJoin = async () => {
    setErrorMessage(null);

    // Validação: Verificar limites e duplicidade
    if (localBooking.participants.some((p) => p.id === localBooking.id)) {
      toast.warning('Você já está confirmado nesta reserva.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (localBooking.participants.length >= localCourt.maxPlayers) {
      toast.error('A reserva já atingiu o número máximo de jogadores.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsJoining(true);

    try {
      const response: JoinBookingResponse = await joinBooking(localBooking.id);
      console.log('Resposta ao ingressar na reserva:', response);

      setLocalBooking((prev) => ({
        ...prev,
        participants: response.data.attributes.players.map((player) => ({
          id: player.id,
          name: player.nickname || `Jogador ${player.id}`,
          isAuthenticated: true,
        })),
      }));

      toast.success('Você entrou na reserva com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao ingressar na reserva:', error);
      toast.error('Erro ao ingressar na reserva. Tente novamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setErrorMessage('Erro ao ingressar na reserva.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="flex min-h-screen items-center justify-center px-4 py-6">
        <Dialog.Panel className="mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-900">
              Entrar na Reserva
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Quadra:</span> {localCourt.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Esporte:</span>{' '}
              {localCourt.category.charAt(0).toUpperCase() + localCourt.category.slice(1)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Horário:</span> {localBooking.startsOn}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">Jogadores:</span>{' '}
              {localBooking.participants.length}/{localCourt.maxPlayers}
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                isJoining ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isJoining ? 'Carregando...' : 'Confirmar Entrada'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JoinModal;
