import React, { useState, useEffect } from 'react';
import { Users, Star, Clock } from 'lucide-react';
import { fetchPublicBookings } from '../connection/apiConnection';
import JoinModal from './JoinModal';
import { PublicBookingResponse, Participant, Booking, Court } from '../types';

const PublicBookings: React.FC = () => {
  const [publicBookings, setPublicBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response: PublicBookingResponse = await fetchPublicBookings();
        const bookings: Booking[] = response.data.map((b) => ({
          id: b.id,
          time: new Date(b.attributes.starts_on).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          currentPlayers: b.attributes.players.length,
          maxPlayers: b.attributes.court.max_players ?? 22, // Valor padrão
          participants: b.attributes.players.map((player) => ({
            name: player.nickname || player.name || 'Jogador desconhecido',
            position: player.role || 'Não especificado',
          })),
          court: {
            id: b.attributes.court.id.toString(),
            name: b.attributes.court.name,
            category: b.attributes.court.category,
          },
          status: b.attributes.status,
        }));
        setPublicBookings(bookings);
      } catch (error) {
        console.error('Erro ao buscar reservas públicas:', error);
        alert('Erro ao carregar reservas públicas.');
      }
    };

    fetchBookings();
  }, []);

  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <aside className="w-full lg:w-80 bg-white border-l border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Reservas Públicas</h2>
        </div>
        <span className="text-sm text-green-600 font-medium">Hoje</span>
      </div>

      <div className="space-y-4">
        {publicBookings.length > 0 ? (
          publicBookings.map((booking) => (
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
                    {booking.currentPlayers}/{booking.maxPlayers} Jogadores
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
                    {booking.currentPlayers > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{booking.currentPlayers - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {booking.maxPlayers - booking.currentPlayers} vagas
                  </span>
                </div>

                <button
                  onClick={() => handleOpenModal(booking)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Participar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            Nenhuma reserva pública disponível no momento.
          </p>
        )}
      </div>

      {selectedBooking && (
        <JoinModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          court={selectedBooking.court}
        />
      )}
    </aside>
  );
};

export default PublicBookings;
