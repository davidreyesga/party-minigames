import { create } from "zustand";

export type Player = {
  id: string;
  name: string;
  color: string; // para avatar simple
  createdAt: number;
};

type SessionState = {
  players: Player[];
  currentIndex: number; // índice del jugador actual (turno)
  addPlayer: (name: string) => void;
  removePlayer: (playerId: string) => void;
  updatePlayerName: (playerId: string, name: string) => void;
  clearPlayers: () => void;
  nextPlayer: () => void;
  setCurrentIndex: (index: number) => void;
};

const COLORS = [
  "#3366CC",
  "#ED9D24",
  "#0D9488",
  "#7E7E7E",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
];

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function pickColor(playersCount: number) {
  return COLORS[playersCount % COLORS.length];
}

export const useSessionStore = create<SessionState>((set, get) => ({
  players: [],
  currentIndex: 0,

  addPlayer: (name) => {
    const trimmed = (name ?? "").trim();
    if (!trimmed) return;

    set((state) => {
      const newPlayer: Player = {
        id: uid(),
        name: trimmed,
        color: pickColor(state.players.length),
        createdAt: Date.now(),
      };
      return { players: [...state.players, newPlayer] };
    });
  },

  removePlayer: (playerId) => {
    set((state) => {
      const newPlayers = state.players.filter((p) => p.id !== playerId);

      // Ajuste de currentIndex para que no se salga de rango
      let nextIndex = state.currentIndex;
      if (newPlayers.length === 0) nextIndex = 0;
      else if (nextIndex >= newPlayers.length) nextIndex = newPlayers.length - 1;

      return { players: newPlayers, currentIndex: nextIndex };
    });
  },

  updatePlayerName: (playerId, name) => {
    const trimmed = (name ?? "").trim();
    if (!trimmed) return;
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, name: trimmed } : p
      ),
    }));
  },

  clearPlayers: () => set({ players: [], currentIndex: 0 }),

  nextPlayer: () => {
    const { players, currentIndex } = get();
    if (players.length === 0) return;
    const next = (currentIndex + 1) % players.length;
    set({ currentIndex: next });
  },

  setCurrentIndex: (index) => {
    const { players } = get();
    if (players.length === 0) return;
    const clamped = Math.max(0, Math.min(index, players.length - 1));
    set({ currentIndex: clamped });
  },
}));