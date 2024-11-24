import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: {
    id: string;
    name: string;
    availability?: string[]; // Torna `availability` opcional
    maxPlayers: number;
    price: number;
  } | null; // Permite que court seja nulo
  onBookingConfirm: (booking: {
    courtId: string;
    times: string[];
    isPublic: boolean;
  }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  court,
  onBookingConfirm,
}) => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  if (!court) {
    return null; // Não renderiza o modal se a quadra não for válida
  }

  const handleTimeToggle = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time)); // Remove o horário
    } else {
      setSelectedTimes([...selectedTimes, time]); // Adiciona o horário
    }
  };

  const handleBooking = () => {
    if (selectedTimes.length === 0) return;
    onBookingConfirm({
      courtId: court.id,
      times: selectedTimes,
      isPublic,
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedTimes([]);
    setIsPublic(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl transform rounded-2xl bg-white p-8 shadow-lg transition-all sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              {court.name}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Select Times */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o(s) horário(s)
              </label>
              <div className="flex flex-wrap gap-4">
                {court.availability && court.availability.length > 0 ? (
                  court.availability.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeToggle(time)}
                      className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                        selectedTimes.includes(time)
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Nenhum horário disponível.</p>
                )}
              </div>
            </div>

            {/* Booking Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibilidade do agendamento
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={isPublic}
                    onChange={() => setIsPublic(true)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Público</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="bookingType"
                    checked={!isPublic}
                    onChange={() => setIsPublic(false)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Privado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-900">
              Valor: R$ {(court.price / 100).toFixed(2)}/h
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleBooking}
              disabled={selectedTimes.length === 0}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Confirmar Agendamento
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
