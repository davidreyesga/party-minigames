import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { GameBadgeTone, GameCatalogItem } from "../../data/games";
import { colors, radius } from "../../theme/tokens";

import GameActionDock, { GAME_ACTION_DOCK_SCROLL_PADDING } from "./GameActionDock";
import Card from "../ui/Card";
import GameBadge from "../ui/GameBadge";
import Header from "../ui/Header";
import PromptCard from "../ui/PromptCard";
import RulesModal from "../ui/RulesModal";
import Screen from "../ui/Screen";
import TimerRing from "../ui/TimerRing";
import TurnCard from "../ui/TurnCard";

type CurrentPlayer = {
  name: string;
  color: string;
};

type Props = {
  game: GameCatalogItem;
  playersCount: number;
  currentPlayer?: CurrentPlayer;
  hasPlayers: boolean;
  penaltyMode: string;
  defaultLevel: string;
  roundCap: number;
  timerSeconds: number;
  countdownSeconds: number;
  countdownTotalSeconds: number;
  gameContent?: ReactNode;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  rulesVisible: boolean;
  onOpenRules: () => void;
  onCloseRules: () => void;
  onPrimaryPress: () => void;
  onBackToCatalog: () => void;
};

function ConfigTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: GameBadgeTone;
}) {
  return (
    <View
      className="flex-1 px-3 py-3"
      style={{
        backgroundColor: colors.surfaceLow,
        borderColor: colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
      }}
    >
      <GameBadge label={label} tone={tone} />
      <Text className="mt-3 text-lg font-extrabold" style={{ color: colors.text }}>
        {value}
      </Text>
    </View>
  );
}

export default function GameShell({
  game,
  playersCount,
  currentPlayer,
  hasPlayers,
  penaltyMode,
  defaultLevel,
  roundCap,
  timerSeconds,
  countdownSeconds,
  countdownTotalSeconds,
  gameContent,
  primaryActionLabel,
  primaryActionDisabled = false,
  rulesVisible,
  onOpenRules,
  onCloseRules,
  onPrimaryPress,
  onBackToCatalog,
}: Props) {
  const primaryLabel = primaryActionLabel ?? (hasPlayers ? "SIGUIENTE TURNO" : "INICIAR RONDA");

  return (
    <View style={styles.root}>
      <Screen scroll>
        <Header title={game.title} subtitle={game.description} onRulesPress={onOpenRules} />

        <View className="gap-4" style={styles.contentStack}>
          <Card className="p-4" glow>
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <GameBadge label={game.typeLabel} tone={game.badgeVariant} selected />
                <Text className="mt-4 text-xl font-extrabold leading-7" style={{ color: colors.text }}>
                  Shell de partida
                </Text>
                <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
                  Base visual lista para conectar la mecanica real de este minijuego.
                </Text>
              </View>
              <GameBadge
                label={`${playersCount}/${game.minPlayers} jugadores`}
                tone={hasPlayers ? "cyan" : "warning"}
              />
            </View>
          </Card>

          <TurnCard
            playerName={currentPlayer?.name}
            playerColor={currentPlayer?.color}
            subtitle={
              hasPlayers
                ? "Completa la instruccion temporal y avanza al siguiente turno."
                : "Agrega jugadores al lobby para iniciar una ronda real."
            }
          />

          {!hasPlayers ? (
            <Card className="p-5">
              <GameBadge label="sin jugadores" tone="warning" selected />
              <Text className="mt-4 text-xl font-extrabold" style={{ color: colors.text }}>
                La mesa todavia esta vacia.
              </Text>
              <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
                Vuelve al lobby y agrega al menos una persona para que el turno, el timer y las acciones
                tengan contexto.
              </Text>
            </Card>
          ) : null}

          <PromptCard
            footnote={game.prompt.footnote}
            text={hasPlayers ? game.prompt.text : game.prompt.emptyText}
            title={game.prompt.title}
          />

          {gameContent}

          <Card className="p-5">
            <View className="items-center">
              <GameBadge label="timer sugerido" tone="cyan" selected />
              <View className="mt-5">
                <TimerRing
                  dangerThreshold={Math.max(3, Math.floor(countdownTotalSeconds / 3))}
                  label={game.timerLabel}
                  seconds={countdownSeconds}
                  totalSeconds={countdownTotalSeconds}
                />
              </View>
              <Text className="mt-4 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
                Cuenta regresiva activa con el valor configurado para este juego.
              </Text>
            </View>
          </Card>

          <Card className="p-5">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
                  CONFIGURACION ACTUAL
                </Text>
                <Text className="mt-2 text-sm leading-5" style={{ color: colors.textMuted }}>
                  Esta partida lee los ajustes globales sin duplicar estado.
                </Text>
              </View>
              <GameBadge label={game.timerLabel} tone={game.badgeVariant} />
            </View>

            <View className="mt-4 flex-row gap-2">
              <ConfigTile label="modo" tone="warning" value={penaltyMode} />
              <ConfigTile label="nivel" tone="primary" value={defaultLevel} />
            </View>
            <View className="mt-2 flex-row gap-2">
              <ConfigTile label="tope" tone="cyan" value={`${roundCap}`} />
              <ConfigTile label="timer" tone="pink" value={`${timerSeconds}s`} />
            </View>
          </Card>
        </View>

        <RulesModal
          onClose={onCloseRules}
          rules={game.rules}
          title={`Reglas: ${game.title}`}
          visible={rulesVisible}
        />
      </Screen>

      <GameActionDock
        onPrimaryPress={onPrimaryPress}
        onSecondaryPress={onBackToCatalog}
        primaryDisabled={primaryActionDisabled}
        primaryLabel={primaryLabel}
        secondaryLabel="VOLVER AL CATALOGO"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  contentStack: {
    paddingBottom: GAME_ACTION_DOCK_SCROLL_PADDING,
  },
});
