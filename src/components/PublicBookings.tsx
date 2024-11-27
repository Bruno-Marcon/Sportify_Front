import React, { useState, useEffect } from 'react';
import { Users, Star, Clock } from 'lucide-react';
import { fetchPublicBookings } from '../connection/apiConnection';
import JoinModal from './JoinModal';
import { PublicBookingResponse, Booking } from '../types';

const PublicBookingCard: React.FC<{
  booking: Booking;
  onClick: () => void;
}> = ({ booking, onClick }) => (
  <div
    key={booking.id}
    className="p-4 bg-white rounded-xl border border-gray-200 hover:border-green-500 transition-colors cursor-pointer"
  >
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{booking.court.name}</h3>
          <p className="text-sm text-gray-600 capitalize">
            {booking.court.category}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            booking.status === 'agendado'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {booking.status}
        </span>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {booking.time}
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 mr-1" />
          {booking.participants.length}/{booking.court.maxPlayers} Jogadores
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {booking.participants.slice(0, 3).map((participant, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium"
            >
              {participant.name[0]}
            </div>
          ))}
          {booking.participants.slice(0, 3).map((participant, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium"
            >
              {participant.name?.[0] || '?'}
            </div>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {Math.max(0, booking.court.maxPlayers - booking.participants.length)} vagas
        </span>
      </div>

      <button
        onClick={onClick}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        Participar
      </button>
    </div>
  </div>
);

const PublicBookings: React.FC = () => {
  const [publicBookings, setPublicBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response: PublicBookingResponse = await fetchPublicBookings();
  
        // Validação do formato dos dados retornados
        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error('Dados retornados pelo backend estão em um formato inesperado.');
        }
  
        const bookings: Booking[] = response.data.map((b) => {
          const court = b.attributes.court || {};
          const players = b.attributes.players || [];
          console.log('Reservas públicas retornadas pelo backend:', publicBookings);
          console.log('Reserva selecionada para participar:', selectedBooking);
          return {
            
            id: parseInt(b.id, 10),
            time: new Date(b.attributes.starts_on).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            startsOn: b.attributes.starts_on,
            endsOn: b.attributes.ends_on,
            status: b.attributes.status || 'indefinido',
            isPublic: b.attributes.public || false,
            court: {
              id: court.id || 0,
              name: court.name || 'Quadra desconhecida',
              category: court.category || 'Indefinido',
              price: court.price || 0,
              maxPlayers: court.max_players || 22, // Default para maxPlayers
            },
            participants: players.map((player) => ({
              id: player.id,
              name: player.nickname || 'Jogador desconhecido',
              position: player.role || 'Não especificado',
            })),
          };
        });
  
        setPublicBookings(bookings);
      } catch (error) {
        console.error('Erro ao buscar reservas públicas:', error);
        setError('Erro ao carregar reservas públicas. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <aside className="w-full lg:w-80 bg-white border-l border-gray-200 p-4 sm:p-6">
  <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-6">
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-green-600" />
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">
        Reservas Públicas
      </h2>
    </div>
    <span className="text-xs sm:text-sm text-green-600 font-medium">Hoje</span>
  </div>

  {isLoading ? (
    <p className="text-center text-sm sm:text-base text-gray-600">Carregando...</p>
  ) : error ? (
    <p className="text-center text-sm sm:text-base text-red-600">{error}</p>
  ) : publicBookings.length > 0 ? (
    <div className="space-y-3 sm:space-y-4">
      {publicBookings.map((booking) => (
        <PublicBookingCard
          key={booking.id}
          booking={booking}
          onClick={() => handleOpenModal(booking)}
        />
      ))}
    </div>
  ) : (
    <p className="text-center text-sm sm:text-base text-gray-600">
      Nenhuma reserva pública disponível no momento.
    </p>
  )}

  {selectedBooking && (
    <JoinModal
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false);
      setSelectedBooking(null);
    }}
    booking={selectedBooking}
    court={selectedBooking.court}
  />
  )}
</aside>
  );
};

export default PublicBookings;
