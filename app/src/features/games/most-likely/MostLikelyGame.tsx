import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import PlayerAvatar from "../../../components/ui/PlayerAvatar";
import { colors, radius } from "../../../theme/tokens";
import { successTap } from "../../../utils/haptics";
import type { GameComponentProps } from "../game.registry";

import { MOST_LIKELY_QUESTIONS, pickNextQuestion } from "./questions";

export default function MostLikelyGame(props: GameComponentProps) {
  const [question, setQuestion] = useState(() => pickNextQuestion(MOST_LIKELY_QUESTIONS));
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [resultPlayerId, setResultPlayerId] = useState<string | null>(null);

  const hasEnoughPlayers = props.players.length >= 2;
  const selectedPlayer = props.players.find((player) => player.id === selectedPlayerId);
  const resultPlayer = props.players.find((player) => player.id === resultPlayerId);
  const isFinished = props.countdownSeconds <= 0;

  const handlePrimaryPress = () => {
    if (!hasEnoughPlayers) {
      return;
    }

    if (!resultPlayer) {
      if (!selectedPlayer) {
        return;
      }

      successTap();
      setResultPlayerId(selectedPlayer.id);
      props.pauseTimer();
      return;
    }

    setQuestion((currentQuestion) => pickNextQuestion(MOST_LIKELY_QUESTIONS, currentQuestion));
    setSelectedPlayerId(null);
    setResultPlayerId(null);
    props.restartTimer();
    props.onPrimaryPress();
  };

  const promptText = !hasEnoughPlayers
    ? "Agrega al menos 2 jugadores al lobby para abrir la votacion."
    : resultPlayer
      ? `El grupo eligio a ${resultPlayer.name}. Sugerencia: aplica una penalizacion en modo ${props.penaltyMode}.`
      : isFinished
        ? `Se acabo el tiempo para decidir quien podria ${question}. Selecciona a alguien para cerrar la votacion.`
        : `¿Quien es mas probable que pueda ${question}? Selecciona a una persona y confirma el voto.`;

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: !hasEnoughPlayers
        ? "Se necesitan 2 jugadores"
        : resultPlayer
          ? "Resultado confirmado"
          : isFinished
            ? "Tiempo terminado"
            : "Votacion activa",
      text: promptText,
      emptyText: "Agrega al menos 2 jugadores al lobby para abrir la votacion.",
      footnote: resultPlayer
        ? "Pulsa SIGUIENTE PREGUNTA para continuar con otro turno."
        : "Cada persona elige a quien mejor encaja con la pregunta.",
    },
  };

  const gameContent = (
    <Card className="p-5" glow>
      <GameBadge
        label={resultPlayer ? "resultado" : hasEnoughPlayers ? "elige un jugador" : "faltan jugadores"}
        tone={resultPlayer ? "success" : hasEnoughPlayers ? "cyan" : "warning"}
        selected
      />

      {resultPlayer ? (
        <View className="mt-5 items-center">
          <PlayerAvatar name={resultPlayer.name} color={resultPlayer.color} size={72} selected />
          <Text className="mt-4 text-center text-2xl font-extrabold" style={{ color: colors.text }}>
            El grupo eligio a {resultPlayer.name}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
            Sugerencia: aplica una penalizacion en modo {props.penaltyMode}.
          </Text>
        </View>
      ) : hasEnoughPlayers ? (
        <>
          <Text className="mt-4 text-sm leading-5" style={{ color: colors.textMuted }}>
            Toca una persona para registrar el voto del grupo.
          </Text>
          <View className="mt-4 flex-row flex-wrap justify-between" style={{ rowGap: 12 }}>
            {props.players.map((player) => {
              const selected = player.id === selectedPlayerId;

              return (
                <Pressable
                  accessibilityLabel={`Votar por ${player.name}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  key={player.id}
                  onPress={() => setSelectedPlayerId(player.id)}
                  className="min-h-[112px] items-center justify-center p-3"
                  style={({ pressed }) => ({
                    backgroundColor: selected ? colors.surfaceHighest : colors.surfaceHigh,
                    borderColor: selected ? player.color : colors.innerBorder,
                    borderRadius: radius.default,
                    borderWidth: selected ? 2 : 1,
                    opacity: pressed ? 0.86 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    width: "48%",
                  })}
                >
                  <PlayerAvatar name={player.name} color={player.color} size={52} selected={selected} />
                  <Text
                    className="mt-2 text-center text-sm font-extrabold"
                    numberOfLines={2}
                    style={{ color: colors.text }}
                  >
                    {player.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : (
        <Text className="mt-4 text-sm leading-5" style={{ color: colors.textMuted }}>
          Este juego necesita minimo 2 jugadores para crear una votacion.
        </Text>
      )}
    </Card>
  );

  const primaryActionLabel = !hasEnoughPlayers
    ? "SE NECESITAN 2 JUGADORES"
    : resultPlayer
      ? "SIGUIENTE PREGUNTA"
      : "CONFIRMAR VOTO";

  return (
    <GameShell
      {...props}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionDisabled={!hasEnoughPlayers || (!resultPlayer && !selectedPlayer)}
      primaryActionLabel={primaryActionLabel}
    />
  );
}
