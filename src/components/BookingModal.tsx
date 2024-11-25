import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
import { getAvailableTimes, createBooking } from '../connection/apiConnection';
import { Court, AvailableTimesResponse, CreateBookingResponse } from '../types/index';
import { toast } from 'react-toastify';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court | null;
  onBookingComplete: (bookingLink: string) => void;
}

const Spinner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    className="animate-spin text-emerald-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  court,
  onBookingComplete,
}) => {
  const [availableTimes, setAvailableTimes] = useState<{ start: string; end: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAvailableTimes = async () => {
    if (!court) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data: AvailableTimesResponse = await getAvailableTimes(court.id);
      setAvailableTimes(data.availableTimes);
    } catch (error: unknown) {
      console.error('Erro ao buscar horários disponíveis:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Erro ao carregar horários disponíveis.');
      } else {
        setErrorMessage('Erro ao carregar horários disponíveis.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableTimes();
    }
  }, [court, isOpen]);

  const handleBooking = async () => {
    if (!selectedTime) {
      setErrorMessage('Selecione um horário para agendar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const bookingData = {
        startsOn: selectedTime,
        courtId: court!.id,
        isPublic,
      };

      const response: CreateBookingResponse = await createBooking(bookingData);
      const bookingId = response.data.id;
      const shareToken = response.data.attributes.share_token;
      const shareLink = `${window.location.origin}/bookings/${bookingId}?token=${shareToken}`;

      toast.success('Reserva realizada com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });

      if (onBookingComplete) {
        onBookingComplete(shareLink);
      }

      handleClose();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setErrorMessage('Erro ao realizar a reserva. Tente novamente.');
      toast.error('Erro ao realizar a reserva. Tente novamente.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAvailableTimes([]);
    setSelectedTime(null);
    setIsPublic(true);
    setErrorMessage(null);
    onClose();
  };

  const formattedPrice = court
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(court.price)
    : '';

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-2xl font-semibold">{court?.name}</Dialog.Title>
            <button
              onClick={handleClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : availableTimes.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Horários Disponíveis:</label>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time.start}
                      onClick={() => setSelectedTime(time.start)}
                      className={`px-4 py-2 rounded-lg text-sm ${
                        selectedTime === time.start
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {time.start} - {time.end}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center">Nenhum horário disponível.</p>
            )}
          </div>

          <div className="mt-6">
            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="text-sm font-medium text-gray-700">
                  Visibilidade do agendamento
                </Switch.Label>
                <Switch
                  checked={isPublic}
                  onChange={setIsPublic}
                  className={`${
                    isPublic ? 'bg-emerald-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </div>

          <div className="mt-6">
            <p className="text-lg font-medium">Valor: {formattedPrice}/h</p>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedTime || isSubmitting}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal;
