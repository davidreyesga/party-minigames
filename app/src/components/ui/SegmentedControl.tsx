import { Pressable, Text, View } from "react-native";

import { colors, radius } from "../../theme/tokens";

export type SegmentedOption<T extends string> = {
  key: T;
  label: string;
  color?: string;
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
        const activeColor = option.color ?? colors.cyan;
        const activeTextColor = option.color ? colors.onPrimaryContainer : colors.onCyan;

        return (
          <Pressable
            accessibilityLabel={option.label}
            accessibilityRole="button"
            accessibilityState={{ disabled, selected: active }}
            disabled={disabled}
            key={option.key}
            onPress={() => onChange(option.key)}
            className="h-12 flex-1 items-center justify-center px-3"
            style={({ pressed }) => ({
              backgroundColor: active ? activeColor : "transparent",
              borderRadius: radius.pill,
              shadowColor: activeColor,
              shadowOpacity: active ? 0.28 : 0,
              shadowRadius: active ? 12 : 0,
              shadowOffset: { width: 0, height: 0 },
              elevation: active ? 4 : 0,
              opacity: disabled ? 0.45 : pressed ? 0.86 : 1,
            })}
          >
            <Text
              className="text-xs font-extrabold tracking-wide"
              style={{ color: active ? activeTextColor : colors.textMuted }}
            >
              {option.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
