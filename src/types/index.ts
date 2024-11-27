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
export interface PagedCourtsResponse {
  courts: Court[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
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

/**
 * Interface para representar uma Reserva (Booking)
 */
export interface BookingAttributes {
  id: Key | null | undefined;
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
    id: string;
    name: string;
    category: string;
    price: number;
  };
  players: Participant[];
}

export interface BookingData {
  id: string;
  type: string;
  attributes: BookingAttributes;
}

export interface BookingByShareTokenResponse {
  data: BookingData;
}

export interface BookingsResponse {
  data: BookingData[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

export interface PagedBookingsResponse {
  bookings: Booking[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface CreatePlayerParams {
  shareToken: string;
  nickname: string;
  role: string;
}

export interface CreatePlayerResponse {
  id: string;
  nickname: string;
  role: string;
  createdAt: string;
}

export interface CreateBookingResponse {
  data: BookingData;
}
export interface Booking {
  players: unknown;
  id: number;
  courtId: number;
  startsOn: string;
  endsOn: string;
  time: string; // Adicione essa propriedade para facilitar o uso
  isPublic: boolean;
  maxPlayers: number;
  currentPlayers: number;
  participants: Participant[];
  status?: string;
  totalValue?: number;
}

export interface BookingByShareToken {
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
export interface BookingDetailsResponse {
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
        name: string;
      };
      court: {
        id: number;
        name: string;
        category: string;
        price: number;
        max_players: number;
      };
      players: {
        id: number;
        nickname: string;
        role: string | null;
      }[];
    };
  };
}
export interface JoinBookingResponse {
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
        max_players: number;
      };
      players: {
        id: number;
        nickname: string;
        role: string | null;
      }[];
    };
  };
}
/**
 * Interface para representar um Participante (Participant)
 */
export interface Participant {
  id: number;
  name: string;
  cpf?: string;
  isAuthenticated: boolean;
  position?: string | null;
}


// ================================
// Interfaces para Respostas da API
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
  data: BookingData[]; // O array contém objetos de reservas
}

export interface BookingData {
  id: string;
  type: string; // Tipo do recurso, como "booking"
  attributes: BookingAttributes;
}

export interface BookingAttributes {
  starts_on: string; // Data e hora de início da reserva
  ends_on: string; // Data e hora de término da reserva
  total_value: number; // Valor total da reserva
  status: string; // Status da reserva, como "agendado"
  share_token: string; // Token de compartilhamento
  public: boolean; // Se a reserva é pública ou não
  user3: User3; // Informações do usuário que criou a reserva
  court3: Court3; // Informações sobre a quadra
  players3: Player3[]; // Lista de jogadores associados à reserva
}

export interface User3 {
  id: number; // ID do usuário
  email: string; // Email do usuário
  name: string; // Nome do usuário
}

export interface Court3 {
  id: number; // ID da quadra
  name: string; // Nome da quadra
  category: string; // Categoria da quadra, como "soccer"
  price: number; // Preço por hora da quadra
  max_players: number; // Número máximo de jogadores permitido
}

export interface Player3 {
  id: number; // ID do jogador
  nickname: string; // Apelido do jogador
  role: string | null; // Papel do jogador na partida (se aplicável)
}
export interface CourtUpdateData {
  name: string;
  max_players: number;
  category: string;
  description: string;
  price: number;
  status: string;
}

// Interface para os atributos da quadra na resposta
export interface CourtAttributes {
  name: string;
  max_players: number;
  category: string;
  description: string;
  price: number;
  status: string;
}

// Interface para o objeto de dados na resposta
export interface CourtDataResponse {
  id: string;
  type: "court";
  attributes: CourtAttributes;
}

// Interface para a resposta completa da API
export interface CourtUpdateResponse {
  data: CourtDataResponse;
}

// Interface para possíveis erros retornados pela API
export interface APIErrorResponse {
  message: string;
}