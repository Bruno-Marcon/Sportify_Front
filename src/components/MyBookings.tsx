import React, { useEffect, useState } from 'react';
import { Clock, Users2, Calendar, AlertCircle } from 'lucide-react';
import { fetchUserInformation } from '../connection/apiConnection';
import { BookingAttributes, Court3, UserInformationResponse } from '../types';
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

const BookingCard: React.FC<{ booking: BookingAttributes; court: Court3 }> = ({ booking, court }) => {
  if (!booking || !court) {
    console.error('Dados inválidos recebidos no BookingCard:', { booking, court });
    return null; // Retorna nulo se os dados estiverem inválidos
  }

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 relative">
      <span
        className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 text-sm font-medium rounded-lg ${getStatusColor(
          booking.status
        )}`}
      >
        {booking.status || 'Pendente'}
      </span>

      <div className="p-4 flex justify-between items-start">
        <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
        <div className="text-gray-400">
          <Users2 className="w-6 h-6" />
        </div>
      </div>

      <div className="p-4 text-gray-600 space-y-2 border-t">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          <span>{formatDate(booking.starts_on)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          <span>
            {formatTime(booking.starts_on)} - {formatTime(booking.ends_on)}
          </span>
        </div>
        <p className="text-sm">
          <span className="font-medium">Participantes:</span> {booking.players?.length || 0}
        </p>
        <p className="text-sm">
          <span className="font-medium">Valor:</span>{' '}
          <span className="text-green-700 font-semibold">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(booking.total_value / 100)}
          </span>
        </p>
      </div>
    </div>
  );
};

const UnifiedBookings: React.FC<{ activeSection: 'agendado' | 'concluido' }> = ({
  activeSection,
}) => {
  const [bookings, setBookings] = useState<BookingAttributes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        console.log('Iniciando busca de informações do usuário...');
        const userInfo: UserInformationResponse = await fetchUserInformation();
  
        console.log('Resposta do backend para informações do usuário:', userInfo);
  
        if (!userInfo.data || userInfo.data.length === 0) {
          throw new Error('Nenhuma informação do usuário foi retornada pelo backend.');
        }
  
        // ID do usuário logado
        const userId = userInfo.data[0]?.attributes?.user?.id;
        if (!userId) {
          throw new Error('ID do usuário não encontrado na resposta do backend.');
        }
  
        console.log('ID do usuário logado:', userId);
  
        // Filtrar as reservas associadas ao usuário logado
        const userBookings = userInfo.data.map((bookingData) => ({
          ...bookingData.attributes,
          id: bookingData.id, // Inclua o ID da reserva no mapeamento
          court: bookingData.attributes.court, // Inclua o campo court corretamente
        }))
  
        console.log('Reservas filtradas para o usuário logado:', userBookings);
  
        setBookings(userBookings);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  const filteredBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === activeSection
  );

  console.log('Reservas exibidas para a seção ativa:', filteredBookings);

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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              console.log('Dados da reserva sendo passados para BookingCard:', booking);
              return <BookingCard key={booking.id} booking={booking} court={booking.court} />;
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
