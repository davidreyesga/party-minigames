export type WouldYouRatherDilemma = {
  optionA: string;
  optionB: string;
  level?: string;
};

export const WOULD_YOU_RATHER_QUESTIONS: readonly WouldYouRatherDilemma[] = [
  {
    optionA: "No poder escuchar musica nunca mas",
    optionB: "No poder ver peliculas nunca mas",
    level: "suave",
  },
  {
    optionA: "Llegar siempre 30 minutos tarde",
    optionB: "Llegar siempre 1 hora temprano",
    level: "suave",
  },
  {
    optionA: "Tener que cantar cada vez que saludas",
    optionB: "Tener que bailar cada vez que te despides",
    level: "medio",
  },
  {
    optionA: "Solo poder comer pizza",
    optionB: "Solo poder comer hamburguesa",
    level: "suave",
  },
  {
    optionA: "Leer mentes por un dia",
    optionB: "Ser invisible por un dia",
    level: "medio",
  },
  {
    optionA: "Siempre decir la verdad",
    optionB: "Nunca poder explicar tus mentiras",
    level: "intenso",
  },
  {
    optionA: "Perder el celular una semana",
    optionB: "No tener internet una semana",
    level: "medio",
  },
  {
    optionA: "Viajar al pasado",
    optionB: "Viajar al futuro",
    level: "suave",
  },
  {
    optionA: "Tener mucha suerte",
    optionB: "Tener mucha disciplina",
    level: "medio",
  },
  {
    optionA: "Ser famoso por algo absurdo",
    optionB: "Ser desconocido pero millonario",
    level: "intenso",
  },
];

const FALLBACK_DILEMMA: WouldYouRatherDilemma = {
  optionA: "Elegir la opcion A",
  optionB: "Elegir la opcion B",
};

export function pickNextDilemma(
  questions: readonly WouldYouRatherDilemma[],
  currentQuestion?: WouldYouRatherDilemma,
  random: () => number = Math.random,
): WouldYouRatherDilemma {
  const candidates = questions.filter((question) => question !== currentQuestion);

  if (candidates.length === 0) {
    return questions[0] ?? FALLBACK_DILEMMA;
  }

  const index = Math.floor(random() * candidates.length);
  return candidates[index] ?? candidates[0] ?? FALLBACK_DILEMMA;
}
