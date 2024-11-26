import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, CalendarDays, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';
import { createPlayer, getBookingsByShareToken } from '../connection/apiConnection';
import { BookingData } from '../types';
import { Booking } from '../types';

interface Position {
  id: string;
  name: string;
  available: number;
}

const positions: Position[] = [
  { id: 'striker', name: 'Atacante', available: 2 },
  { id: 'midfielder', name: 'Meio-Campo', available: 1 },
  { id: 'defender', name: 'Defensor', available: 2 },
  { id: 'goalkeeper', name: 'Goleiro', available: 1 },
];

export default function JoinGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [joiningGame, setJoiningGame] = useState(false);

  console.log(gameId)

  const safeGameId = gameId ?? '';

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        if (safeGameId) {
          const data = await getBookingsByShareToken(safeGameId);
          setBooking(data);
          setApiError(null);
        } else {
          setApiError('Partida não encontrada ou link expirado');
          setBooking(null);
        }
      } catch (err) {
        setApiError('Erro ao buscar informações da partida');
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBooking();
  }, [safeGameId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!nickname.trim()) {
      setError('Por favor, insira seu apelido');
      return;
    }
    if (!selectedPosition) {
      setError('Por favor, selecione uma posição');
      return;
    }
  
    try {
      setJoiningGame(true);
  
      await createPlayer({
        shareToken: safeGameId,
        nickname,
        role: selectedPosition,
      });
  
      setJoinSuccess(true);
    } catch (err) {
      console.error('Erro ao entrar na partida:', err);
      setError('Não foi possível entrar na partida. Tente novamente.');
    } finally {
      setJoiningGame(false);
    }
  };
  

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
          <p className="text-gray-600">Carregando informações da partida...</p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Oops! {apiError}</h2>
          <p className="mb-6 text-gray-600">
            Verifique se o link está correto ou tente novamente mais tarde.
          </p>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    );
  }

  if (joinSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Você está na partida!
          </h2>
          <p className="mb-2 text-lg text-gray-600">
            Sua participação foi confirmada com sucesso.
          </p>
          <div className="my-8 rounded-lg bg-white p-6 shadow-sm">
            <div className="space-y-3 text-left">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span>{'courtname'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarDays className="h-5 w-5 mr-2 text-gray-400" />
                <span>{booking?.startsOn} às {booking?.startsOn}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 mr-2 text-gray-400" />
                <span>Posição: {positions.find(p => p.id === selectedPosition)?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Game Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Entrar na Partida</h1>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {booking?.totalValue}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              <span>{'Sportify Arena'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarDays className="h-5 w-5 mr-2 text-gray-400" />
              <span>{booking?.startsOn}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2 text-gray-400" />
              <span>{booking?.startsOn}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              <span>{booking?.currentPlayers}/{booking?.maxPlayers} jogadores</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Organizado por <span className="font-medium text-gray-900">{'joao'}</span>
            </p>
          </div>
        </div>

        {/* Join Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                Seu apelido
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Como quer ser chamado?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escolha sua posição
              </label>
              <div className="grid grid-cols-2 gap-3">
                {positions.map((position) => (
                  <button
                    key={position.id}
                    type="button"
                    onClick={() => setSelectedPosition(position.id)}
                    className={clsx(
                      'flex flex-col items-center p-4 border rounded-lg transition-colors',
                      selectedPosition === position.id
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-200'
                    )}
                  >
                    <span className="font-medium">{position.name}</span>
                    <span className="text-sm text-gray-500 mt-1">
                      {position.available} {position.available === 1 ? 'vaga' : 'vagas'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={joiningGame}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joiningGame ? (
                <span className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Confirmando...
                </span>
              ) : (
                'Confirmar Participação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}