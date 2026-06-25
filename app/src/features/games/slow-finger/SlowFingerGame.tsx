import { useRef, useState } from "react";
import { Text, View, type GestureResponderEvent } from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import PlayerAvatar from "../../../components/ui/PlayerAvatar";
import { colors, radius } from "../../../theme/tokens";
import type { GameComponentProps } from "../game.registry";

type Phase = "idle" | "ready" | "running" | "result";

const MIN_PLAYERS = 2;

function pickRandomPlayer<T>(players: readonly T[]): T | undefined {
  if (players.length === 0) {
    return undefined;
  }

  const index = Math.floor(Math.random() * players.length);
  return players[index] ?? players[0];
}

export default function SlowFingerGame(props: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [activeTouchCount, setActiveTouchCount] = useState(0);
  const [maxTouchCount, setMaxTouchCount] = useState(0);
  const [liftOrder, setLiftOrder] = useState<string[]>([]);
  const [lastTouchId, setLastTouchId] = useState<string | null>(null);
  const [loserPlayerId, setLoserPlayerId] = useState<string | null>(null);

  const activeTouchIdsRef = useRef<Set<string>>(new Set());
  const hasRegisteredTouchRef = useRef(false);
  const roundFinishedRef = useRef(false);

  const hasEnoughPlayers = props.players.length >= MIN_PLAYERS;
  const loserPlayer = props.players.find((player) => player.id === loserPlayerId);

  const clearRoundState = () => {
    activeTouchIdsRef.current.clear();
    hasRegisteredTouchRef.current = false;
    roundFinishedRef.current = false;
    setActiveTouchCount(0);
    setMaxTouchCount(0);
    setLiftOrder([]);
    setLastTouchId(null);
    setLoserPlayerId(null);
  };

  const finishRound = () => {
    if (roundFinishedRef.current || !hasEnoughPlayers) {
      return;
    }

    // MVP: React Native touch identifiers represent contacts, not player identities.
    // A later calibration step can bind each player to a touch before choosing the real last lifter.
    const loser = pickRandomPlayer(props.players);

    roundFinishedRef.current = true;
    activeTouchIdsRef.current.clear();
    setActiveTouchCount(0);
    setLoserPlayerId(loser?.id ?? null);
    setPhase("result");
    props.pauseTimer();
  };

  const syncActiveTouches = (event: GestureResponderEvent) => {
    const touches = event.nativeEvent.touches ?? [];
    const nextTouchIds = new Set(touches.map((touch) => touch.identifier));
    const nextTouchCount = nextTouchIds.size;

    activeTouchIdsRef.current = nextTouchIds;

    if (nextTouchCount > 0) {
      hasRegisteredTouchRef.current = true;
      setMaxTouchCount((currentCount) => Math.max(currentCount, nextTouchCount));
    }

    setActiveTouchCount(nextTouchCount);
    return nextTouchCount;
  };

  const handleTouchStart = (event: GestureResponderEvent) => {
    if (phase !== "running") {
      return;
    }

    syncActiveTouches(event);
  };

  const handleTouchMove = (event: GestureResponderEvent) => {
    if (phase !== "running") {
      return;
    }

    syncActiveTouches(event);
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (phase !== "running") {
      return;
    }

    const changedTouches = event.nativeEvent.changedTouches ?? [];

    if (changedTouches.length > 0) {
      const liftedTouchIds = changedTouches.map((touch) => touch.identifier);
      const lastLiftedTouchId = liftedTouchIds[liftedTouchIds.length - 1];

      setLiftOrder((currentOrder) => [...currentOrder, ...liftedTouchIds]);
      setLastTouchId(lastLiftedTouchId ?? null);
    }

    const nextTouchCount = syncActiveTouches(event);

    if (hasRegisteredTouchRef.current && nextTouchCount === 0) {
      finishRound();
    }
  };

  const handlePrimaryPress = () => {
    if (!hasEnoughPlayers) {
      return;
    }

    if (phase === "idle") {
      clearRoundState();
      setPhase("ready");
      props.resetTimer();
      return;
    }

    if (phase === "ready") {
      clearRoundState();
      setPhase("running");
      props.restartTimer();
      return;
    }

    if (phase === "result") {
      clearRoundState();
      setPhase("ready");
      props.resetTimer();
      props.onPrimaryPress();
    }
  };

  let promptTitle = "Prepara la ronda";
  let promptText = "Todos ponen un dedo en la pantalla. Cuando empiece la ronda, no lo levanten.";
  let promptFootnote = "Pulsa PREPARAR RONDA para acomodar al grupo.";

  if (!hasEnoughPlayers) {
    promptTitle = "Se necesitan mínimo 2 jugadores";
    promptText = "Agrega otra persona al lobby antes de iniciar Dedo mas lento.";
    promptFootnote = "Este juego necesita competencia entre al menos dos jugadores.";
  } else if (phase === "ready") {
    promptTitle = "Dedos listos";
    promptText = "Todos ponen un dedo en la pantalla. Cuando empiece la ronda, no lo levanten.";
    promptFootnote = "Pulsa INICIAR y usen la zona tactil grande.";
  } else if (phase === "running") {
    promptTitle = activeTouchCount > 0 ? "Ronda activa" : "Esperando dedos";
    promptText =
      activeTouchCount > 0
        ? `${activeTouchCount} dedo(s) tocando la pantalla. El ultimo en levantar pierde.`
        : "Toquen la zona grande y mantengan el dedo abajo.";
    promptFootnote = "La ronda termina cuando no queda ningun dedo activo.";
  } else if (phase === "result") {
    promptTitle = "Resultado";
    promptText = loserPlayer
      ? `${loserPlayer.name} pierde esta ronda. Sugerencia: aplica hasta ${props.roundCap} en modo ${props.penaltyMode}.`
      : `No se pudo detectar un perdedor confiable. Sugerencia: aplica hasta ${props.roundCap} en modo ${props.penaltyMode}.`;
    promptFootnote = "Pulsa NUEVA RONDA para limpiar el estado y volver a iniciar.";
  }

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: promptTitle,
      text: promptText,
      emptyText: "Se necesitan mínimo 2 jugadores para jugar Dedo mas lento.",
      footnote: promptFootnote,
    },
  };

  const primaryActionLabel = !hasEnoughPlayers
    ? "SE NECESITAN 2 JUGADORES"
    : phase === "idle"
      ? "PREPARAR RONDA"
      : phase === "ready"
        ? "INICIAR"
        : phase === "running"
          ? "RONDA ACTIVA"
          : "NUEVA RONDA";

  const gameContent = (
    <Card className="p-5" glow>
      {!hasEnoughPlayers ? (
        <>
          <GameBadge label="faltan jugadores" tone="warning" selected />
          <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
            Se necesitan mínimo 2 jugadores
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
            Actualmente hay {props.players.length}. Agrega otra persona desde el lobby.
          </Text>
        </>
      ) : phase === "result" ? (
        <>
          <GameBadge label="perdedor" tone="danger" selected />
          <View className="mt-5 items-center">
            <PlayerAvatar name={loserPlayer?.name} color={loserPlayer?.color} size={76} selected />
            <Text className="mt-4 text-center text-2xl font-extrabold" style={{ color: colors.text }}>
              Pierde {loserPlayer?.name ?? "alguien del grupo"}
            </Text>
            <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
              Toques maximos detectados: {maxTouchCount}. Levantamientos registrados: {liftOrder.length}.
            </Text>
            <Text className="mt-3 text-center text-sm font-extrabold" style={{ color: colors.warningSoft }}>
              Sugerencia: aplica hasta {props.roundCap} en modo {props.penaltyMode}.
            </Text>
          </View>
        </>
      ) : (
        <>
          <View className="flex-row items-center justify-between gap-3">
            <GameBadge
              label={phase === "running" ? "zona activa" : phase === "ready" ? "listos" : "preparacion"}
              tone={phase === "running" ? "cyan" : "primary"}
              selected
            />
            <GameBadge label={`${props.players.length} jugadores`} tone="warning" />
          </View>

          <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
            Todos ponen un dedo en la pantalla
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
            Cuando empiece la ronda, no lo levanten. Gana quien aguante mas tiempo.
          </Text>

          <View
            className="mt-5 min-h-[260px] items-center justify-center p-5"
            onMoveShouldSetResponder={() => phase === "running"}
            onResponderTerminationRequest={() => false}
            onStartShouldSetResponder={() => phase === "running"}
            onTouchCancel={handleTouchEnd}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            style={{
              backgroundColor: phase === "running" ? colors.surfaceHighest : colors.surfaceHigh,
              borderColor: activeTouchCount > 0 ? colors.cyan : colors.outlineVariant,
              borderRadius: radius.md,
              borderStyle: phase === "running" ? "solid" : "dashed",
              borderWidth: 2,
            }}
          >
            <GameBadge
              label={phase === "running" ? "tocando ahora" : "zona tactil"}
              tone={activeTouchCount > 0 ? "success" : "neutral"}
              selected={activeTouchCount > 0}
            />
            <Text className="mt-5 text-center text-6xl font-extrabold" style={{ color: colors.text }}>
              {activeTouchCount}
            </Text>
            <Text className="mt-2 text-center text-sm font-extrabold" style={{ color: colors.textMuted }}>
              dedo(s) activos
            </Text>
            <Text className="mt-4 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
              {phase === "running"
                ? "Mantengan el dedo abajo. Al soltarlos todos se revela el perdedor."
                : "Pulsa INICIAR para activar esta zona."}
            </Text>
          </View>

          <View className="mt-4 flex-row gap-2">
            <View
              className="flex-1 px-3 py-3"
              style={{
                backgroundColor: colors.surfaceLow,
                borderColor: colors.innerBorder,
                borderRadius: radius.default,
                borderWidth: 1,
              }}
            >
              <GameBadge label="maximo" tone="cyan" />
              <Text className="mt-3 text-lg font-extrabold" style={{ color: colors.text }}>
                {maxTouchCount}
              </Text>
            </View>
            <View
              className="flex-1 px-3 py-3"
              style={{
                backgroundColor: colors.surfaceLow,
                borderColor: colors.innerBorder,
                borderRadius: radius.default,
                borderWidth: 1,
              }}
            >
              <GameBadge label="ultimo touch" tone="pink" />
              <Text className="mt-3 text-lg font-extrabold" style={{ color: colors.text }}>
                {lastTouchId ?? "-"}
              </Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );

  return (
    <GameShell
      {...props}
      game={game}
      gameContent={gameContent}
      onPrimaryPress={handlePrimaryPress}
      primaryActionDisabled={!hasEnoughPlayers || phase === "running"}
      primaryActionLabel={primaryActionLabel}
    />
  );
}
