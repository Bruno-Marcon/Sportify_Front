import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import ShareModal from '../components/ShareModal';
import MyBookings from '../components/MyBookings';
import PublicBookings from '../components/PublicBookings';
import WelcomeHeader from '../components/WelcomeHeader';

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('bookings');
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <WelcomeHeader />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeSection === 'bookings' && 'Minhas Reservas'}
                {activeSection === 'courts' && 'Quadras Disponíveis'}
              </h2>
              <div className="flex gap-4">
                {activeSection === 'courts' && (
                  <>
                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition"
                    >
                      <Filter className="h-5 w-5 mr-2" />
                      Filtrar
                    </button>
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Nova Reserva
                    </button>
                  </>
                )}
              </div>
            </div>
            {activeSection === 'bookings' && <MyBookings />}
          </div>
        </main>
        <PublicBookings />
      </div>

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