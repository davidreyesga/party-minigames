export const IMPOSTOR_WORDS = [
  "playa",
  "restaurante",
  "colegio",
  "aeropuerto",
  "cine",
  "gimnasio",
  "hospital",
  "discoteca",
  "supermercado",
  "estadio",
  "oficina",
  "hotel",
] as const;

const FALLBACK_WORD = "lugar secreto";

export function pickSecretWord(
  words: readonly string[],
  previousWord?: string,
  random: () => number = Math.random,
): string {
  const candidates = words.filter((word) => word !== previousWord);

  if (candidates.length === 0) {
    return words[0] ?? FALLBACK_WORD;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_WORD;
}

export function pickImpostorId(
  players: readonly { id: string }[],
  random: () => number = Math.random,
): string | undefined {
  if (players.length === 0) {
    return undefined;
  }

  const index = Math.floor(random() * players.length);
  return players[index]?.id ?? players[0]?.id;
}
