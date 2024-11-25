import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Copy, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingLink: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, bookingLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      toast.success('Link copiado com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast.error('Erro ao copiar link. Tente novamente.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Fundo escuro */}
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      {/* Container do modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-xl font-semibold">Compartilhar Agendamento</Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Use o link abaixo para compartilhar o agendamento com outros participantes:
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3">
              <input
                type="text"
                readOnly
                value={bookingLink}
                className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareModal;
