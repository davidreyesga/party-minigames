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
  wouldYouRather: "Que prefieres?",
  rapidCategory: "Categoria relampago",
  slowFinger: "Dedo mas lento",
  impostor: "Impostor",
  rhymes: "Rimas",
  sequence: "Secuencia",
  mostLikely: "Mas probable",
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
        subtitle="Sigan la dinamica y mantengan la ronda en movimiento."
        onRulesPress={() => {
          // siguiente iteracion: modal de reglas por juego
        }}
      />

      <TurnCard
        playerName={current?.name}
        playerColor={current?.color}
        subtitle="Completa tu reto y pulsa SIGUIENTE TURNO."
      />

      <View className="mt-4">
        <PromptCard
          title="Ronda Activa"
          text={`Modo ${penaltyMode} | Tope ${roundCap} | Nivel ${defaultLevel}`}
          footnote="Proximo paso: retos reales, timer y mazos por juego."
        />
      </View>

      <View className="mt-4 gap-3">
        <PrimaryButtonGiant label="SIGUIENTE TURNO" onPress={nextPlayer} />

        <SecondaryButton label="VOLVER AL LOBBY" onPress={() => navigation.navigate("Lobby")} />

        <SecondaryButton label="VOLVER A JUEGOS" onPress={() => navigation.navigate("Games")} />
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            DEV NOTE
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: colors.textMuted }}>
            La base visual ya esta alineada para que los minijuegos entren sin rehacer UI.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
