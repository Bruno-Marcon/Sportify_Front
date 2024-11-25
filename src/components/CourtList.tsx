import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getCourts } from '../connection/apiConnection';
import BookingModal from './BookingModal';

interface Court {
  id: string;
  name: string;
  max_Players: number;
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
        const data = await getCourts();

        const formattedCourts = data.map((court) => ({
          id: court.id,
          name: court.name || 'Quadra sem nome',
          max_Players: court.max_Players || 0,
          category: court.category || 'Categoria desconhecida',
          description: court.description || 'Sem descrição',
          price: court.price || 0,
          status: court.status || 'Indisponível',
        }));

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
    setSelectedCourt(court);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p className="text-center text-gray-700">Carregando quadras...</p>
      ) : courts.length === 0 ? (
        <p className="text-center text-gray-700">Nenhuma quadra disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <div
              key={court.id}
              className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{court.name}</h3>
                  <div className="ml-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                    {court.category}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{court.description}</p>
                <div className="mt-4 flex items-center text-gray-600">
                  <Users className="h-5 w-5" />
                  <span className="ml-2 text-sm">Máximo {court.max_Players} jogadores</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-800">
                    <strong>Status:</strong> {court.status}
                  </p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(court.price / 100)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCourtClick(court)}
                className="mt-auto w-full rounded-none rounded-b-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Reservar
              </button>
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
        />
      )}
    </div>
  );
};

export default CourtList;
