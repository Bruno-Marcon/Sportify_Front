import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import CourtList from '../components/CourtList';
import BookingModal from '../components/BookingModal';
import ShareModal from '../components/ShareModal';
import PublicBookings from '../components/PublicBookings';

const HomePage: React.FC = () => {
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  return (
    <main className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quadras Disponíveis</h1>
        <div className="mt-4 flex gap-4 sm:mt-0">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filtrar
          </button>
        </div>
      </div>
      <CourtList />
      <PublicBookings />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </main>
  );
};

export default HomePage;
