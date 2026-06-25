import { type ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import PlayerAvatar from "../../../components/ui/PlayerAvatar";
import { colors, radius } from "../../../theme/tokens";
import type { GameComponentProps } from "../game.registry";

import { IMPOSTOR_WORDS, pickImpostorId, pickSecretWord } from "./words";

type Phase = "idle" | "reveal" | "roleShown" | "discussion" | "voting" | "result";

const MIN_PLAYERS = 3;

export default function ImpostorGame(props: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [secretWord, setSecretWord] = useState("");
  const [impostorId, setImpostorId] = useState<string | null>(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [votedPlayerId, setVotedPlayerId] = useState<string | null>(null);

  const hasEnoughPlayers = props.players.length >= MIN_PLAYERS;
  const isRevealPhase = phase === "reveal" || phase === "roleShown";
  const revealPlayer = props.players[revealIndex];
  const shellCurrentPlayer = isRevealPhase && revealPlayer ? revealPlayer : props.currentPlayer;
  const selectedSuspect = props.players.find((player) => player.id === selectedSuspectId);
  const votedPlayer = props.players.find((player) => player.id === votedPlayerId);
  const impostor = props.players.find((player) => player.id === impostorId);
  const showingImpostorRole = phase === "roleShown" && revealPlayer?.id === impostorId;
  const groupCaughtImpostor = Boolean(votedPlayer && impostor && votedPlayer.id === impostor.id);
  const discussionFinished = phase === "discussion" && props.countdownSeconds <= 0;

  const startRound = () => {
    const nextImpostorId = pickImpostorId(props.players);

    if (!hasEnoughPlayers || !nextImpostorId) {
      return false;
    }

    setSecretWord((currentWord) => pickSecretWord(IMPOSTOR_WORDS, currentWord));
    setImpostorId(nextImpostorId);
    setRevealIndex(0);
    setSelectedSuspectId(null);
    setVotedPlayerId(null);
    setPhase("reveal");
    props.resetTimer();
    return true;
  };

  const handlePrimaryPress = () => {
    if (!hasEnoughPlayers) {
      return;
    }

    switch (phase) {
      case "idle":
        startRound();
        return;
      case "result":
        if (startRound()) {
          props.onPrimaryPress();
        }
        return;
      case "reveal":
        if (revealPlayer) {
          setPhase("roleShown");
        }
        return;
      case "roleShown":
        if (revealIndex < props.players.length - 1) {
          setRevealIndex((currentIndex) => currentIndex + 1);
          setPhase("reveal");
        } else {
          setPhase("discussion");
          props.restartTimer();
        }
        return;
      case "discussion":
        setPhase("voting");
        props.pauseTimer();
        return;
      case "voting":
        if (selectedSuspect) {
          setVotedPlayerId(selectedSuspect.id);
          setPhase("result");
          props.pauseTimer();
        }
    }
  };

  let promptTitle = "Prepara la ronda";
  let promptText = "Inicia una ronda para repartir una palabra y un rol secreto.";
  let promptFootnote = "El telefono pasara en privado por cada jugador.";

  if (!hasEnoughPlayers) {
    promptTitle = "Se necesitan mínimo 3 jugadores";
    promptText = "Agrega mas personas al lobby antes de repartir los roles.";
  } else if (phase === "reveal") {
    promptTitle = "Revelacion privada";
    promptText = `Pasa el telefono a ${revealPlayer?.name ?? "el siguiente jugador"}. Nadie mas debe mirar.`;
    promptFootnote = "Pulsa REVELAR ROL cuando la pantalla este en privado.";
  } else if (phase === "roleShown") {
    promptTitle = showingImpostorRole ? "Eres el impostor" : "Tu palabra secreta";
    promptText = showingImpostorRole
      ? "No conoces la palabra. Escucha al grupo e intenta pasar desapercibido."
      : `La palabra es: ${secretWord}. Memorizala sin decirla en voz alta.`;
    promptFootnote = "Oculta la pantalla antes de pasar el telefono.";
  } else if (phase === "discussion") {
    promptTitle = discussionFinished ? "Tiempo terminado" : "Discusion abierta";
    promptText = discussionFinished
      ? "La discusion termino. Pasen a votar por la persona sospechosa."
      : "Cada jugador da una pista sin revelar directamente la palabra. El impostor intenta mezclarse.";
    promptFootnote = "Cuando el grupo este listo, pasa a la votacion.";
  } else if (phase === "voting") {
    promptTitle = "Votacion final";
    promptText = "Selecciona a la persona que el grupo cree que era el impostor.";
    promptFootnote = "La seleccion se confirma con el boton principal.";
  } else if (phase === "result") {
    promptTitle = groupCaughtImpostor ? "El grupo acerto" : "El impostor escapo";
    promptText = groupCaughtImpostor
      ? `${impostor?.name ?? "El impostor"} fue descubierto. La palabra era ${secretWord}.`
      : `El grupo eligio a ${votedPlayer?.name ?? "otro jugador"}, pero el impostor era ${impostor?.name ?? "desconocido"}. La palabra era ${secretWord}.`;
    promptFootnote = `Sugerencia: aplica hasta ${props.roundCap} en modo ${props.penaltyMode}.`;
  }

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: promptTitle,
      text: promptText,
      emptyText: "Se necesitan mínimo 3 jugadores para iniciar una ronda de Impostor.",
      footnote: promptFootnote,
    },
  };

  let gameContent: ReactNode;

  if (!hasEnoughPlayers) {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge label="faltan jugadores" tone="warning" selected />
        <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
          Se necesitan mínimo 3 jugadores
        </Text>
        <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
          Actualmente hay {props.players.length}. Agrega mas personas desde el lobby.
        </Text>
      </Card>
    );
  } else if (phase === "idle") {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge label="ronda preparada" tone="cyan" selected />
        <Text className="mt-4 text-lg font-extrabold" style={{ color: colors.text }}>
          {props.players.length} jugadores listos
        </Text>
        <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
          El juego elegira una palabra y un impostor al azar.
        </Text>
      </Card>
    );
  } else if (phase === "reveal" || phase === "roleShown") {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge
          label={`jugador ${revealIndex + 1} de ${props.players.length}`}
          tone={phase === "roleShown" ? "pink" : "primary"}
          selected
        />
        <View className="mt-5 items-center">
          <PlayerAvatar name={revealPlayer?.name} color={revealPlayer?.color} size={72} selected />
          <Text className="mt-3 text-center text-xl font-extrabold" style={{ color: colors.text }}>
            {revealPlayer?.name}
          </Text>
          {phase === "reveal" ? (
            <Text className="mt-3 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
              Asegurate de que nadie mas pueda ver la pantalla.
            </Text>
          ) : showingImpostorRole ? (
            <>
              <GameBadge label="impostor" tone="danger" selected />
              <Text className="mt-4 text-center text-2xl font-extrabold" style={{ color: colors.error }}>
                Eres el impostor
              </Text>
            </>
          ) : (
            <>
              <GameBadge label="palabra secreta" tone="success" selected />
              <Text className="mt-4 text-center text-3xl font-extrabold" style={{ color: colors.cyan }}>
                {secretWord}
              </Text>
            </>
          )}
        </View>
      </Card>
    );
  } else if (phase === "discussion") {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge label={discussionFinished ? "tiempo terminado" : "discusion"} tone="cyan" selected />
        <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
          Den pistas, escuchen y busquen contradicciones.
        </Text>
        <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
          No digan la palabra exacta. El impostor debe improvisar sin descubrirse.
        </Text>
      </Card>
    );
  } else if (phase === "voting") {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge label="elige sospechoso" tone="warning" selected />
        <View className="mt-4 flex-row flex-wrap justify-between" style={{ rowGap: 12 }}>
          {props.players.map((player) => {
            const selected = player.id === selectedSuspectId;

            return (
              <Pressable
                accessibilityLabel={`Votar por ${player.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                className="min-h-[112px] items-center justify-center p-3"
                key={player.id}
                onPress={() => setSelectedSuspectId(player.id)}
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
      </Card>
    );
  } else if (phase === "result") {
    gameContent = (
      <Card className="p-5" glow>
        <GameBadge
          label={groupCaughtImpostor ? "grupo gana" : "impostor gana"}
          tone={groupCaughtImpostor ? "success" : "danger"}
          selected
        />
        <View className="mt-5 items-center">
          <PlayerAvatar name={impostor?.name} color={impostor?.color} size={72} selected />
          <Text className="mt-3 text-center text-2xl font-extrabold" style={{ color: colors.text }}>
            El impostor era {impostor?.name}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
            El grupo eligio a {votedPlayer?.name}. Palabra secreta: {secretWord}.
          </Text>
          <Text className="mt-3 text-center text-sm font-extrabold" style={{ color: colors.warningSoft }}>
            Sugerencia: aplica hasta {props.roundCap} en modo {props.penaltyMode}.
          </Text>
        </View>
      </Card>
    );
  }

  const primaryActionLabel = !hasEnoughPlayers
    ? "SE NECESITAN 3 JUGADORES"
    : phase === "idle"
      ? "INICIAR RONDA"
      : phase === "reveal"
        ? "REVELAR ROL"
        : phase === "roleShown"
          ? "OCULTAR Y PASAR"
          : phase === "discussion"
            ? "IR A VOTACION"
            : phase === "voting"
              ? "CONFIRMAR VOTO"
              : "NUEVA RONDA";

  return (
    <GameShell
      {...props}
      currentPlayer={shellCurrentPlayer}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionDisabled={!hasEnoughPlayers || (phase === "voting" && !selectedSuspect)}
      primaryActionLabel={primaryActionLabel}
    />
  );
}
