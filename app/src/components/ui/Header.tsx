import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onRulesPress?: () => void;
};

export default function Header({ title, subtitle, right, onRulesPress }: Props) {
  return (
    <View className="relative mb-4 min-h-[72px] justify-center px-14 py-2">
      <Text className="text-center text-2xl font-extrabold" style={{ color: colors.text }}>
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-1 text-center text-sm leading-5" style={{ color: colors.textMuted }}>
          {subtitle}
        </Text>
      ) : null}

      <View className="absolute right-0 top-2 flex-row items-center gap-2">
        {right}
        {onRulesPress ? (
          <Pressable
            accessibilityLabel="Reglas"
            accessibilityRole="button"
            onPress={onRulesPress}
            className="h-12 w-12 items-center justify-center border"
            style={({ pressed }) => ({
              backgroundColor: pressed ? colors.surfaceHigh : colors.surfaceContainer,
              borderColor: colors.cyanDim,
              borderRadius: radius.pill,
              shadowColor: glow.cyan.color,
              shadowOpacity: pressed ? 0.32 : 0.18,
              shadowRadius: glow.cyan.radius,
              shadowOffset: { width: 0, height: 0 },
              elevation: pressed ? 7 : 4,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Text className="text-lg font-extrabold" style={{ color: colors.cyan }}>
              ?
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
