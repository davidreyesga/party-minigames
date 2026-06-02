import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, Text, View } from "react-native";

import type { RootStackParamList, GameId } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Games">;

const GAMES: {
  id: GameId;
  title: string;
  subtitle: string;
  tag: string;
}[] = [
  { id: "roulette", title: "Ruleta por nivel", subtitle: "Retos con escalado por ronda", tag: "PICANTE" },
  { id: "wouldYouRather", title: "Que prefieres?", subtitle: "Dilemas rapidos de grupo", tag: "DEBATE" },
  { id: "rapidCategory", title: "Categoria relampago", subtitle: "Tiempo limite + categoria", tag: "RAPIDO" },
  { id: "slowFinger", title: "Dedo mas lento", subtitle: "Reflejos en mesa y pantalla", tag: "REFLEJOS" },
  { id: "impostor", title: "Impostor", subtitle: "Roles ocultos y voto final", tag: "SOCIAL" },
  { id: "rhymes", title: "Rimas", subtitle: "Cadena rapida sin repetir", tag: "RITMO" },
  { id: "sequence", title: "Secuencia", subtitle: "Memoria que crece por turno", tag: "MENTE" },
  { id: "mostLikely", title: "Mas probable", subtitle: "Votacion express del grupo", tag: "GRUPO" },
];

function GameTag({ label }: { label: string }) {
  return (
    <View
      className="self-start px-2.5 py-1"
      style={{
        backgroundColor: colors.surface2,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.pill,
      }}
    >
      <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: colors.glow }}>
        {label}
      </Text>
    </View>
  );
}

export default function GamesScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen>
      <Header
        title="Juegos"
        subtitle="Elige un juego y mantengan un ritmo divertido."
        onRulesPress={() => {}}
      />

      <Card className="p-4">
        <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
          GRUPO ACTUAL
        </Text>
        <Text className="mt-2 text-sm leading-6" style={{ color: colors.text }}>
          Jugadores detectados:{" "}
          <Text style={{ color: colors.glow, fontWeight: "900" }}>{playersCount}</Text>. El punto
          ideal para una buena ronda es 3+.
        </Text>
      </Card>

      <View className="mt-4 flex-1">
        <FlatList
          data={GAMES}
          keyExtractor={(g) => g.id}
          ItemSeparatorComponent={() => <View className="h-3" />}
          contentContainerStyle={{ paddingBottom: 18, paddingTop: 6 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("Game", { gameId: item.id })}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.99 : 1 }],
                opacity: pressed ? 0.95 : 1,
              })}
            >
              <Card className="p-4" glow>
                <GameTag label={item.tag} />
                <Text className="mt-3 text-xl font-extrabold" style={{ color: colors.text }}>
                  {item.title}
                </Text>
                <Text className="mt-1 text-sm" style={{ color: colors.textMuted }}>
                  {item.subtitle}
                </Text>
                <Text className="mt-3 text-xs font-extrabold tracking-wider" style={{ color: colors.accent }}>
                  TOCA PARA JUGAR
                </Text>
              </Card>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}
