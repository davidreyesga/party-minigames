import { Text, View } from "react-native";

import { colors, radius } from "../../theme/tokens";

type Tone = "primary" | "cyan" | "pink" | "success" | "warning" | "neutral";

type Props = {
  label: string;
  tone?: Tone;
};

const tones: Record<Tone, { backgroundColor: string; borderColor: string; textColor: string }> = {
  primary: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.primaryContainer,
    textColor: colors.primary,
  },
  cyan: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.cyanDim,
    textColor: colors.cyan,
  },
  pink: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.pink,
    textColor: colors.pinkSoft,
  },
  success: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.success,
    textColor: colors.success,
  },
  warning: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.warning,
    textColor: colors.warningSoft,
  },
  neutral: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outlineVariant,
    textColor: colors.textMuted,
  },
};

export default function GameBadge({ label, tone = "neutral" }: Props) {
  const palette = tones[tone];

  return (
    <View
      className="self-start border px-3 py-1"
      style={{
        backgroundColor: palette.backgroundColor,
        borderColor: palette.borderColor,
        borderRadius: radius.pill,
      }}
    >
      <Text
        className="text-[10px] font-extrabold tracking-widest"
        style={{ color: palette.textColor }}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
}
