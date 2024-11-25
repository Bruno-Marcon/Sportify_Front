import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Copy, Check, X, Send } from 'lucide-react';
import { toast } from 'react-toastify';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingLink: string;
  location: string;
  date: string;
  time: string;
  service: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, bookingLink, location, date, time}) => {
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

  const whatsappMessage = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎉 *Convite Especial para Você!*\n\n` +
    `Olá, gostaríamos de convidá-lo para praticar um esporte! Veja os detalhes do evento abaixo:\n\n` +
    `🏢 *Local*: ${location}\n` +
    `📆 *Data*: ${date}\n` +
    `⏰ *Hora*: ${time}\n\n` +
    `🔗 Para confirmar sua presença ou obter mais informações, clique no link abaixo:\n${bookingLink}\n\n` +
    `✨ Lembre de confirmar antes que as vagas acabem!\n` +
    `💼 Com carinho da equipe Sportify, sua parceira de confiança em esportes!`
  )}`;
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between border-b pb-4">
            <Dialog.Title className="text-xl font-semibold">Compartilhar Agendamento</Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

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
            <div className="mt-4">
              <a
                href={whatsappMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
              >
                <Send className="h-4 w-4" />
                Enviar pelo WhatsApp
              </a>
            </div>
          </div>

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
