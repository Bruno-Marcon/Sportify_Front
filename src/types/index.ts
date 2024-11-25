// ================================
// Interfaces Gerais
// ================================

/**
 * Interface para representar uma Quadra (Court)
 */
export interface Court {
  id: number;
  name: string;
  max_Players: number; // Padronizado para 'maxPlayers'
  category: string; // Padronizado para 'category' (equivalente a 'type')
  description: string;
  price: number;
  status: 'open' | 'closed'; // Utilizando enum para melhor controle
}
export interface CourtAttributes {
  name: string;
  max_players: number; // Assumindo que o backend retorna 'max_players'
  category: string;
  description: string;
  price: number;
  status: 'open' | 'closed';
}
export interface CourtData {
  id: string;
  type: string;
  attributes: CourtAttributes;
}
export interface CourtsResponse {
  data: CourtData[];
}

/**
 * Interface para representar uma Reserva (Booking)
 */
export interface Booking {
  id: string;
  courtId: number;
  startsOn: string;
  endsOn: string;
  isPublic: boolean;
  max_Players: number;
  currentPlayers: number;
  participants: Participant[];
  status?: string;
  totalValue?: number;
}

export interface BookingAttributes {
  starts_on: string;
  ends_on: string;
  total_value: number;
  status: string;
  share_token: string;
  public: boolean;
  user: {
    id: number;
    email: string;
  };
  court: {
    id: number;
    name: string;
    category: string;
    price: number;
  };
  players: Participant[];
}

// Interface para uma reserva retornada pela API
export interface BookingData {
  id: string;
  type: string;
  attributes: BookingAttributes;
}

// Interface para a resposta da API ao criar uma reserva
export interface CreateBookingResponse {
  data: BookingData;
}

/**
 * Interface para representar um Participante (Participant)
 */
export interface Participant {
  id: number;
  name: string;
  cpf?: string;
  isAuthenticated: boolean;
}

// ================================
// Interfaces para Respostas da API
// ================================

/**
 * Interface para a resposta de criação de usuário
 */
export interface UserResponse {
  id: string;
  type: string;
  attributes: {
    email: string;
    name: string;
    document: string;
    role: 'admin' | 'user'; 
  };
}
export interface User {
  id: number;
  email: string;
  document: string;
  name: string;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user';
}

/**
 * Interface para a resposta de login
 */
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    role: 'admin' | 'user'; 
  };
}

/**
 * Interface para os horários disponíveis
 */
export interface AvailableTimesResponse {
  courtId: number;
  date: string;
  availableTimes: {
    start: string;
    end: string;
  }[];
}

/**
 * Interface para os parâmetros de criação de reserva
 */
export interface CreateBookingParams {
  startsOn: string; // Formato ISO (exemplo: "2022-11-25T20:00:00Z")
  courtId: number;
  isPublic: boolean;
}

/**
 * Interface para a resposta das reservas públicas
 */
export interface PublicBookingResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      starts_on: string;
      ends_on: string;
      total_value: number;
      status: string;
      share_token: string;
      public: boolean;
      user: {
        id: number;
        email: string;
      };
      court: {
        id: number;
        name: string;
        category: string;
        price: number;
      };
      players: Participant[];
    };
  }[];
}

/**
 * Interface para as informações do usuário
 */
export interface UserInformationResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      email: string;
      name: string;
      document: string;
    };
  };
}
