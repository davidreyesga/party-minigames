export const MOST_LIKELY_QUESTIONS = [
  "llegar tarde a una fiesta",
  "olvidar el nombre de alguien",
  "bailar primero",
  "perder el celular",
  "pedir otra ronda",
  "quedarse dormido en una reunion",
  "contar el peor chiste",
  "hacer un karaoke sin pena",
  "mandar un mensaje del que se arrepienta",
  "convencer a todos de salir",
] as const;

const FALLBACK_QUESTION = "proponer el proximo plan del grupo";

export function pickNextQuestion(
  questions: readonly string[],
  currentQuestion?: string,
  random: () => number = Math.random,
): string {
  const candidates = questions.filter((question) => question !== currentQuestion);

  if (candidates.length === 0) {
    return questions[0] ?? FALLBACK_QUESTION;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_QUESTION;
}
