import { useState } from "react";

import GameShell from "../../../components/game/GameShell";
import type { GameComponentProps } from "../game.registry";

import { pickNextCategory, RAPID_CATEGORIES } from "./categories";

export default function RapidCategoryGame(props: GameComponentProps) {
  const [category, setCategory] = useState(() => pickNextCategory(RAPID_CATEGORIES));
  const isFinished = props.countdownSeconds <= 0;

  const handlePrimaryPress = () => {
    if (props.hasPlayers) {
      setCategory((currentCategory) => pickNextCategory(RAPID_CATEGORIES, currentCategory));
    }

    props.onPrimaryPress();
  };

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: isFinished ? "Tiempo terminado" : "Categoria activa",
      text: isFinished
        ? `Se acabo el tiempo para "${category}". Sugerencia: aplica una penalizacion en modo ${props.penaltyMode} y pasa el turno.`
        : `Di una respuesta valida para: ${category}. Responde antes de que el timer llegue a cero.`,
      emptyText: `Agrega jugadores para comenzar. Categoria preparada: ${category}.`,
      footnote: isFinished
        ? "Pulsa SIGUIENTE TURNO para cambiar de categoria y continuar."
        : "No repitas respuestas de esta ronda y deja que el grupo valide cada intento.",
    },
  };

  return <GameShell {...props} game={game} onPrimaryPress={handlePrimaryPress} />;
}
