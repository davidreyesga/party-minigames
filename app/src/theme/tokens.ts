export const colors = {
  bg: "#060814",
  surface: "#0B1024",
  surface2: "#0E1633",
  border: "#1B2A4A",

  text: "#EAF2FF",
  textMuted: "#9BB0D6",

  primary: "#3B82F6", // azul neon
  glow: "#22D3EE", // cian glow

  danger: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",
};

export const levelColors = {
  suave: { base: "#22C55E", glow: "#4ADE80" },
  medio: { base: "#3B82F6", glow: "#60A5FA" },
  intenso: { base: "#F59E0B", glow: "#FBBF24" },
  extremo: { base: "#EF4444", glow: "#F87171" },
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const spacing = {
  screenX: 20,
  screenY: 16,
};

export const shadow = {
  // iOS shadow
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  } as const,
  // Android elevation
  elevation: 8,
};

export const glowShadow = (glowColor: string) =>
  ({
    shadowColor: glowColor,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  }) as const;