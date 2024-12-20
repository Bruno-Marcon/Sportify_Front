// src/components/EditCourtModal.tsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Court, CourtUpdateData, CourtUpdateResponse } from '../types/index';
import { updateCourt } from '../connection/apiConnection';

interface EditCourtModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court;
  onUpdate: (updatedCourt: Court) => void;
}

const EditCourtModal: React.FC<EditCourtModalProps> = ({ isOpen, onClose, court, onUpdate }) => {
  const [name, setName] = useState(court.name);
  const [category, setCategory] = useState(court.category);
  const [description, setDescription] = useState(court.description);
  const [maxPlayers, setMaxPlayers] = useState(court.max_players);
  const [price, setPrice] = useState(court.price);
  const [status, setStatus] = useState<string>(court.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Atualizar os estados quando a quadra mudar (útil se a modal for reusada para diferentes quadras)
  useEffect(() => {
    if (isOpen) {
      setName(court.name);
      setCategory(court.category);
      setDescription(court.description);
      setMaxPlayers(court.max_players);
      setPrice(court.price);
      setStatus(court.status);
    }
  }, [isOpen, court]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData: CourtUpdateData = {
      name,
      category,
      description,
      max_players: maxPlayers,
      price,
      status,
    };

    console.log('Dados enviados para atualização da quadra:', updatedData);

    try {
      const response: CourtUpdateResponse = await updateCourt(court.id, updatedData);
      console.log('Quadra atualizada com sucesso:', response);

      // Extrai os dados atualizados da resposta
      const updatedCourt: Court = {
        id: parseInt(response.data.id, 10),
        name: response.data.attributes.name,
        category: response.data.attributes.category,
        description: response.data.attributes.description,
        max_players: response.data.attributes.max_players,
        price: parseFloat(response.data.attributes.price.toString()),
        status: response.data.attributes.status,
      };

      onUpdate(updatedCourt);
      toast.success('Quadra atualizada com sucesso!');
      onClose();
    } catch (error: unknown) {
      console.error('Erro ao atualizar quadra:', error);

      if (error instanceof Error) {
        toast.error(`Erro ao atualizar quadra: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro inesperado ao atualizar a quadra.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar Quadra</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="soccer">Futebol</option>
              <option value="volleyball">Vôlei</option>
              <option value="basketball">Basquete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows={3}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Máximo de Jogadores
            </label>
            <input
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="open">Disponível</option>
              <option value="closed">Fechada</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {isSubmitting ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourtModal;
