import { ReactNode } from "react";
import { View } from "react-native";
import { colors, radius, shadow } from "../../theme/tokens";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

export default function Card({ children, className = "", glow = false }: Props) {
  return (
    <View
      className={`border ${className}`}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radius.xl,
        ...(glow ? { shadowColor: colors.glow, shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 10 } : {}),
        ...shadow.ios,
        elevation: shadow.elevation,
      }}
    >
      {children}
    </View>
  );
}