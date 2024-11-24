import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { fetchPublicBookings } from '../connection/apiConnection';
import JoinModal from './JoinModal';

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
          time: new Date(b.attributes.starts_on).toLocaleTimeString(),
          currentPlayers: b.attributes.players.length,
          maxPlayers: b.attributes.court.category === 'soccer' ? 22 : 10,
          participants: b.attributes.players.map((player) => ({
            name: player.name || 'Jogador desconhecido',
            position: player.position || 'Não especificado',
          })),
          court: b.attributes.court,
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
    <div className="mt-8">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Reservas Públicas</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {publicBookings.length > 0 ? (
          publicBookings.map((booking, index) => (
            <div
              key={booking.id}
              className={`rounded-lg border ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } p-5 shadow-md transition hover:shadow-lg`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{booking.court.name}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    booking.status === 'agendado'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{booking.court.category}</p>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Horário: {booking.time}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {booking.currentPlayers}/{booking.maxPlayers} Jogadores
                </span>
              </div>
              <button
                onClick={() => handleOpenModal(booking)}
                className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Juntar-se
              </button>
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
    </div>
  );
};

export default PublicBookings;
