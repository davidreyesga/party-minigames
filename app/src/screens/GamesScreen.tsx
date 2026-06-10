import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Pressable, Text, View } from "react-native";

import type { GameId, RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import Screen from "../components/ui/Screen";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Games">;

type BadgeTone = "primary" | "cyan" | "pink" | "success" | "warning" | "neutral";

const GAMES: {
  id: GameId;
  title: string;
  subtitle: string;
  type: string;
  tone: BadgeTone;
  code: string;
}[] = [
  { id: "roulette", title: "Ruleta por nivel", subtitle: "Retos que suben de intensidad.", type: "Azar", tone: "primary", code: "01" },
  { id: "wouldYouRather", title: "Que prefieres?", subtitle: "Dilemas para abrir debate.", type: "Dilemas", tone: "cyan", code: "02" },
  { id: "rapidCategory", title: "Categoria relampago", subtitle: "Piensa rapido antes del limite.", type: "Rapidez", tone: "pink", code: "03" },
  { id: "slowFinger", title: "Dedo mas lento", subtitle: "Reflejos y tension en la mesa.", type: "Reflejos", tone: "warning", code: "04" },
  { id: "impostor", title: "Impostor", subtitle: "Descubre el rol oculto del grupo.", type: "Roles ocultos", tone: "cyan", code: "05" },
  { id: "rhymes", title: "Rimas", subtitle: "Creatividad sin romper la cadena.", type: "Creatividad", tone: "pink", code: "06" },
  { id: "sequence", title: "Secuencia", subtitle: "Memoria que crece por turno.", type: "Memoria", tone: "primary", code: "07" },
  { id: "mostLikely", title: "Mas probable", subtitle: "Votacion express entre amigos.", type: "Votacion", tone: "success", code: "08" },
];

export default function GamesScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen>
      <Header title="Juegos" subtitle="Elige la energia de la proxima ronda." />

      <Card className="p-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-base font-extrabold" style={{ color: colors.text }}>
              Catalogo listo
            </Text>
            <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
              Tienes {playersCount} jugadores en el lobby. La mayoria de juegos brillan con grupos de 3 o mas.
            </Text>
          </View>
          <GameBadge label={`${playersCount} jugadores`} tone="cyan" selected />
        </View>
      </Card>

      <View className="mt-5 flex-1">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            MINIJUEGOS
          </Text>
          <GameBadge label={`${GAMES.length} disponibles`} variant="default" />
        </View>

        <FlatList
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={GAMES}
          ItemSeparatorComponent={() => <View className="h-3" />}
          keyExtractor={(game) => game.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-1">
              <Pressable
                accessibilityLabel={`Abrir ${item.title}`}
                accessibilityRole="button"
                onPress={() => navigation.navigate("Game", { gameId: item.id })}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Card className="min-h-[224px] p-4">
                  <View className="gap-3">
                    <View
                      className="h-10 w-10 items-center justify-center"
                      style={{
                        backgroundColor: colors.surfaceHigh,
                        borderColor: colors.innerBorder,
                        borderRadius: radius.default,
                        borderWidth: 1,
                      }}
                    >
                      <Text className="text-sm font-extrabold" style={{ color: colors.primary }}>
                        {item.code}
                      </Text>
                    </View>
                    <GameBadge label={item.type} tone={item.tone} />
                  </View>

                  <Text className="mt-5 text-lg font-extrabold leading-6" style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  <Text className="mt-2 text-xs leading-5" style={{ color: colors.textMuted }}>
                    {item.subtitle}
                  </Text>

                  <View
                    className="mt-auto items-center justify-center border px-3 py-2"
                    style={{
                      backgroundColor: colors.surfaceHigh,
                      borderColor: colors.innerBorder,
                      borderRadius: radius.pill,
                    }}
                  >
                    <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: colors.cyan }}>
                      ABRIR
                    </Text>
                  </View>
                </Card>
              </Pressable>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
