import { Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type Props = {
  name?: string;
  color?: string;
  size?: number;
  active?: boolean;
};

function getInitials(name?: string) {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PlayerAvatar({
  name,
  color = colors.primaryContainer,
  size = 48,
  active = false,
}: Props) {
  return (
    <View
      accessibilityLabel={name ? `Jugador ${name}` : "Jugador sin nombre"}
      style={{
        alignItems: "center",
        backgroundColor: color,
        borderColor: active ? colors.cyanDim : colors.innerBorder,
        borderRadius: radius.pill,
        borderWidth: active ? 3 : 1,
        height: size,
        justifyContent: "center",
        shadowColor: glow.cyan.color,
        shadowOpacity: active ? glow.cyan.opacity : 0,
        shadowRadius: glow.cyan.radius,
        shadowOffset: { width: 0, height: 0 },
        elevation: active ? 7 : 0,
        width: size,
      }}
    >
      <Text
        style={{
          color: colors.onPrimaryContainer,
          fontSize: Math.max(14, Math.round(size * 0.3)),
          fontWeight: "800",
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
}
