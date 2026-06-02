import { Pressable, Text, View } from "react-native";

import { colors, radius } from "../../theme/tokens";

export type SegmentedOption<T extends string> = {
  key: T;
  label: string;
};

type Props<T extends string> = {
  value: T;
  options: readonly SegmentedOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export default function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
}: Props<T>) {
  return (
    <View
      className="flex-row p-1"
      style={{
        backgroundColor: colors.surfaceContainer,
        borderColor: colors.outlineVariant,
        borderRadius: radius.pill,
        borderWidth: 1,
      }}
    >
      {options.map((option) => {
        const active = option.key === value;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled, selected: active }}
            disabled={disabled}
            key={option.key}
            onPress={() => onChange(option.key)}
            className="h-12 flex-1 items-center justify-center px-3"
            style={({ pressed }) => ({
              backgroundColor: active ? colors.cyan : "transparent",
              borderRadius: radius.pill,
              opacity: disabled ? 0.45 : pressed ? 0.86 : 1,
            })}
          >
            <Text
              className="text-xs font-extrabold tracking-wide"
              style={{ color: active ? colors.onCyan : colors.textMuted }}
            >
              {option.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
