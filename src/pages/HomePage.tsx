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
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Exibir Skeleton ou WelcomeHeader */}
            {isLoading ? <WelcomeHeaderSkeleton /> : <WelcomeHeader />}

            <div className="flex justify-center space-x-4 my-6">
              <button
                onClick={() => setActiveSection('bookings')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'bookings'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reservas Agendadas
              </button>
              <button
                onClick={() => setActiveSection('courtsBookings')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeSection === 'courtsBookings'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Reservas Concluídas
              </button>
            </div>

            {activeSection === 'bookings' && <MyBookings />}
            {activeSection === 'courtsBookings' && <CourtsBookings />}
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
