import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import JoinModal from './JoinModal';

const PublicBookings: React.FC = () => {
  const { bookings, courts } = useStore();
  const publicBookings = bookings.filter((booking) => booking.isPublic);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedCourt, setSelectedCourt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (booking: any, court: any) => {
    setSelectedBooking(booking);
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Reservas Públicas</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {publicBookings.map((booking) => {
          const court = courts.find((c) => c.id === booking.courtId);
          if (!court) return null;

          return (
            <div
              key={booking.id}
              className="rounded-lg bg-white p-4 shadow-sm"
            >
              <h3 className="font-semibold">{court.name}</h3>
              <p className="text-sm text-gray-600">{court.sport}</p>
              <p className="mt-2 text-sm">Horário: {booking.time}</p>
              <div className="mt-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {booking.currentPlayers}/{booking.maxPlayers} Jogadores
                </span>
              </div>
              <button
                onClick={() => handleOpenModal(booking, court)}
                className="mt-3 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Entrar
              </button>
            </div>
          );
        })}
      </div>

      {selectedBooking && selectedCourt && (
        <JoinModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          booking={selectedBooking}
          court={selectedCourt}
        />
      )}
    </div>
  );
};

export default PublicBookings;
