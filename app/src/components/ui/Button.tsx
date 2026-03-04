import { ReactNode } from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { colors, radius, glowShadow } from "../../theme/tokens";

type BaseProps = {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children?: ReactNode; // para IconButton o casos especiales
};

export function PrimaryButtonGiant({
  label,
  onPress,
  disabled = false,
  style,
}: BaseProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="h-14 w-full items-center justify-center active:opacity-90"
      style={{
        borderRadius: radius.pill,
        backgroundColor: disabled ? "#1F2A44" : colors.primary,
        borderWidth: 1,
        borderColor: disabled ? "#24324F" : colors.glow,
        ...(disabled ? {} : glowShadow(colors.glow)),
        ...style,
      }}
    >
      <Text
        className="text-base font-extrabold"
        style={{ color: disabled ? "#94A3B8" : "#FFFFFF", letterSpacing: 0.5 }}
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
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-full items-center justify-center active:opacity-90"
      style={{
        borderRadius: radius.pill,
        backgroundColor: colors.surface2,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Text className="text-sm font-bold" style={{ color: colors.text }}>
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
      onPress={onPress}
      disabled={disabled}
      className="h-12 w-full items-center justify-center active:opacity-90"
      style={{
        borderRadius: radius.pill,
        backgroundColor: "#2A0B16",
        borderWidth: 1,
        borderColor: "#7F1D1D",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <Text className="text-sm font-extrabold" style={{ color: "#FCA5A5" }}>
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
      onPress={onPress}
      disabled={disabled}
      className="h-10 w-10 items-center justify-center active:opacity-80"
      style={{
        borderRadius: radius.pill,
        backgroundColor: colors.surface2,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </Pressable>
  );
}