import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import { colors } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen scroll>
      <Header
        title="Party Minigames"
        subtitle="Dark Neon • neutra internacional • una acción principal por pantalla"
        onRulesPress={() => {}}
      />

      <Card className="p-4" glow>
        <Text className="text-xs font-bold tracking-widest" style={{ color: colors.textMuted }}>
          SESIÓN ACTUAL
        </Text>
        <Text className="mt-2 text-base" style={{ color: colors.text }}>
          Jugadores:{" "}
          <Text style={{ color: colors.glow, fontWeight: "900" }}>{playersCount}</Text>
        </Text>
        <Text className="mt-1 text-xs" style={{ color: colors.textMuted }}>
          (Luego añadimos guardado local para recordar sesión siempre.)
        </Text>
      </Card>

      <View className="mt-5 gap-3">
        <PrimaryButtonGiant
          label="IR AL LOBBY"
          onPress={() => navigation.navigate("Lobby")}
        />
        <SecondaryButton
          label="VER JUEGOS"
          onPress={() => navigation.navigate("Games")}
        />
        <SecondaryButton
          label="AJUSTES"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-xs font-bold tracking-widest" style={{ color: colors.textMuted }}>
            NOTAS
          </Text>
          <Text className="mt-2 text-xs" style={{ color: colors.textMuted }}>
            +18 • Consentimiento primero • Modo sin alcohol desde Ajustes.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}