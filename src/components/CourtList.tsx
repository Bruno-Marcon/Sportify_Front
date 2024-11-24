import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getCourts } from '../connection/apiConnection'; // Importa a função para buscar quadras
import BookingModal from './BookingModal'; // Importa o modal de reservas

interface Court {
  id: string;
  name: string;
  maxPlayers: number;
  category: string;
  description: string;
  price: number;
  status: string;
}

const CourtList: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        console.log('Iniciando a busca pelas quadras...');
        const data = await getCourts();

        console.log('Dados recebidos da API:', data);

        const formattedCourts = data.map((court) => ({
          id: court.id,
          name: court.name || 'Quadra sem nome',
          maxPlayers: court.maxPlayers || 0,
          category: court.category || 'Categoria desconhecida',
          description: court.description || 'Sem descrição',
          price: court.price || 0,
          status: court.status || 'Indisponível',
        }));

        console.log('Quadras formatadas:', formattedCourts);
        setCourts(formattedCourts);
      } catch (error) {
        console.error('Erro ao carregar quadras:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleCourtClick = (court: Court) => {
    console.log('Quadra selecionada:', court);
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  const handleBookingConfirm = (bookingData: { courtId: string; times: string[]; isPublic: boolean }) => {
    console.log('Reserva confirmada:', bookingData);
    setIsModalOpen(false);
  };

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-700">Carregando quadras...</p>
      ) : courts.length === 0 ? (
        <p className="text-center text-gray-700">Nenhuma quadra disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <div
              key={court.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
                  <p className="text-sm text-gray-600">{court.category}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-700">{court.description}</p>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Máximo {court.maxPlayers} Jogadores
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">
                    <strong>Status:</strong> {court.status}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-800">
                    <strong>Preço:</strong> R$ {(court.price / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleCourtClick(court)}
                  className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Reservar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Reserva */}
      {isModalOpen && selectedCourt && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          court={selectedCourt}
          onBookingConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default CourtList;
