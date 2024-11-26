import React, { useEffect, useState } from 'react';
import { Clock, Users2, Calendar, AlertCircle } from 'lucide-react';
import { getBookings } from '../connection/apiConnection';
import { Booking } from '../types';
import { BookingsGridSkeleton } from '../components/BookingSkeleton';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'agendado':
      return 'bg-green-100 text-green-700';
    case 'concluido':
      return 'bg-blue-100 text-blue-700';
    case 'pendente':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200">
      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{booking.name}</h3>
          <span
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(
              booking.status || 'pendente'
            )}`}
          >
            {booking.status || 'Pendente'}
          </span>
        </div>
        <div className="text-gray-400">
          <Users2 className="w-6 h-6" />
        </div>
      </div>

      <div className="p-4 text-gray-600 space-y-2 border-t">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <span>{formatDate(booking.startsOn)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <span>
            {formatTime(booking.startsOn)} - {formatTime(booking.endsOn)}
          </span>
        </div>
        <p className="text-sm">
          <span className="font-medium">Participantes:</span>{' '}
          {booking.participants.map((p) => p.name).join(', ')}
        </p>
        <p className="text-sm">
          <span className="font-medium">Valor:</span>{' '}
          <span className="text-green-700 font-semibold">
            R$ {booking.totalValue?.toFixed(2)}
          </span>
        </p>
      </div>

      <div className="p-4 flex justify-between items-center border-t">
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
          Gerenciar
        </button>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition">
          Editar
        </button>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Calendar className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg">Você não tem reservas ainda.</p>
      <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
        Fazer Nova Reserva
      </button>
    </div>
  );
};

const ErrorState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-64 text-red-600 gap-2">
      <AlertCircle className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getBookings();
        setBookings(response.bookings);
      } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        setError('Não foi possível carregar suas reservas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Minhas Reservas</h1>
          <p className="text-gray-500 mt-2">Gerencie suas reservas de quadras esportivas</p>
        </header>

        {isLoading ? (
          <BookingsGridSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : bookings.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
};

export default MyBookings;
