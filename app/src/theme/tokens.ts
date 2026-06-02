export const colors = {
  // Electric Social surfaces and text.
  background: "#16111A",
  bg: "#16111A", // Compatibility alias.
  surface: "#16111A",
  surfaceDim: "#16111A",
  surfaceLowest: "#110C15",
  surfaceLow: "#1F1A22",
  surfaceContainer: "#231E26",
  surface2: "#231E26", // Compatibility alias.
  surfaceHigh: "#2E2831",
  surfaceHighest: "#39333C",
  surfaceBright: "#3D3740",
  surfaceVariant: "#39333C",

  text: "#EADFEC",
  textMuted: "#D0C2D5",
  onBackground: "#EADFEC",
  inverseSurface: "#EADFEC",
  inverseOnSurface: "#342E38",
  outline: "#998D9E",
  outlineVariant: "#4D4353",
  border: "#4D4353", // Compatibility alias.

  // Brand and Stitch state colors.
  primary: "#E0B6FF",
  surfaceTint: "#E0B6FF",
  primaryContainer: "#9D4EDD",
  primaryInverse: "#8433C4",
  onPrimary: "#4C007D",
  onPrimaryContainer: "#FFFDFF",
  primaryFixed: "#F2DAFF",
  primaryFixedDim: "#E0B6FF",
  onPrimaryFixed: "#2E004E",
  onPrimaryFixedVariant: "#6A0BAA",

  secondary: "#E6FEFF",
  onSecondary: "#003739",
  secondaryContainer: "#00F4FE",
  onSecondaryContainer: "#006C71",
  cyan: "#00F4FE",
  cyanDim: "#00DCE5",
  cyanSoft: "#63F7FF",
  onCyan: "#002021",
  secondaryFixed: "#63F7FF",
  secondaryFixedDim: "#00DCE5",
  onSecondaryFixed: "#002021",
  onSecondaryFixedVariant: "#004F53",
  glow: "#00DCE5", // Compatibility alias.

  tertiary: "#FFB1C3",
  onTertiary: "#66002C",
  tertiaryContainer: "#E5006D",
  onTertiaryContainer: "#FFFDFF",
  pink: "#E5006D",
  pinkSoft: "#FFB1C3",
  pinkFixed: "#FFD9E0",
  tertiaryFixed: "#FFD9E0",
  tertiaryFixedDim: "#FFB1C3",
  onTertiaryFixed: "#3F0019",
  onTertiaryFixedVariant: "#8F0041",

  error: "#FFB4AB",
  onError: "#690005",
  errorContainer: "#93000A",
  onErrorContainer: "#FFDAD6",
  danger: "#FFB4AB", // Compatibility alias.

  // App-level semantic extensions.
  success: "#10B981",
  successStrong: "#059669",
  warning: "#FB923C",
  warningSoft: "#FDBA74",
  scrim: "rgba(0, 0, 0, 0.60)",
  glassFill: "rgba(35, 30, 38, 0.40)",
  glassFillStrong: "rgba(22, 17, 26, 0.70)",
  innerBorder: "rgba(255, 255, 255, 0.10)",

  // Compatibility aliases for the current UI migration.
  accent: "#FB923C",
  panelStripe: "#9D4EDD",
  partyPink: "#E5006D",
  partyLime: "#10B981",
  partyAmber: "#FB923C",
  partyCyanSoft: "#63F7FF",
} as const;

export const levelColors = {
  suave: { base: colors.success, glow: "#6EE7B7" },
  medio: { base: colors.cyanDim, glow: colors.cyanSoft },
  intenso: { base: colors.warning, glow: colors.warningSoft },
  extremo: { base: colors.pink, glow: colors.pinkSoft },
} as const;

export const gradients = {
  primary: [colors.primaryContainer, colors.pink],
  primaryDepth: [colors.primaryContainer, colors.primaryInverse],
  avatar: [colors.primaryContainer, colors.cyan],
  success: [colors.success, colors.successStrong],
  ambient: {
    purple: "rgba(157, 78, 221, 0.16)",
    cyan: "rgba(0, 244, 254, 0.10)",
  },
} as const;

export const radius = {
  sm: 8,
  default: 16,
  md: 24,
  lg: 32,
  xl: 48,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  safeMargin: 20,
  screenX: 20, // Compatibility alias.
  screenY: 16, // Compatibility alias.
} as const;

export const shadow = {
  ios: {
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  } as const,
  elevation: 5,
} as const;

export const glow = {
  primary: {
    color: colors.primaryContainer,
    opacity: 0.2,
    radius: 30,
  },
  cyan: {
    color: colors.cyanDim,
    opacity: 0.3,
    radius: 18,
  },
  pink: {
    color: colors.pink,
    opacity: 0.35,
    radius: 16,
  },
  success: {
    color: colors.success,
    opacity: 0.25,
    radius: 16,
  },
} as const;

export const blur = {
  panel: 20,
  modal: 16,
} as const;

export const glowShadow = (glowColor: string) =>
  ({
    shadowColor: glowColor,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  }) as const;

// Temporary compatibility tokens for components pending visual refactor.
export const panelFx = {
  stripeHeight: 5,
  panelInset: 3,
  cardBorderWidth: 1.5,
} as const;
