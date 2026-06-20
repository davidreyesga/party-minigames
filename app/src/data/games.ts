import type { GameId } from "../app/navigation.types";

export type GameBadgeTone = "primary" | "cyan" | "pink" | "success" | "warning" | "neutral";
export type GameTimerKey = "rapidCategory" | "rhymes" | "sequence" | "impostorQnA";

export type GamePrompt = {
  title: string;
  text: string;
  emptyText: string;
  footnote: string;
};

export type GameCatalogItem = {
  id: GameId;
  code: string;
  title: string;
  shortTitle?: string;
  description: string;
  typeLabel: string;
  badgeVariant: GameBadgeTone;
  minPlayers: number;
  suggestedTimerSeconds?: GameTimerKey;
  timerLabel: string;
  prompt: GamePrompt;
  rules: string[];
};

export const GAMES: readonly GameCatalogItem[] = [
  {
    id: "roulette",
    code: "01",
    title: "Ruleta por nivel",
    shortTitle: "Ruleta",
    description: "Retos que suben de intensidad.",
    typeLabel: "Azar",
    badgeVariant: "primary",
    minPlayers: 2,
    suggestedTimerSeconds: "impostorQnA",
    timerLabel: "Setup",
    prompt: {
      title: "Preparar ruleta",
      text: "El jugador actual elige un nivel, gira la ruleta y acepta el reto que salga.",
      emptyText: "Agrega jugadores al lobby para activar la ruleta de la ronda.",
      footnote: "Shell temporal: aqui entraran niveles, giro y modal de resultado.",
    },
    rules: [
      "El jugador del turno toma la decision principal.",
      "El grupo valida el reto antes de pasar al siguiente turno.",
      "La intensidad final usara el nivel por defecto como punto de partida.",
    ],
  },
  {
    id: "wouldYouRather",
    code: "02",
    title: "Que prefieres?",
    shortTitle: "Prefieres",
    description: "Dilemas para abrir debate.",
    typeLabel: "Dilemas",
    badgeVariant: "cyan",
    minPlayers: 2,
    suggestedTimerSeconds: "impostorQnA",
    timerLabel: "Decision",
    prompt: {
      title: "Dilema listo",
      text: "Lee el dilema en voz alta, elige una opcion y deja que el grupo discuta la respuesta.",
      emptyText: "Agrega jugadores para iniciar dilemas con turno visible.",
      footnote: "Shell temporal: aqui entraran opciones, seleccion y expiracion.",
    },
    rules: [
      "El jugador decide una de dos opciones.",
      "El grupo puede pedir una razon corta antes de avanzar.",
      "Los dilemas reales se conectaran en la siguiente fase.",
    ],
  },
  {
    id: "rapidCategory",
    code: "03",
    title: "Categoria relampago",
    shortTitle: "Categoria",
    description: "Piensa rapido antes del limite.",
    typeLabel: "Rapidez",
    badgeVariant: "pink",
    minPlayers: 2,
    suggestedTimerSeconds: "rapidCategory",
    timerLabel: "Categoria",
    prompt: {
      title: "Categoria activa",
      text: "Di ejemplos validos de la categoria hasta que el tiempo termine o falles.",
      emptyText: "Agrega jugadores para activar el timer de categoria.",
      footnote: "Shell temporal: aqui entraran categorias, aciertos y fallo.",
    },
    rules: [
      "Responde antes de que termine el tiempo.",
      "No repitas respuestas dentro de la misma ronda.",
      "Cuando falle alguien, pasa el turno.",
    ],
  },
  {
    id: "slowFinger",
    code: "04",
    title: "Dedo mas lento",
    shortTitle: "Dedo lento",
    description: "Reflejos y tension en la mesa.",
    typeLabel: "Reflejos",
    badgeVariant: "warning",
    minPlayers: 2,
    suggestedTimerSeconds: "rapidCategory",
    timerLabel: "Senal",
    prompt: {
      title: "Todos atentos",
      text: "Todos colocan un dedo y esperan la senal; el ultimo en soltar pierde.",
      emptyText: "Agrega jugadores antes de activar la ronda multitactil.",
      footnote: "Shell temporal: aqui entrara deteccion multitouch real.",
    },
    rules: [
      "Todos deben tocar la pantalla antes de iniciar.",
      "Nadie suelta hasta que aparezca la senal.",
      "El resultado real requiere pruebas fisicas multitouch.",
    ],
  },
  {
    id: "impostor",
    code: "05",
    title: "Impostor",
    description: "Descubre el rol oculto del grupo.",
    typeLabel: "Roles ocultos",
    badgeVariant: "cyan",
    minPlayers: 3,
    suggestedTimerSeconds: "impostorQnA",
    timerLabel: "Secreto",
    prompt: {
      title: "Pasar telefono",
      text: "Pasa el telefono en secreto para revelar rol y preparar la discusion.",
      emptyText: "Agrega jugadores para repartir roles sin filtrar informacion.",
      footnote: "Shell temporal: aqui entraran fases, roles, palabra y votos.",
    },
    rules: [
      "Cada jugador mira su rol en privado.",
      "El impostor intenta mezclarse sin conocer la palabra completa.",
      "La votacion final decide si el grupo descubrio al impostor.",
    ],
  },
  {
    id: "rhymes",
    code: "06",
    title: "Rimas",
    description: "Creatividad sin romper la cadena.",
    typeLabel: "Creatividad",
    badgeVariant: "pink",
    minPlayers: 2,
    suggestedTimerSeconds: "rhymes",
    timerLabel: "Rimas",
    prompt: {
      title: "Palabra base",
      text: "Improvisa una rima valida antes de que el timer llegue a cero.",
      emptyText: "Agrega jugadores para activar la cadena de rimas.",
      footnote: "Shell temporal: aqui entraran palabra base, timer y evaluacion.",
    },
    rules: [
      "La rima debe ser aceptada por el grupo.",
      "No repitas palabras usadas en la ronda.",
      "Si dudas demasiado, pasa el turno con penalizacion.",
    ],
  },
  {
    id: "sequence",
    code: "07",
    title: "Secuencia",
    description: "Memoria que crece por turno.",
    typeLabel: "Memoria",
    badgeVariant: "primary",
    minPlayers: 1,
    suggestedTimerSeconds: "sequence",
    timerLabel: "Memoria",
    prompt: {
      title: "Memoriza el patron",
      text: "Observa la secuencia, repitela en orden y preparate para el siguiente nivel.",
      emptyText: "Agrega jugadores para iniciar la cadena de memoria.",
      footnote: "Shell temporal: aqui entraran patron, input y feedback.",
    },
    rules: [
      "Mira el patron completo antes de responder.",
      "Cada ronda puede agregar un paso nuevo.",
      "Un error corta la secuencia y pasa el turno.",
    ],
  },
  {
    id: "mostLikely",
    code: "08",
    title: "Mas probable",
    description: "Votacion express entre amigos.",
    typeLabel: "Votacion",
    badgeVariant: "success",
    minPlayers: 3,
    suggestedTimerSeconds: "impostorQnA",
    timerLabel: "Voto",
    prompt: {
      title: "Pregunta al grupo",
      text: "Lean la pregunta y voten quien encaja mejor con la situacion.",
      emptyText: "Agrega jugadores para que la votacion tenga candidatos.",
      footnote: "Shell temporal: aqui entraran pregunta, votos y resultado.",
    },
    rules: [
      "Cada persona vota por quien crea mas probable.",
      "El grupo puede pedir una explicacion corta al ganador.",
      "Las preguntas reales se conectaran por mazos.",
    ],
  },
];

export const GAME_BY_ID: Record<GameId, GameCatalogItem> = GAMES.reduce(
  (acc, game) => ({ ...acc, [game.id]: game }),
  {} as Record<GameId, GameCatalogItem>,
);

export function getGameById(gameId: string): GameCatalogItem | undefined {
  return GAME_BY_ID[gameId as GameId];
}
