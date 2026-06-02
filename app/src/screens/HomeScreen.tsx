import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import Card from "../components/ui/Card";
import GameBadge from "../components/ui/GameBadge";
import Header from "../components/ui/Header";
import Screen from "../components/ui/Screen";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function SessionMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View
      className="min-w-[104px] flex-1 px-3 py-3"
      style={{
        backgroundColor: colors.surfaceLow,
        borderColor: accent ? colors.cyanDim : colors.innerBorder,
        borderRadius: radius.default,
        borderWidth: 1,
      }}
    >
      <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
        {label}
      </Text>
      <Text className="mt-1 text-base font-extrabold" style={{ color: accent ? colors.cyan : colors.text }}>
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen scroll>
      <Header title="Party Minigames" subtitle="Tu noche, tus reglas, una ronda mas." />

      <View className="items-center px-2 pb-5 pt-2">
        <GameBadge label="Electric Social" tone="primary" selected />
        <Text
          className="mt-4 text-center text-4xl font-extrabold leading-[44px]"
          style={{ color: colors.primary }}
        >
          Enciende la noche.
        </Text>
        <Text className="mt-3 max-w-[300px] text-center text-base leading-6" style={{ color: colors.textMuted }}>
          Rompan el hielo, armen el grupo y elijan el siguiente reto.
        </Text>
      </View>

      <Card className="p-5" glow>
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-extrabold" style={{ color: colors.primaryFixed }}>
              Sesion activa
            </Text>
            <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
              El lobby conserva tu grupo entre juegos.
            </Text>
          </View>
          <GameBadge label="En curso" tone="cyan" selected />
        </View>

        <View
          className="mt-5 px-4 py-4"
          style={{
            backgroundColor: colors.surfaceLow,
            borderColor: colors.innerBorder,
            borderRadius: radius.default,
            borderWidth: 1,
          }}
        >
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            JUGADORES LISTOS
          </Text>
          <View className="mt-2 flex-row items-end gap-2">
            <Text className="text-5xl font-extrabold" style={{ color: colors.text }}>
              {playersCount}
            </Text>
            <Text className="pb-1 text-sm font-semibold" style={{ color: colors.cyan }}>
              EN EL LOBBY
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          <SessionMetric label="ACCESO" value="RAPIDO" accent />
          <SessionMetric label="MODO" value="FLEXIBLE" />
        </View>
      </Card>

      <View className="mt-5 gap-3">
        <PrimaryButtonGiant label="IR AL LOBBY" onPress={() => navigation.navigate("Lobby")} />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <SecondaryButton label="VER JUEGOS" onPress={() => navigation.navigate("Games")} />
          </View>
          <View className="flex-1">
            <SecondaryButton label="AJUSTES" onPress={() => navigation.navigate("Settings")} />
          </View>
        </View>
      </View>

      <View className="mt-7 px-3 pb-3">
        <Text className="text-center text-xs leading-5" style={{ color: colors.outline }}>
          +18. Consentimiento primero. Uso responsable y modo sin alcohol disponible.
        </Text>
      </View>
    </Screen>
  );
}
