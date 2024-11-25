// src/components/Admin.tsx

import React, { useState, useContext, useEffect } from 'react';
import { Plus, Calendar, Edit2, Trash2, Filter } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getCourts, createCourt, deleteCourt, getBookings, deleteBooking } from '../connection/apiConnection';
import EditCourtModal from './EditCourtModal';
import { Court, Booking } from '../types/index';

const Admin: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [courts, setCourts] = useState<Court[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAddingCourt, setIsAddingCourt] = useState(false);
  const [activeTab, setActiveTab] = useState<'courts' | 'reservations'>('courts');
  const [isLoadingCourts, setIsLoadingCourts] = useState<boolean>(false);
  const [errorCourts, setErrorCourts] = useState<string | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);
  const [editingCourt, setEditingCourt] = useState<Court | null>(null);

  // Estados para paginação das Quadras
  const [currentPageCourts, setCurrentPageCourts] = useState<number>(1);
  const [totalPagesCourts, setTotalPagesCourts] = useState<number>(1);
  const [totalCountCourts, setTotalCountCourts] = useState<number>(0);
  const limitCourts = 10; // Número de itens por página

  // Estados para paginação das Reservas
  const [currentPageBookings, setCurrentPageBookings] = useState<number>(1);
  const [totalPagesBookings, setTotalPagesBookings] = useState<number>(1);
  const [totalCountBookings, setTotalCountBookings] = useState<number>(0);
  const limitBookings = 10; // Número de itens por página

  useEffect(() => {
    const fetchCourtsData = async () => {
      setIsLoadingCourts(true);
      setErrorCourts(null);
      try {
        const courtsData = await getCourts(currentPageCourts, limitCourts);
        console.log('Quadras recebidas:', courtsData); // Log das quadras recebidas
        if ('courts' in courtsData && Array.isArray(courtsData.courts)) {
          setCourts(courtsData.courts);
          setTotalPagesCourts(courtsData.meta.totalPages);
          setTotalCountCourts(courtsData.meta.totalCount);
        } else {
          throw new Error('Estrutura de dados inesperada para quadras.');
        }
      } catch (error: unknown) {
        console.error('Erro ao buscar quadras:', error);
        if (error instanceof Error) {
          setErrorCourts('Erro ao carregar quadras. ' + error.message);
        } else {
          setErrorCourts('Erro ao carregar quadras. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoadingCourts(false);
      }
    };

    const fetchBookingsData = async () => {
      setIsLoadingBookings(true);
      setErrorBookings(null);
      try {
        const bookingsData = await getBookings(currentPageBookings, limitBookings);
        console.log('Dados das reservas recebidos:', bookingsData); // Log para depuração
        if ('bookings' in bookingsData && Array.isArray(bookingsData.bookings)) {
          setBookings(bookingsData.bookings);
          setTotalPagesBookings(bookingsData.meta.totalPages);
          setTotalCountBookings(bookingsData.meta.totalCount);
        } else {
          throw new Error('Estrutura de dados inesperada para reservas.');
        }
      } catch (error: unknown) {
        console.error('Erro ao buscar reservas:', error);
        if (error instanceof Error) {
          setErrorBookings('Erro ao carregar reservas. ' + error.message);
        } else {
          setErrorBookings('Erro ao carregar reservas. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchCourtsData();
    fetchBookingsData();
  }, [currentPageCourts, currentPageBookings]);

  // Funções de Paginação para Quadras
  const handlePreviousPageCourts = () => {
    setCurrentPageCourts((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPageCourts = () => {
    setCurrentPageCourts((prev) => Math.min(prev + 1, totalPagesCourts));
  };

  const handlePageSelectCourts = (page: number) => {
    setCurrentPageCourts(page);
  };

  const getPageNumbersCourts = () => {
    const maxPageButtons = 5;
    let startPage = Math.max(currentPageCourts - Math.floor(maxPageButtons / 2), 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPagesCourts) {
      endPage = totalPagesCourts;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  // Funções de Paginação para Reservas
  const handlePreviousPageBookings = () => {
    setCurrentPageBookings((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPageBookings = () => {
    setCurrentPageBookings((prev) => Math.min(prev + 1, totalPagesBookings));
  };

  const handlePageSelectBookings = (page: number) => {
    setCurrentPageBookings(page);
  };

  const getPageNumbersBookings = () => {
    const maxPageButtons = 5;
    let startPage = Math.max(currentPageBookings - Math.floor(maxPageButtons / 2), 1);
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPagesBookings) {
      endPage = totalPagesBookings;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  };

  // Função para adicionar uma nova quadra via API
  const handleAddCourt = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const maxPlayers = parseInt(formData.get('maxPlayers') as string, 10);
    const price = parseFloat(formData.get('price') as string);

    if (!name || !category || !description || isNaN(maxPlayers) || isNaN(price)) {
      toast.error('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // Preparar os dados com os nomes corretos
    const courtData = {
      name,
      category,
      description,
      max_players: maxPlayers, // Ajuste para snake_case
      price,
      status: 'open', // Padrão ou permitir selecionar
    };

    console.log('Dados enviados para criação da quadra:', courtData); // Log dos dados enviados

    try {
      const newCourt = await createCourt(courtData);
      console.log('Quadra criada com sucesso:', newCourt); // Log da resposta bem-sucedida
      // Se estiver na última página e houver espaço, adicionar, caso contrário, recarregar a página
      if (courts.length < limitCourts) {
        setCourts((prevCourts) => [...prevCourts, newCourt]);
      } else {
        setCurrentPageCourts(totalPagesCourts + 1); // Vai para a nova página onde a quadra foi adicionada
      }
      setTotalCountCourts((prevCount) => prevCount + 1);
      setIsAddingCourt(false);
      toast.success('Quadra adicionada com sucesso!');
      form.reset();
    } catch (error: unknown) {
      console.error('Erro ao adicionar quadra:', error);

      if (error instanceof Error) {
        toast.error(`Erro ao adicionar quadra: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro inesperado ao adicionar a quadra.');
      }
    }
  };

  // Função para abrir o modal de edição
  const openEditModal = (court: Court) => {
    setEditingCourt(court);
  };

  // Função para fechar o modal de edição
  const closeEditModal = () => {
    setEditingCourt(null);
  };

  // Função para atualizar a quadra após edição
  const handleUpdateCourt = (updatedCourt: Court) => {
    setCourts((prevCourts) =>
      prevCourts.map((c) => (c.id === updatedCourt.id ? updatedCourt : c))
    );
  };

  // Função para excluir uma quadra via API
  const handleDeleteCourt = async (courtId: number) => { // Alterado para number
    if (window.confirm('Tem certeza que deseja excluir esta quadra?')) {
      try {
        await deleteCourt(courtId);
        setCourts((prevCourts) => prevCourts.filter((court) => court.id !== courtId));
        setTotalCountCourts((prevCount) => prevCount - 1);
        toast.success('Quadra excluída com sucesso!');
      } catch (error: unknown) {
        console.error('Erro ao excluir quadra:', error);
        if (error instanceof Error) {
          toast.error(`Erro ao excluir quadra: ${error.message}`);
        } else {
          toast.error('Ocorreu um erro inesperado ao excluir a quadra.');
        }
      }
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await deleteBooking(bookingId);
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        setTotalCountBookings((prevCount) => prevCount - 1);
        toast.success('Reserva excluída com sucesso!');
      } catch (error: unknown) {
        console.error('Erro ao excluir reserva:', error);
        if (error instanceof Error) {
          toast.error(`Erro ao excluir reserva: ${error.message}`);
        } else {
          toast.error('Ocorreu um erro inesperado ao excluir a reserva.');
        }
      }
    }
  };

  console.log('Quadras no estado:', courts);

  return (
    <div className="p-6">
    
      <div className="mb-4 text-right text-gray-600">
        {user && <span>Papel: {user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Quadras</h1>
          <p className="text-gray-600">Gerencie suas quadras e visualize as reservas</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('courts')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'courts'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Quadras
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'reservations'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reservas
          </button>
        </div>
      </div>

      {activeTab === 'courts' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setIsAddingCourt(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
              Adicionar Quadra
            </button>
            <button className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">
              <Filter size={20} />
              Filtrar
            </button>
          </div>

          {isLoadingCourts ? (
            <p className="text-center text-gray-700">Carregando quadras...</p>
          ) : errorCourts ? (
            <p className="text-center text-red-500">{errorCourts}</p>
          ) : courts.length === 0 ? (
            <p className="text-center text-gray-700">Nenhuma quadra disponível no momento.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courts.map((court) => (
                  <div
                    key={court.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{court.name}</h3>
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mt-2">
                          {court.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                          onClick={() => openEditModal(court)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          onClick={() => handleDeleteCourt(court.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <p>Máximo {court.max_players} jogadores</p>
                      <p>Status: {court.status === 'open' ? 'Disponível' : 'Fechada'}</p>
                      <p className="text-xl font-semibold text-green-600">
                        R$ {court.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-600">
                  Mostrando {courts.length} de {totalCountCourts} quadras
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousPageCourts}
                    disabled={currentPageCourts === 1}
                    className={`px-4 py-2 rounded ${
                      currentPageCourts === 1
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Anterior
                  </button>

                  <div className="flex space-x-2">
                    {getPageNumbersCourts().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageSelectCourts(page)}
                        className={`px-3 py-1 rounded ${
                          page === currentPageCourts
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPageCourts}
                    disabled={currentPageCourts === totalPagesCourts}
                    className={`px-4 py-2 rounded ${
                      currentPageCourts === totalPagesCourts
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'reservations' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => {/* Implementar funcionalidade de adicionar reserva */}}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Adicionar Reserva
            </button>
            <button className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100">
              <Filter size={20} />
              Filtrar
            </button>
          </div>

          {isLoadingBookings ? (
            <p className="text-center text-gray-700">Carregando reservas...</p>
          ) : errorBookings ? (
            <p className="text-center text-red-500">{errorBookings}</p>
          ) : bookings.length === 0 ? (
            <p className="text-center text-gray-700">Nenhuma reserva disponível no momento.</p>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quadra
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Início
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Participantes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {courts.find((c) => c.id === booking.courtId)?.name || 'Quadra Desconhecida'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(booking.startsOn).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(booking.endsOn).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.participants.map((p) => p.name).join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.status || 'Pendente'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <Calendar size={18} />
                              </button>
                              <button
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                onClick={() => handleDeleteBooking(booking.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center space-y-4">
                <p className="text-sm text-gray-600">
                  Mostrando {bookings.length} de {totalCountBookings} reservas
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePreviousPageBookings}
                    disabled={currentPageBookings === 1}
                    className={`px-4 py-2 rounded ${
                      currentPageBookings === 1
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Anterior
                  </button>

                  <div className="flex space-x-2">
                    {getPageNumbersBookings().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageSelectBookings(page)}
                        className={`px-3 py-1 rounded ${
                          page === currentPageBookings
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPageBookings}
                    disabled={currentPageBookings === totalPagesBookings}
                    className={`px-4 py-2 rounded ${
                      currentPageBookings === totalPagesBookings
                        ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {isAddingCourt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Adicionar Nova Quadra</h2>
            <form className="space-y-4" onSubmit={handleAddCourt}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select name="category" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                  <option value="soccer">Futebol</option>
                  <option value="volleyball">Vôlei</option>
                  <option value="basketball">Basquete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  name="description"
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
                  name="maxPlayers"
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
                  name="price"
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddingCourt(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCourt && (
        <EditCourtModal
          isOpen={!!editingCourt}
          onClose={closeEditModal}
          court={editingCourt}
          onUpdate={handleUpdateCourt}
        />
      )}
    </div>
  );
};

export default Admin;
