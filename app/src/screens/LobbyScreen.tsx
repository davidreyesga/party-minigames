import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { useSessionStore } from "../store/session.store";

import { DangerButton, PrimaryButtonGiant } from "../components/ui/Button";
import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import PlayerAvatar from "../components/ui/PlayerAvatar";
import Screen from "../components/ui/Screen";
import TurnCard from "../components/ui/TurnCard";
import { colors, glow, radius } from "../theme/tokens";

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

  const submitPlayer = () => {
    addPlayer(name);
    setName("");
  };

  return (
    <Screen scroll>
      <Header title="Lobby" subtitle="Arma el grupo y mantengan la ronda en movimiento." />

      <TurnCard
        playerName={currentPlayer?.name}
        playerColor={currentPlayer?.color}
        subtitle={
          currentPlayer
            ? "Cuando termine su reto, pasa el turno al siguiente."
            : "Agrega jugadores para comenzar la primera ronda."
        }
      />

      <View className="mt-6">
        <Card className="p-4">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-extrabold" style={{ color: colors.text }}>
                Agregar jugador
              </Text>
              <Text className="mt-1 text-xs leading-5" style={{ color: colors.textMuted }}>
                Cada persona conserva su lugar durante la sesion.
              </Text>
            </View>
            <GameBadge label={`${players.length} listos`} tone="cyan" />
          </View>

          <View className="mt-4 flex-row items-center gap-2">
            <TextInput
              accessibilityLabel="Nombre del jugador"
              value={name}
              onChangeText={setName}
              placeholder="Nombre del jugador"
              placeholderTextColor={colors.outline}
              className="h-12 flex-1 px-4 text-base"
              style={{
                backgroundColor: colors.surfaceContainer,
                borderBottomColor: colors.cyanDim,
                borderBottomWidth: 2,
                borderRadius: radius.default,
                color: colors.text,
              }}
              returnKeyType="done"
              onSubmitEditing={submitPlayer}
            />
            <Pressable
              accessibilityLabel="Agregar jugador"
              accessibilityRole="button"
              onPress={submitPlayer}
              className="h-12 items-center justify-center px-4"
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.primaryInverse : colors.primaryContainer,
                borderColor: colors.pinkSoft,
                borderRadius: radius.pill,
                borderWidth: 1,
                shadowColor: glow.primary.color,
                shadowOpacity: glow.primary.opacity,
                shadowRadius: glow.primary.radius,
                shadowOffset: { width: 0, height: 0 },
                elevation: 7,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Text className="text-xs font-extrabold tracking-wide" style={{ color: colors.onPrimaryContainer }}>
                AGREGAR
              </Text>
            </Pressable>
          </View>
        </Card>
      </View>

      <View className="mt-6">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            JUGADORES
          </Text>
          <GameBadge label={`${players.length} en lobby`} variant="default" />
        </View>

        <FlatList
          data={players}
          keyExtractor={(player) => player.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item, index }) => {
            const isCurrent = index === currentIndex;

            return (
              <Pressable
                accessibilityLabel={`Asignar turno a ${item.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isCurrent }}
                onPress={() => setCurrentIndex(index)}
                style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1 })}
              >
                <Card className="p-3" glow={isCurrent}>
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-3">
                      <PlayerAvatar name={item.name} color={item.color} selected={isCurrent} />
                      <View className="flex-1">
                        <Text className="text-base font-extrabold" style={{ color: colors.text }}>
                          {item.name}
                        </Text>
                        <Text
                          className="mt-0.5 text-[10px] font-extrabold tracking-wider"
                          style={{ color: isCurrent ? colors.cyan : colors.textMuted }}
                        >
                          {isCurrent ? "TURNO ACTUAL" : "TOCA PARA ASIGNAR TURNO"}
                        </Text>
                      </View>
                    </View>

                    <Pressable
                      accessibilityLabel={`Quitar a ${item.name}`}
                      accessibilityRole="button"
                      onPress={() => removePlayer(item.id)}
                      className="h-10 items-center justify-center px-3"
                      style={({ pressed }) => ({
                        backgroundColor: colors.errorContainer,
                        borderColor: colors.error,
                        borderRadius: radius.pill,
                        borderWidth: 1,
                        opacity: pressed ? 0.82 : 1,
                      })}
                    >
                      <Text className="text-[10px] font-extrabold tracking-wide" style={{ color: colors.onErrorContainer }}>
                        QUITAR
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              </Pressable>
            );
          }}
          ListEmptyComponent={() => (
            <Card className="items-center p-5">
              <GameBadge label="Lobby vacio" variant="default" />
              <Text className="mt-4 text-center text-lg font-extrabold" style={{ color: colors.text }}>
                Todavia no hay jugadores.
              </Text>
              <Text className="mt-2 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
                Agrega dos o mas personas para empezar una ronda.
              </Text>
            </Card>
          )}
        />
      </View>

      <View className="mt-6 gap-3 pb-2">
        <PrimaryButtonGiant
          disabled={players.length === 0}
          label="SIGUIENTE TURNO"
          onPress={nextPlayer}
        />
        <DangerButton
          disabled={players.length === 0}
          label="RESETEAR JUGADORES"
          onPress={clearPlayers}
        />
      </View>
    </Screen>
  );
}
