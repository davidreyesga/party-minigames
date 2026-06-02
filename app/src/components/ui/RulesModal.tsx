import { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { colors, glow, radius } from "../../theme/tokens";
import { PrimaryButtonGiant } from "./Button";
import GameBadge from "./GameBadge";

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  rules?: readonly string[];
  children?: ReactNode;
};

export default function RulesModal({
  visible,
  onClose,
  title = "Reglas",
  rules = [],
  children,
}: Props) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View className="flex-1 items-center justify-center px-5 py-8">
        <Pressable
          accessibilityLabel="Cerrar reglas"
          accessibilityRole="button"
          onPress={onClose}
          style={{
            backgroundColor: colors.scrim,
            bottom: 0,
            left: 0,
            position: "absolute",
            right: 0,
            top: 0,
          }}
        />

        <View
          accessibilityLabel={title}
          accessibilityViewIsModal
          className="max-h-full w-full border p-5"
          style={{
            backgroundColor: colors.glassFillStrong,
            borderColor: colors.innerBorder,
            borderRadius: radius.lg,
            shadowColor: glow.primary.color,
            shadowOpacity: glow.primary.opacity,
            shadowRadius: glow.primary.radius,
            shadowOffset: { width: 0, height: 0 },
            elevation: 10,
          }}
        >
          <GameBadge label="Como jugar" tone="cyan" />
          <Text className="mt-4 text-2xl font-extrabold" style={{ color: colors.text }}>
            {title}
          </Text>

          <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
            {rules.length === 0 && !children ? (
              <Text className="text-sm leading-5" style={{ color: colors.textMuted }}>
                No hay reglas adicionales para esta ronda.
              </Text>
            ) : null}
            {rules.map((rule, index) => (
              <View className="mb-3 flex-row gap-3" key={`${index}-${rule}`}>
                <Text className="font-extrabold" style={{ color: colors.cyan }}>
                  {index + 1}.
                </Text>
                <Text className="flex-1 text-sm leading-5" style={{ color: colors.textMuted }}>
                  {rule}
                </Text>
              </View>
            ))}
            {children}
          </ScrollView>

          <View className="mt-5">
            <PrimaryButtonGiant label="ENTENDIDO" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
