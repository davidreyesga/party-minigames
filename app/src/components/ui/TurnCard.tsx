import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";
import GameBadge from "./GameBadge";
import PlayerAvatar from "./PlayerAvatar";

type Props = {
  playerName?: string;
  playerColor?: string;
  subtitle?: string;
};

export default function TurnCard({ playerName, playerColor, subtitle }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={{
        backgroundColor: colors.glassFillStrong,
        borderColor: colors.primaryContainer,
        borderRadius: radius.md,
        borderWidth: 4,
        padding: 16,
        shadowColor: glow.primary.color,
        shadowOpacity: glow.primary.opacity,
        shadowRadius: glow.primary.radius,
        shadowOffset: { width: 0, height: 0 },
        elevation: 10,
        transform: [
          {
            scale: pulse.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.01],
            }),
          },
        ],
      }}
    >
      <GameBadge label="Turno actual" tone="primary" />

      <View className="mt-4 flex-row items-center gap-3">
        <PlayerAvatar name={playerName} color={playerColor} size={64} selected />

        <View className="flex-1">
          <Text className="text-2xl font-extrabold" style={{ color: colors.text }}>
            {playerName ?? "--"}
          </Text>
          <Text className="mt-1 text-sm leading-5" style={{ color: colors.textMuted }}>
            {subtitle ?? "Sigue las reglas y presiona el boton principal."}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
