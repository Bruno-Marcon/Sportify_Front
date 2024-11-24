import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { getCourts } from '../connection/apiConnection'; // Importa a função para buscar quadras
import BookingModal from './BookingModal'; // Importa o modal de reservas

interface Court {
  id: string;
  name: string;
  sport: string;
  description: string;
  maxPlayers: number;
  availability: string[];
  image: string;
}

const CourtList: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]); // Estado para armazenar as quadras
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null); // Estado para a quadra selecionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts(); // Busca as quadras da API
        const formattedCourts = data.map((court: any) => ({
          id: court.id,
          name: court.attributes.name,
          sport: court.attributes.category,
          description: court.attributes.description, // Adiciona a descrição
          maxPlayers: court.attributes.max_players,
          availability: ['10:00', '11:00', '12:00'], // Exemplo de horários disponíveis
          image: 'https://via.placeholder.com/400', // Imagem padrão
        }));
        setCourts(formattedCourts); // Atualiza o estado com as quadras formatadas
      } catch (error) {
        console.error('Erro ao carregar quadras:', error);
      }
    };

    fetchCourts();
  }, []);

  const handleCourtClick = (court: Court) => {
    setSelectedCourt(court); // Define a quadra selecionada
    setIsModalOpen(true); // Abre o modal
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <div
            key={court.id}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
          >
            <img
              src={court.image}
              alt={court.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{court.name}</h3>
                <p className="text-sm text-gray-600">{court.sport}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-700">{court.description}</p> {/* Exibe a descrição */}
              </div>
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  Máximo {court.maxPlayers} Jogadores
                </span>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">Horários Disponíveis:</p>
                <div className="flex flex-wrap gap-2">
                  {court.availability.map((time) => (
                    <span
                      key={time}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600"
                    >
                      {time}
                    </span>
                  ))}
                </div>
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
