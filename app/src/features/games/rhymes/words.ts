export const RHYME_WORDS = [
  "casa",
  "cancion",
  "fiesta",
  "amor",
  "noche",
  "mesa",
  "camino",
  "corazon",
  "juego",
  "botella",
  "amigo",
  "playa",
] as const;

const FALLBACK_WORD = "rima";

export function pickNextWord(
  words: readonly string[],
  currentWord?: string,
  random: () => number = Math.random,
): string {
  const candidates = words.filter((word) => word !== currentWord);

  if (candidates.length === 0) {
    return words[0] ?? FALLBACK_WORD;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_WORD;
}
