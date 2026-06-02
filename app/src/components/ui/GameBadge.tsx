import { Text, View } from "react-native";

import { colors, radius } from "../../theme/tokens";

type Tone = "primary" | "cyan" | "pink" | "success" | "warning" | "danger" | "neutral";
type Variant = "default" | "level" | "penalty" | "success" | "danger";

type Props = {
  label: string;
  tone?: Tone;
  variant?: Variant;
  color?: string;
  selected?: boolean;
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
  danger: {
    backgroundColor: colors.errorContainer,
    borderColor: colors.error,
    textColor: colors.onErrorContainer,
  },
  neutral: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.outlineVariant,
    textColor: colors.textMuted,
  },
};

const variants: Record<Variant, Tone> = {
  default: "neutral",
  level: "primary",
  penalty: "warning",
  success: "success",
  danger: "danger",
};

export default function GameBadge({
  label,
  tone,
  variant = "default",
  color,
  selected = false,
}: Props) {
  const basePalette = tones[tone ?? variants[variant]];
  const palette = color
    ? { ...basePalette, borderColor: color, textColor: color }
    : basePalette;

  return (
    <View
      className="self-start border px-3 py-1"
      style={{
        backgroundColor: palette.backgroundColor,
        borderColor: palette.borderColor,
        borderRadius: radius.pill,
        shadowColor: palette.borderColor,
        shadowOpacity: selected ? 0.28 : 0,
        shadowRadius: selected ? 12 : 0,
        shadowOffset: { width: 0, height: 0 },
        elevation: selected ? 4 : 0,
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
