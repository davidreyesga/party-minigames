import { useState } from "react";

import GameShell from "../../../components/game/GameShell";
import type { GameComponentProps } from "../game.registry";

import { pickNextWord, RHYME_WORDS } from "./words";

export default function RhymesGame(props: GameComponentProps) {
  const [word, setWord] = useState(() => pickNextWord(RHYME_WORDS));
  const isFinished = props.countdownSeconds <= 0;

  const handlePrimaryPress = () => {
    if (props.hasPlayers) {
      setWord((currentWord) => pickNextWord(RHYME_WORDS, currentWord));
      props.restartTimer();
    }

    props.onPrimaryPress();
  };

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: isFinished ? "Tiempo terminado" : "Palabra base",
      text: isFinished
        ? `Se acabo el tiempo para rimar con "${word}". Sugerencia: aplica una penalizacion en modo ${props.penaltyMode} y pasa el turno.`
        : `Di una palabra que rime con "${word}" antes de que el timer llegue a cero.`,
      emptyText: `Agrega jugadores para comenzar. Palabra preparada: ${word}.`,
      footnote: isFinished
        ? "Pulsa SIGUIENTE TURNO para cambiar la palabra y continuar."
        : "El grupo valida la rima. No repitas palabras dentro de la ronda.",
    },
  };

  return <GameShell {...props} game={game} onPrimaryPress={handlePrimaryPress} />;
}
