import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "../../theme/tokens";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode; // para meter botones extra si quieres
  onRulesPress?: () => void;
};

export default function Header({ title, subtitle, right, onRulesPress }: Props) {
  return (
    <View
      className="mb-4 rounded-2xl border px-4 py-3"
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-xl font-extrabold" style={{ color: colors.text }}>
            {title}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-sm" style={{ color: colors.textMuted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2">
          {onRulesPress ? (
            <Pressable
              onPress={onRulesPress}
              className="rounded-full border px-4 py-2 active:opacity-80"
              style={{ borderColor: colors.border, backgroundColor: colors.surface2 }}
            >
              <Text className="text-xs font-bold" style={{ color: colors.glow }}>
                REGLAS
              </Text>
            </Pressable>
          ) : null}

          {right}
        </View>
      </View>
    </View>
  );
}