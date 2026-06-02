import { Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type Status = "normal" | "warning" | "expired";

type Props = {
  seconds: number;
  label?: string;
  status?: Status;
  size?: number;
};

const statusStyles: Record<Status, { color: string; glowColor: string }> = {
  normal: { color: colors.cyan, glowColor: glow.cyan.color },
  warning: { color: colors.pink, glowColor: glow.pink.color },
  expired: { color: colors.error, glowColor: colors.errorContainer },
};

export default function TimerRing({
  seconds,
  label = "Tiempo",
  status = "normal",
  size = 112,
}: Props) {
  const palette = statusStyles[status];

  return (
    <View
      accessibilityLabel={`${label}: ${seconds} segundos`}
      accessibilityRole="timer"
      className="items-center justify-center"
      style={{
        backgroundColor: colors.surfaceContainer,
        borderColor: palette.color,
        borderRadius: radius.pill,
        borderWidth: 6,
        height: size,
        shadowColor: palette.glowColor,
        shadowOpacity: 0.32,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
        width: size,
      }}
    >
      <Text className="text-3xl font-extrabold" style={{ color: colors.text }}>
        {seconds}
      </Text>
      <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: palette.color }}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
