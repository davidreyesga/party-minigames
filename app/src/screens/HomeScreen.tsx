import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import type { RootStackParamList } from "../app/navigation.types";
import { useSessionStore } from "../store/session.store";

import Screen from "../components/ui/Screen";
import Header from "../components/ui/Header";
import Card from "../components/ui/Card";
import { PrimaryButtonGiant, SecondaryButton } from "../components/ui/Button";
import { colors, radius } from "../theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View
      className="items-center justify-center px-3 py-2"
      style={{
        backgroundColor: colors.surface2,
        borderRadius: radius.pill,
        borderWidth: 2,
        borderColor: colors.border,
        minWidth: 92,
      }}
    >
      <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
        {label}
      </Text>
      <Text className="mt-1 text-base font-extrabold" style={{ color: colors.glow }}>
        {value}
      </Text>
    </View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const playersCount = useSessionStore((s) => s.players.length);

  return (
    <Screen scroll>
      <Header
        title="Party Minigames"
        subtitle="Preparen la ronda, relajense y jueguen en grupo."
        onRulesPress={() => {}}
      />

      <Card className="p-4" glow>
        <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.glow }}>
          LISTO PARA JUGAR
        </Text>
        <Text className="mt-2 text-2xl font-extrabold leading-8" style={{ color: colors.text }}>
          Todo listo para empezar la fiesta.
        </Text>
        <Text className="mt-2 text-sm" style={{ color: colors.textMuted }}>
          Crea el lobby, elige el juego y dejen que fluya la noche.
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          <StatChip label="JUGADORES" value={String(playersCount)} />
          <StatChip label="ACCESO" value="COMPLETO" />
          <StatChip label="AMBIENTE" value="ALTO" />
        </View>
      </Card>

      <View className="mt-5 gap-3">
        <PrimaryButtonGiant label="IR AL LOBBY" onPress={() => navigation.navigate("Lobby")} />
        <SecondaryButton label="SELECCIONAR JUEGO" onPress={() => navigation.navigate("Games")} />
        <SecondaryButton label="CONFIGURACION" onPress={() => navigation.navigate("Settings")} />
      </View>

      <View className="mt-6">
        <Card className="p-4">
          <Text className="text-xs font-extrabold tracking-widest" style={{ color: colors.textMuted }}>
            PARTY TIPS
          </Text>
          <Text className="mt-2 text-sm leading-6" style={{ color: colors.textMuted }}>
            +18, consentimiento primero y ritmo comodo para todo el grupo.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
