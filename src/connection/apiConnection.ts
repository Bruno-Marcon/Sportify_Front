
import axios from 'axios';
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
  BookingByShareTokenResponse,
  CreatePlayerParams,
  CreatePlayerResponse
} from '../types/index';

// ================================
// Configurações Gerais
// ================================

const BASE_URL = "http://localhost:3000";

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const publicFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  return await fetch(url, { ...options, headers });
};

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

export const createPlayer = async (
  params: CreatePlayerParams
): Promise<any> => {
  const endpoint = `api/v1/players/${params.shareToken}`;

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: params.nickname,
        role: params.role,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar jogador:', error);
    throw error;
  }
};

// ================================
// Endpoints de Usuário
// ================================


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

export const createCourt = async (courtData: {
  name: string;
  category: string;
  description: string;
  max_players: number;
  price: number;
  status: string;
}): Promise<Court> => {
  const endpoint = "api/v1/courts";

  console.log('Enviando dados para a API:', courtData);

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
    console.log('Resposta da API após criação da quadra:', result);

    const data = result.data;
    const { attributes, id } = data;
    const newCourt: Court = {
      id: parseInt(id, 10),
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
  const endpoint = `api/v1/courts/${courtId}`;

  console.log(`Atualizando quadra com ID: ${courtId}`, courtData);

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
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
    console.log('Resposta da API após atualização da quadra:', result);

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

  } catch (error) {
    console.error('Erro ao excluir quadra:', error);
    throw error;
  }
};

export const getCourts = async (
  page: number = 1,
  limit: number = 10
): Promise<PagedCourtsResponse> => {
  const endpoint = "api/v1/courts";
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

    const courts: Court[] = result.data.map((courtData: CourtData) => {
      const { attributes, id } = courtData;
      return {
        id: parseInt(id, 10),
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
  const endpoint = "api/v1/bookings";
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

    const bookings: Booking[] = result.data.map((bookingData: BookingData) => {
      const { attributes, id } = bookingData;
      return {
        id: parseInt(id, 10),
        courtId: parseInt(attributes.court.id, 10),
        startsOn: attributes.starts_on,
        endsOn: attributes.ends_on,
        isPublic: attributes.public,
        maxPlayers: 0,
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

export const getBookingsByShareToken = async (
  gameId: string
): Promise<Booking> => {
  const endpoint = `api/v1/public/bookings/${gameId}`;
  
  try {
    const response = await publicFetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result: BookingByShareTokenResponse = await response.json(); // Supondo que o tipo retornado seja BookingData

    const { attributes, id } = result.data; // Acessa diretamente o objeto

    const booking: Booking = {
      id: parseInt(id, 10),
      courtId: parseInt(attributes.court.id, 10),
      startsOn: attributes.starts_on,
      endsOn: attributes.ends_on,
      isPublic: attributes.public,
      maxPlayers: 0, // Adapte conforme necessário
      currentPlayers: attributes.players.length,
      participants: attributes.players,
      status: attributes.status,
      totalValue: attributes.total_value,
    };

    return booking; // Retorna o único Booking
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    throw error;
  }
};



export const deleteBooking = async (bookingId: number): Promise<void> => {
  const endpoint = `api/v1/bookings/${bookingId}`;

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar reserva.');
    }

  } catch (error) {
    console.error("Erro na função deleteBooking:", error);
    throw error;
  }
};
