import { useState } from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import { type GameBadgeTone, getGameById } from "../data/games";
import { useSessionStore } from "../store/session.store";
import { useSettingsStore } from "../store/settings.store";

import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import PromptCard from "../components/ui/PromptCard";
import RulesModal from "../components/ui/RulesModal";
import Screen from "../components/ui/Screen";
import TimerRing from "../components/ui/TimerRing";
import TurnCard from "../components/ui/TurnCard";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

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
          <SecondaryButton label="VOLVER AL CATALOGO" onPress={() => navigation.navigate("Games")} />
        </View>
      </Screen>
    );
  }

  const timerKey = game.suggestedTimerSeconds ?? "impostorQnA";
  const timerSeconds = timers[timerKey];

  return (
    <Screen scroll>
      <Header
        title={game.title}
        subtitle={game.description}
        onRulesPress={() => setRulesVisible(true)}
      />

      <View className="gap-4 pb-3">
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
              label={`${players.length}/${game.minPlayers} jugadores`}
              tone={hasPlayers ? "cyan" : "warning"}
            />
          </View>
        </Card>

        <TurnCard
          playerName={current?.name}
          playerColor={current?.color}
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

        <Card className="p-5">
          <View className="items-center">
            <GameBadge label="timer sugerido" tone="cyan" selected />
            <View className="mt-5">
              <TimerRing
                dangerThreshold={Math.max(3, Math.floor(timerSeconds / 3))}
                label={game.timerLabel}
                seconds={timerSeconds}
                totalSeconds={timerSeconds}
              />
            </View>
            <Text className="mt-4 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
              Usa el valor actual del store para dejar preparada la futura cuenta regresiva.
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

        <View className="gap-3">
          <PrimaryButtonGiant
            label={hasPlayers ? "SIGUIENTE TURNO" : "INICIAR RONDA"}
            onPress={hasPlayers ? nextPlayer : () => navigation.navigate("Lobby")}
          />
          <SecondaryButton label="VOLVER AL CATALOGO" onPress={() => navigation.navigate("Games")} />
        </View>
      </View>

      <RulesModal
        onClose={() => setRulesVisible(false)}
        rules={game.rules}
        title={`Reglas: ${game.title}`}
        visible={rulesVisible}
      />
    </Screen>
  );
}
