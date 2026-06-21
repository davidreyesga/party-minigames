import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import { colors, radius } from "../../../theme/tokens";
import type { GameComponentProps } from "../game.registry";

import { pickNextDilemma, WOULD_YOU_RATHER_QUESTIONS } from "./questions";

type SelectedOption = "A" | "B";

export default function WouldYouRatherGame(props: GameComponentProps) {
  const [dilemma, setDilemma] = useState(() => pickNextDilemma(WOULD_YOU_RATHER_QUESTIONS));
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(null);
  const isFinished = props.countdownSeconds <= 0;

  const selectedText =
    selectedOption === "A" ? dilemma.optionA : selectedOption === "B" ? dilemma.optionB : undefined;

  const handleSelect = (option: SelectedOption) => {
    if (!props.hasPlayers || isFinished) {
      return;
    }

    setSelectedOption(option);
    props.pauseTimer();
  };

  const handlePrimaryPress = () => {
    if (!props.hasPlayers) {
      props.onPrimaryPress();
      return;
    }

    if (!selectedOption && !isFinished) {
      return;
    }

    setDilemma((currentDilemma) => pickNextDilemma(WOULD_YOU_RATHER_QUESTIONS, currentDilemma));
    setSelectedOption(null);
    props.restartTimer();
    props.onPrimaryPress();
  };

  const promptText = isFinished
    ? `Se acabo el tiempo sin elegir. Sugerencia: aplica una penalizacion en modo ${props.penaltyMode}.`
    : selectedText
      ? `${props.currentPlayer?.name ?? "El jugador actual"} eligio: ${selectedText}.`
      : `¿Que prefieres: "${dilemma.optionA}" o "${dilemma.optionB}"?`;

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: isFinished ? "Tiempo terminado" : selectedText ? "Eleccion lista" : "Dilema activo",
      text: promptText,
      emptyText: "Agrega jugadores al lobby para comenzar a elegir dilemas.",
      footnote: isFinished
        ? "Pulsa SIGUIENTE DILEMA para continuar despues de la penalizacion."
        : selectedText
          ? "Defiende tu eleccion y avanza al siguiente dilema."
          : "Selecciona A o B antes de que el timer llegue a cero.",
    },
  };

  const options: readonly { key: SelectedOption; text: string; tone: "primary" | "cyan" }[] = [
    { key: "A", text: dilemma.optionA, tone: "primary" },
    { key: "B", text: dilemma.optionB, tone: "cyan" },
  ];

  const gameContent = (
    <Card className="p-5" glow>
      <GameBadge label={dilemma.level ? `nivel ${dilemma.level}` : "elige A o B"} tone="pink" selected />

      <View className="mt-4 gap-3">
        {options.map((option) => {
          const selected = option.key === selectedOption;
          const accentColor = option.key === "A" ? colors.primary : colors.cyan;

          return (
            <Pressable
              accessibilityLabel={`Opcion ${option.key}: ${option.text}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: !props.hasPlayers || isFinished, selected }}
              disabled={!props.hasPlayers || isFinished}
              key={option.key}
              onPress={() => handleSelect(option.key)}
              className="min-h-[112px] p-4"
              style={({ pressed }) => ({
                backgroundColor: selected ? colors.surfaceHighest : colors.surfaceHigh,
                borderColor: selected ? accentColor : colors.innerBorder,
                borderRadius: radius.default,
                borderWidth: selected ? 2 : 1,
                opacity: !props.hasPlayers || isFinished ? 0.55 : pressed ? 0.86 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
              })}
            >
              <GameBadge label={`opcion ${option.key}`} tone={option.tone} selected={selected} />
              <Text className="mt-3 text-lg font-extrabold leading-6" style={{ color: colors.text }}>
                {option.text}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedText ? (
        <Text className="mt-4 text-center text-sm font-extrabold" style={{ color: colors.success }}>
          Elegiste la opcion {selectedOption}: {selectedText}
        </Text>
      ) : null}
    </Card>
  );

  const primaryActionLabel = !props.hasPlayers
    ? "INICIAR RONDA"
    : selectedOption || isFinished
      ? "SIGUIENTE DILEMA"
      : "ELIGE UNA OPCION";

  return (
    <GameShell
      {...props}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionDisabled={props.hasPlayers && !selectedOption && !isFinished}
      primaryActionLabel={primaryActionLabel}
    />
  );
}
