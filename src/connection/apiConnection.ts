// apiConnection.ts

// ================================
// Importações
// ================================
import {
  UserResponse,
  LoginResponse,
  AvailableTimesResponse,
  Court,
  CreateBookingParams,
  PublicBookingResponse,
  UserInformationResponse,
  CreateBookingResponse, 
  Booking,
  PagedCourtsResponse,
  CourtsResponse,
  CourtData,
  PagedBookingsResponse,
  BookingsResponse,
  BookingData,
} from '../types/index';

// ================================
// Configurações Gerais
// ================================
const BASE_URL = "http://127.0.0.1:3000"; // Atualize com a URL do seu backend

// Função utilitária para obter o token do localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Função utilitária para realizar fetch com autenticação
const authorizedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Token ausente.');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return await fetch(url, { ...options, headers });
};

// ================================
// Endpoints de Autenticação
// ================================

/**
 * Cria um novo usuário.
 * @param name Nome do usuário
 * @param email Email do usuário
 * @param password Senha
 * @param passwordConfirmation Confirmação da senha
 * @param document Documento do usuário
 * @returns Dados do usuário criado
 */
export const createUser = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
  document: string
): Promise<UserResponse> => {
  const endpoint = "api/v1/users";
  const userData = {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
    document,
  };

  console.log("Payload enviado para API:", JSON.stringify(userData, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Erro retornado pela API:", errorResponse);
      throw new Error(`Erro na requisição: ${errorResponse.message || response.statusText}`);
    }

    const result = await response.json();
    console.log("Resposta da API:", result);
    return result.data as UserResponse;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

/**
 * Realiza login do usuário.
 * @param email Email do usuário
 * @param password Senha do usuário
 * @returns Dados de autenticação e usuário
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const endpoint = "api/v1/auth/sign_in";
  const loginData = { email, password };

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Erro retornado pela API:", errorResponse);
      throw new Error(`Erro na requisição: ${errorResponse.message || response.statusText}`);
    }

    const result: LoginResponse = await response.json();
    console.log("Resposta da API:", result);
    return result;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

// ================================
// Endpoints de Usuário
// ================================

/**
 * Obtém informações do usuário autenticado.
 * @returns Informações do usuário
 */
export const fetchUserInformation = async (): Promise<UserInformationResponse> => {
  const endpoint = 'api/v1/informations/me';

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    throw error;
  }
};

// ================================
// Endpoints de Quadras
// ================================

/**
 * Obtém a lista de quadras disponíveis.
 * @returns Lista de quadras
 */
export const createCourt = async (courtData: {
  name: string;
  category: string;
  description: string;
  max_players: number;
  price: number;
  status: string;
}): Promise<Court> => {
  const endpoint = "api/v1/courts"; // Ajuste conforme a sua API

  console.log('Enviando dados para a API:', courtData); // Log dos dados enviados

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courtData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao criar quadra.');
    }

    const result = await response.json();
    console.log('Resposta da API após criação da quadra:', result); // Log da resposta

    // Processar result.data para extrair o objeto Court
    const data = result.data;
    const { attributes, id } = data;
    const newCourt: Court = {
      id: parseInt(id, 10), // Converter id de string para number
      name: attributes.name,
      category: attributes.category,
      description: attributes.description,
      max_players: attributes.max_players,
      price: Number(attributes.price),
      status: attributes.status,
    };

    return newCourt;
  } catch (error) {
    console.error("Erro na função createCourt:", error);
    throw error;
  }
};

export const updateCourt = async (
  courtId: number,
  courtData: {
    name: string;
    category: string;
    description: string;
    max_players: number;
    price: number;
    status: string;
  }
): Promise<Court> => {
  const endpoint = `api/v1/courts/${courtId}`; // Ajuste conforme a sua API

  console.log(`Atualizando quadra com ID: ${courtId}`, courtData); // Log dos dados enviados

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT', // ou 'PATCH' conforme a sua API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courtData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar quadra.');
    }

    const result = await response.json();
    console.log('Resposta da API após atualização da quadra:', result); // Log da resposta

    const data = result.data;
    const { attributes, id } = data;
    const updatedCourt: Court = {
      id: parseInt(id, 10),
      name: attributes.name,
      category: attributes.category,
      description: attributes.description,
      max_players: attributes.max_players,
      price: Number(attributes.price),
      status: attributes.status,
    };

    return updatedCourt;
  } catch (error) {
    console.error("Erro na função updateCourt:", error);
    throw error;
  }
};


export const deleteCourt = async (courtId: number): Promise<void> => {
  const endpoint = `api/v1/admin/courts/${courtId}`;

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao excluir quadra.');
    }

    // Supondo que a API não retorne conteúdo no DELETE
  } catch (error) {
    console.error('Erro ao excluir quadra:', error);
    throw error;
  }
};

export const getCourts = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedCourtsResponse> => {
  const endpoint = "api/v1/courts"; // Ajuste conforme a sua API
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result: CourtsResponse = await response.json();

    // Processar result.data para extrair um array de objetos Court
    const courts: Court[] = result.data.map((courtData: CourtData) => {
      const { attributes, id } = courtData;
      return {
        id: parseInt(id, 10), // Converter id de string para number
        name: attributes.name,
        category: attributes.category,
        description: attributes.description,
        max_players: attributes.max_players,
        price: Number(attributes.price),
        status: attributes.status,
      };
    });

    return {
      courts,
      meta: {
        currentPage: result.meta.current_page,
        totalPages: result.meta.total_pages,
        totalCount: result.meta.total_count,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar quadras:", error);
    throw error;
  }
};




// ================================
// Endpoints de Reservas
// ================================

/**
 * Obtém os horários disponíveis para uma quadra específica.
 * @param courtId ID da quadra
 * @returns Horários disponíveis
 */
export const getAvailableTimes = async (courtId: number): Promise<AvailableTimesResponse> => {
  const endpoint = `api/v1/bookings/${courtId}/available_times`;

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result = await response.json();

    // Formata os dados recebidos
    return {
      courtId: result.court_id,
      date: result.date,
      availableTimes: result.available_times.map((time: { start: string; end: string }) => ({
        start: time.start,
        end: time.end,
      })),
    };
  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    throw error;
  }
};

/**
 * Cria uma nova reserva.
 * @param params Parâmetros da reserva
 * @returns Dados da reserva criada
 */
export const createBooking = async (params: CreateBookingParams): Promise<CreateBookingResponse> => {
  const endpoint = "api/v1/bookings";

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify({
        starts_on: params.startsOn,
        court_id: params.courtId,
        public: params.isPublic,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message: errorData.message || response.statusText,
      };
    }

    const result: CreateBookingResponse = await response.json();
    return result;
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    throw error;
  }
};

/**
 * Busca as reservas públicas disponíveis.
 * @returns Lista de reservas públicas
 */
export const fetchPublicBookings = async (): Promise<PublicBookingResponse> => {
  const endpoint = `api/v1/bookings?filter[public_eq]=true`;

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao buscar reservas públicas:', error);
    throw error;
  }
};
export const getBookings = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedBookingsResponse> => {
  const endpoint = "api/v1/bookings"; // Ajuste conforme a sua API
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result: BookingsResponse = await response.json();

    // Processar result.data para extrair um array de objetos Booking
    const bookings: Booking[] = result.data.map((bookingData: BookingData) => {
      const { attributes, id } = bookingData;
      return {
        id: parseInt(id, 10),
        courtId: parseInt(attributes.court.id, 10),
        startsOn: attributes.starts_on,
        endsOn: attributes.ends_on,
        isPublic: attributes.public,
        maxPlayers: 0, // Preencha conforme a lógica necessária
        currentPlayers: attributes.players.length,
        participants: attributes.players,
        status: attributes.status,
        totalValue: attributes.total_value,
      };
    });

    return {
      bookings,
      meta: {
        currentPage: result.meta.current_page,
        totalPages: result.meta.total_pages,
        totalCount: result.meta.total_count,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    throw error;
  }
};


/**
 * Exclui uma reserva existente.
 * @param bookingId ID da reserva a ser excluída
 * @returns void
 */
export const deleteBooking = async (bookingId: number): Promise<void> => { // Mantido como number no frontend
  const endpoint = `api/v1/bookings/${bookingId}`; // Convertendo bookingId para string na URL

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar reserva.');
    }

    // Se a resposta for OK, não há necessidade de retornar nada
  } catch (error) {
    console.error("Erro na função deleteBooking:", error);
    throw error;
  }
};
