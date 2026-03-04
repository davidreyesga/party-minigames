import { create } from "zustand";

export type PenaltyMode = "sorbos" | "shots" | "puntos";
export type DareLevel = "suave" | "medio" | "intenso" | "extremo";

type SettingsState = {
  penaltyMode: PenaltyMode;
  roundCap: number; // tope por ronda (en “unidades”)
  defaultLevel: DareLevel;

  // Timers base (segundos) por juego (MVP)
  timers: {
    rapidCategory: number;
    rhymes: number;
    sequence: number;
    impostorQnA: number;
  };

  setPenaltyMode: (mode: PenaltyMode) => void;
  setRoundCap: (cap: number) => void;
  setDefaultLevel: (level: DareLevel) => void;
  setTimer: (key: keyof SettingsState["timers"], seconds: number) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  penaltyMode: "sorbos",
  roundCap: 3,
  defaultLevel: "medio",
  timers: {
    rapidCategory: 8,
    rhymes: 8,
    sequence: 10,
    impostorQnA: 15,
  },

  setPenaltyMode: (mode) => set({ penaltyMode: mode }),

  setRoundCap: (cap) => {
    const safe = Number.isFinite(cap) ? cap : 3;
    set({ roundCap: Math.max(0, Math.min(99, Math.floor(safe))) });
  },

  setDefaultLevel: (level) => set({ defaultLevel: level }),

  setTimer: (key, seconds) => {
    const safe = Number.isFinite(seconds) ? seconds : 10;
    set((state) => ({
      timers: {
        ...state.timers,
        [key]: Math.max(3, Math.min(120, Math.floor(safe))),
      },
    }));
  },
}));