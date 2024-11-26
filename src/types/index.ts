// ================================
// Interfaces Gerais
// ================================

export interface CourtAttributes {
  name: string;
  max_players: number;
  category: string;
  description: string;
  price: number;
  status: string;
}

export interface CourtData {
  id: string;
  type: string;
  attributes: CourtAttributes;
}

export interface CourtsResponse {
  data: CourtData[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface Court {
  id: number;
  name: string;
  max_players: number;
  category: string;
  description: string;
  price: number;
  status: string;
}

// ================================
// Interfaces de Reservas (Booking)
// ================================

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
    max_players?: number; // Opcional
  };
  players: Participant[];
}

export interface BookingData {
  id: string;
  type: string;
  attributes: BookingAttributes;
}

export interface BookingsResponse {
  data: BookingData[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface Booking {
  id: number;
  courtId: number;
  startsOn: string;
  endsOn: string;
  isPublic: boolean;
  maxPlayers: number;
  currentPlayers: number;
  participants: Participant[];
  status?: string;
  totalValue?: number;
}

// ================================
// Participantes
// ================================

export interface Participant {
  id: number;
  name: string;
  nickname?: string;
  role?: string;
  cpf?: string;
  isAuthenticated: boolean;
}

// ================================
// Interfaces de API
// ================================

/**
 * Interface para a resposta de criação de usuário
 */
export interface UserResponse2 {
  id: string;
  type: string;
  attributes: {
    email: string;
    name: string;
    document: string;
    role: 'admin' | 'user'; 
  };
}
export interface UserResponse {
  data: UserData;
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
export interface UserAttributes {
  email: string;
  name: string;
  document: string;
  role: string;
}
export interface UserData {
  id: string;
  type: string;
  attributes: UserAttributes;
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

export type Stat = {
  id: number;
  label: string;
  value: string | number;
  info: string | null;
};

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

export interface CreateBookingParams {
  startsOn: string; // Formato ISO (exemplo: "2022-11-25T20:00:00Z")
  courtId: number;
  isPublic: boolean;
}

export interface CreateBookingResponse {
  data: BookingData;
}

export interface PublicBookingResponse {
  data: {
    id: string;
    type: string;
    attributes: BookingAttributes;
  }[];
}

export interface JoinBookingResponse {
  data: BookingData;
}

// ================================
// Interfaces de Usuário
// ================================

export interface UserResponse {
  data: UserData;
}

export interface UserAttributes {
  email: string;
  name: string;
  document: string;
  role: 'admin' | 'user';
}

export interface UserData {
  id: string;
  type: string;
  attributes: UserAttributes;
}

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
