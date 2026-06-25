import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type PenaltyMode = "sorbos" | "shots" | "puntos";
export type DareLevel = "suave" | "medio" | "intenso" | "extremo";

type SettingsState = {
  penaltyMode: PenaltyMode;
  roundCap: number; // tope por ronda (en “unidades”)
  defaultLevel: DareLevel;
  hapticsEnabled: boolean;

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
  setHapticsEnabled: (enabled: boolean) => void;
  setTimer: (key: keyof SettingsState["timers"], seconds: number) => void;
};

type PersistedSettingsState = Pick<
  SettingsState,
  "penaltyMode" | "roundCap" | "defaultLevel" | "timers" | "hapticsEnabled"
>;

const safeAsyncStorage: StateStorage<Promise<void>> = {
  getItem: async (name) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Ignore persistence failures so in-memory settings keep working.
    }
  },
  removeItem: async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Ignore persistence failures so in-memory settings keep working.
    }
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      penaltyMode: "sorbos",
      roundCap: 3,
      defaultLevel: "medio",
      hapticsEnabled: true,
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

      setHapticsEnabled: (enabled) => set({ hapticsEnabled: enabled }),

      setTimer: (key, seconds) => {
        const safe = Number.isFinite(seconds) ? seconds : 10;
        set((state) => ({
          timers: {
            ...state.timers,
            [key]: Math.max(3, Math.min(120, Math.floor(safe))),
          },
        }));
      },
    }),
    {
      name: "party-minigames-settings-v1",
      storage: createJSONStorage<PersistedSettingsState>(() => safeAsyncStorage),
      version: 1,
      partialize: (state): PersistedSettingsState => ({
        penaltyMode: state.penaltyMode,
        roundCap: state.roundCap,
        defaultLevel: state.defaultLevel,
        timers: state.timers,
        hapticsEnabled: state.hapticsEnabled,
      }),
    },
  ),
);
