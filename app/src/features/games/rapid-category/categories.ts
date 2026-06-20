export const RAPID_CATEGORIES = [
  "marcas de carros",
  "canciones de regueton",
  "paises de Latinoamerica",
  "cosas que hay en una cocina",
  "peliculas famosas",
  "equipos de futbol",
  "frutas",
  "ciudades de Colombia",
  "cosas que llevas a una fiesta",
  "animales",
] as const;

const FALLBACK_CATEGORY = "cosas que ves a tu alrededor";

export function pickNextCategory(
  categories: readonly string[],
  currentCategory?: string,
  random: () => number = Math.random,
): string {
  const candidates = categories.filter((category) => category !== currentCategory);

  if (candidates.length === 0) {
    return categories[0] ?? FALLBACK_CATEGORY;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_CATEGORY;
}
