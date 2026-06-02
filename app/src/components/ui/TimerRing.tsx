import { Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type Status = "normal" | "warning" | "expired";

type Props = {
  seconds: number;
  totalSeconds?: number;
  label?: string;
  dangerThreshold?: number;
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
  totalSeconds,
  label = "Tiempo",
  dangerThreshold = 10,
  status,
  size = 112,
}: Props) {
  const displaySeconds = Math.max(0, Math.ceil(seconds));
  const maxSeconds = Math.max(1, totalSeconds ?? displaySeconds, displaySeconds);
  const progress = Math.min(100, Math.max(0, (displaySeconds / maxSeconds) * 100));
  const visualStatus =
    status ?? (displaySeconds === 0 ? "expired" : displaySeconds <= dangerThreshold ? "warning" : "normal");
  const palette = statusStyles[visualStatus];

  return (
    <View
      accessibilityLabel={`${label}: ${displaySeconds} segundos`}
      accessibilityLiveRegion="polite"
      accessibilityRole="timer"
      accessibilityValue={{ min: 0, max: maxSeconds, now: displaySeconds }}
      className="items-center justify-center"
      style={{
        backgroundColor: colors.glassFillStrong,
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
        {displaySeconds}
      </Text>
      <Text className="text-[10px] font-extrabold tracking-widest" style={{ color: palette.color }}>
        {label.toUpperCase()}
      </Text>
      <View
        className="absolute bottom-3 left-4 right-4 h-1 overflow-hidden"
        style={{ backgroundColor: colors.surfaceHigh, borderRadius: radius.pill }}
      >
        <View
          className="h-full"
          style={{
            backgroundColor: palette.color,
            borderRadius: radius.pill,
            width: `${progress}%`,
          }}
        />
      </View>
    </View>
  );
}
