import { ReactNode } from "react";
import { Platform, View, type ViewStyle } from "react-native";

import { colors, glow as electricGlow, radius, shadow } from "../../theme/tokens";

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

const webCardStyle =
  Platform.OS === "web"
    ? ({
        touchAction: "pan-y",
        userSelect: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
      } as unknown as ViewStyle)
    : undefined;

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
        ...webCardStyle,
      }}
    >
      {children}
    </View>
  );
}
