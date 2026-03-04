import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";
import { useSettingsStore } from "../store/settings.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import TurnCard from "../components/ui/TurnCard";
import PromptCard from "../components/ui/PromptCard";
import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import { colors } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

const TITLES: Record<string, string> = {
  roulette: "Ruleta por nivel",
  wouldYouRather: "¿Qué prefieres?",
  rapidCategory: "Categoría relámpago",
  slowFinger: "Dedo más lento",
  impostor: "Impostor",
  rhymes: "Rimas",
  sequence: "Secuencia",
  mostLikely: "¿Quién es más probable?",
};

export default function GameScreen({ route, navigation }: Props) {
  const { gameId } = route.params;

  const players = useSessionStore((s) => s.players);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const nextPlayer = useSessionStore((s) => s.nextPlayer);

  const penaltyMode = useSettingsStore((s) => s.penaltyMode);
  const roundCap = useSettingsStore((s) => s.roundCap);
  const defaultLevel = useSettingsStore((s) => s.defaultLevel);

  const current = players[currentIndex];

  return (
    <Screen scroll>
      <Header
        title={TITLES[gameId] ?? gameId}
        subtitle="Placeholder del juego. Aquí conectaremos la lógica real en el siguiente paso."
        onRulesPress={() => {
          // luego: abrir RulesModal
        }}
      />

      <TurnCard
        playerName={current?.name}
        playerColor={current?.color}
        subtitle="Cuando estés listo, usa el botón principal."
      />

      <View className="mt-4">
        <PromptCard
          title="Contexto"
          text={`Modo: ${penaltyMode} • Tope ronda: ${roundCap} • Nivel: ${defaultLevel}`}
          footnote="Luego conectamos: motor de penalización, timer y mazos JSON."
        />
      </View>

      <View className="mt-4 gap-3">
        <PrimaryButtonGiant label="SIGUIENTE JUGADOR" onPress={nextPlayer} />

        <SecondaryButton
          label="IR A LOBBY"
          onPress={() => navigation.navigate("Lobby")}
        />

        <SecondaryButton
          label="VOLVER A JUEGOS"
          onPress={() => navigation.navigate("Games")}
        />
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-xs font-bold tracking-widest" style={{ color: colors.textMuted }}>
            NOTA
          </Text>
          <Text className="mt-2 text-sm" style={{ color: colors.textMuted }}>
            En este punto definiremos componentes del motor común para que todos los minijuegos reutilicen la misma lógica.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}