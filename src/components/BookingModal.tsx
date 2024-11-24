import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

const BookingModal: React.FC = () => {
  const {
    selectedCourt,
    isModalOpen,
    setModalOpen,
    setSelectedCourt,
    addBooking,
    setShowShareModal,
    setCurrentBookingLink,
  } = useStore();
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]); // Alterado para múltiplos horários
  const [isPublic, setIsPublic] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    setSelectedCourt(null);
    setSelectedTimes([]);
    setIsPublic(true);
  };

  const handleTimeToggle = (time: string) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time)); // Remove o horário se já estiver selecionado
    } else {
      setSelectedTimes([...selectedTimes, time]); // Adiciona o horário se não estiver selecionado
    }
  };

  const handleBooking = () => {
    if (!selectedCourt || selectedTimes.length === 0) return;

    const bookingId = Math.random().toString(36).substr(2, 9);
    const booking = {
      id: bookingId,
      courtId: selectedCourt.id,
      times: selectedTimes, // Salva os horários selecionados
      isPublic,
      maxPlayers: selectedCourt.maxPlayers,
      currentPlayers: 0,
      participants: [],
    };

    const baseUrl = window.location.origin;
    const shareLink = `${baseUrl}/booking/${bookingId}`;

    addBooking(booking);
    setCurrentBookingLink(shareLink);
    handleClose();
    setShowShareModal(true);
  };

  if (!selectedCourt) return null;

  return (
    <Dialog open={isModalOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl transform rounded-2xl bg-white p-8 shadow-lg transition-all sm:p-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
               {selectedCourt.name}
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
                {selectedCourt.availability.map((time) => (
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
                ))}
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
                  <span className="text-gray-700">Publico</span>
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
              Valor: ${selectedCourt.pricePerHour}/h
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
              disabled={selectedTimes.length === 0} // Desabilita se nenhum horário for selecionado
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
