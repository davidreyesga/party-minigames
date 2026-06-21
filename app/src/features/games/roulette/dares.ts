export type RouletteLevel = "suave" | "medio" | "intenso" | "extremo";

export const ROULETTE_LEVELS: readonly RouletteLevel[] = ["suave", "medio", "intenso", "extremo"];

export const DARES_BY_LEVEL: Record<RouletteLevel, readonly string[]> = {
  suave: [
    "Cuenta una anecdota graciosa.",
    "Haz una pose dramatica durante 5 segundos.",
    "Di un cumplido a alguien del grupo.",
  ],
  medio: [
    "Imita a alguien famoso.",
    "Habla con un acento diferente durante una ronda.",
    "Cuenta una verdad incomoda pero ligera.",
  ],
  intenso: [
    "Deja que el grupo te haga una pregunta.",
    "Haz una mini actuacion de 10 segundos.",
    "Confiesa algo que casi nadie sepa.",
  ],
  extremo: [
    "El grupo elige un reto social.",
    "Responde una pregunta dificil del grupo.",
    "Haz una llamada falsa actuada de 15 segundos.",
  ],
};

const FALLBACK_DARE = "El grupo propone un reto rapido y seguro.";

export function normalizeRouletteLevel(level: string): RouletteLevel {
  return ROULETTE_LEVELS.includes(level as RouletteLevel) ? (level as RouletteLevel) : "medio";
}

export function pickNextDare(
  dares: readonly string[],
  currentDare?: string,
  random: () => number = Math.random,
): string {
  const candidates = dares.filter((dare) => dare !== currentDare);

  if (candidates.length === 0) {
    return dares[0] ?? FALLBACK_DARE;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_DARE;
}
