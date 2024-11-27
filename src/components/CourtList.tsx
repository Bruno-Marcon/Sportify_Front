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

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 10;

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getCourts(currentPage, limit);
        setCourts(data.courts);
        setTotalPages(data.meta.totalPages);
        setTotalCount(data.meta.totalCount);
      } catch (error) {
        console.error('Erro ao carregar quadras:', error);
        setErrorMessage('Erro ao carregar quadras. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourts();
  }, [currentPage]);

  const handleBookingComplete = (bookingLink: string) => {
    setShareModalLink(bookingLink);
    setIsModalOpen(false);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const maxPageButtons = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
      </div>
  
      {isLoading ? (
        <p className="text-center text-gray-700">Carregando quadras...</p>
      ) : errorMessage ? (
        <p className="text-center text-red-500">{errorMessage}</p>
      ) : courts.length === 0 ? (
        <p className="text-center text-gray-700">Nenhuma quadra disponível no momento.</p>
      ) : (
        <>
          {/* Grid ajustado para responsividade */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courts.map((court) => (
              <div
                key={court.id}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{court.name}</h3>
                    <div className="ml-2 rounded-full bg-emerald-600 px-3 py-1 text-xs sm:text-sm font-medium text-white">
                      {court.category}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{court.description}</p>
                  <div className="mt-4 flex items-center text-gray-600">
                    <span className="ml-2 text-sm">Máximo {court.max_players} jogadores</span>
                  </div>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-800">
                      <strong>Status:</strong> {court.status === 'open' ? 'Disponível' : 'Fechada'}
                    </p>
                    <p className="text-lg font-semibold text-emerald-600 mt-2 sm:mt-0">
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
  
          {/* Navegação por páginas responsiva */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-600">
              Mostrando {courts.length} de {totalCount} quadras
            </p>
            <div className="flex flex-wrap items-center justify-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Anterior
              </button>
  
              <div className="flex space-x-2 overflow-x-auto">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageSelect(page)}
                    className={`px-3 py-1 rounded ${
                      page === currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
  
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        </>
      )}
  
      {/* Modais */}
      {isModalOpen && selectedCourt && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          court={selectedCourt}
          onBookingComplete={handleBookingComplete}
        />
      )}
  
      {shareModalLink && selectedCourt && (
        <ShareModal
          isOpen={!!shareModalLink}
          onClose={() => setShareModalLink(null)}
          bookingLink={shareModalLink}
          date={new Date().toLocaleDateString('pt-BR')}
          time={'19:00'}
          service={selectedCourt.name || 'Serviço não informado'}
        />
      )}
    </div>
  );
};

export default CourtList;
