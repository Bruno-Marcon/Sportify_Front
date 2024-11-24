export interface Court {
  id: number;
  name: string;
  sport: string;
  maxPlayers: number;
  image: string;
  pricePerHour: number;
  availability: string[];
}

export interface Booking {
  id: string;
  courtId: number;
  time: string;
  isPublic: boolean;
  maxPlayers: number;
  currentPlayers: number;
  participants: Participant[];
}

export interface Participant {
  id: string;
  name: string;
  cpf?: string;
  isAuthenticated: boolean;
}