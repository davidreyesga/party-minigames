import { useEffect, useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import GameShell from "../components/game/GameShell";
import { getGameById } from "../data/games";
import useCountdown from "../hooks/useCountdown";
import { useSessionStore } from "../store/session.store";
import { useSettingsStore } from "../store/settings.store";

import { SecondaryButton } from "../components/ui/Button";
import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import Screen from "../components/ui/Screen";
import { colors } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const FALLBACK_TIMER_SECONDS = 15;

export default function GameScreen({ route, navigation }: Props) {
  const { gameId } = route.params;
  const [rulesVisible, setRulesVisible] = useState(false);

  const players = useSessionStore((s) => s.players);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const nextPlayer = useSessionStore((s) => s.nextPlayer);

  const penaltyMode = useSettingsStore((s) => s.penaltyMode);
  const roundCap = useSettingsStore((s) => s.roundCap);
  const defaultLevel = useSettingsStore((s) => s.defaultLevel);
  const timers = useSettingsStore((s) => s.timers);

  const game = getGameById(gameId);
  const current = players[currentIndex];
  const hasPlayers = players.length > 0;
  const timerSeconds = game?.suggestedTimerSeconds
    ? timers[game.suggestedTimerSeconds]
    : game
      ? FALLBACK_TIMER_SECONDS
      : 0;
  const countdown = useCountdown(timerSeconds);

  useEffect(() => {
    countdown.restartWith(timerSeconds);
  }, [countdown.restartWith, gameId, timerSeconds]);

  const handleBackToCatalog = () => navigation.navigate("Games");
  const handleOpenRules = () => setRulesVisible(true);
  const handleCloseRules = () => setRulesVisible(false);
  const handlePrimaryPress = () => {
    if (hasPlayers) {
      nextPlayer();
      return;
    }

    navigation.navigate("Lobby");
  };

  if (!game) {
    return (
      <Screen scroll>
        <Header
          title="Juego no disponible"
          subtitle="No encontramos la configuracion para este minijuego."
        />

        <Card className="p-5" glow>
          <GameBadge label="fallback" tone="warning" selected />
          <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
            El catalogo no reconoce este juego.
          </Text>
          <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
            Vuelve al catalogo y selecciona uno de los minijuegos disponibles.
          </Text>
        </Card>

        <View className="mt-4">
          <SecondaryButton label="VOLVER AL CATALOGO" onPress={handleBackToCatalog} />
        </View>
      </Screen>
    );
  }

  return (
    <GameShell
      countdownSeconds={countdown.seconds}
      countdownTotalSeconds={countdown.totalSeconds}
      currentPlayer={current}
      defaultLevel={defaultLevel}
      game={game}
      hasPlayers={hasPlayers}
      onBackToCatalog={handleBackToCatalog}
      onCloseRules={handleCloseRules}
      onOpenRules={handleOpenRules}
      onPrimaryPress={handlePrimaryPress}
      penaltyMode={penaltyMode}
      playersCount={players.length}
      roundCap={roundCap}
      rulesVisible={rulesVisible}
      timerSeconds={timerSeconds}
    />
  );
}
