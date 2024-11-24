import React from 'react';
import { Users } from 'lucide-react';
import { useStore } from '../store/useStore';

const CourtList: React.FC = () => {
  const { courts, setSelectedCourt, setModalOpen } = useStore();

  const handleCourtClick = (court: typeof courts[0]) => {
    setSelectedCourt(court);
    setModalOpen(true);
  };

  return (
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
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                Máximo  {court.maxPlayers} Jogadores
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
  );
};

export default CourtList;