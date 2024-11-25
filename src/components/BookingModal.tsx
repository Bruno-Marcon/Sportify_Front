import React, { useState, useEffect } from 'react';
import { Dialog, Switch } from '@headlessui/react';
import { X, AlertCircle } from 'lucide-react';
import { getAvailableTimes, createBooking } from '../connection/apiConnection';
import ShareModal from './ShareModal';

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

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, court }) => {
  const [availableTimes, setAvailableTimes] = useState<{ start: string; end: string }[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [bookingLink, setBookingLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!court) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data = await getAvailableTimes(parseInt(court.id, 10));
        setAvailableTimes(data.availableTimes);
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        setErrorMessage('Erro ao carregar horários disponíveis.');
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
      setErrorMessage('Selecione um horário para agendar.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const bookingData = {
        startsOn: selectedTime,
        courtId: parseInt(court!.id, 10),
        isPublic,
      };

      const response = await createBooking(bookingData);
      const shareLink = `${window.location.origin}/bookings/${response.id}`;
      setBookingLink(shareLink);
      setShowShareModal(true);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setErrorMessage('Erro ao realizar a reserva. Tente novamente.');
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
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
        court.price / 100
      )
    : '';

  return (
    <>
      {/* Modal de Agendamento */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Fundo escuro */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        {/* Container do modal */}
        <div className="flex min-h-screen items-center justify-center px-4 py-6">
          {/* Painel do modal */}
          <Dialog.Panel className="mx-auto w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between border-b pb-4">
              <Dialog.Title className="text-2xl font-semibold text-gray-900">
                {court?.name}
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <span className="sr-only">Fechar</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 mb-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
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
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Selecione um horário
                  </label>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {availableTimes.map((time) => (
                      <button
                        key={time.start}
                        onClick={() => setSelectedTime(time.start)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
              ) : (
                <p className="text-center text-gray-600">Nenhum horário disponível.</p>
              )}
            </div>

            <div className="mt-6">
              <Switch.Group>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <Switch.Label className="mb-2 text-sm font-medium text-gray-700 sm:mb-0">
                    Visibilidade do agendamento
                  </Switch.Label>
                  <Switch
                    checked={isPublic}
                    onChange={setIsPublic}
                    className={`${
                      isPublic ? 'bg-emerald-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  >
                    <span
                      className={`${
                        isPublic ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                <Switch.Description className="mt-2 text-sm text-gray-500">
                  {isPublic
                    ? 'Seu agendamento será público.'
                    : 'Seu agendamento será privado.'}
                </Switch.Description>
              </Switch.Group>
            </div>

            <div className="mt-6">
              <p className="text-lg font-medium text-gray-900">Valor: {formattedPrice}/h</p>
            </div>

            <div className="mt-8 flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-end">
              <button
                onClick={handleClose}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 sm:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleBooking}
                disabled={!selectedTime || isSubmitting}
                className="w-full flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size={20} />
                    <span className="ml-2">Enviando...</span>
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal de Compartilhamento */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        bookingLink={bookingLink || ''}
      />
    </>
  );
};

export default BookingModal;
