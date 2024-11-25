import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { fetchPublicBookings } from '../connection/apiConnection';
import JoinModal from './JoinModal';

interface Participant {
  name: string;
  position: string;
}

interface Court {
  id: string;
  name: string;
  category: string;
}

interface Booking {
  id: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  participants: Participant[];
  court: Court;
  status: string;
}

const PublicBookings: React.FC = () => {
  const [publicBookings, setPublicBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetchPublicBookings();
        const bookings: Booking[] = response.data.map(
          (b: { id: string; attributes: any }) => ({
            id: b.id,
            time: new Date(b.attributes.starts_on).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            currentPlayers: b.attributes.players.length,
            maxPlayers:
              b.attributes.court.category === 'soccer' ? 22 : b.attributes.court.max_players,
            participants: b.attributes.players.map(
              (player: { name: string; position: string }) => ({
                name: player.name || 'Jogador desconhecido',
                position: player.position || 'Não especificado',
              })
            ),
            court: {
              id: b.attributes.court.id,
              name: b.attributes.court.name,
              category: b.attributes.court.category,
            },
            status: b.attributes.status,
          })
        );
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
    <section className="mt-12 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Reservas Públicas</h2>
          <p className="mt-2 text-gray-600">
            Junte-se a jogos públicos e conheça novos jogadores!
          </p>
        </div>
        {publicBookings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicBookings.map((booking) => (
              <div
                key={booking.id}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">{booking.court.name}</h3>
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
                  <p className="text-sm text-gray-600 capitalize">{booking.court.category}</p>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Horário: {booking.time}
                  </p>
                  <div className="mt-2 flex items-center text-gray-600">
                    <Users className="h-5 w-5" />
                    <span className="ml-2 text-sm">
                      {booking.currentPlayers}/{booking.maxPlayers} Jogadores
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenModal(booking)}
                    className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    Juntar-se
                  </button>
                </div>
              </div>
            ))}
          </div>
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
    </section>
  );
};

export default PublicBookings;
