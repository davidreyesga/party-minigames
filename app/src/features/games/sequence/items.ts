export const SEQUENCE_ITEMS = [
  "pizza",
  "playa",
  "perro",
  "avion",
  "fiesta",
  "montana",
  "cafe",
  "balon",
  "guitarra",
  "celular",
  "naranja",
  "sombrero",
  "bicicleta",
  "helado",
  "reloj",
] as const;

const FALLBACK_ITEM = "estrella";

export function pickNextItem(
  items: readonly string[],
  previousItem?: string,
  random: () => number = Math.random,
): string {
  const candidates = items.filter((item) => item !== previousItem);

  if (candidates.length === 0) {
    return items[0] ?? FALLBACK_ITEM;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_ITEM;
}
