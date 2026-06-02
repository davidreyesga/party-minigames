import { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { colors, radius } from "../../theme/tokens";
import { SecondaryButton } from "./Button";
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
          className="max-h-full w-full border p-5"
          style={{
            backgroundColor: colors.surfaceHighest,
            borderColor: colors.innerBorder,
            borderRadius: radius.lg,
          }}
        >
          <GameBadge label="Como jugar" tone="cyan" />
          <Text className="mt-4 text-2xl font-extrabold" style={{ color: colors.text }}>
            {title}
          </Text>

          <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
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
            <SecondaryButton label="ENTENDIDO" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
