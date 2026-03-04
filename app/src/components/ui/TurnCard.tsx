import { Text, View } from "react-native";
import Card from "./Card";
import { colors } from "../../theme/tokens";

type Props = {
  playerName?: string;
  playerColor?: string;
  subtitle?: string;
};

function initials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TurnCard({ playerName, playerColor, subtitle }: Props) {
  return (
    <Card className="p-4" glow>
      <Text className="text-xs font-bold tracking-widest" style={{ color: colors.textMuted }}>
        TURNO
      </Text>

      <View className="mt-3 flex-row items-center gap-3">
        <View
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: playerColor ?? colors.primary }}
        >
          <Text className="text-base font-extrabold text-white">
            {initials(playerName)}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-xl font-extrabold" style={{ color: colors.text }}>
            {playerName ?? "—"}
          </Text>
          <Text className="mt-0.5 text-sm" style={{ color: colors.textMuted }}>
            {subtitle ?? "Sigue las reglas y presiona el botón principal."}
          </Text>
        </View>
      </View>
    </Card>
  );
}