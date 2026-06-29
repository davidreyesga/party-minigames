import { ReactNode } from "react";
import { Platform, Pressable, Text, type TextStyle, type ViewStyle } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";

type BaseProps = {
  label?: string;
  accessibilityLabel?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children?: ReactNode;
};

const webButtonStyle =
  Platform.OS === "web"
    ? ({
        touchAction: "pan-y",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      } as unknown as ViewStyle)
    : undefined;

const webButtonTextStyle =
  Platform.OS === "web"
    ? ({
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      } as unknown as TextStyle)
    : undefined;

export function PrimaryButtonGiant({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label ?? "Continuar"}
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
        shadowRadius: glow.primary.radius,
        shadowOffset: { width: 0, height: 0 },
        elevation: disabled ? 0 : 10,
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        ...style,
        ...webButtonStyle,
      })}
    >
      <Text
        className="text-base font-extrabold tracking-wide"
        style={[
          { color: disabled ? colors.textMuted : colors.onPrimaryContainer },
          webButtonTextStyle,
        ]}
      >
        {label ?? "CONTINUAR"}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label ?? "Volver"}
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
        shadowColor: glow.cyan.color,
        shadowOpacity: disabled ? 0 : pressed ? 0.18 : 0.1,
        shadowRadius: glow.cyan.radius,
        shadowOffset: { width: 0, height: 0 },
        elevation: disabled ? 0 : 3,
        opacity: disabled ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        ...style,
        ...webButtonStyle,
      })}
    >
      <Text
        className="text-sm font-extrabold tracking-wide"
        style={[{ color: colors.cyan }, webButtonTextStyle]}
      >
        {label ?? "VOLVER"}
      </Text>
    </Pressable>
  );
}

export function DangerButton({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label ?? "Reset"}
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
        ...webButtonStyle,
      })}
    >
      <Text
        className="text-sm font-extrabold tracking-wide"
        style={[
          { color: disabled ? colors.textMuted : colors.onPrimaryContainer },
          webButtonTextStyle,
        ]}
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
  accessibilityLabel,
}: Omit<BaseProps, "label">) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? "Accion"}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-12 items-center justify-center"
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.surfaceHigh : colors.surfaceContainer,
        borderColor: pressed ? colors.cyanDim : colors.outlineVariant,
        borderRadius: radius.pill,
        borderWidth: 1,
        shadowColor: glow.cyan.color,
        shadowOpacity: pressed ? 0.18 : 0,
        shadowRadius: glow.cyan.radius,
        shadowOffset: { width: 0, height: 0 },
        elevation: pressed ? 4 : 0,
        opacity: disabled ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.96 : 1 }],
        ...style,
        ...webButtonStyle,
      })}
    >
      {children}
    </Pressable>
  );
}
