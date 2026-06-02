import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { useSessionStore } from "../store/session.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import TurnCard from "../components/ui/TurnCard";
import { PrimaryButtonGiant, DangerButton } from "../components/ui/Button";
import { colors, radius } from "../theme/tokens";

function PlayerAvatar({ name, color }: { name: string; color: string }) {
  const initials = useMemo(() => {
    const parts = (name ?? "").trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-full border-2"
      style={{
        backgroundColor: color,
        borderColor: colors.glow,
      }}
    >
      <Text className="text-sm font-extrabold text-white">{initials}</Text>
    </View>
  );
}

export default function LobbyScreen() {
  const players = useSessionStore((s) => s.players);
  const currentIndex = useSessionStore((s) => s.currentIndex);
  const addPlayer = useSessionStore((s) => s.addPlayer);
  const removePlayer = useSessionStore((s) => s.removePlayer);
  const nextPlayer = useSessionStore((s) => s.nextPlayer);
  const setCurrentIndex = useSessionStore((s) => s.setCurrentIndex);
  const clearPlayers = useSessionStore((s) => s.clearPlayers);

  const [name, setName] = useState("");

  const currentPlayer = players[currentIndex];

  return (
    <Screen scroll>
      <Header
        title="Lobby"
        subtitle="Agrega jugadores y arranquen la ronda sin complicaciones."
        onRulesPress={() => {}}
      />

      <TurnCard
        playerName={currentPlayer?.name}
        playerColor={currentPlayer?.color}
        subtitle="Cuando termine su reto, pasa el turno al siguiente."
      />

      <View className="mt-4 gap-3">
        <PrimaryButtonGiant label="SIGUIENTE TURNO" onPress={nextPlayer} />
        <DangerButton label="REINICIAR JUGADORES" onPress={clearPlayers} />
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            NUEVO JUGADOR
          </Text>

          <View className="mt-3 flex-row gap-2">
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre"
              placeholderTextColor={colors.textMuted}
              className="flex-1 px-4 py-3 text-base"
              style={{
                backgroundColor: colors.surface2,
                borderColor: colors.border,
                borderWidth: 2,
                borderRadius: radius.pill,
                color: colors.text,
              }}
              returnKeyType="done"
              onSubmitEditing={() => {
                addPlayer(name);
                setName("");
              }}
            />
            <Pressable
              onPress={() => {
                addPlayer(name);
                setName("");
              }}
              className="h-12 items-center justify-center px-5"
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                borderColor: colors.glow,
                borderWidth: 2,
                borderRadius: radius.pill,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Text className="text-sm font-extrabold tracking-wide text-white">AGREGAR</Text>
            </Pressable>
          </View>
        </Card>
      </View>

      <View className="mt-6">
        <Text className="mb-2 text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
          PLAYERS ({players.length})
        </Text>

        <FlatList
          data={players}
          keyExtractor={(p) => p.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => {
            const isCurrent = index === currentIndex;

            return (
              <Pressable onPress={() => setCurrentIndex(index)} className="active:opacity-90">
                <Card className="p-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <PlayerAvatar name={item.name} color={item.color} />
                      <View>
                        <Text className="text-base font-extrabold" style={{ color: colors.text }}>
                          {item.name}
                        </Text>
                        <Text
                          className="text-xs font-extrabold tracking-wide"
                          style={{ color: isCurrent ? colors.glow : colors.textMuted }}
                        >
                          {isCurrent ? "TURNO ACTUAL" : "TOCA PARA ASIGNAR TURNO"}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      onPress={() => removePlayer(item.id)}
                      className="px-4 py-2"
                      style={({ pressed }) => ({
                        backgroundColor: "#2A0B16",
                        borderColor: "#7F1D1D",
                        borderWidth: 1,
                        borderRadius: radius.pill,
                        opacity: pressed ? 0.85 : 1,
                      })}
                    >
                      <Text className="text-xs font-extrabold tracking-wide" style={{ color: "#FCA5A5" }}>
                        QUITAR
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              </Pressable>
            );
          }}
          ListEmptyComponent={() => (
            <View className="mt-6 items-center">
              <Text className="text-sm font-semibold" style={{ color: colors.textMuted }}>
                Agrega 2 o mas jugadores para empezar.
              </Text>
            </View>
          )}
        />
      </View>
    </Screen>
  );
}
