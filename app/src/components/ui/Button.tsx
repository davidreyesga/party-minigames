import { ReactNode } from "react";
import { Pressable, Text, ViewStyle } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type BaseProps = {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
};

export function PrimaryButtonGiant({
  label,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className="h-14 w-full items-center justify-center"
      style={({ pressed }) => ({
        // Flat native fallback until the app enables its gradient renderer.
        backgroundColor: disabled ? colors.surfaceHigh : colors.primaryContainer,
        borderColor: disabled ? colors.outlineVariant : colors.pinkSoft,
        borderRadius: radius.pill,
        borderWidth: 1,
        shadowColor: glow.primary.color,
        shadowOpacity: disabled ? 0 : glow.primary.opacity,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 0 },
        elevation: disabled ? 0 : 10,
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        ...style,
      })}
    >
      <Text
        className="text-base font-extrabold tracking-wide"
        style={{ color: disabled ? colors.textMuted : colors.onPrimaryContainer }}
      >
        {label ?? "CONTINUAR"}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-full items-center justify-center"
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceHigh : colors.glassFill,
        borderColor: colors.cyanDim,
        borderRadius: radius.pill,
        borderWidth: 2,
        opacity: disabled ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        ...style,
      })}
    >
      <Text className="text-sm font-extrabold tracking-wide" style={{ color: colors.cyan }}>
        {label ?? "VOLVER"}
      </Text>
    </Pressable>
  );
}

export function DangerButton({
  label,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-full items-center justify-center"
      style={({ pressed }) => ({
        backgroundColor: disabled ? colors.surfaceHigh : colors.warning,
        borderColor: disabled ? colors.outlineVariant : colors.warningSoft,
        borderRadius: radius.pill,
        borderWidth: 1,
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        ...style,
      })}
    >
      <Text
        className="text-sm font-extrabold tracking-wide"
        style={{ color: disabled ? colors.textMuted : colors.onPrimaryContainer }}
      >
        {label ?? "RESET"}
      </Text>
    </Pressable>
  );
}

export function IconButton({
  onPress,
  disabled = false,
  style,
  children,
}: Omit<BaseProps, "label">) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-12 items-center justify-center"
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceHigh : colors.surfaceContainer,
        borderColor: colors.outlineVariant,
        borderRadius: radius.pill,
        borderWidth: 1,
        opacity: disabled ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
        ...style,
      })}
    >
      {children}
    </Pressable>
  );
}
