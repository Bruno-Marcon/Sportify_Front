import { create } from 'zustand';
import type { Court, Booking, Participant } from '../types';

interface Store {
  courts: Court[];
  bookings: Booking[];
  selectedCourt: Court | null;
  isModalOpen: boolean;
  showShareModal: boolean;
  currentBookingLink: string | null;
  setSelectedCourt: (court: Court | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  setShowShareModal: (isOpen: boolean) => void;
  setCurrentBookingLink: (link: string | null) => void;
  addBooking: (booking: Booking) => void;
  addParticipant: (bookingId: string, participant: Participant) => void;
}

export const useStore = create<Store>((set) => ({
  courts: [
    {
      id: 1,
      name: 'Center Court',
      sport: 'Tennis',
      maxPlayers: 4,
      pricePerHour: 80,
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800&h=400',
      availability: ['09:00', '10:00', '14:00', '16:00'],
    },
    {
      id: 2,
      name: 'Indoor Court 1',
      sport: 'Basketball',
      maxPlayers: 10,
      pricePerHour: 120,
      image: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?auto=format&fit=crop&q=80&w=800&h=400',
      availability: ['11:00', '13:00', '15:00', '17:00'],
    },
    {
      id: 3,
      name: 'Field A',
      sport: 'Soccer',
      maxPlayers: 12,
      pricePerHour: 150,
      image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800&h=400',
      availability: ['08:00', '12:00', '16:00', '18:00'],
    },
  ],
  bookings: [],
  selectedCourt: null,
  isModalOpen: false,
  showShareModal: false,
  currentBookingLink: null,
  setSelectedCourt: (court) => set({ selectedCourt: court }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setShowShareModal: (isOpen) => set({ showShareModal: isOpen }),
  setCurrentBookingLink: (link) => set({ currentBookingLink: link }),
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking],
  })),
  addParticipant: (bookingId, participant) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === bookingId
        ? {
            ...booking,
            currentPlayers: booking.currentPlayers + 1,
            participants: [...booking.participants, participant],
          }
        : booking
    ),
  })),
}));