import { useState } from "react";
import { Text, View } from "react-native";

import GameShell from "../../../components/game/GameShell";
import { SecondaryButton } from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import { colors, radius } from "../../../theme/tokens";
import { mediumTap } from "../../../utils/haptics";
import type { GameComponentProps } from "../game.registry";

import { pickNextItem, SEQUENCE_ITEMS } from "./items";

export default function SequenceGame(props: GameComponentProps) {
  const [sequence, setSequence] = useState<string[]>(() => [pickNextItem(SEQUENCE_ITEMS)]);
  const isFinished = props.countdownSeconds <= 0;

  const handlePrimaryPress = () => {
    if (!props.hasPlayers) {
      props.onPrimaryPress();
      return;
    }

    mediumTap();
    setSequence((currentSequence) => {
      const previousItem = currentSequence[currentSequence.length - 1];
      return [...currentSequence, pickNextItem(SEQUENCE_ITEMS, previousItem)];
    });
    props.restartTimer();
    props.onPrimaryPress();
  };

  const handleResetSequence = () => {
    setSequence((currentSequence) => {
      const previousItem = currentSequence[currentSequence.length - 1];
      return [pickNextItem(SEQUENCE_ITEMS, previousItem)];
    });
    props.restartTimer();
  };

  const playerName = props.currentPlayer?.name ?? "El jugador actual";
  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: isFinished ? "Tiempo terminado" : "Repite la secuencia",
      text: isFinished
        ? `Se acabo el tiempo en la ronda ${sequence.length}. Sugerencia: aplica una penalizacion en modo ${props.penaltyMode}.`
        : `${playerName}, repite los ${sequence.length} elementos en orden antes de que termine el tiempo.`,
      emptyText: "Agrega jugadores al lobby para comenzar una secuencia.",
      footnote: isFinished
        ? "Agrega un elemento para comenzar el siguiente turno o reinicia la cadena."
        : "Cada turno agrega un elemento nuevo al final de la cadena.",
    },
  };

  const gameContent = (
    <Card className="p-5" glow>
      <View className="flex-row items-center justify-between gap-3">
        <GameBadge label={`ronda ${sequence.length}`} tone="primary" selected />
        <GameBadge label={`${sequence.length} elementos`} tone="cyan" />
      </View>

      <View className="mt-5 flex-row flex-wrap" style={{ gap: 10 }}>
        {sequence.map((item, index) => (
          <View
            className="min-h-12 flex-row items-center px-3 py-2"
            key={`${item}-${index}`}
            style={{
              backgroundColor: colors.surfaceHigh,
              borderColor: index === sequence.length - 1 ? colors.cyan : colors.innerBorder,
              borderRadius: radius.pill,
              borderWidth: index === sequence.length - 1 ? 2 : 1,
            }}
          >
            <Text className="mr-2 text-xs font-extrabold" style={{ color: colors.primary }}>
              {index + 1}
            </Text>
            <Text className="text-sm font-extrabold" style={{ color: colors.text }}>
              {item}
            </Text>
          </View>
        ))}
      </View>

      <Text className="mt-4 text-sm leading-5" style={{ color: colors.textMuted }}>
        Lee de izquierda a derecha y repite toda la cadena en voz alta.
      </Text>

      <View className="mt-4">
        <SecondaryButton
          disabled={!props.hasPlayers}
          label="REINICIAR SECUENCIA"
          onPress={handleResetSequence}
        />
      </View>
    </Card>
  );

  return (
    <GameShell
      {...props}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionLabel={!props.hasPlayers ? "INICIAR RONDA" : "AGREGAR A LA SECUENCIA"}
    />
  );
}
