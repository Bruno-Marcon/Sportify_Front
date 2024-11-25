import React, { useEffect, useState } from 'react';
import { Clock, Users2, Calendar, AlertCircle } from 'lucide-react';
import { getBookings } from '../connection/apiConnection';
import { Booking } from '../types';
import { BookingsGridSkeleton } from '../components/BookingSkeleton';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'agendado':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'concluido':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{booking.courtId.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 border ${getStatusColor(booking.status)}`}>
              {booking.status || 'Pendente'}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Users2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>{formatDate(booking.startsOn)}</span>
            <span className="text-gray-300">|</span>
            <span>{formatTime(booking.startsOn)} - {formatTime(booking.endsOn)}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="mb-1">
              <span className="font-medium">Participantes:</span>{' '}
              {booking.participants.map(p => p.name).join(', ')}
            </p>
            <p>
              <span className="font-medium">Valor:</span>{' '}
              <span className="text-emerald-700 font-semibold">
                R$ {booking.totalValue?.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Gerenciar
          </button>
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Calendar className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg">Você não tem reservas ainda.</p>
      <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
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
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Reservas</h1>
          <p className="text-gray-500 mt-2">Gerencie suas reservas de quadras esportivas</p>
        </header>

        {isLoading ? (
          <BookingsGridSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : bookings.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
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