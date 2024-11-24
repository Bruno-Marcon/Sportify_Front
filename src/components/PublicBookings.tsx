import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { fetchPublicBookings } from '../connection/apiConnection';
import JoinModal from './JoinModal';

const PublicBookings: React.FC = () => {
  const [publicBookings, setPublicBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetchPublicBookings();
        const bookings = response.data.map((b: any) => ({
          id: b.id,
          time: new Date(b.attributes.starts_on).toLocaleTimeString(),
          currentPlayers: b.attributes.players.length,
          maxPlayers: b.attributes.court.category === 'soccer' ? 22 : 10,
          participants: b.attributes.players.map((player: any) => ({
            name: player.name || 'Jogador desconhecido',
            position: player.position || 'Não especificado',
          })),
          court: b.attributes.court,
        }));
        setPublicBookings(bookings);
      } catch (error) {
        console.error('Erro ao buscar reservas públicas:', error);
        alert('Erro ao carregar reservas públicas.');
      }
    };

    fetchBookings();
  }, []);

  const handleOpenModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Reservas Públicas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {publicBookings.length > 0 ? (
          publicBookings.map((booking) => (
            <div key={booking.id} className="rounded-lg bg-white p-4 shadow-sm">
              <h3 className="font-semibold">{booking.court.name}</h3>
              <p className="text-sm text-gray-600">{booking.court.category}</p>
              <p className="mt-2 text-sm">Horário: {booking.time}</p>
              <div className="mt-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {booking.currentPlayers}/{booking.maxPlayers} Jogadores
                </span>
              </div>
              <button
                onClick={() => handleOpenModal(booking)}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Juntar-se
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Nenhuma reserva pública disponível no momento.</p>
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
