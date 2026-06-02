import { ReactNode } from "react";
import { View } from "react-native";

import { colors, glow as electricGlow, radius } from "../../theme/tokens";

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
        backgroundColor: colors.surfaceContainer,
        borderColor: glow ? colors.primaryContainer : colors.innerBorder,
        borderWidth: 1,
        borderRadius: radius.md,
        ...(glow
          ? {
              shadowColor: electricGlow.primary.color,
              shadowOpacity: 0.22,
              shadowRadius: 30,
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
