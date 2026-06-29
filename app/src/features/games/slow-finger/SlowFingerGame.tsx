import { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import GameShell from "../../../components/game/GameShell";
import Card from "../../../components/ui/Card";
import GameBadge from "../../../components/ui/GameBadge";
import PlayerAvatar from "../../../components/ui/PlayerAvatar";
import { colors, glow, radius } from "../../../theme/tokens";
import { heavyTap, mediumTap, warningTap } from "../../../utils/haptics";
import type { GameComponentProps, GamePlayer } from "../game.registry";

type Phase = "idle" | "ready" | "countdown" | "signal" | "result";
type ResultReason = "early-release" | "last-release" | "fallback";
type ZoneStatus = "waiting" | "touching" | "fastest" | "released" | "lost" | "eliminated";
type TouchId = GestureResponderEvent["nativeEvent"]["changedTouches"][number]["identifier"];

type ReleaseEntry = {
  playerId: string;
  releasedAt: number;
};

type RoundResult = {
  loserId: string | null;
  message: string;
  reason: ResultReason;
};

const MIN_PLAYERS = 2;
const SIGNAL_COUNTDOWN_SECONDS = 3;

const webGameControlStyle =
  Platform.OS === "web"
    ? ({
        touchAction: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      } as unknown as ViewStyle)
    : undefined;

const webNoSelectTextStyle =
  Platform.OS === "web"
    ? ({
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      } as unknown as TextStyle)
    : undefined;

const statusLabels: Record<ZoneStatus, string> = {
  waiting: "esperando",
  touching: "tocando",
  fastest: "mas rapido",
  released: "levanto",
  lost: "perdio",
  eliminated: "eliminado",
};

const resultReasonLabels: Record<ResultReason, string> = {
  "early-release": "levanto antes de la senal",
  "last-release": "fue el ultimo en levantar",
  fallback: "deteccion incompleta",
};

function getChangedTouchIds(event: GestureResponderEvent): TouchId[] {
  return (event.nativeEvent.changedTouches ?? []).map((touch) => touch.identifier);
}

function getPlayerName(players: readonly GamePlayer[], playerId: string | null) {
  return players.find((player) => player.id === playerId)?.name ?? "alguien del grupo";
}

function pickFallbackPlayer(players: readonly GamePlayer[], preferredIds: readonly string[] = []) {
  return (
    preferredIds
      .map((playerId) => players.find((player) => player.id === playerId))
      .find(Boolean) ?? players[0]
  );
}

export default function SlowFingerGame(props: GameComponentProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [signalCountdown, setSignalCountdown] = useState(SIGNAL_COUNTDOWN_SECONDS);
  const [touchingByPlayerId, setTouchingByPlayerId] = useState<Record<string, boolean>>({});
  const [liftOrder, setLiftOrder] = useState<string[]>([]);
  const [releaseOrder, setReleaseOrder] = useState<ReleaseEntry[]>([]);
  const [result, setResult] = useState<RoundResult | null>(null);

  const activeRoundPlayerIdsRef = useRef<Set<string>>(new Set());
  const liftOrderRef = useRef<string[]>([]);
  const releaseOrderRef = useRef<ReleaseEntry[]>([]);
  const roundFinishedRef = useRef(false);
  const touchingByPlayerIdRef = useRef<Record<string, boolean>>({});
  const touchIdsByPlayerRef = useRef<Record<string, Set<TouchId> | undefined>>({});

  const hasEnoughPlayers = props.players.length >= MIN_PLAYERS;
  const loserPlayer = props.players.find((player) => player.id === result?.loserId);
  const touchingCount = props.players.filter((player) => touchingByPlayerId[player.id]).length;
  const allPlayersTouching =
    hasEnoughPlayers && props.players.every((player) => touchingByPlayerId[player.id]);
  const penaltySuggestion = `Sugerencia: aplica hasta ${props.roundCap} en modo ${props.penaltyMode}.`;
  const usesCompactGrid = props.players.length >= 4;
  const boardMinHeight =
    props.players.length <= 2
      ? 470
      : props.players.length === 3
        ? 580
        : props.players.length === 4
          ? 520
          : 620;
  const zoneMinHeight =
    props.players.length <= 2
      ? 184
      : props.players.length === 3
        ? 150
        : props.players.length === 4
          ? 170
          : 136;
  const sortedReleaseOrder = releaseOrder
    .map((entry, index) => ({ entry, index }))
    .sort((left, right) => left.entry.releasedAt - right.entry.releasedAt || left.index - right.index)
    .map(({ entry }) => entry);

  const setPlayerTouching = (playerId: string, isTouching: boolean) => {
    const nextTouching = { ...touchingByPlayerIdRef.current, [playerId]: isTouching };

    touchingByPlayerIdRef.current = nextTouching;
    setTouchingByPlayerId(nextTouching);
  };

  const clearTouchTracking = () => {
    touchingByPlayerIdRef.current = {};
    touchIdsByPlayerRef.current = {};
    setTouchingByPlayerId({});
  };

  const clearRoundState = () => {
    activeRoundPlayerIdsRef.current.clear();
    liftOrderRef.current = [];
    releaseOrderRef.current = [];
    roundFinishedRef.current = false;
    clearTouchTracking();
    setLiftOrder([]);
    setReleaseOrder([]);
    setResult(null);
    setSignalCountdown(SIGNAL_COUNTDOWN_SECONDS);
  };

  const finishRound = (nextResult: RoundResult) => {
    if (roundFinishedRef.current) {
      return;
    }

    warningTap();
    roundFinishedRef.current = true;
    clearTouchTracking();
    setResult(nextResult);
    setPhase("result");
    props.pauseTimer();
  };

  const finishFallbackRound = (detail = "No se pudo detectar el orden completo de levantamiento.") => {
    const liftedIds = new Set(liftOrderRef.current);
    const remainingIds = Array.from(activeRoundPlayerIdsRef.current).filter(
      (playerId) => !liftedIds.has(playerId),
    );
    const loser = pickFallbackPlayer(props.players, remainingIds);

    finishRound({
      loserId: loser?.id ?? null,
      message: loser ? `${loser.name} pierde por deteccion incompleta.` : detail,
      reason: "fallback",
    });
  };

  useEffect(() => {
    if (phase !== "countdown") {
      return undefined;
    }

    if (signalCountdown <= 0) {
      if (activeRoundPlayerIdsRef.current.size < MIN_PLAYERS) {
        finishFallbackRound("No habia suficientes dedos activos al llegar la senal.");
        return undefined;
      }

      heavyTap();
      setPhase("signal");
      props.restartTimer();
      return undefined;
    }

    const countdownTimer = setTimeout(() => {
      setSignalCountdown((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => clearTimeout(countdownTimer);
  }, [phase, props.restartTimer, signalCountdown]);

  const rememberZoneTouch = (playerId: string, event: GestureResponderEvent) => {
    const touchIds = getChangedTouchIds(event);
    const nextTouchIds = new Set(touchIdsByPlayerRef.current[playerId] ?? []);

    touchIds.forEach((touchId) => nextTouchIds.add(touchId));
    touchIdsByPlayerRef.current = {
      ...touchIdsByPlayerRef.current,
      [playerId]: nextTouchIds,
    };

    setPlayerTouching(playerId, nextTouchIds.size > 0 || touchIds.length === 0);
  };

  const releaseZoneTouch = (playerId: string, event: GestureResponderEvent) => {
    const touchIds = getChangedTouchIds(event);
    const nextTouchIds = new Set(touchIdsByPlayerRef.current[playerId] ?? []);

    if (touchIds.length === 0) {
      nextTouchIds.clear();
    } else {
      touchIds.forEach((touchId) => nextTouchIds.delete(touchId));
    }

    touchIdsByPlayerRef.current = {
      ...touchIdsByPlayerRef.current,
      [playerId]: nextTouchIds,
    };

    setPlayerTouching(playerId, nextTouchIds.size > 0);
    return nextTouchIds.size > 0;
  };

  const registerLiftAfterSignal = (playerId: string) => {
    if (roundFinishedRef.current) {
      return;
    }

    if (!activeRoundPlayerIdsRef.current.has(playerId)) {
      finishFallbackRound("Una zona recibio un levantamiento fuera de la ronda activa.");
      return;
    }

    if (liftOrderRef.current.includes(playerId)) {
      return;
    }

    touchIdsByPlayerRef.current = {
      ...touchIdsByPlayerRef.current,
      [playerId]: new Set(),
    };
    setPlayerTouching(playerId, false);

    const nextReleaseOrder = [...releaseOrderRef.current, { playerId, releasedAt: Date.now() }];
    releaseOrderRef.current = nextReleaseOrder;
    setReleaseOrder(nextReleaseOrder);

    const nextLiftOrder = nextReleaseOrder.map((entry) => entry.playerId);
    liftOrderRef.current = nextLiftOrder;
    setLiftOrder(nextLiftOrder);

    const allPlayersLifted = Array.from(activeRoundPlayerIdsRef.current).every((activePlayerId) =>
      nextLiftOrder.includes(activePlayerId),
    );

    if (!allPlayersLifted) {
      return;
    }

    const loserId = nextLiftOrder[nextLiftOrder.length - 1] ?? null;
    const loserName = getPlayerName(props.players, loserId);

    finishRound({
      loserId,
      message: `${loserName} fue el ultimo en levantar el dedo.`,
      reason: "last-release",
    });
  };

  const handleZoneTouchStart = (playerId: string, event: GestureResponderEvent) => {
    if (!hasEnoughPlayers || phase === "idle" || phase === "result") {
      return;
    }

    if (phase === "signal" && liftOrderRef.current.includes(playerId)) {
      return;
    }

    rememberZoneTouch(playerId, event);
  };

  const handleZoneTouchEnd = (playerId: string, event: GestureResponderEvent) => {
    if (!hasEnoughPlayers || phase === "idle" || phase === "result") {
      return;
    }

    const wasTouching = Boolean(
      touchingByPlayerIdRef.current[playerId] || touchIdsByPlayerRef.current[playerId]?.size,
    );
    releaseZoneTouch(playerId, event);

    if (!wasTouching) {
      return;
    }

    if (phase === "ready") {
      return;
    }

    if (phase === "countdown") {
      const playerName = getPlayerName(props.players, playerId);

      finishRound({
        loserId: playerId,
        message: `${playerName} levanto el dedo antes de la senal.`,
        reason: "early-release",
      });
      return;
    }

    registerLiftAfterSignal(playerId);
  };

  const startSignalCountdown = () => {
    const readyPlayerIds = props.players
      .filter((player) => touchingByPlayerIdRef.current[player.id])
      .map((player) => player.id);

    if (readyPlayerIds.length !== props.players.length) {
      return;
    }

    activeRoundPlayerIdsRef.current = new Set(readyPlayerIds);
    liftOrderRef.current = [];
    releaseOrderRef.current = [];
    roundFinishedRef.current = false;
    setLiftOrder([]);
    setReleaseOrder([]);
    setResult(null);
    setSignalCountdown(SIGNAL_COUNTDOWN_SECONDS);
    setPhase("countdown");
    props.pauseTimer();
    mediumTap();
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
      startSignalCountdown();
      return;
    }

    if (phase === "result") {
      clearRoundState();
      setPhase("ready");
      props.resetTimer();
    }
  };

  const getZoneStatus = (playerId: string): ZoneStatus => {
    if (phase === "result" && result) {
      if (result.reason === "early-release") {
        return result.loserId === playerId ? "eliminated" : "released";
      }

      if (result.loserId === playerId) {
        return "lost";
      }

      if (result.reason === "last-release" && sortedReleaseOrder[0]?.playerId === playerId) {
        return "fastest";
      }

      return "released";
    }

    if (liftOrder.includes(playerId)) {
      return "released";
    }

    if (touchingByPlayerId[playerId]) {
      return "touching";
    }

    return "waiting";
  };

  const getZoneTone = (status: ZoneStatus) => {
    if (status === "fastest") return "success";
    if (status === "touching") return "success";
    if (status === "released") return "cyan";
    if (status === "lost") return "danger";
    if (status === "eliminated") return "danger";
    return "neutral";
  };

  const isTouchPhase = phase === "ready" || phase === "countdown" || phase === "signal";
  const phaseBadgeLabel =
    phase === "idle"
      ? "preparacion"
      : phase === "ready"
        ? "dedos listos"
        : phase === "countdown"
          ? "cuenta"
          : phase === "signal"
            ? "senal"
            : "resultado";

  let promptTitle = "Prepara la ronda";
  let promptText = "Cada jugador pone un dedo en su zona.";
  let promptFootnote = "Pulsa PREPARAR RONDA para activar las zonas tactiles.";

  if (!hasEnoughPlayers) {
    promptTitle = "Se necesitan minimo 2 jugadores";
    promptText = "Agrega otra persona al lobby antes de iniciar Dedo mas lento.";
    promptFootnote = "Este juego necesita competencia entre al menos dos jugadores.";
  } else if (phase === "ready") {
    promptTitle = "Cada dedo en su zona";
    promptText = "Cada jugador pone un dedo en su zona.";
    promptFootnote = allPlayersTouching
      ? "Todos estan tocando. Pulsa INICIAR SENAL."
      : "El boton se activa cuando todas las zonas tienen un dedo.";
  } else if (phase === "countdown") {
    promptTitle = "No levanten";
    promptText = "No levanten el dedo hasta la senal.";
    promptFootnote = "La vibracion fuerte marca la senal para levantar.";
  } else if (phase === "signal") {
    promptTitle = "Senal";
    promptText = "Ya pueden levantar el dedo. El ultimo en levantar pierde.";
    promptFootnote = "Cada zona registra el orden de levantamiento.";
  } else if (phase === "result") {
    promptTitle = "Resultado";
    promptText = result
      ? `${result.message} ${penaltySuggestion}`
      : `Resultado incompleto. ${penaltySuggestion}`;
    promptFootnote = "Pulsa NUEVA RONDA para limpiar el estado sin salir del juego.";
  }

  const game = {
    ...props.game,
    prompt: {
      ...props.game.prompt,
      title: promptTitle,
      text: promptText,
      emptyText: "Se necesitan minimo 2 jugadores para jugar Dedo mas lento.",
      footnote: promptFootnote,
    },
  };

  const primaryActionLabel = !hasEnoughPlayers
    ? "SE NECESITAN 2 JUGADORES"
    : phase === "idle"
      ? "PREPARAR RONDA"
      : phase === "ready"
        ? "INICIAR SENAL"
        : phase === "result"
          ? "NUEVA RONDA"
          : phase === "countdown"
            ? "CUENTA REGRESIVA"
            : "LEVANTEN LOS DEDOS";

  const primaryActionDisabled =
    !hasEnoughPlayers ||
    phase === "countdown" ||
    phase === "signal" ||
    (phase === "ready" && !allPlayersTouching);

  const boardStatusText =
    phase === "ready"
      ? allPlayersTouching
        ? "Todos estan tocando. Inicia la senal."
        : `Faltan ${props.players.length - touchingCount} zona(s) por tocar.`
      : phase === "countdown"
        ? "No levanten hasta la senal."
        : phase === "signal"
          ? "Levanten. El ultimo pierde."
          : phase === "result"
            ? "Ronda terminada."
            : "Prepara las zonas tactiles.";
  const showSignalOverlay = phase === "countdown" || phase === "signal";
  const signalOverlayValue = phase === "signal" ? "YA" : `${Math.max(1, signalCountdown)}`;

  const gameContent = (
    <Card className="p-5" glow>
      {!hasEnoughPlayers ? (
        <>
          <GameBadge label="faltan jugadores" tone="warning" selected />
          <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
            Se necesitan minimo 2 jugadores
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
            Actualmente hay {props.players.length}. Agrega otra persona desde el lobby.
          </Text>
        </>
      ) : (
        <>
          <View className="flex-row items-center justify-between gap-3">
            <GameBadge
              label={phaseBadgeLabel}
              tone={phase === "result" ? "warning" : phase === "signal" ? "cyan" : "primary"}
              selected
            />
            <GameBadge label={`${touchingCount}/${props.players.length} dedos`} tone="cyan" />
          </View>

          <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
            Cada jugador pone un dedo en su zona.
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
            {phase === "countdown"
              ? "No levanten el dedo hasta la senal."
              : phase === "signal"
                ? "Ya pueden levantar. El ultimo en levantar sera el perdedor."
                : "Cuando todas las zonas esten tocando, inicia la senal."}
          </Text>

          <View style={[styles.touchBoard, webGameControlStyle, { minHeight: boardMinHeight }]}>
            <View style={styles.boardHeader}>
              <View style={styles.boardCopy}>
                <Text numberOfLines={1} style={[styles.boardTitle, webNoSelectTextStyle]}>
                  Tablero tactil
                </Text>
                <Text numberOfLines={1} style={[styles.boardStatus, webNoSelectTextStyle]}>
                  {boardStatusText}
                </Text>
              </View>
              <GameBadge
                label={phase === "signal" ? "levanten" : phase === "countdown" ? "no levanten" : "zonas"}
                tone={phase === "signal" ? "success" : phase === "countdown" ? "warning" : "cyan"}
                selected={phase === "signal" || phase === "countdown"}
              />
            </View>

            <View style={styles.touchGrid}>
              {props.players.map((player) => {
                const status = getZoneStatus(player.id);
                const liftPosition = liftOrder.indexOf(player.id) + 1;

                return (
                  <View
                    key={player.id}
                    onResponderTerminationRequest={() => false}
                    onStartShouldSetResponder={() => isTouchPhase}
                    onTouchCancel={(event) => handleZoneTouchEnd(player.id, event)}
                    onTouchEnd={(event) => handleZoneTouchEnd(player.id, event)}
                    onTouchStart={(event) => handleZoneTouchStart(player.id, event)}
                    style={[
                      styles.playerZone,
                      usesCompactGrid ? styles.playerZoneCompact : styles.playerZoneFull,
                      webGameControlStyle,
                      {
                        borderColor:
                          status === "touching"
                            ? colors.success
                            : status === "eliminated"
                              ? colors.error
                              : player.color,
                        minHeight: zoneMinHeight,
                      },
                    ]}
                  >
                    <View style={styles.playerZoneTop}>
                      <PlayerAvatar
                        active={status === "touching"}
                        color={player.color}
                        name={player.name}
                        selected={status === "eliminated"}
                        size={usesCompactGrid ? 48 : 58}
                      />
                      <View style={styles.playerTextBlock}>
                        <Text numberOfLines={1} style={[styles.playerName, webNoSelectTextStyle]}>
                          {player.name}
                        </Text>
                        <Text style={[styles.playerHint, webNoSelectTextStyle]}>
                          {status === "touching"
                            ? phase === "countdown"
                              ? "mantener"
                              : "dedo abajo"
                            : status === "fastest"
                              ? "mas rapido"
                              : status === "released"
                                ? liftPosition > 0
                                  ? `orden ${liftPosition}`
                                  : "ronda cerrada"
                              : status === "lost"
                                ? "pierde"
                                : status === "eliminated"
                                  ? "eliminado"
                                  : "pon tu dedo aqui"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.zoneFooter}>
                      <GameBadge
                        label={statusLabels[status]}
                        tone={getZoneTone(status)}
                        selected={
                          status === "touching" ||
                          status === "fastest" ||
                          status === "lost" ||
                          status === "eliminated"
                        }
                      />
                      {(status === "released" || status === "fastest" || status === "lost") &&
                      liftPosition > 0 ? (
                        <Text style={[styles.liftOrderText, webNoSelectTextStyle]}>
                          #{liftPosition}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>

            {showSignalOverlay ? (
              <View pointerEvents="none" style={styles.boardOverlay}>
                <View
                  style={[
                    styles.signalOverlayCard,
                    phase === "signal" ? styles.signalOverlayCardActive : null,
                  ]}
                >
                  <GameBadge
                    label={phase === "countdown" ? "no levanten" : "levanten"}
                    tone={phase === "countdown" ? "warning" : "success"}
                    selected
                  />
                  <Text style={[styles.signalNumber, webNoSelectTextStyle]}>
                    {signalOverlayValue}
                  </Text>
                  <Text style={[styles.signalText, webNoSelectTextStyle]}>
                    {phase === "countdown"
                      ? "No levanten el dedo hasta la senal."
                      : "La senal sono. Registrando levantamientos."}
                  </Text>
                </View>
              </View>
            ) : null}

            {phase === "result" && result ? (
              <View pointerEvents="none" style={styles.boardOverlay}>
                <View
                  style={[
                    styles.resultOverlayCard,
                    result.reason === "last-release" ? styles.resultOverlayCardRanking : null,
                    result.reason === "fallback" ? styles.resultOverlayCardFallback : null,
                  ]}
                >
                  {result.reason === "last-release" ? (
                    <>
                      <GameBadge label="clasificacion" tone="cyan" selected />
                      <Text style={[styles.resultTitle, webNoSelectTextStyle]}>Clasificacion</Text>
                      <View style={styles.classificationList}>
                        {sortedReleaseOrder.map((entry, index) => {
                          const player = props.players.find(
                            (currentPlayer) => currentPlayer.id === entry.playerId,
                          );
                          const isFastest = index === 0;
                          const isLoser = entry.playerId === result.loserId;

                          return (
                            <View
                              key={entry.playerId}
                              style={[
                                styles.classificationRow,
                                isFastest ? styles.classificationRowFastest : null,
                                isLoser ? styles.classificationRowLoser : null,
                              ]}
                            >
                              <Text style={[styles.rankNumber, webNoSelectTextStyle]}>
                                {index + 1}.
                              </Text>
                              <PlayerAvatar
                                active={isFastest}
                                color={player?.color}
                                name={player?.name}
                                selected={isLoser}
                                size={38}
                              />
                              <View style={styles.classificationCopy}>
                                <Text
                                  numberOfLines={1}
                                  style={[styles.classificationName, webNoSelectTextStyle]}
                                >
                                  {player?.name ?? "Jugador"}
                                </Text>
                                <Text style={[styles.classificationStatus, webNoSelectTextStyle]}>
                                  {isFastest ? "mas rapida" : isLoser ? "perdio" : "levanto"}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                      <Text style={[styles.penaltyText, webNoSelectTextStyle]}>
                        {penaltySuggestion}
                      </Text>
                    </>
                  ) : result.reason === "early-release" ? (
                    <>
                      <GameBadge label="perdedor automatico" tone="danger" selected />
                      <View style={styles.resultContent}>
                        <PlayerAvatar
                          color={loserPlayer?.color}
                          name={loserPlayer?.name}
                          selected
                          size={76}
                        />
                        <Text style={[styles.resultTitle, webNoSelectTextStyle]}>
                          {loserPlayer?.name ?? "Alguien del grupo"}
                        </Text>
                        <Text style={[styles.resultText, webNoSelectTextStyle]}>
                          Razon: Levanto antes de la senal.
                        </Text>
                        <Text style={[styles.penaltyText, webNoSelectTextStyle]}>
                          {penaltySuggestion}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <GameBadge label="resultado estimado" tone="warning" selected />
                      <View style={styles.resultContent}>
                        <PlayerAvatar
                          color={loserPlayer?.color}
                          name={loserPlayer?.name}
                          selected
                          size={76}
                        />
                        <Text style={[styles.resultTitle, webNoSelectTextStyle]}>
                          Resultado estimado
                        </Text>
                        <Text style={[styles.resultText, webNoSelectTextStyle]}>
                          Resultado estimado por deteccion tactil.
                        </Text>
                        <Text style={[styles.resultText, webNoSelectTextStyle]}>
                          {result.message}
                        </Text>
                        <Text style={[styles.penaltyText, webNoSelectTextStyle]}>
                          {penaltySuggestion}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            ) : null}
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
      primaryActionDisabled={primaryActionDisabled}
      primaryActionLabel={primaryActionLabel}
    />
  );
}

const styles = StyleSheet.create({
  touchBoard: {
    backgroundColor: colors.surfaceLowest,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: 22,
    overflow: "hidden",
    padding: 14,
    position: "relative",
    shadowColor: glow.cyan.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: glow.cyan.radius,
    elevation: 5,
  },
  boardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    height: 58,
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  boardCopy: {
    flex: 1,
    minWidth: 0,
  },
  boardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  boardStatus: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  boardOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(17, 12, 21, 0.58)",
    justifyContent: "center",
    padding: 18,
    zIndex: 10,
  },
  signalOverlayCard: {
    alignItems: "center",
    backgroundColor: colors.glassFillStrong,
    borderColor: colors.warning,
    borderRadius: radius.md,
    borderWidth: 1,
    maxWidth: "92%",
    minWidth: 220,
    paddingHorizontal: 24,
    paddingVertical: 22,
    shadowColor: glow.pink.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.24,
    shadowRadius: glow.pink.radius,
    elevation: 6,
  },
  signalOverlayCardActive: {
    borderColor: colors.success,
    shadowColor: glow.success.color,
    shadowOpacity: 0.32,
  },
  signalNumber: {
    color: colors.text,
    fontSize: 86,
    fontWeight: "900",
    lineHeight: 96,
    marginTop: 8,
    textAlign: "center",
  },
  signalText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
    textAlign: "center",
  },
  resultOverlayCard: {
    alignItems: "center",
    backgroundColor: colors.glassFillStrong,
    borderColor: colors.error,
    borderRadius: radius.md,
    borderWidth: 1,
    maxWidth: "92%",
    minWidth: "82%",
    padding: 20,
    shadowColor: glow.pink.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.26,
    shadowRadius: glow.pink.radius,
    elevation: 7,
  },
  resultOverlayCardRanking: {
    borderColor: colors.cyanDim,
    shadowColor: glow.cyan.color,
  },
  resultOverlayCardFallback: {
    borderColor: colors.warning,
  },
  resultContent: {
    alignItems: "center",
    marginTop: 14,
  },
  resultTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 14,
    textAlign: "center",
  },
  resultText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 8,
    textAlign: "center",
  },
  penaltyText: {
    color: colors.warningSoft,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 19,
    marginTop: 10,
    textAlign: "center",
  },
  classificationList: {
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  classificationRow: {
    alignItems: "center",
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.innerBorder,
    borderRadius: radius.default,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
  },
  classificationRowFastest: {
    borderColor: colors.success,
    shadowColor: glow.success.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: glow.success.radius,
  },
  classificationRowLoser: {
    borderColor: colors.error,
  },
  rankNumber: {
    color: colors.cyan,
    fontSize: 18,
    fontWeight: "900",
    minWidth: 28,
  },
  classificationCopy: {
    flex: 1,
    minWidth: 0,
  },
  classificationName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  classificationStatus: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 3,
  },
  touchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    paddingBottom: 2,
  },
  playerZone: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: radius.md,
    borderWidth: 2,
    justifyContent: "space-between",
    padding: 14,
    shadowColor: glow.cyan.color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: glow.cyan.radius,
    elevation: 4,
  },
  playerZoneFull: {
    width: "100%",
  },
  playerZoneCompact: {
    flexGrow: 1,
    width: "47%",
  },
  playerZoneTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  playerTextBlock: {
    flex: 1,
  },
  playerName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  playerHint: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },
  zoneFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  liftOrderText: {
    color: colors.cyan,
    fontSize: 18,
    fontWeight: "900",
  },
});
