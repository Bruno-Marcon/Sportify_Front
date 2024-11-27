import React, { useState, useEffect } from 'react';
import BookingModal from '../components/BookingModal';
import ShareModal from '../components/ShareModal';
import { CourtsBookings, MyBookings } from '../components/MyBookings';
import WelcomeHeader from '../components/WelcomeHeader';
import { WelcomeHeaderSkeleton } from '../components/skeleton/WelcomeHeaderSkeleton'; // Import do Skeleton

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'bookings' | 'courtsBookings'>('bookings'); // Tipo explícito
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  // Simular carregamento (substituir pela lógica real se necessário)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Carregamento falso por 2 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-full sm:max-w-4xl mx-auto">
            {/* Exibir Skeleton ou WelcomeHeader */}
            {isLoading ? <WelcomeHeaderSkeleton /> : <WelcomeHeader />}

            <div className="flex flex-wrap justify-center sm:justify-start space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 my-6">
              <button
                onClick={() => setActiveSection('bookings')}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'bookings'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reservas Agendadas
              </button>
              <button
                onClick={() => setActiveSection('courtsBookings')}
                className={`w-full sm:w-auto px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'courtsBookings'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reservas Concluídas
              </button>
            </div>

            <div className="mt-6">
              {activeSection === 'bookings' && <MyBookings />}
              {activeSection === 'courtsBookings' && <CourtsBookings />}
            </div>
          </div>
        </main>
      </div>

      {/* Modais */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>

  );
};

export default HomePage;
