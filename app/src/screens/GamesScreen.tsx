import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, Text, View } from "react-native";

import type { RootStackParamList, GameId } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import { colors } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Games">;

const GAMES: { id: GameId; title: string; subtitle: string }[] = [
  { id: "roulette", title: "Ruleta por nivel", subtitle: "Retos + escalado si no lo haces" },
  { id: "wouldYouRather", title: "¿Qué prefieres?", subtitle: "Con niveles de incomodidad" },
  { id: "rapidCategory", title: "Categoría relámpago", subtitle: "Timer + categoría aleatoria" },
  { id: "slowFinger", title: "Dedo más lento", subtitle: "Reflejos en mesa/pantalla" },
  { id: "impostor", title: "Impostor", subtitle: "Roles ocultos + votación" },
  { id: "rhymes", title: "Rimas", subtitle: "Rápido con temporizador" },
  { id: "sequence", title: "Secuencia", subtitle: "Crece 1 ítem por turno" },
  { id: "mostLikely", title: "¿Quién es más probable?", subtitle: "Votación del grupo" },
];

export default function GamesScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen>
      <Header
        title="Juegos"
        subtitle="Elige un minijuego. (Luego añadimos favoritos y categorías)"
        onRulesPress={() => {}}
      />

      <Card className="p-4">
        <Text className="text-xs font-bold tracking-widest" style={{ color: colors.textMuted }}>
          RECOMENDACIÓN
        </Text>
        <Text className="mt-2 text-sm" style={{ color: colors.text }}>
          Para jugar mejor:{" "}
          <Text style={{ color: colors.glow, fontWeight: "800" }}>{playersCount}</Text>{" "}
          jugador(es). Ideal 3+.
        </Text>
      </Card>

      <View className="mt-4 flex-1">
        <FlatList
          data={GAMES}
          keyExtractor={(g) => g.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerStyle={{ paddingBottom: 18, paddingTop: 6 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("Game", { gameId: item.id })}
              className="active:opacity-90"
            >
              <Card className="p-4">
                <Text className="text-base font-extrabold" style={{ color: colors.text }}>
                  {item.title}
                </Text>
                <Text className="mt-1 text-sm" style={{ color: colors.textMuted }}>
                  {item.subtitle}
                </Text>
                <Text className="mt-3 text-xs font-bold" style={{ color: colors.glow }}>
                  ABRIR →
                </Text>
              </Card>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}