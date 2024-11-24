import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { getAvailableTimes, createBooking } from '../connection/apiConnection'; // Certifique-se de que estas funções estejam implementadas corretamente

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: {
    id: string;
    name: string;
    maxPlayers: number;
    price: number;
  } | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, court }) => {
  const [availableTimes, setAvailableTimes] = useState<{ start: string; end: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!court) return;

      setIsLoading(true);

      try {
        const data = await getAvailableTimes(parseInt(court.id, 10));
        console.log('Horários disponíveis:', data);
        setAvailableTimes(data.availableTimes);
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        alert('Erro ao carregar horários disponíveis.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchAvailableTimes();
    }
  }, [court, isOpen]);

  const handleBooking = async () => {
    if (!selectedTime) {
      alert('Selecione um horário para agendar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        startsOn: selectedTime,
        courtId: parseInt(court!.id, 10),
        isPublic,
      };

      console.log('Enviando dados de reserva:', bookingData);

      const response = await createBooking(bookingData);
      console.log('Reserva criada com sucesso:', response);
      alert('Reserva realizada com sucesso!');
      handleClose();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert('Erro ao realizar a reserva. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAvailableTimes([]);
    setSelectedTime(null);
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
              {court?.name}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            {isLoading ? (
              <p className="text-center text-gray-600">Carregando horários disponíveis...</p>
            ) : availableTimes.length > 0 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione um horário
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {availableTimes.map((time) => (
                      <button
                        key={time.start}
                        onClick={() => setSelectedTime(time.start)}
                        className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                          selectedTime === time.start
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {time.start} - {time.end}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Type */}
                <div className="mt-6">
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
              </>
            ) : (
              <p className="text-center text-gray-600">Nenhum horário disponível.</p>
            )}
          </div>

          {/* Price */}
          <div className="mt-6">
            <p className="text-lg font-medium text-gray-900">
              Valor: R$ {(court?.price / 100).toFixed(2)}/h
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
              disabled={!selectedTime || isSubmitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
