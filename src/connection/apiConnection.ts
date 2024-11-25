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
  CourtsResponse, 
  CourtData, 
  CreateBookingResponse ,
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

    const result = await response.json();
    console.log("Resposta da API:", result);
    return result as LoginResponse;
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
export const getCourts = async (): Promise<Court[]> => {
  const endpoint = "api/v1/courts";

  try {
    const response = await authorizedFetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result: CourtsResponse = await response.json();

    if (!Array.isArray(result.data)) {
      throw new Error("Resposta inesperada: dados de quadras ausentes.");
    }

    return result.data.map((court: CourtData) => {
      if (!court.attributes) {
        throw new Error(`Quadra inválida: ${JSON.stringify(court)}`);
      }

      return {
        id: parseInt(court.id, 10), // id como number
        name: court.attributes.name || "Nome não especificado",
        max_Players: court.attributes.max_players || 0, // Usando 'maxPlayers'
        category: court.attributes.category || "Categoria desconhecida",
        description: court.attributes.description || "Sem descrição",
        price: court.attributes.price || 0,
        status: court.attributes.status || "Indisponível",
      } as Court;
    });
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
      const error = await response.json();
      throw new Error(`Erro na requisição: ${error.message || response.statusText}`);
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
