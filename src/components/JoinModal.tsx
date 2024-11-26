import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, AlertCircle, User } from 'lucide-react';
import {joinBooking, listBookingDetails } from '../connection/apiConnection';
import { toast } from 'react-toastify';
import { Booking, Participant, Court, JoinBookingResponse } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  court: Court;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, booking, court }) => {
  const [userInfo, setUserInfo] = useState<Participant | null>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setIsLoadingUserInfo(true);
      setErrorMessage(null);
  
      try {
        const response = await listBookingDetails(booking.id);
        console.log('Detalhes da reserva recebidos:', response);
  
        // Atualizar o estado com os detalhes recebidos
        booking.participants = response.data.attributes.players.map((player) => ({
          id: player.id,
          name: player.nickname || `Jogador ${player.id}`,
          isAuthenticated: true,
        }));
  
        court.name = response.data.attributes.court.name;
        court.category = response.data.attributes.court.category;
        court.max_players = response.data.attributes.court.max_players;
      } catch (error) {
        console.error('Erro ao buscar detalhes da reserva:', error);
        setErrorMessage('Erro ao carregar detalhes da reserva.');
      } finally {
        setIsLoadingUserInfo(false);
      }
    };
  
    if (isOpen) {
      fetchBookingDetails();
    } else {
      setErrorMessage(null);
      setUserInfo(null);
    }
  }, [isOpen, booking.id, court, booking]);

  const handleJoin = async () => {
    if (!userInfo) {
      setErrorMessage('Erro ao identificar o usuário.');
      toast.error('Erro ao identificar o usuário.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
      return;
    }
  
    try {
      // Validar se o usuário já está na lista de participantes
      const alreadyJoined = booking.participants.some(
        (participant) => participant.id === userInfo.id
      );
  
      if (alreadyJoined) {
        setErrorMessage('Você já está confirmado nesta reserva.');
        toast.warning('Você já está confirmado nesta reserva.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        return;
      }
  
      // Validar limite de jogadores
      if (booking.participants.length >= court.max_players) {
        setErrorMessage('A reserva já atingiu o número máximo de jogadores.');
        toast.error('A reserva já atingiu o número máximo de jogadores.', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
        return;
      }
  
      setIsJoining(true);
  
      // Chamada à API para ingressar na reserva
      const response: JoinBookingResponse = await joinBooking(booking.id);
      console.log('Resposta ao ingressar na reserva:', response);
  
      // Atualizar participantes e outros detalhes da reserva
      booking.participants = response.data.attributes.players.map((player) => ({
        id: player.id,
        name: player.nickname || `Jogador ${player.id}`,
        isAuthenticated: true,
      }));
  
      court.name = response.data.attributes.court.name;
      court.category = response.data.attributes.court.category;
      court.max_players = response.data.attributes.court.max_players;
  
      toast.success('Você entrou na reserva com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
  
      onClose();
    } catch (error) {
      console.error('Erro ao ingressar na reserva:', error);
      setErrorMessage('Erro ao ingressar na reserva. Tente novamente.');
      toast.error('Erro ao ingressar na reserva. Tente novamente.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
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
          {isLoadingUserInfo ? (
            <p className="text-center text-gray-500">Carregando informações...</p>
          ) : (
            <div>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Quadra:</span> {court.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Esporte:</span>{' '}
                    {court.category.charAt(0).toUpperCase() + court.category.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Horário:</span> {booking.startsOn}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Jogadores:</span>{' '}
                    {booking.participants.length}/{court.max_players}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-medium text-gray-800">
                    Jogadores Confirmados:
                  </h3>
                  {booking.participants && booking.participants.length > 0 ? (
                    <ul className="max-h-40 space-y-2 overflow-y-auto">
                      {booking.participants.map((participant, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700"
                        >
                          <User className="h-4 w-4 text-gray-500" />
                          {participant.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum jogador confirmado ainda.</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse items-center justify-end gap-4 sm:flex-row">
                <button
                  onClick={onClose}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                    onClick={handleJoin}
                    className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
                  >
                    {isJoining ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                        Carregando...
                      </>
                    ) : (
                      'Confirmar Entrada'
                    )}
                  </button>

              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default JoinModal;
