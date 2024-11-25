// src/components/CourtList.tsx

import React, { useState, useEffect } from 'react';
import { getCourts } from '../connection/apiConnection';
import BookingModal from './BookingModal';
import ShareModal from './ShareModal';
import { Court } from '../types/index';

const CourtList: React.FC = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareModalLink, setShareModalLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getCourts();
        setCourts(data);
      } catch (error) {
        console.error('Erro ao carregar quadras:', error);
        setErrorMessage('Erro ao carregar quadras. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const handleBookingComplete = (bookingLink: string) => {
    setShareModalLink(bookingLink);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <p className="text-center text-gray-700">Carregando quadras...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-500">{errorMessage}</p>
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
                  <span className="ml-2 text-sm">Máximo {court.maxPlayers} jogadores</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm text-gray-800">
                    <strong>Status:</strong> {court.status === 'open' ? 'Disponível' : 'Fechada'}
                  </p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(court.price)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedCourt(court);
                  setIsModalOpen(true);
                }}
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
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Modal de Compartilhamento */}
      {shareModalLink && (
        <ShareModal
          isOpen={!!shareModalLink}
          onClose={() => setShareModalLink(null)}
          bookingLink={shareModalLink}
        />
      )}
    </div>
  );
};

export default CourtList;
