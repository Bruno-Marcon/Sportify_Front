import React, { useEffect, useState } from 'react';
import { Clock, Users2, Calendar, AlertCircle } from 'lucide-react';
import { getBookings, getCourts } from '../connection/apiConnection';
import { Booking, Court } from '../types';
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

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
    <Calendar className="w-12 h-12 mb-4 text-gray-400" />
    <p className="text-lg">Nenhuma reserva disponível.</p>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-64 text-red-600 gap-2">
    <AlertCircle className="w-5 h-5" />
    <p>{message}</p>
  </div>
);

const BookingCard: React.FC<{ booking: Booking; courtName: string }> = ({ booking, courtName }) => (
  <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 relative">
    {/* Status no canto superior direito */}
    <span
      className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(
        booking.status || 'pendente'
      )}`}
    >
      {booking.status || 'Pendente'}
    </span>

    <div className="p-4 flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{courtName}</h3>
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
        {booking.participants.length}
      </p>
      <p className="text-sm">
        <span className="font-medium">Valor:</span>{' '}
        <span className="text-green-700 font-semibold">
        {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(booking?.totalValue ?? 0 / 100)}
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

const UnifiedBookings: React.FC<{ activeSection: 'agendado' | 'concluido' }> = ({
  activeSection,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Busca quadras e reservas em paralelo
        const [courtsResponse, bookingsResponse] = await Promise.all([getCourts(), getBookings()]);

        setCourts(courtsResponse.courts);
        setBookings(bookingsResponse.bookings);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtra as reservas conforme a seção ativa
  const filteredBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === activeSection
  );

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeSection === 'agendado' ? 'Minhas Reservas' : 'Reservas Concluídas'}
          </h1>
          <p className="text-gray-500 mt-2">
            Exibindo reservas com status "{activeSection === 'agendado' ? 'Agendado' : 'Concluído'}"
          </p>
        </header>

        {isLoading ? (
          <BookingsGridSkeleton />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredBookings.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">
            {filteredBookings.map((booking) => {
              const courtName =
                courts.find((court) => court.id === booking.courtId)?.name || 'Quadra Desconhecida';
              return <BookingCard key={booking.id} booking={booking} courtName={courtName} />;
            })}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
};

const MyBookings: React.FC = () => <UnifiedBookings activeSection="agendado" />;
const CourtsBookings: React.FC = () => <UnifiedBookings activeSection="concluido" />;

export { MyBookings, CourtsBookings };
