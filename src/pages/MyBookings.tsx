import React from 'react';

interface Booking {
  id: number;
  date: string;
  court: string;
  time: string;
}

const MyBookings: React.FC = () => {
  // Dados fictícios das reservas do usuário
  const bookings: Booking[] = [
    { id: 1, date: '2024-11-24', court: 'Court A', time: '10:00 - 11:00' },
    { id: 2, date: '2024-11-25', court: 'Court B', time: '15:00 - 16:00' },
    { id: 3, date: '2024-11-26', court: 'Court C', time: '12:00 - 13:00' },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
      {bookings.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="flex justify-between rounded-lg border bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-lg font-medium text-gray-900">{booking.court}</p>
                <p className="text-sm text-gray-600">
                  {booking.date} | {booking.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-600">Você não tem reservas ainda.</p>
      )}
    </main>
  );
};

export default MyBookings;
