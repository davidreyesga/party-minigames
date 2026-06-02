import { ReactNode } from "react";
import { View } from "react-native";

import { colors, glow as electricGlow, radius, shadow } from "../../theme/tokens";

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
        backgroundColor: colors.glassFillStrong,
        borderColor: glow ? colors.primaryContainer : colors.innerBorder,
        borderWidth: 1,
        borderRadius: radius.md,
        ...shadow.ios,
        elevation: shadow.elevation,
        ...(glow
          ? {
              shadowColor: electricGlow.primary.color,
              shadowOpacity: electricGlow.primary.opacity,
              shadowRadius: electricGlow.primary.radius,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
            }
          : {}),
      }}
    >
      {children}
    </View>
  );
}
